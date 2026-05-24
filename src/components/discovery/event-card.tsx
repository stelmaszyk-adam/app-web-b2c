"use client";

import { Clock, MapPin, Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CATEGORY_MAP } from "@/lib/categories";
import type { MockEvent } from "@/lib/types";

interface EventCardProps {
  event: MockEvent;
  isHighlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function EventCard({
  event,
  isHighlighted,
  onMouseEnter,
  onMouseLeave,
}: EventCardProps) {
  const cat = CATEGORY_MAP[event.category];

  return (
    <Link
      href={`/${event.city}/event/${event.id}`}
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
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-gradient-to-br from-primary/20 to-secondary/20">
        {/* Badges */}
        <div className="absolute left-1.5 top-1.5 flex flex-col gap-1">
          {event.badges.includes("live") && (
            <span className="bg-live-red rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
              Na żywo
            </span>
          )}
          {event.badges.includes("fast") && (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
              Szybko znika
            </span>
          )}
          {event.badges.includes("recur") && (
            <span className="bg-info rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
              Cotygodniowo
            </span>
          )}
        </div>
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
            {event.date} · {event.time}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-on-surface mt-0.5 line-clamp-2 text-sm font-semibold leading-tight">
          {event.title}
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
            {event.priceFrom === 0
              ? "Bezpłatne"
              : `od ${event.priceFrom} zł`}
          </span>
        </div>
      </div>
    </article>
    </Link>
  );
}
