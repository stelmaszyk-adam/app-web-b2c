"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type DatePreset =
  | "today"
  | "tomorrow"
  | "this-weekend"
  | "this-week"
  | "custom";

interface DatePickerProps {
  onApply: (dateFrom: string, dateTo: string, label: string) => void;
  onClear: () => void;
  onClose: () => void;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatISO(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function DatePicker({ onApply, onClear, onClose }: DatePickerProps) {
  const t = useTranslations("discovery");
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [activePreset, setActivePreset] = useState<DatePreset | null>(null);

  const presets: { key: DatePreset; label: string }[] = [
    { key: "today", label: t("presetToday") },
    { key: "tomorrow", label: t("presetTomorrow") },
    { key: "this-weekend", label: t("presetWeekend") },
    { key: "this-week", label: t("presetThisWeek") },
    { key: "custom", label: t("presetCustom") },
  ];

  function applyPreset(preset: DatePreset) {
    setActivePreset(preset);
    const now = startOfDay(new Date());
    let from: Date;
    let to: Date;

    switch (preset) {
      case "today":
        from = now;
        to = now;
        break;
      case "tomorrow":
        from = new Date(now.getTime() + 86400000);
        to = from;
        break;
      case "this-weekend": {
        const day = now.getDay();
        const satOffset = day === 0 ? 6 : 6 - day;
        from = new Date(now.getTime() + satOffset * 86400000);
        to = new Date(from.getTime() + 86400000);
        break;
      }
      case "this-week": {
        from = now;
        const dayOfWeek = now.getDay();
        const sunOffset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
        to = new Date(now.getTime() + sunOffset * 86400000);
        break;
      }
      case "custom":
        return;
    }

    setRangeStart(from);
    setRangeEnd(to);
  }

  const daysInMonth = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(viewYear, viewMonth, d));
    }
    return days;
  }, [viewMonth, viewYear]);

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("pl-PL", {
    month: "long",
    year: "numeric",
  });

  function handleDayClick(day: Date) {
    setActivePreset("custom");
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
    } else {
      if (day < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(day);
      } else {
        setRangeEnd(day);
      }
    }
  }

  function isInRange(day: Date): boolean {
    if (!rangeStart || !rangeEnd) return false;
    return day >= rangeStart && day <= rangeEnd;
  }

  function isSelected(day: Date): boolean {
    if (rangeStart && day.getTime() === rangeStart.getTime()) return true;
    if (rangeEnd && day.getTime() === rangeEnd.getTime()) return true;
    return false;
  }

  function handleApply() {
    if (rangeStart) {
      const from = formatISO(rangeStart);
      const to = rangeEnd ? formatISO(rangeEnd) : from;
      const label =
        activePreset && activePreset !== "custom"
          ? presets.find((p) => p.key === activePreset)?.label ?? ""
          : `${from} – ${to}`;
      onApply(from, to, label);
    }
  }

  const dayHeaders = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-surface-high w-full max-w-sm rounded-[var(--radius-xl)] p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-on-surface text-lg font-semibold">
            {t("selectDate")}
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-full"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Presets */}
        <div className="mb-4 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => applyPreset(p.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activePreset === p.key
                  ? "bg-primary text-white"
                  : "bg-surface-low text-on-surface-variant hover:bg-surface-mid"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Month navigation */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => {
              if (viewMonth === 0) {
                setViewMonth(11);
                setViewYear(viewYear - 1);
              } else {
                setViewMonth(viewMonth - 1);
              }
            }}
            className="text-on-surface-variant flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-low"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <span className="text-on-surface text-sm font-semibold capitalize">
            {monthLabel}
          </span>
          <button
            onClick={() => {
              if (viewMonth === 11) {
                setViewMonth(0);
                setViewYear(viewYear + 1);
              } else {
                setViewMonth(viewMonth + 1);
              }
            }}
            className="text-on-surface-variant flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-low"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Day headers */}
        <div className="mb-1 grid grid-cols-7 gap-0">
          {dayHeaders.map((dh) => (
            <div
              key={dh}
              className="text-on-surface-muted py-1 text-center text-[10px] font-medium uppercase"
            >
              {dh}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0">
          {daysInMonth.map((day, i) => {
            if (!day) {
              return <div key={`empty-${i}`} className="h-9" />;
            }
            const isToday = day.getTime() === today.getTime();
            const selected = isSelected(day);
            const inRange = isInRange(day);
            const isPast = day < today;

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isPast && handleDayClick(day)}
                disabled={isPast}
                className={`flex h-9 items-center justify-center text-xs font-medium transition-colors ${
                  selected
                    ? "bg-primary rounded-full text-white"
                    : inRange
                      ? "bg-primary/10 text-primary"
                      : isToday
                        ? "text-primary font-bold"
                        : isPast
                          ? "text-on-surface-muted cursor-not-allowed"
                          : "text-on-surface hover:bg-surface-low"
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => {
              setRangeStart(null);
              setRangeEnd(null);
              setActivePreset(null);
              onClear();
            }}
            className="text-on-surface-variant text-sm font-medium hover:underline"
          >
            {t("clearDate")}
          </button>
          <button
            onClick={handleApply}
            disabled={!rangeStart}
            className="bg-primary rounded-full px-6 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {t("applyDate")}
          </button>
        </div>
      </div>
    </div>
  );
}
