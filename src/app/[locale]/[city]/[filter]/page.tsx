import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCityBySlug, CITIES } from "@/lib/cities";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import { fetchEvents } from "@/lib/api";
import { formatEventDate, formatEventTime, type Event } from "@/lib/types";
import { DiscoveryView } from "@/components/discovery/discovery-view";
import { getPresetRange, type DatePresetKey } from "@/lib/date-filters";

type Props = {
  params: Promise<{ locale: string; city: string; filter: string }>;
};

// Date-based filters
const DATE_FILTERS: Record<DatePresetKey, { labelPl: string; labelEn: string }> = {
  "this-weekend": { labelPl: "W ten weekend", labelEn: "This weekend" },
  today: { labelPl: "Dzisiaj", labelEn: "Today" },
  tomorrow: { labelPl: "Jutro", labelEn: "Tomorrow" },
  "this-week": { labelPl: "W tym tygodniu", labelEn: "This week" },
  "next-30-days": { labelPl: "30 dni", labelEn: "30 days" },
};

const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

function isCategory(filter: string): filter is CategorySlug {
  return CATEGORY_SLUGS.includes(filter as CategorySlug);
}

function isDateFilter(filter: string): filter is DatePresetKey {
  return filter in DATE_FILTERS;
}

export async function generateStaticParams() {
  const params: { city: string; filter: string }[] = [];
  for (const city of CITIES) {
    for (const cat of CATEGORIES) {
      params.push({ city: city.slug, filter: cat.slug });
    }
    for (const df of Object.keys(DATE_FILTERS)) {
      params.push({ city: city.slug, filter: df });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city: citySlug, filter } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) return {};

  const t = await getTranslations({ locale, namespace: "discovery" });

  const canonicalPath = `/${citySlug}/${filter}`;

  if (isCategory(filter)) {
    const cat = CATEGORIES.find((c) => c.slug === filter);
    const catLabel = (locale === "pl" ? cat?.labelPl : cat?.labelEn) ?? filter;
    return {
      title: t("categoryMetaTitle", { city: city.namePl, category: catLabel }),
      description: t("categoryMetaDescription", {
        city: city.namePl,
        category: catLabel,
      }),
      alternates: {
        canonical: canonicalPath,
        languages: {
          pl: canonicalPath,
          en: `/en${canonicalPath}`,
        },
      },
    };
  }

  if (isDateFilter(filter)) {
    const df = DATE_FILTERS[filter];
    const label = locale === "pl" ? df.labelPl : df.labelEn;
    return {
      title: t("dateFilterMetaTitle", { city: city.namePl, filter: label }),
      description: t("dateFilterMetaDescription", {
        city: city.namePl,
        filter: label,
      }),
      alternates: {
        canonical: canonicalPath,
        languages: {
          pl: canonicalPath,
          en: `/en${canonicalPath}`,
        },
      },
    };
  }

  return {};
}

export default async function CityFilterPage({ params }: Props) {
  const { locale, city: citySlug, filter } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  if (!isCategory(filter) && !isDateFilter(filter)) {
    notFound();
  }

  let events: Event[];
  let initialCategories: CategorySlug[] | undefined;

  let initialDateFilter:
    | { from: string; to: string; label: string; preset: DatePresetKey }
    | undefined;

  if (isCategory(filter)) {
    events = await fetchEvents({ city: citySlug, categories: [filter] });
    initialCategories = [filter];
  } else if (isDateFilter(filter)) {
    const range = getPresetRange(filter);
    events = await fetchEvents({
      city: citySlug,
      dateFrom: range.from,
      dateTo: range.to,
    });
    initialDateFilter = {
      ...range,
      label: locale === "pl" ? DATE_FILTERS[filter].labelPl : DATE_FILTERS[filter].labelEn,
      preset: filter,
    };
  } else {
    events = [];
  }

  const filterLabel = isCategory(filter)
    ? CATEGORIES.find((c) => c.slug === filter)?.labelPl
    : isDateFilter(filter)
      ? DATE_FILTERS[filter]?.labelPl
      : undefined;

  return (
    <>
      {/* SSR event data for SEO + screen readers */}
      <div className="sr-only">
        <h1>
          {filterLabel} — Wydarzenia w {city.namePl} — {events.length} wydarzen
        </h1>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              {event.name} — {event.venue.name} — {formatEventDate(event.startTime, locale)} {formatEventTime(event.startTime)}
            </li>
          ))}
        </ul>
      </div>

      <DiscoveryView
        events={events}
        city={city}
        initialCategories={initialCategories}
        initialDateFilter={initialDateFilter}
      />
    </>
  );
}
