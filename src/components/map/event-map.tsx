"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MockEvent } from "@/lib/types";
import { CATEGORY_MAP, CATEGORIES } from "@/lib/categories";
import { MapPopup } from "./map-popup";

interface EventMapProps {
  events: MockEvent[];
  center: { lat: number; lng: number };
  onEventHover?: (eventId: string | null) => void;
  highlightedEventId?: string | null;
}

function buildGeoJSON(events: MockEvent[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: events.map((e) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [e.lng, e.lat] },
      properties: {
        id: e.id,
        title: e.title,
        category: e.category,
        price: e.priceFrom,
        date: e.date,
        time: e.time,
        venueName: e.venue.name,
        venueAddress: e.venue.address,
      },
    })),
  };
}

const STADIA_KEY = process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY ?? "";

export function EventMap({
  events,
  center,
  onEventHover,
  highlightedEventId,
}: EventMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<MockEvent | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const styleUrl = STADIA_KEY
    ? `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${STADIA_KEY}`
    : undefined;

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // If no Stadia Maps key, use fallback view
    if (!styleUrl) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [center.lng, center.lat],
      zoom: 13,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      mapRef.current = map;
      setMapReady(true);

      // Add images for each category pin
      for (const cat of CATEGORIES) {
        const canvas = document.createElement("canvas");
        canvas.width = 24;
        canvas.height = 24;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = cat.color;
          ctx.beginPath();
          ctx.arc(12, 12, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 12px Inter, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(cat.slug[0].toUpperCase(), 12, 12);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          map.addImage(`pin-${cat.slug}`, {
            width: canvas.width,
            height: canvas.height,
            data: imageData.data,
          });
        }
      }

      // Add clustered source
      map.addSource("events", {
        type: "geojson",
        data: buildGeoJSON(events),
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Cluster circles
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "events",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#6c3feb",
            10,
            "#8c56f4",
            30,
            "#a97ef8",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            10,
            25,
            30,
            30,
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Cluster count text
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "events",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Bold"],
          "text-size": 13,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Unclustered pins
      map.addLayer({
        id: "unclustered-point",
        type: "symbol",
        source: "events",
        filter: ["!", ["has", "point_count"]],
        layout: {
          "icon-image": [
            "concat",
            "pin-",
            ["get", "category"],
          ],
          "icon-size": 1.2,
          "icon-allow-overlap": true,
          "text-field": [
            "case",
            ["==", ["get", "price"], 0],
            "Free",
            ["concat", ["to-string", ["get", "price"]], " zł"],
          ],
          "text-font": ["Open Sans Bold"],
          "text-size": 10,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#1c1a22",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5,
        },
      });

      // Click on cluster to zoom
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        if (!features.length) return;
        const clusterId = features[0].properties.cluster_id;
        const source = map.getSource("events") as maplibregl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId).then((zoom) => {
          const geometry = features[0].geometry;
          if (geometry.type === "Point") {
            map.easeTo({
              center: geometry.coordinates as [number, number],
              zoom,
            });
          }
        });
      });

      // Click on unclustered pin
      map.on("click", "unclustered-point", (e) => {
        if (!e.features?.length) return;
        const props = e.features[0].properties;
        const event = events.find((ev) => ev.id === props.id);
        if (event) setSelectedEvent(event);
      });

      // Hover cursor changes
      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("mouseenter", "unclustered-point", (e) => {
        map.getCanvas().style.cursor = "pointer";
        if (e.features?.length) {
          onEventHover?.(e.features[0].properties.id);
        }
      });
      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
        onEventHover?.(null);
      });
    });

    return () => {
      mapRef.current = null;
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleUrl]);

  // Update data when events change
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const source = mapRef.current.getSource("events") as
      | maplibregl.GeoJSONSource
      | undefined;
    if (source) {
      source.setData(buildGeoJSON(events));
    }
  }, [events, mapReady]);

  // If no Stadia Maps key, show fallback
  if (!styleUrl) {
    return (
      <FallbackMap
        events={events}
        onEventHover={onEventHover}
        highlightedEventId={highlightedEventId}
      />
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-lg)]">
      <div ref={mapContainer} className="h-full w-full" />
      {selectedEvent && (
        <div className="absolute bottom-4 left-4 right-4 z-20 max-w-sm">
          <MapPopup
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            inline
          />
        </div>
      )}
    </div>
  );
}

// Fallback map when no Stadia Maps API key is configured
function FallbackMap({
  events,
  onEventHover,
  highlightedEventId,
}: {
  events: MockEvent[];
  onEventHover?: (eventId: string | null) => void;
  highlightedEventId?: string | null;
}) {
  const [selectedEvent, setSelectedEvent] = useState<MockEvent | null>(null);

  const bounds = useMemo(() => {
    if (events.length === 0)
      return { minLat: 52.38, maxLat: 52.43, minLng: 16.88, maxLng: 16.95 };
    const lats = events.map((e) => e.lat);
    const lngs = events.map((e) => e.lng);
    const pad = 0.005;
    return {
      minLat: Math.min(...lats) - pad,
      maxLat: Math.max(...lats) + pad,
      minLng: Math.min(...lngs) - pad,
      maxLng: Math.max(...lngs) + pad,
    };
  }, [events]);

  return (
    <div className="bg-surface-low relative h-full w-full overflow-hidden rounded-[var(--radius-lg)]">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(108,63,235,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(108,63,235,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="text-on-surface-muted absolute left-4 top-4 text-xs font-medium">
        Map Preview (set NEXT_PUBLIC_STADIA_MAPS_API_KEY for Stadia Maps tiles)
      </div>

      {events.map((event) => {
        const cat = CATEGORY_MAP[event.category];
        const x =
          ((event.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
        const y =
          ((bounds.maxLat - event.lat) / (bounds.maxLat - bounds.minLat)) * 100;
        const isHighlighted = highlightedEventId === event.id;

        return (
          <button
            key={event.id}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{
              left: `${Math.min(Math.max(x, 5), 95)}%`,
              top: `${Math.min(Math.max(y, 5), 95)}%`,
              transform: `translate(-50%, -100%) ${isHighlighted ? "scale(1.2)" : "scale(1)"}`,
              transition: "transform 200ms ease-out",
              zIndex: isHighlighted ? 10 : 1,
            }}
            onClick={() => setSelectedEvent(event)}
            onMouseEnter={() => onEventHover?.(event.id)}
            onMouseLeave={() => onEventHover?.(null)}
          >
            <div
              className="flex items-center gap-1 rounded-full px-2 py-1 text-white shadow-md"
              style={{ backgroundColor: cat?.color ?? "#6b7280" }}
            >
              {cat?.icon && (
                <cat.icon className="h-3 w-3" strokeWidth={2} />
              )}
              <span className="text-[10px] font-semibold">
                {event.priceFrom === 0 ? "Free" : `${event.priceFrom} zł`}
              </span>
            </div>
            <div
              className="mx-auto h-1.5 w-1.5 -translate-y-0.5 rotate-45"
              style={{ backgroundColor: cat?.color ?? "#6b7280" }}
            />
          </button>
        );
      })}

      {selectedEvent && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <MapPopup
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            inline
          />
        </div>
      )}
    </div>
  );
}
