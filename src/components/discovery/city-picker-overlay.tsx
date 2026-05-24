"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Search, X, MapPin, Bell } from "lucide-react";
import { CITIES } from "@/lib/cities";
import { useCity } from "@/hooks/use-city";

export function CityPickerOverlay() {
  const { showCityPicker, closeCityPicker, selectCity, city } = useCity();
  const t = useTranslations("discovery");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return CITIES;
    const q = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return CITIES.filter((c) => {
      const name = c.namePl
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return name.includes(q);
    });
  }, [query]);

  const noMatch = query.length > 0 && filtered.length === 0;

  const handleSelect = useCallback(
    (slug: string) => {
      setQuery("");
      selectCity(slug);
    },
    [selectCity],
  );

  const handleClose = useCallback(() => {
    setQuery("");
    closeCityPicker();
  }, [closeCityPicker]);

  if (!showCityPicker) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-surface-high w-full max-w-[560px] rounded-[var(--radius-xl)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-on-surface text-lg font-semibold">
            {t("selectCity")}
          </h2>
          <button
            onClick={handleClose}
            className="text-on-surface-variant hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            aria-label={t("close")}
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

        {/* No-match state */}
        {noMatch ? (
          <div className="bg-primary/5 rounded-[var(--radius-lg)] p-6 text-center">
            <div className="bg-surface-high text-primary mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)]">
              <MapPin className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <p className="text-on-surface mb-1 text-base font-semibold">
              <strong>{query}</strong> {t("cityNotAvailable")}
            </p>
            <p className="text-on-surface-variant mb-4 text-sm">
              {t("cityNotAvailableDesc")}
            </p>
            <button className="bg-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-90">
              <Bell className="h-4 w-4" strokeWidth={1.75} />
              {t("reportCity", { city: query })}
            </button>
          </div>
        ) : (
          <>
            <p className="text-on-surface-variant mb-3 text-xs font-medium uppercase tracking-wide">
              {t("popularCities")}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {filtered.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => handleSelect(c.slug)}
                  className={`flex flex-col items-start rounded-[var(--radius-md)] px-3 py-3 text-left transition-colors ${
                    city.slug === c.slug
                      ? "bg-primary/10 ring-primary/30 ring-2"
                      : "bg-surface-low hover:bg-surface-mid"
                  }`}
                >
                  <span className="text-on-surface flex items-center gap-1.5 text-sm font-medium">
                    <MapPin className="h-3 w-3" strokeWidth={1.75} />
                    {c.namePl}
                  </span>
                  <span className="text-on-surface-muted mt-0.5 text-[10px]">
                    {c.eventCount} {t("eventsCount")} · {c.region}
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
