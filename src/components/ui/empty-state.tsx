"use client";

import { useTranslations } from "next-intl";
import { MapPin, Search } from "lucide-react";
import { useCity } from "@/hooks/use-city";

export function NoEventsEmptyState({
  onClearFilters,
  hasActiveFilters,
}: {
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}) {
  const t = useTranslations("emptyStates");
  const { openCityPicker } = useCity();

  return (
    <div className="bg-surface-low flex flex-col items-center justify-center rounded-[var(--radius-xl)] px-6 py-12">
      {/* Illustration */}
      <svg
        width="140"
        height="120"
        viewBox="0 0 140 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="mb-6"
      >
        <circle cx="70" cy="55" r="45" fill="var(--primary-container)" opacity="0.3" />

        {/* Calendar body */}
        <rect x="40" y="28" width="60" height="55" rx="6" fill="var(--surface-high)" stroke="var(--primary)" strokeWidth="1.5" opacity="0.8" />
        <rect x="40" y="28" width="60" height="16" rx="6" fill="var(--primary)" opacity="0.15" />

        {/* Calendar lines */}
        <line x1="55" y1="55" x2="85" y2="55" stroke="var(--on-surface-muted)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        <line x1="55" y1="63" x2="78" y2="63" stroke="var(--on-surface-muted)" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
        <line x1="55" y1="71" x2="72" y2="71" stroke="var(--on-surface-muted)" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />

        {/* Search icon overlay */}
        <circle cx="95" cy="80" r="14" fill="var(--surface-high)" stroke="var(--primary)" strokeWidth="1.5" />
        <line x1="104" y1="89" x2="112" y2="97" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
        <text x="95" y="84" textAnchor="middle" fontSize="12" fill="var(--on-surface-muted)">?</text>
      </svg>

      <h3 className="text-on-surface mb-1 text-base font-semibold">
        {t("noEventsTitle")}
      </h3>
      <p className="text-on-surface-variant mb-5 max-w-sm text-center text-sm">
        {t("noEventsDescription")}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="bg-primary hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-colors"
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t("clearFilters")}
          </button>
        )}
        <button
          onClick={openCityPicker}
          className="text-on-surface hover:bg-surface-mid inline-flex items-center gap-1.5 rounded-full border border-outline px-4 py-2 text-xs font-semibold transition-colors"
        >
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
          {t("changeCity")}
        </button>
      </div>
    </div>
  );
}

export function NoVenueEventsEmptyState() {
  const t = useTranslations("emptyStates");

  return (
    <div className="bg-surface-low rounded-[var(--radius-xl)] px-6 py-10 text-center">
      {/* Illustration */}
      <svg
        width="100"
        height="80"
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="mx-auto mb-4"
      >
        <circle cx="50" cy="40" r="32" fill="var(--primary-container)" opacity="0.25" />

        {/* Calendar */}
        <rect x="28" y="20" width="44" height="40" rx="5" fill="var(--surface-high)" stroke="var(--primary)" strokeWidth="1.5" opacity="0.7" />
        <rect x="28" y="20" width="44" height="12" rx="5" fill="var(--primary)" opacity="0.12" />

        {/* Empty lines */}
        <line x1="37" y1="42" x2="63" y2="42" stroke="var(--on-surface-muted)" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
        <line x1="37" y1="50" x2="55" y2="50" stroke="var(--on-surface-muted)" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
      </svg>

      <h3 className="text-on-surface mb-1 text-base font-semibold">
        {t("noVenueEventsTitle")}
      </h3>
      <p className="text-on-surface-variant mx-auto max-w-xs text-sm">
        {t("noVenueEventsDescription")}
      </p>
    </div>
  );
}
