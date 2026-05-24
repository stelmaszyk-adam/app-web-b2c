"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Map as MapIcon, List, MapPin } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import type { MockEvent } from "@/lib/types";
import type { CategorySlug } from "@/lib/categories";
import type { City } from "@/lib/cities";
import { EventMap } from "@/components/map/event-map";
import { FilterBar } from "./filter-bar";
import { EventCard } from "./event-card";
import { CityPicker } from "./city-picker";
import { DatePicker } from "./date-picker";

interface DiscoveryViewProps {
  events: MockEvent[];
  city: City;
  initialCategories?: CategorySlug[];
}

export function DiscoveryView({
  events,
  city,
  initialCategories,
}: DiscoveryViewProps) {
  const t = useTranslations("discovery");
  const router = useRouter();

  const [selectedCategories, setSelectedCategories] = useState<CategorySlug[]>(
    initialCategories ?? [],
  );
  const [dateFilter, setDateFilter] = useState<{
    from: string;
    to: string;
    label: string;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"split" | "list">("split");
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [happeningNow, setHappeningNow] = useState(false);

  const filteredEvents = useMemo(() => {
    let result = events;

    if (selectedCategories.length > 0) {
      result = result.filter((e) => selectedCategories.includes(e.category));
    }

    if (dateFilter) {
      result = result.filter((e) => {
        const eventDate = e.startDate.split("T")[0];
        return eventDate >= dateFilter.from && eventDate <= dateFilter.to;
      });
    }

    return result;
  }, [events, selectedCategories, dateFilter]);

  const toggleCategory = useCallback((slug: CategorySlug) => {
    setSelectedCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug],
    );
  }, []);

  const handleCitySelect = useCallback(
    (citySlug: string) => {
      setShowCityPicker(false);
      router.push(`/${citySlug}`);
    },
    [router],
  );

  const handleDateApply = useCallback(
    (from: string, to: string, label: string) => {
      setDateFilter({ from, to, label });
      setShowDatePicker(false);
    },
    [],
  );

  return (
    <div className="flex flex-col">
      {/* Top bar: city + view toggle */}
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-6 py-3 max-md:px-3">
        <button
          onClick={() => setShowCityPicker(true)}
          className="inline-flex items-center gap-1.5 text-lg font-bold"
        >
          <MapPin className="text-primary h-5 w-5" strokeWidth={1.75} />
          <span className="text-on-surface">{city.namePl}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("split")}
            className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] transition-colors ${
              viewMode === "split"
                ? "bg-primary text-white"
                : "bg-surface-low text-on-surface-variant hover:bg-surface-mid"
            }`}
            aria-label={t("mapView")}
          >
            <MapIcon className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] transition-colors ${
              viewMode === "list"
                ? "bg-primary text-white"
                : "bg-surface-low text-on-surface-variant hover:bg-surface-mid"
            }`}
            aria-label={t("listView")}
          >
            <List className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto w-full max-w-[1440px] px-6 max-md:px-3">
        <FilterBar
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          onDateFilterClick={() => setShowDatePicker(true)}
          dateLabel={dateFilter?.label}
          happeningNow={happeningNow}
          onToggleHappeningNow={() => setHappeningNow(!happeningNow)}
        />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-[1440px] px-6 py-4 max-md:px-3">
        {viewMode === "split" ? (
          <div className="flex gap-4 max-lg:flex-col" style={{ minHeight: "70vh" }}>
            {/* Event list */}
            <div className="flex w-full flex-col gap-3 overflow-y-auto lg:w-[420px] lg:shrink-0" style={{ maxHeight: "70vh" }}>
              <p className="text-on-surface-variant text-xs font-medium">
                {filteredEvents.length} {t("eventsFound")}
              </p>
              {filteredEvents.length === 0 ? (
                <div className="bg-surface-low flex flex-col items-center justify-center rounded-[var(--radius-lg)] py-12">
                  <p className="text-on-surface text-sm font-medium">
                    {t("noEventsFound")}
                  </p>
                  <p className="text-on-surface-variant mt-1 text-xs">
                    {t("noEventsFoundDesc")}
                  </p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isHighlighted={hoveredEventId === event.id}
                    onMouseEnter={() => setHoveredEventId(event.id)}
                    onMouseLeave={() => setHoveredEventId(null)}
                  />
                ))
              )}
            </div>

            {/* Map */}
            <div className="flex-1 overflow-hidden rounded-[var(--radius-lg)] max-lg:h-[50vh] lg:sticky lg:top-20">
              <EventMap
                events={filteredEvents}
                center={{ lat: city.lat, lng: city.lng }}
                onEventHover={setHoveredEventId}
                highlightedEventId={hoveredEventId}
              />
            </div>
          </div>
        ) : (
          // List-only view
          <div>
            <p className="text-on-surface-variant mb-3 text-xs font-medium">
              {filteredEvents.length} {t("eventsFound")}
            </p>
            {filteredEvents.length === 0 ? (
              <div className="bg-surface-low flex flex-col items-center justify-center rounded-[var(--radius-lg)] py-12">
                <p className="text-on-surface text-sm font-medium">
                  {t("noEventsFound")}
                </p>
                <p className="text-on-surface-variant mt-1 text-xs">
                  {t("noEventsFoundDesc")}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlays */}
      {showCityPicker && (
        <CityPicker
          currentCity={city.slug}
          onSelectCity={handleCitySelect}
          onClose={() => setShowCityPicker(false)}
        />
      )}
      {showDatePicker && (
        <DatePicker
          onApply={handleDateApply}
          onClear={() => {
            setDateFilter(null);
            setShowDatePicker(false);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
}
