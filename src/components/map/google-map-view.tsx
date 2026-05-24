"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import type { MockEvent } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { MapPopup } from "./map-popup";

interface GoogleMapViewProps {
  events: MockEvent[];
  center: { lat: number; lng: number };
  onEventHover?: (eventId: string | null) => void;
  highlightedEventId?: string | null;
  apiKey: string;
}

const MAP_ID = "eventapp-map";

export default function GoogleMapView({
  events,
  center,
  onEventHover,
  highlightedEventId,
  apiKey,
}: GoogleMapViewProps) {
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={13}
        mapId={MAP_ID}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="h-full w-full rounded-[var(--radius-lg)]"
      >
        <MapMarkers
          events={events}
          onEventHover={onEventHover}
          highlightedEventId={highlightedEventId}
        />
      </Map>
    </APIProvider>
  );
}

function MapMarkers({
  events,
  onEventHover,
  highlightedEventId,
}: {
  events: MockEvent[];
  onEventHover?: (eventId: string | null) => void;
  highlightedEventId?: string | null;
}) {
  const map = useMap();
  const [selectedEvent, setSelectedEvent] = useState<MockEvent | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<globalThis.Map<string, Marker>>(
    new globalThis.Map(),
  );

  useEffect(() => {
    if (!map) return;
    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({ map, markers: [] });
    }
  }, [map]);

  useEffect(() => {
    if (!clustererRef.current) return;
    clustererRef.current.clearMarkers();
    const markers = Array.from(markersRef.current.values());
    clustererRef.current.addMarkers(markers);
  }, [events]);

  const setMarkerRef = useCallback(
    (marker: Marker | null, eventId: string) => {
      if (marker) {
        markersRef.current.set(eventId, marker);
      } else {
        markersRef.current.delete(eventId);
      }
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current.addMarkers(
          Array.from(markersRef.current.values()),
        );
      }
    },
    [],
  );

  return (
    <>
      {events.map((event) => {
        const cat = CATEGORY_MAP[event.category];
        const isHighlighted = highlightedEventId === event.id;
        return (
          <AdvancedMarker
            key={event.id}
            position={{ lat: event.lat, lng: event.lng }}
            ref={(marker) => setMarkerRef(marker, event.id)}
            onClick={() => setSelectedEvent(event)}
            onMouseEnter={() => onEventHover?.(event.id)}
            onMouseLeave={() => onEventHover?.(null)}
          >
            <PinIcon
              color={cat?.color ?? "#6b7280"}
              category={event.category}
              price={event.priceFrom}
              isHighlighted={isHighlighted}
            />
          </AdvancedMarker>
        );
      })}
      {selectedEvent && (
        <div className="absolute bottom-4 left-4 right-4 z-20 max-w-sm">
          <MapPopup
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            inline
          />
        </div>
      )}
    </>
  );
}

function PinIcon({
  color,
  category,
  price,
  isHighlighted,
}: {
  color: string;
  category: string;
  price: number;
  isHighlighted?: boolean;
}) {
  const cat = CATEGORY_MAP[category as keyof typeof CATEGORY_MAP];
  const Icon = cat?.icon;

  return (
    <div
      className="flex flex-col items-center"
      style={{
        transform: isHighlighted ? "scale(1.2)" : "scale(1)",
        transition: "transform 200ms ease-out",
        zIndex: isHighlighted ? 10 : 1,
      }}
    >
      <div
        className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-white shadow-md"
        style={{ backgroundColor: color }}
      >
        {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2} />}
        <span className="text-xs font-semibold">
          {price === 0 ? "Free" : `${price} zł`}
        </span>
      </div>
      <div
        className="h-2 w-2 -translate-y-0.5 rotate-45"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
