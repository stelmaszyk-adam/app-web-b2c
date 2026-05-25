"use client";

import type { LucideIcon } from "lucide-react";
import type { CategorySlug } from "@/lib/categories";
import { EventImage } from "@/components/ui/event-image";

interface VenueHeroImageProps {
  photos: string[];
  venueName: string;
  category: CategorySlug;
  categoryLabel: string;
  categoryColor?: string;
  CategoryIcon?: LucideIcon;
}

export function VenueHeroImage({
  photos,
  venueName,
  category,
  categoryLabel,
  categoryColor,
  CategoryIcon,
}: VenueHeroImageProps) {
  const heroSrc = photos[0] ?? null;

  return (
    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[var(--radius-xl)]">
      <EventImage
        src={heroSrc}
        alt={venueName}
        category={category}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        priority
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute left-4 top-4 flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            color: categoryColor ?? "#6b7280",
          }}
        >
          {CategoryIcon && <CategoryIcon className="h-3.5 w-3.5" strokeWidth={1.75} />}
          {categoryLabel}
        </span>
      </div>
    </div>
  );
}
