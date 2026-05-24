"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { MockEvent } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";

interface EventDetailContentProps {
  event: MockEvent;
  citySlug: string;
  locale: string;
}

export function EventDetailContent({ event, citySlug, locale }: EventDetailContentProps) {
  const t = useTranslations("eventDetail");

  const photos = getPhotoList(event);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  return (
    <div>
      {/* Photo gallery */}
      <PhotoGallery
        photos={photos}
        alt={event.title}
        selectedIndex={selectedPhoto}
        onSelect={setSelectedPhoto}
      />

      {/* Action buttons row */}
      <div className="mt-4 flex flex-wrap gap-3">
        <ShareButton locale={locale} citySlug={citySlug} eventId={event.id} label={t("share")} copiedLabel={t("linkCopied")} />
        <AddToCalendarDropdown event={event} />
      </div>
    </div>
  );
}

function getPhotoList(event: MockEvent): string[] {
  if (event.eventPhotos && event.eventPhotos.length > 0) {
    return event.eventPhotos;
  }
  if (event.imageUrl) {
    return [event.imageUrl];
  }
  const cat = CATEGORY_MAP[event.category];
  const hue = cat?.color ?? "#6b7280";
  return [`placeholder:${hue}`];
}

function PhotoGallery({
  photos,
  alt,
  selectedIndex,
  onSelect,
}: {
  photos: string[];
  alt: string;
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  const current = photos[selectedIndex] ?? photos[0];
  const isPlaceholder = current?.startsWith("placeholder:");

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-xl)]">
        {isPlaceholder ? (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${current.split(":")[1]}33, ${current.split(":")[1]}66)` }}
          >
            <svg className="h-16 w-16 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        ) : (
          <div
            className="h-full w-full bg-cover bg-center bg-surface-mid"
            style={{ backgroundImage: `url(${current})` }}
            role="img"
            aria-label={alt}
          />
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {photos.map((photo, i) => {
            const isThumbPlaceholder = photo.startsWith("placeholder:");
            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] transition-all ${
                  i === selectedIndex ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`Photo ${i + 1}`}
              >
                {isThumbPlaceholder ? (
                  <div
                    className="h-full w-full"
                    style={{ background: `linear-gradient(135deg, ${photo.split(":")[1]}33, ${photo.split(":")[1]}66)` }}
                  />
                ) : (
                  <div
                    className="h-full w-full bg-cover bg-center bg-surface-mid"
                    style={{ backgroundImage: `url(${photo})` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ShareButton({
  locale,
  citySlug,
  eventId,
  label,
  copiedLabel,
}: {
  locale: string;
  citySlug: string;
  eventId: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const prefix = locale === "pl" ? "" : `/${locale}`;
    const url = `${baseUrl}${prefix}/${citySlug}/event/${eventId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select a temporary input
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-full border border-outline px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-low"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      {copied ? copiedLabel : label}
    </button>
  );
}

function AddToCalendarDropdown({ event }: { event: MockEvent }) {
  const t = useTranslations("eventDetail");
  const [open, setOpen] = useState(false);

  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const googleCalendarUrl = buildGoogleCalendarUrl(event.title, startDate, endDate, event.venue.name, event.venue.address, event.description);
  const icsContent = buildIcsContent(event.title, startDate, endDate, event.venue.name, event.venue.address, event.description);

  const downloadIcs = () => {
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-outline px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-low"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="12" y1="14" x2="12" y2="18" />
          <line x1="10" y1="16" x2="14" y2="16" />
        </svg>
        {t("addToCalendar")}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="bg-surface-high absolute left-0 top-full z-20 mt-2 w-56 rounded-[var(--radius-lg)] p-2 shadow-lg">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm hover:bg-surface-low"
              onClick={() => setOpen(false)}
            >
              {t("googleCalendar")}
            </a>
            <button
              onClick={downloadIcs}
              className="text-on-surface flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm hover:bg-surface-low"
            >
              {t("appleCalendar")}
            </button>
            <button
              onClick={downloadIcs}
              className="text-on-surface flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm hover:bg-surface-low"
            >
              {t("outlookCalendar")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function formatDateForGoogle(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function formatDateForIcs(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function buildGoogleCalendarUrl(
  title: string,
  start: Date,
  end: Date,
  venue: string,
  address: string,
  description: string,
): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatDateForGoogle(start)}/${formatDateForGoogle(end)}`,
    location: `${venue}, ${address}`,
    details: description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsContent(
  title: string,
  start: Date,
  end: Date,
  venue: string,
  address: string,
  description: string,
): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EventApp//EventApp//EN",
    "BEGIN:VEVENT",
    `DTSTART:${formatDateForIcs(start)}`,
    `DTEND:${formatDateForIcs(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${venue}, ${address}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
