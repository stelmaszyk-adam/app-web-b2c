import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCityBySlug } from "@/lib/cities";
import { fetchVenueById, fetchEventsByVenueId } from "@/lib/api";
import { CATEGORY_MAP } from "@/lib/categories";
import { VenueProfileContent } from "@/components/venue/venue-profile-content";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPlaceJsonLd } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string; city: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city: citySlug, id } = await params;
  const venue = await fetchVenueById(id);
  if (!venue) return {};

  const t = await getTranslations({ locale, namespace: "venueProfile" });

  const canonicalPath = `/${citySlug}/venue/${id}`;

  return {
    title: t("metaTitle", { name: venue.name }),
    description: t("metaDescription", {
      name: venue.name,
      address: venue.address,
      description: venue.description.slice(0, 120),
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

export default async function VenueProfilePage({ params }: Props) {
  const { locale, city: citySlug, id } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const venue = await fetchVenueById(id);
  if (!venue) notFound();

  const upcomingEvents = await fetchEventsByVenueId(venue.id);
  const cat = CATEGORY_MAP[venue.category];
  const t = await getTranslations({ locale, namespace: "venueProfile" });

  const todayIndex = new Date().getDay();
  // JS getDay(): 0=Sunday..6=Saturday → map to our array index (0=Monday..6=Sunday)
  const todayMondayIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  const photos = getPhotoList(venue.venuePhotos, venue.photoUrl, cat?.color);

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      <JsonLd data={buildPlaceJsonLd(venue)} />
      {/* Breadcrumb */}
      <nav
        className="text-on-surface-variant mb-6 flex items-center gap-1.5 text-sm"
        aria-label="Breadcrumb"
      >
        <a href={`/${locale === "pl" ? "" : locale + "/"}${citySlug}`} className="hover:text-primary">
          {city.namePl}
        </a>
        <span className="text-on-surface-muted">/</span>
        <span className="text-on-surface-muted">{t("venues")}</span>
        <span className="text-on-surface-muted">/</span>
        <span className="text-on-surface">{venue.name}</span>
      </nav>

      {/* Hero image */}
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[var(--radius-xl)]">
        {photos[0].startsWith("placeholder:") ? (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${photos[0].split(":")[1]}33, ${photos[0].split(":")[1]}66)`,
            }}
          >
            <svg
              className="h-16 w-16 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        ) : (
          <div
            className="bg-surface-mid h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${photos[0]})` }}
            role="img"
            aria-label={venue.name}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: "rgba(255,255,255,0.95)",
              color: cat?.color ?? "#6b7280",
            }}
          >
            {cat?.icon && <cat.icon className="h-3.5 w-3.5" strokeWidth={1.75} />}
            {venue.categoryLabel}
          </span>
        </div>
      </div>

      {/* Photo thumbnails */}
      {photos.length > 1 && (
        <VenueProfileContent photos={photos} venueName={venue.name} />
      )}

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        {/* Left column */}
        <div className="flex-1">
          {/* Venue name */}
          <h1 className="text-on-surface text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {venue.name}
          </h1>

          {/* Address */}
          <div className="text-on-surface-variant mt-2 flex items-center gap-2 text-base">
            <svg
              className="h-5 w-5 shrink-0 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{venue.address}</span>
          </div>

          {/* Stats row */}
          <div className="bg-surface-low mt-4 flex flex-wrap items-center gap-6 rounded-[var(--radius-lg)] px-4 py-3">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-on-surface-variant"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <strong className="text-on-surface">{venue.followers.toLocaleString("pl-PL")}</strong>
              <span className="text-on-surface-variant text-sm">{t("followers")}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-on-surface-variant"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <strong className="text-on-surface">{upcomingEvents.length}</strong>
              <span className="text-on-surface-variant text-sm">{t("upcomingEvents")}</span>
            </div>
            <VenueOpenStatus hours={venue.openingHours} todayIndex={todayMondayIndex} t={t} />
          </div>

          {/* About */}
          <section className="mt-8">
            <h2 className="text-on-surface mb-3 text-xl font-semibold">{t("about")}</h2>
            <p className="text-on-surface-variant whitespace-pre-line text-base leading-relaxed">
              {venue.description}
            </p>
            {/* Claim CTA placeholder (task 1-01) */}
            <div className="bg-surface-low mt-4 flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3">
              <svg
                className="h-5 w-5 shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span className="text-on-surface-variant text-sm">
                {t("claimVenue")}{" "}
                <a
                  href="https://dashboard.eventapp.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {t("claimVenueLink")}
                  <svg className="ml-0.5 inline h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </span>
            </div>
          </section>

          {/* Opening Hours */}
          <section className="mt-8">
            <h2 className="text-on-surface mb-3 text-xl font-semibold">{t("openingHours")}</h2>
            <div className="overflow-hidden rounded-[var(--radius-lg)]">
              {venue.openingHours.map((entry, i) => {
                const isToday = i === todayMondayIndex;
                return (
                  <div
                    key={entry.day}
                    className={`flex items-center justify-between px-4 py-2.5 ${
                      isToday
                        ? "bg-primary-container font-semibold text-on-surface"
                        : i % 2 === 0
                          ? "bg-surface-low text-on-surface"
                          : "text-on-surface"
                    }`}
                  >
                    <span className="text-sm">
                      {entry.dayPl}
                      {isToday && (
                        <span className="text-primary ml-2 text-xs font-medium">({t("today")})</span>
                      )}
                    </span>
                    <span className={`text-sm ${entry.isClosed ? "text-on-surface-muted" : ""}`}>
                      {entry.hours}
                      {entry.isOpenUntilLate && !entry.isClosed && (
                        <span className="text-on-surface-variant ml-1 text-xs">({t("openUntilLate")})</span>
                      )}
                      {entry.isHoliday && (
                        <span className="ml-1 text-xs text-warning">({t("holiday")})</span>
                      )}
                      {entry.isTemporaryClosure && (
                        <span className="ml-1 text-xs text-warning">({t("temporaryClosure")})</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="mt-8">
            <h2 className="text-on-surface mb-3 text-xl font-semibold">{t("upcomingEventsTitle")}</h2>
            {upcomingEvents.length === 0 ? (
              <div className="bg-surface-low rounded-[var(--radius-xl)] px-6 py-8 text-center">
                <svg
                  className="text-on-surface-muted mx-auto h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <p className="text-on-surface-variant mt-3">{t("noUpcomingEvents")}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {upcomingEvents.map((ev) => {
                  const evCat = CATEGORY_MAP[ev.category];
                  return (
                    <a
                      key={ev.id}
                      href={`/${locale === "pl" ? "" : locale + "/"}${citySlug}/event/${ev.id}`}
                      className="bg-surface-low hover:bg-surface-mid flex items-center gap-4 rounded-[var(--radius-lg)] p-3 transition-colors"
                    >
                      <div
                        className="bg-surface-mid h-16 w-16 shrink-0 rounded-[var(--radius-md)] bg-cover bg-center"
                        style={{
                          backgroundImage: ev.imageUrl
                            ? `url(${ev.imageUrl})`
                            : `linear-gradient(135deg, ${evCat?.color ?? "#6b7280"}33, ${evCat?.color ?? "#6b7280"}66)`,
                        }}
                        role="img"
                        aria-label={ev.title}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">
                          {ev.date} · {ev.time}
                        </p>
                        <h3 className="text-on-surface mt-1 truncate text-base font-semibold">
                          {ev.title}
                        </h3>
                      </div>
                      <div className="bg-surface-high flex shrink-0 flex-col items-center rounded-[var(--radius-md)] px-3 py-1.5">
                        <span className="text-on-surface text-lg font-bold leading-tight">
                          {extractDay(ev.date)}
                        </span>
                        <span className="text-on-surface-variant text-xs font-medium uppercase">
                          {extractMonth(ev.date)}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="w-full shrink-0 space-y-4 lg:w-80">
          {/* Map card */}
          <div className="overflow-hidden rounded-[var(--radius-xl)]">
            <div className="bg-surface-mid relative flex h-56 items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice">
                <rect width="360" height="220" fill="#E8EBF1" />
                <g stroke="#fff" strokeWidth="6" fill="none">
                  <path d="M-10 70 L370 90" />
                  <path d="M-10 150 L370 130" />
                  <path d="M120 -10 L140 230" />
                  <path d="M230 -10 L240 230" />
                </g>
                <path d="M 200 -20 C 180 80 240 140 200 240" stroke="#B8D5EC" strokeWidth="40" fill="none" />
              </svg>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                <div
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-md"
                  style={{ backgroundColor: cat?.color ?? "#6b7280" }}
                >
                  {cat?.icon && <cat.icon className="h-3.5 w-3.5" strokeWidth={1.75} />}
                  {venue.name}
                </div>
                <div
                  className="mx-auto h-0 w-0"
                  style={{
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: `8px solid ${cat?.color ?? "#6b7280"}`,
                  }}
                />
              </div>
            </div>
            <div className="bg-surface-low p-4">
              <p className="text-on-surface mb-3 text-sm">{venue.address}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-outline px-6 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-mid"
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
              </a>
            </div>
          </div>

          {/* Smart banner: Follow venue in app */}
          <div className="bg-surface-low rounded-[var(--radius-xl)] p-5">
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <div>
                <p className="text-on-surface text-sm font-semibold">{t("followInApp")}</p>
                <p className="text-on-surface-variant mt-1 text-xs">
                  {t("followInAppDesc", { name: venue.name })}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-on-surface px-3 py-1.5 text-xs font-medium text-surface"
              >
                {t("appStore")}
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-on-surface px-3 py-1.5 text-xs font-medium text-surface"
              >
                {t("googlePlay")}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

function VenueOpenStatus({
  hours,
  todayIndex,
  t,
}: {
  hours: { hours: string; isClosed?: boolean; isOpenUntilLate?: boolean }[];
  todayIndex: number;
  t: (key: string) => string;
}) {
  const today = hours[todayIndex];
  if (!today || today.isClosed) {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-on-surface-muted" />
        <strong className="text-on-surface-variant text-sm">{t("closed")}</strong>
      </div>
    );
  }
  const closingTime = today.hours.split(" - ")[1]?.trim();
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-success" />
      <strong className="text-sm text-success">{t("open")}</strong>
      {closingTime && (
        <span className="text-on-surface-variant text-sm">
          {t("until")} {closingTime}
        </span>
      )}
    </div>
  );
}

function getPhotoList(
  venuePhotos: string[],
  photoUrl: string | null,
  fallbackColor?: string,
): string[] {
  if (venuePhotos.length > 0) return venuePhotos;
  if (photoUrl) return [photoUrl];
  return [`placeholder:${fallbackColor ?? "#6b7280"}`];
}

function extractDay(dateStr: string): string {
  const match = dateStr.match(/(\d{1,2})\s/);
  return match?.[1] ?? "";
}

function extractMonth(dateStr: string): string {
  const match = dateStr.match(/\d{1,2}\s(\w+)/);
  return match?.[1]?.slice(0, 3) ?? "";
}
