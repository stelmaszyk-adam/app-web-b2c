"use client";

import { Clock, MapPin, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CATEGORY_MAP } from "@/lib/categories";
import type { Event } from "@/lib/types";
import { formatEventDate, formatEventTime } from "@/lib/types";
import { EventImage } from "@/components/ui/event-image";

interface EventCardProps {
  event: Event;
  citySlug: string;
  isHighlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function EventCard({
  event,
  citySlug,
  isHighlighted,
  onMouseEnter,
  onMouseLeave,
}: EventCardProps) {
  const t = useTranslations("discovery");
  const cat = CATEGORY_MAP[event.category];

  return (
    <Link
      href={`/${citySlug}/event/${event.id}`}
      className="block"
    >
    <article
      className={`bg-surface-high group flex gap-3 rounded-[var(--radius-lg)] p-3 transition-all ${
        isHighlighted
          ? "ring-2 ring-primary/40 shadow-md"
          : "hover:shadow-sm"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Thumbnail */}
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[var(--radius-md)]">
        <EventImage
          src={event.photoUrl}
          alt={event.name}
          category={event.category}
          fill
          sizes="112px"
        />
        {/* Save button */}
        <button
          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
          aria-label="Save event"
        >
          <Heart className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Category badge */}
        <span
          className="mb-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
          style={{ backgroundColor: cat?.color ?? "#6b7280" }}
        >
          {cat?.icon && <cat.icon className="h-2.5 w-2.5" strokeWidth={2} />}
          {cat?.labelPl ?? event.category}
        </span>

        {/* Date / Time */}
        <div className="text-on-surface-variant flex items-center gap-1.5 text-xs">
          <Clock className="h-3 w-3 shrink-0" strokeWidth={1.75} />
          <span>
            {formatEventDate(event.startTime)} · {formatEventTime(event.startTime)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-on-surface mt-0.5 line-clamp-2 text-sm font-semibold leading-tight">
          {event.name}
        </h3>

        {/* Venue */}
        <div className="text-on-surface-variant mt-auto flex items-center gap-1.5 text-xs">
          <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.75} />
          <span className="truncate">
            {event.venue.name} · {event.venue.address}
          </span>
        </div>

        {/* Price */}
        <div className="mt-1">
          <span className="text-on-surface text-sm font-semibold">
            {event.price == null || event.price === 0
              ? "Bezpłatne"
              : `od ${event.price} zł`}
          </span>
        </div>
      </div>
    </article>
    </Link>
  );
}
