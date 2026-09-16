import { getTranslations } from "next-intl/server";
import type { Event } from "@/lib/types";
import { formatEventDate, formatEventTime } from "@/lib/types";

const FREQUENCY_KEY = {
  daily: "recurrenceDaily",
  weekly: "recurrenceWeekly",
  monthly: "recurrenceMonthly",
} as const;

interface RecurringSeriesProps {
  event: Event;
  locale: string;
  citySlug: string;
}

export async function RecurringSeries({ event, locale, citySlug }: RecurringSeriesProps) {
  if (!event.recurringTemplateId) return null;

  const t = await getTranslations({ locale, namespace: "eventDetail" });

  const badgeLabel = event.recurrence
    ? t("partOfSeries", { type: t(FREQUENCY_KEY[event.recurrence.frequency]) })
    : t("partOfSeriesGeneric");

  const now = new Date();
  const upcomingInstances = (event.seriesInstances ?? [])
    .filter((instance) => !instance.isCancelled && new Date(instance.startTime) >= now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const localePrefix = locale === "pl" ? "" : `/${locale}`;

  return (
    <div className="mt-4">
      <span className="bg-surface-low text-on-surface-variant inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
        {badgeLabel}
      </span>

      {upcomingInstances.length > 0 && (
        <details className="group mt-2">
          <summary className="cursor-pointer list-none text-sm font-medium text-primary hover:underline [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">{t("viewAllDates")}</span>
            <span className="hidden group-open:inline">{t("hideAllDates")}</span>
          </summary>
          <ul className="bg-surface-low mt-2 space-y-1 rounded-[var(--radius-lg)] p-3">
            {upcomingInstances.map((instance) => {
              const isCurrent = instance.id === event.id;
              return (
                <li key={instance.id}>
                  <a
                    href={`${localePrefix}/${citySlug}/event/${instance.id}`}
                    aria-current={isCurrent ? "true" : undefined}
                    className={`text-on-surface flex items-center rounded-[var(--radius-md)] px-2 py-1.5 text-sm hover:bg-surface-high ${isCurrent ? "font-semibold" : ""}`}
                  >
                    {formatEventDate(instance.startTime, locale)} · {formatEventTime(instance.startTime)}
                  </a>
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </div>
  );
}
