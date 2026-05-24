"use client";

import { X, Clock, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CATEGORY_MAP } from "@/lib/categories";
import type { MockEvent } from "@/lib/types";

interface MapPopupProps {
  event: MockEvent;
  onClose: () => void;
  inline?: boolean;
}

export function MapPopup({ event, onClose, inline }: MapPopupProps) {
  const cat = CATEGORY_MAP[event.category];

  return (
    <div
      className={`bg-surface-high overflow-hidden rounded-[var(--radius-lg)] shadow-lg ${inline ? "" : "absolute bottom-4 left-4 right-4 z-20 max-w-sm"}`}
    >
      {/* Image */}
      <div className="relative h-32 w-full bg-gradient-to-br from-primary/20 to-secondary/20">
        {/* Category badge */}
        <span
          className="absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
          style={{ backgroundColor: cat?.color ?? "#6b7280" }}
        >
          {cat?.labelEn ?? event.category}
        </span>
        <button
          onClick={onClose}
          className="bg-surface-high/80 absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="text-on-surface-variant mb-1 flex items-center gap-1.5 text-xs">
          <Clock className="h-3 w-3" strokeWidth={1.75} />
          <span>
            {event.date} · {event.time}
          </span>
        </div>
        <h3 className="text-on-surface line-clamp-2 text-sm font-semibold">
          {event.title}
        </h3>
        <div className="text-on-surface-variant mt-1 flex items-center gap-1.5 text-xs">
          <MapPin className="h-3 w-3" strokeWidth={1.75} />
          <span>{event.venue.name}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-on-surface text-sm font-semibold">
            {event.priceFrom === 0
              ? "Bezpłatne"
              : `od ${event.priceFrom} zł`}
          </span>
          <Link
            href={`/${event.city}/event/${event.id}`}
            className="text-primary text-xs font-medium hover:underline"
          >
            Zobacz szczegóły
          </Link>
        </div>
      </div>
    </div>
  );
}
