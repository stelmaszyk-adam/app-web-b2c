"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Navigation, X } from "lucide-react";

const MIN_KM = 5;
const MAX_KM = 150;
const PRESETS = [5, 15, 30, 60, 150] as const;

interface DistanceFilterProps {
  /** Selected radius in km, or null when no distance filter is applied. */
  value: number | null;
  onChange: (km: number | null) => void;
  /** City display name used in the modal description. */
  cityName: string;
}

export function DistanceFilter({ value, onChange, cityName }: DistanceFilterProps) {
  const t = useTranslations("discovery");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value ?? MIN_KM);

  useEffect(() => {
    if (open) {
      setDraft(value ?? MIN_KM);
    }
  }, [open, value]);

  function handleApply() {
    onChange(draft);
    setOpen(false);
  }

  function handleClear() {
    onChange(null);
    setOpen(false);
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-pressed={value !== null}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
          value !== null
            ? "bg-primary text-white"
            : "bg-surface-low text-on-surface-variant hover:bg-surface-mid"
        }`}
      >
        <Navigation className="h-3.5 w-3.5" strokeWidth={1.75} />
        {value !== null ? t("distanceValueKm", { km: value }) : t("distanceFilter")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="distance-filter-title"
            className="bg-surface-high w-full max-w-md rounded-[var(--radius-xl)] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="distance-filter-title"
                className="text-on-surface text-lg font-semibold"
              >
                {t("distanceTitle")}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-on-surface-variant hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-low"
                aria-label={t("close")}
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <p className="text-on-surface-variant mb-8 text-sm leading-relaxed">
              {t.rich("distanceDescription", {
                city: cityName,
                bold: (chunks) => (
                  <span className="text-on-surface font-semibold">{chunks}</span>
                ),
              })}
            </p>

            {/* Current value */}
            <div className="mb-6 text-center">
              <span className="text-primary text-5xl font-bold tracking-tight">
                {draft}
              </span>
              <span className="text-primary/70 ml-1.5 text-2xl font-medium">
                {t("distanceUnit")}
              </span>
            </div>

            {/* Range slider */}
            <div className="mb-2 px-1">
              <input
                type="range"
                min={MIN_KM}
                max={MAX_KM}
                step={1}
                value={draft}
                onChange={(e) => setDraft(Number(e.target.value))}
                aria-label={t("distanceTitle")}
                aria-valuemin={MIN_KM}
                aria-valuemax={MAX_KM}
                aria-valuenow={draft}
                className="distance-slider w-full"
                style={{
                  background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${
                    ((draft - MIN_KM) / (MAX_KM - MIN_KM)) * 100
                  }%, var(--outline) ${
                    ((draft - MIN_KM) / (MAX_KM - MIN_KM)) * 100
                  }%, var(--outline) 100%)`,
                }}
              />
            </div>
            <div className="text-on-surface-variant mb-6 flex justify-between px-1 text-xs font-medium">
              <span>{t("distanceValueKm", { km: MIN_KM })}</span>
              <span>{t("distanceValueKm", { km: MAX_KM })}</span>
            </div>

            {/* Quick-select presets */}
            <div className="mb-6 flex flex-wrap gap-2">
              {PRESETS.map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => setDraft(km)}
                  aria-pressed={draft === km}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    draft === km
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-outline text-on-surface hover:bg-surface-low"
                  }`}
                >
                  {t("distanceValueKm", { km })}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="border-outline flex items-center justify-end gap-4 border-t pt-4">
              <button
                type="button"
                onClick={handleClear}
                className="text-primary text-sm font-medium hover:underline"
              >
                {t("clearDate")}
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="bg-primary rounded-[var(--radius-md)] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                {t("applyDate")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
