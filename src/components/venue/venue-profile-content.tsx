"use client";

import { useState } from "react";

interface VenueProfileContentProps {
  photos: string[];
  venueName: string;
}

export function VenueProfileContent({ photos, venueName }: VenueProfileContentProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (photos.length <= 1) return null;

  return (
    <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
      {photos.map((photo, i) => {
        const isPlaceholder = photo.startsWith("placeholder:");
        return (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] transition-all ${
              i === selectedIndex ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
            }`}
            aria-label={`${venueName} photo ${i + 1}`}
          >
            {isPlaceholder ? (
              <div
                className="h-full w-full"
                style={{
                  background: `linear-gradient(135deg, ${photo.split(":")[1]}33, ${photo.split(":")[1]}66)`,
                }}
              />
            ) : (
              <div
                className="bg-surface-mid h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photo})` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
