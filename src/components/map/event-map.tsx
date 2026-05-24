"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { MockEvent } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { MapPopup } from "./map-popup";

interface EventMapProps {
  events: MockEvent[];
  center: { lat: number; lng: number };
  onEventHover?: (eventId: string | null) => void;
  highlightedEventId?: string | null;
}

const GoogleMapView = dynamic(() => import("./google-map-view"), {
  ssr: false,
  loading: () => (
    <div className="bg-surface-low flex h-full w-full items-center justify-center rounded-[var(--radius-lg)]">
      <span className="text-on-surface-muted text-sm">Loading map...</span>
    </div>
  ),
});

export function EventMap({
  events,
  center,
  onEventHover,
  highlightedEventId,
}: EventMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  if (apiKey) {
    return (
      <GoogleMapView
        events={events}
        center={center}
        onEventHover={onEventHover}
        highlightedEventId={highlightedEventId}
        apiKey={apiKey}
      />
    );
  }

  return (
    <MockMapView
      events={events}
      onEventHover={onEventHover}
      highlightedEventId={highlightedEventId}
    />
  );
}

// Fallback map when no Google Maps API key is configured
function MockMapView({
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
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(108,63,235,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(108,63,235,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="text-on-surface-muted absolute left-4 top-4 text-xs font-medium">
        Map Preview (set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for Google Maps)
      </div>

      {/* Event pins */}
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

      {/* Popup */}
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
