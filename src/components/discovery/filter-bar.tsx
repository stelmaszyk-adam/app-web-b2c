"use client";

import { useTranslations } from "next-intl";
import { Calendar, Flame } from "lucide-react";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";

interface FilterBarProps {
  selectedCategories: CategorySlug[];
  onToggleCategory: (slug: CategorySlug) => void;
  onDateFilterClick: () => void;
  dateLabel?: string;
  happeningNow?: boolean;
  onToggleHappeningNow?: () => void;
}

export function FilterBar({
  selectedCategories,
  onToggleCategory,
  onDateFilterClick,
  dateLabel,
  happeningNow,
  onToggleHappeningNow,
}: FilterBarProps) {
  const t = useTranslations("discovery");

  return (
    <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-1" role="toolbar" aria-label={t("filterCategories")}>
      {/* Happening Now toggle */}
      {onToggleHappeningNow && (
        <>
          <button
            onClick={onToggleHappeningNow}
            aria-pressed={happeningNow}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              happeningNow
                ? "bg-live-red text-white"
                : "bg-surface-low text-on-surface-variant hover:bg-surface-mid"
            }`}
          >
            <Flame className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t("happeningNow")}
          </button>
          <div className="bg-outline h-6 w-px shrink-0" />
        </>
      )}

      {/* Category chips */}
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategories.includes(cat.slug);
        const Icon = cat.icon;
        return (
          <button
            key={cat.slug}
            onClick={() => onToggleCategory(cat.slug)}
            aria-pressed={isSelected}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              isSelected
                ? "text-white"
                : "bg-surface-low text-on-surface-variant hover:bg-surface-mid"
            }`}
            style={isSelected ? { backgroundColor: cat.color } : undefined}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t(`categories.${cat.slug}`)}
          </button>
        );
      })}

      <div className="bg-outline h-6 w-px shrink-0" />

      {/* Date filter */}
      <button
        onClick={onDateFilterClick}
        className="bg-surface-low text-on-surface-variant hover:bg-surface-mid inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors"
      >
        <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
        {dateLabel ?? t("dateFilter")}
      </button>
    </div>
  );
}
