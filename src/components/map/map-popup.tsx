"use client";

import { X, Clock, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CATEGORY_MAP } from "@/lib/categories";
import type { Event } from "@/lib/types";
import { formatEventDate, formatEventTime } from "@/lib/types";
import { EventImage } from "@/components/ui/event-image";

interface MapPopupProps {
  event: Event;
  citySlug: string;
  onClose: () => void;
  inline?: boolean;
}

export function MapPopup({ event, citySlug, onClose, inline }: MapPopupProps) {
  const cat = CATEGORY_MAP[event.category];

  return (
    <div
      className={`bg-surface-high overflow-hidden rounded-[var(--radius-lg)] shadow-lg ${inline ? "" : "absolute bottom-4 left-4 right-4 z-20 max-w-sm"}`}
    >
      {/* Image */}
      <div className="relative h-32 w-full">
        <EventImage
          src={event.photoUrl}
          alt={event.name}
          category={event.category}
          fill
          sizes="(max-width: 640px) 100vw, 384px"
        />
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
            {formatEventDate(event.startTime)} · {formatEventTime(event.startTime)}
          </span>
        </div>
        <h3 className="text-on-surface line-clamp-2 text-sm font-semibold">
          {event.name}
        </h3>
        <div className="text-on-surface-variant mt-1 flex items-center gap-1.5 text-xs">
          <MapPin className="h-3 w-3" strokeWidth={1.75} />
          <span>{event.venue.name}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-on-surface text-sm font-semibold">
            {event.price == null || event.price === 0
              ? "Bezpłatne"
              : `od ${event.price} zł`}
          </span>
          <Link
            href={`/${citySlug}/event/${event.id}`}
            className="text-primary text-xs font-medium hover:underline"
          >
            Zobacz szczegoly
          </Link>
        </div>
      </div>
    </div>
  );
}
