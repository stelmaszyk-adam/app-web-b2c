"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { ConsentCategories } from "@/lib/cookie-consent";

type CookiePrefsOverlayProps = {
  initialConsent: ConsentCategories | null;
  onSave: (categories: ConsentCategories) => void;
  onClose: () => void;
};

function Toggle({
  on,
  onChange,
  disabled,
  id,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  id: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => !disabled && onChange(!on)}
      className="relative h-[26px] w-11 shrink-0 rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60"
      style={{ background: on ? "var(--primary)" : "var(--outline)" }}
    >
      <span
        className="absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-sm transition-[left] duration-200"
        style={{ left: on ? 21 : 3 }}
      />
    </button>
  );
}

function CategoryRow({
  id,
  title,
  description,
  on,
  onChange,
  disabled,
}: {
  id: string;
  title: string;
  description: string;
  on: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="border-outline flex items-start gap-4 border-b py-4 last:border-b-0">
      <div className="flex-1">
        <label htmlFor={id} className="text-on-surface block font-medium">
          {title}
        </label>
        <span className="text-on-surface-variant text-sm">{description}</span>
      </div>
      <Toggle id={id} on={on} onChange={onChange} disabled={disabled} />
    </div>
  );
}

export function CookiePrefsOverlay({
  initialConsent,
  onSave,
  onClose,
}: CookiePrefsOverlayProps) {
  const t = useTranslations("cookieConsent");
  const [analytics, setAnalytics] = useState(
    initialConsent?.analytics ?? false,
  );
  const [marketing, setMarketing] = useState(
    initialConsent?.marketing ?? false,
  );

  function handleSave() {
    onSave({ essential: true, analytics, marketing });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label={t("prefsTitle")}
        className="w-full max-w-[560px] rounded-2xl bg-[var(--surface-high)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-on-surface text-lg font-semibold">
            {t("prefsTitle")}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-surface-low -mr-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            aria-label={t("close")}
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2">
          <p className="text-on-surface-variant text-sm">
            {t("prefsDescription")}
          </p>

          <CategoryRow
            id="cookie-essential"
            title={t("essential")}
            description={t("essentialDesc")}
            on={true}
            onChange={() => {}}
            disabled
          />
          <CategoryRow
            id="cookie-analytics"
            title={t("analytics")}
            description={t("analyticsDesc")}
            on={analytics}
            onChange={setAnalytics}
          />
          <CategoryRow
            id="cookie-marketing"
            title={t("marketing")}
            description={t("marketingDesc")}
            on={marketing}
            onChange={setMarketing}
          />
        </div>

        <div className="flex justify-end gap-3 p-6 pt-4">
          <Button variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave}>{t("savePreferences")}</Button>
        </div>
      </div>
    </div>
  );
}
