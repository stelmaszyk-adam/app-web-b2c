export type DatePresetKey =
  | "today"
  | "tomorrow"
  | "this-weekend"
  | "this-week"
  | "next-30-days";

export interface DateRange {
  from: string;
  to: string;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Format a Date as YYYY-MM-DD in local time (avoids UTC off-by-one from toISOString). */
export function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
}

/**
 * Computes the [from, to] ISO date range (inclusive) for a quick-select preset,
 * anchored to `now`. Shared by the interactive DatePicker and the SSR date-filter
 * routes so "this weekend" etc. always resolve the same way.
 */
export function getPresetRange(preset: DatePresetKey, now: Date = new Date()): DateRange {
  const today = startOfDay(now);

  switch (preset) {
    case "today": {
      const iso = toLocalISODate(today);
      return { from: iso, to: iso };
    }
    case "tomorrow": {
      const tomorrow = addDays(today, 1);
      const iso = toLocalISODate(tomorrow);
      return { from: iso, to: iso };
    }
    case "this-weekend": {
      const day = today.getDay(); // 0 = Sun … 6 = Sat
      let sat: Date;
      let sun: Date;
      if (day === 0) {
        // Sunday: current weekend (yesterday Sat → today)
        sat = addDays(today, -1);
        sun = today;
      } else if (day === 6) {
        sat = today;
        sun = addDays(today, 1);
      } else {
        const satOffset = 6 - day;
        sat = addDays(today, satOffset);
        sun = addDays(sat, 1);
      }
      return { from: toLocalISODate(sat), to: toLocalISODate(sun) };
    }
    case "this-week": {
      const dayOfWeek = today.getDay();
      const sunOffset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
      const sun = addDays(today, sunOffset);
      return { from: toLocalISODate(today), to: toLocalISODate(sun) };
    }
    case "next-30-days": {
      // Inclusive window: today through today + 29 days (30 calendar days).
      return { from: toLocalISODate(today), to: toLocalISODate(addDays(today, 29)) };
    }
  }
}
