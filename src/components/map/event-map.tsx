"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Event } from "@/lib/types";
import { CATEGORY_MAP, CATEGORIES } from "@/lib/categories";
import { MapPopup } from "./map-popup";

interface EventMapProps {
  events: Event[];
  citySlug: string;
  center: { lat: number; lng: number };
  onEventHover?: (eventId: string | null) => void;
  highlightedEventId?: string | null;
}

const PIN_SIZE = 48;
const ICON_INSET = 12;

function buildGeoJSON(events: Event[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: events.map((e) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [e.venue.lng, e.venue.lat] },
      properties: {
        id: e.id,
        title: e.name,
        category: e.category,
        price: e.price ?? 0,
      },
    })),
  };
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load map icon: ${src}`));
    img.src = src;
  });
}

/** Compose a colored circular pin with the category SVG icon for MapLibre. */
async function createCategoryPinBitmap(
  mapIcon: string,
  color: string,
): Promise<ImageBitmap> {
  const response = await fetch(mapIcon);
  if (!response.ok) {
    throw new Error(`Failed to fetch map icon: ${mapIcon}`);
  }

  const svg = (await response.text()).replaceAll("currentColor", "#ffffff");
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const objectUrl = URL.createObjectURL(blob);

  try {
    const icon = await loadImageElement(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = PIN_SIZE;
    canvas.height = PIN_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not create canvas context for map pin");
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(PIN_SIZE / 2, PIN_SIZE / 2, PIN_SIZE / 2 - 1, 0, Math.PI * 2);
    ctx.fill();

    const iconSize = PIN_SIZE - ICON_INSET * 2;
    ctx.drawImage(icon, ICON_INSET, ICON_INSET, iconSize, iconSize);

    return createImageBitmap(canvas);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function addCategoryPinImages(map: maplibregl.Map): Promise<void> {
  await Promise.all(
    CATEGORIES.map(async (cat) => {
      const imageId = `pin-${cat.slug}`;
      if (map.hasImage(imageId)) return;

      try {
        const bitmap = await createCategoryPinBitmap(cat.mapIcon, cat.color);
        if (!map.hasImage(imageId)) {
          map.addImage(imageId, bitmap);
        }
      } catch (error) {
        console.error(error);
      }
    }),
  );
}

const STADIA_KEY = process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY ?? "";

export function EventMap({
  events,
  citySlug,
  center,
  onEventHover,
  highlightedEventId,
}: EventMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const eventsRef = useRef(events);
  const onEventHoverRef = useRef(onEventHover);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [mapReady, setMapReady] = useState(false);

  eventsRef.current = events;
  onEventHoverRef.current = onEventHover;

  const styleUrl = STADIA_KEY
    ? `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${STADIA_KEY}`
    : undefined;

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // If no Stadia Maps key, use fallback view
    if (!styleUrl) return;

    let cancelled = false;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [center.lng, center.lat],
      zoom: 13,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      void (async () => {
        await addCategoryPinImages(map);
        if (cancelled) return;

        mapRef.current = map;
        setMapReady(true);

        // Add clustered source
        map.addSource("events", {
          type: "geojson",
          data: buildGeoJSON(eventsRef.current),
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
            "icon-image": ["concat", "pin-", ["get", "category"]],
            "icon-size": 0.75,
            "icon-allow-overlap": true,
            "text-field": [
              "case",
              ["==", ["get", "price"], 0],
              "Free",
              ["concat", ["to-string", ["get", "price"]], " zl"],
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
          const event = eventsRef.current.find((ev) => ev.id === props.id);
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
            onEventHoverRef.current?.(e.features[0].properties.id);
          }
        });
        map.on("mouseleave", "unclustered-point", () => {
          map.getCanvas().style.cursor = "";
          onEventHoverRef.current?.(null);
        });
      })();
    });

    return () => {
      cancelled = true;
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
        citySlug={citySlug}
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
            citySlug={citySlug}
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
  citySlug,
  onEventHover,
  highlightedEventId,
}: {
  events: Event[];
  citySlug: string;
  onEventHover?: (eventId: string | null) => void;
  highlightedEventId?: string | null;
}) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const bounds = useMemo(() => {
    if (events.length === 0)
      return { minLat: 52.38, maxLat: 52.43, minLng: 16.88, maxLng: 16.95 };
    const lats = events.map((e) => e.venue.lat);
    const lngs = events.map((e) => e.venue.lng);
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
          ((event.venue.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) *
          100;
        const y =
          ((bounds.maxLat - event.venue.lat) / (bounds.maxLat - bounds.minLat)) *
          100;
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
              {cat?.mapIcon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cat.mapIcon}
                  alt=""
                  width={12}
                  height={12}
                  className="h-3 w-3 brightness-0 invert"
                />
              )}
              <span className="text-[10px] font-semibold">
                {event.price == null || event.price === 0
                  ? "Free"
                  : `${event.price} zl`}
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
            citySlug={citySlug}
            onClose={() => setSelectedEvent(null)}
            inline
          />
        </div>
      )}
    </div>
  );
}
