import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCityBySlug, CITIES } from "@/lib/cities";
import { fetchEvents } from "@/lib/api";
import { formatEventDate, formatEventTime } from "@/lib/types";
import { DiscoveryView } from "@/components/discovery/discovery-view";

type Props = {
  params: Promise<{ locale: string; city: string }>;
};

export async function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) return {};

  const t = await getTranslations({ locale, namespace: "discovery" });

  const canonicalPath = `/${citySlug}`;

  return {
    title: t("cityMetaTitle", { city: city.namePl }),
    description: t("cityMetaDescription", { city: city.namePl }),
    alternates: {
      canonical: canonicalPath,
      languages: {
        pl: canonicalPath,
        en: `/en${canonicalPath}`,
      },
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { locale, city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const events = await fetchEvents({ city: citySlug });

  return (
    <>
      {/* SSR event data for SEO + screen readers */}
      <div className="sr-only">
        <h1>
          Wydarzenia w {city.namePl} — {events.length} wydarzen
        </h1>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              {event.name} — {event.venue.name} — {formatEventDate(event.startTime, locale)} {formatEventTime(event.startTime)}
            </li>
          ))}
        </ul>
      </div>

      <DiscoveryView events={events} city={city} />
    </>
  );
}
