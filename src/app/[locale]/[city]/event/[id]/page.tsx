import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCityBySlug } from "@/lib/cities";
import { fetchEventById } from "@/lib/api";
import { CATEGORY_MAP } from "@/lib/categories";
import { EventDetailContent } from "@/components/event/event-detail-content";
import { JsonLd } from "@/components/seo/json-ld";
import { buildEventJsonLd } from "@/lib/structured-data";
import { TrackEventDetailView } from "@/components/analytics/track-event-detail";
import {
  TrackedTicketLink,
  TrackedNavigateLink,
  TrackedSmartBannerLink,
} from "@/components/analytics/tracked-event-links";

type Props = {
  params: Promise<{ locale: string; city: string; id: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://eventapp.dev";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city: citySlug, id } = await params;
  const event = await fetchEventById(id);
  if (!event) return {};

  const t = await getTranslations({ locale, namespace: "eventDetail" });

  const description = t("metaDescription", {
    date: event.date,
    venue: event.venue.name,
    address: event.venue.address,
    description: event.description.slice(0, 120),
  });

  const canonicalPath = `/${citySlug}/event/${id}`;
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;
  const ogImageUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(event.title)}&date=${encodeURIComponent(event.date)}&venue=${encodeURIComponent(event.venue.name)}`;

  return {
    title: t("metaTitle", { title: event.title, venue: event.venue.name }),
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        pl: canonicalPath,
        en: `/en${canonicalPath}`,
      },
    },
    openGraph: {
      title: event.title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { locale, city: citySlug, id } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const event = await fetchEventById(id);
  if (!event) notFound();

  const cat = CATEGORY_MAP[event.category];
  const t = await getTranslations({ locale, namespace: "eventDetail" });

  const recurrenceLabel = event.recurrence
    ? t(
        `recurrence${event.recurrence.type.charAt(0).toUpperCase() + event.recurrence.type.slice(1)}` as
          | "recurrenceDaily"
          | "recurrenceWeekly"
          | "recurrenceMonthly",
      )
    : null;

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      <TrackEventDetailView eventId={event.id} eventTitle={event.title} />
      <JsonLd data={buildEventJsonLd(event)} />
      {/* SSR-visible content for SEO — always in raw HTML */}
      <div className="mb-6">
        {/* Category badge */}
        <span
          className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
          style={{ backgroundColor: cat?.color ?? "#6b7280" }}
        >
          {cat?.icon && <cat.icon className="h-3.5 w-3.5" strokeWidth={1.75} />}
          {cat?.labelPl ?? event.category}
        </span>

        <h1 className="text-on-surface mt-2 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {event.title}
        </h1>

        {/* Scout attribution */}
        {event.scoutUsername && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-container px-3 py-1.5 text-sm font-medium text-primary">
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
            </svg>
            {t("tippedBy", { username: event.scoutUsername })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column — main content */}
        <div className="flex-1">
          {/* Photo gallery */}
          <EventDetailContent event={event} citySlug={citySlug} locale={locale} />

          {/* Event info — SSR visible */}
          <div className="mt-6 space-y-4">
            {/* Date & Time */}
            <div className="text-on-surface flex items-center gap-2 text-base">
              <svg
                className="h-5 w-5 shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="font-medium">
                {event.date} · {event.time}
              </span>
            </div>

            {/* Venue & Address */}
            <div className="text-on-surface flex items-start gap-2 text-base">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <a
                  href={`/${locale}/${citySlug}/venue/${event.venue.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {event.venue.name}
                </a>
                <p className="text-on-surface-variant text-sm">{event.venue.address}</p>
              </div>
            </div>

            {/* Recurring event indicator */}
            {event.recurrence && recurrenceLabel && (
              <RecurringBadge
                label={recurrenceLabel}
                seriesLabel={t("partOfSeries", { type: recurrenceLabel.toLowerCase() })}
              />
            )}
          </div>

          {/* Description */}
          <section className="mt-8">
            <h2 className="text-on-surface mb-3 text-xl font-semibold">{t("aboutEvent")}</h2>
            <p className="text-on-surface-variant whitespace-pre-line text-base leading-relaxed">
              {event.description}
            </p>
          </section>

          {/* Source attribution */}
          {event.source && (
            <p className="text-on-surface-muted mt-4 text-sm">
              {t("source")}: {event.source}
            </p>
          )}

          {/* Recurring dates expandable */}
          {event.recurrence && (
            <RecurringDates
              instances={event.recurrence.instances}
              citySlug={citySlug}
              locale={locale}
              viewAllLabel={t("viewAllDates")}
              hideLabel={t("hideAllDates")}
            />
          )}
        </div>

        {/* Right sidebar */}
        <aside className="w-full shrink-0 space-y-4 lg:w-80">
          {/* Price & CTA card */}
          <div className="bg-surface-high rounded-[var(--radius-xl)] p-6">
            <p className="text-on-surface mb-4 text-2xl font-bold">
              {event.priceFrom === 0
                ? t("free")
                : t("priceFrom", { price: event.priceFrom.toString() })}
            </p>

            {/* Buy tickets CTA */}
            {event.ticketUrl && (
              <TrackedTicketLink
                eventId={event.id}
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-shadow hover:shadow-brand"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  <path d="M13 5v2M13 17v2M13 11v2" />
                </svg>
                {t("buyTickets")}
              </TrackedTicketLink>
            )}

            {/* Navigate CTA */}
            <TrackedNavigateLink
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.venue.address + ", " + city.namePl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-outline px-6 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-low"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              {t("navigate")}
            </TrackedNavigateLink>
          </div>

          {/* Smart banner: Save event in app */}
          <div className="bg-primary-container rounded-[var(--radius-xl)] p-5">
            <p className="text-on-surface text-sm font-semibold">{t("saveInApp")}</p>
            <p className="text-on-surface-variant mt-1 text-xs">{t("saveInAppDesc")}</p>
            <div className="mt-3 flex gap-2">
              <TrackedSmartBannerLink
                context="save_event_ios"
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-on-surface px-3 py-1.5 text-xs font-medium text-surface"
              >
                {t("appStore")}
              </TrackedSmartBannerLink>
              <TrackedSmartBannerLink
                context="save_event_android"
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-on-surface px-3 py-1.5 text-xs font-medium text-surface"
              >
                {t("googlePlay")}
              </TrackedSmartBannerLink>
            </div>
          </div>

          {/* Smart banner: Follow venue in app */}
          <div className="bg-surface-low rounded-[var(--radius-xl)] p-5">
            <p className="text-on-surface text-sm font-semibold">
              {t("followVenueInApp")} — {event.venue.name}
            </p>
            <p className="text-on-surface-variant mt-1 text-xs">{t("followVenueInAppDesc")}</p>
            <div className="mt-3 flex gap-2">
              <TrackedSmartBannerLink
                context="follow_venue_ios"
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-on-surface px-3 py-1.5 text-xs font-medium text-surface"
              >
                {t("appStore")}
              </TrackedSmartBannerLink>
              <TrackedSmartBannerLink
                context="follow_venue_android"
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-on-surface px-3 py-1.5 text-xs font-medium text-surface"
              >
                {t("googlePlay")}
              </TrackedSmartBannerLink>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

function RecurringBadge({ seriesLabel }: { label: string; seriesLabel: string }) {
  return (
    <div className="bg-info-container flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2">
      <svg
        className="h-4 w-4 shrink-0 text-info"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
      <span className="text-on-surface text-sm font-medium">{seriesLabel}</span>
    </div>
  );
}

function RecurringDates({
  instances,
  citySlug,
  locale,
  viewAllLabel,
  hideLabel,
}: {
  instances: { id: string; date: string; time: string }[];
  citySlug: string;
  locale: string;
  viewAllLabel: string;
  hideLabel: string;
}) {
  return (
    <details className="mt-6 group">
      <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:underline list-none [&::-webkit-details-marker]:hidden">
        <svg
          className="h-4 w-4 transition-transform group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="group-open:hidden">{viewAllLabel}</span>
        <span className="hidden group-open:inline">{hideLabel}</span>
      </summary>
      <ul className="mt-3 space-y-2 pl-6">
        {instances.map((inst) => (
          <li key={inst.id}>
            <a
              href={`/${locale}/${citySlug}/event/${inst.id}`}
              className="text-on-surface hover:text-primary text-sm transition-colors"
            >
              {inst.date} · {inst.time}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
