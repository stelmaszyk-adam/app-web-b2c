"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, X, MapPin } from "lucide-react";
import { CITIES } from "@/lib/cities";

interface CityPickerProps {
  currentCity?: string;
  onSelectCity: (citySlug: string) => void;
  onClose: () => void;
}

export function CityPicker({
  currentCity,
  onSelectCity,
  onClose,
}: CityPickerProps) {
  const t = useTranslations("discovery");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return CITIES;
    const q = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return CITIES.filter((city) => {
      const name = city.namePl
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return name.includes(q);
    });
  }, [query]);

  const noMatch = query && filtered.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-surface-high w-full max-w-lg rounded-[var(--radius-xl)] p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-on-surface text-lg font-semibold">
            {t("selectCity")}
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Search */}
        <div className="bg-surface-low mb-4 flex items-center gap-2.5 rounded-[var(--radius-md)] px-3.5 py-2.5">
          <Search
            className="text-on-surface-muted h-4 w-4 shrink-0"
            strokeWidth={1.75}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchCityPlaceholder")}
            className="text-on-surface placeholder:text-on-surface-muted min-w-0 flex-1 bg-transparent text-sm outline-none"
            autoFocus
          />
        </div>

        {/* City grid */}
        {noMatch ? (
          <div className="py-8 text-center">
            <p className="text-on-surface text-sm font-medium">
              {query} {t("cityNotAvailable")}
            </p>
            <p className="text-on-surface-variant mt-1 text-xs">
              {t("cityNotAvailableDesc")}
            </p>
          </div>
        ) : (
          <>
            <p className="text-on-surface-variant mb-3 text-xs font-medium uppercase tracking-wide">
              {t("popularCities")}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {filtered.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => onSelectCity(city.slug)}
                  className={`flex flex-col items-start rounded-[var(--radius-md)] px-3 py-3 text-left transition-colors ${
                    currentCity === city.slug
                      ? "bg-primary/10 ring-primary/30 ring-2"
                      : "bg-surface-low hover:bg-surface-mid"
                  }`}
                >
                  <span className="text-on-surface flex items-center gap-1.5 text-sm font-medium">
                    <MapPin className="h-3 w-3" strokeWidth={1.75} />
                    {city.namePl}
                  </span>
                  <span className="text-on-surface-muted mt-0.5 text-[10px]">
                    {city.eventCount} {t("eventsCount")} · {city.region}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
