"use client";

import { useState } from "react";
import type { CategorySlug } from "@/lib/categories";
import { EventImage } from "@/components/ui/event-image";

interface VenueProfileContentProps {
  photos: string[];
  venueName: string;
  category: CategorySlug;
}

export function VenueProfileContent({ photos, venueName, category }: VenueProfileContentProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (photos.length <= 1) return null;

  return (
    <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
      {photos.map((photo, i) => (
        <button
          key={i}
          onClick={() => setSelectedIndex(i)}
          className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] transition-all ${
            i === selectedIndex ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
          }`}
          aria-label={`${venueName} photo ${i + 1}`}
        >
          <EventImage
            src={photo}
            alt=""
            category={category}
            fill
            sizes="64px"
          />
        </button>
      ))}
    </div>
  );
}
