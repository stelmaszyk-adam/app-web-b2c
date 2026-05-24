import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCityBySlug, CITIES } from "@/lib/cities";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import { fetchEvents } from "@/lib/api";
import { DiscoveryView } from "@/components/discovery/discovery-view";

type Props = {
  params: Promise<{ locale: string; city: string; filter: string }>;
};

// Date-based filters
const DATE_FILTERS: Record<
  string,
  { labelPl: string; labelEn: string; getRange: () => { from: string; to: string } }
> = {
  "this-weekend": {
    labelPl: "W ten weekend",
    labelEn: "This weekend",
    getRange: () => {
      const now = new Date();
      const day = now.getDay();
      const satOffset = day === 0 ? 6 : 6 - day;
      const sat = new Date(now.getTime() + satOffset * 86400000);
      const sun = new Date(sat.getTime() + 86400000);
      return {
        from: sat.toISOString().split("T")[0],
        to: sun.toISOString().split("T")[0],
      };
    },
  },
  today: {
    labelPl: "Dzisiaj",
    labelEn: "Today",
    getRange: () => {
      const d = new Date().toISOString().split("T")[0];
      return { from: d, to: d };
    },
  },
  tomorrow: {
    labelPl: "Jutro",
    labelEn: "Tomorrow",
    getRange: () => {
      const d = new Date(Date.now() + 86400000).toISOString().split("T")[0];
      return { from: d, to: d };
    },
  },
};

const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

function isCategory(filter: string): filter is CategorySlug {
  return CATEGORY_SLUGS.includes(filter as CategorySlug);
}

function isDateFilter(filter: string): boolean {
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

  if (isCategory(filter)) {
    const cat = CATEGORIES.find((c) => c.slug === filter);
    const catLabel = (locale === "pl" ? cat?.labelPl : cat?.labelEn) ?? filter;
    return {
      title: t("categoryMetaTitle", { city: city.namePl, category: catLabel }),
      description: t("categoryMetaDescription", {
        city: city.namePl,
        category: catLabel,
      }),
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
    };
  }

  return {};
}

export default async function CityFilterPage({ params }: Props) {
  const { city: citySlug, filter } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  if (!isCategory(filter) && !isDateFilter(filter)) {
    notFound();
  }

  let events;
  let initialCategories: CategorySlug[] | undefined;

  if (isCategory(filter)) {
    events = await fetchEvents({ city: citySlug, categories: [filter] });
    initialCategories = [filter];
  } else {
    const range = DATE_FILTERS[filter].getRange();
    events = await fetchEvents({
      city: citySlug,
      dateFrom: range.from,
      dateTo: range.to,
    });
  }

  const filterLabel = isCategory(filter)
    ? CATEGORIES.find((c) => c.slug === filter)?.labelPl
    : DATE_FILTERS[filter]?.labelPl;

  return (
    <>
      {/* SSR event data for SEO */}
      <div className="sr-only" aria-hidden="true">
        <h1>
          {filterLabel} — Wydarzenia w {city.namePl} — {events.length} wydarzeń
        </h1>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              {event.title} — {event.venue.name} — {event.date} {event.time}
            </li>
          ))}
        </ul>
      </div>

      <DiscoveryView
        events={events}
        city={city}
        initialCategories={initialCategories}
      />
    </>
  );
}
