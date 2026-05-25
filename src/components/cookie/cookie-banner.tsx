"use client";

import { Cookie } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type CookieBannerProps = {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onManage: () => void;
};

export function CookieBanner({
  onAcceptAll,
  onRejectAll,
  onManage,
}: CookieBannerProps) {
  const t = useTranslations("cookieConsent");

  return (
    <div
      role="dialog"
      aria-label={t("bannerTitle")}
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-3xl border border-[var(--outline)]/10 bg-white/70 p-6 shadow-lg backdrop-blur-[20px] sm:flex-row sm:items-center dark:bg-[var(--surface-mid)]/60">
        <div className="flex shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-container)] p-3 text-primary sm:self-start">
          <Cookie className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <div className="flex-1">
          <p className="text-on-surface text-base font-semibold">
            {t("bannerTitle")}
          </p>
          <p className="text-on-surface-variant mt-1 text-sm leading-relaxed">
            {t("bannerDescription")}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap">
          <Button variant="ghost" size="sm" onClick={onManage}>
            {t("manage")}
          </Button>
          <Button variant="secondary" size="sm" onClick={onRejectAll}>
            {t("rejectAll")}
          </Button>
          <Button size="sm" onClick={onAcceptAll}>
            {t("acceptAll")}
          </Button>
        </div>
      </div>
    </div>
  );
}
