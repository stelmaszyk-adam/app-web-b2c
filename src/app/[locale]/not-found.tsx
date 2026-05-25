"use client";

import { useTranslations } from "next-intl";
import { Search, Home } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Track404 } from "@/components/analytics/track-404";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <Track404 />

      {/* Illustration */}
      <div className="mb-8">
        <svg
          width="200"
          height="160"
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle cx="100" cy="80" r="70" fill="var(--primary-container)" opacity="0.3" />
          <circle cx="100" cy="80" r="50" fill="var(--primary-container)" opacity="0.2" />

          {/* Calendar icon */}
          <rect x="65" y="45" width="70" height="65" rx="8" fill="var(--surface-low)" stroke="var(--primary)" strokeWidth="2" />
          <rect x="65" y="45" width="70" height="20" rx="8" fill="var(--primary)" />
          <rect x="65" y="57" width="70" height="8" fill="var(--primary)" />

          {/* Calendar dots */}
          <circle cx="82" cy="78" r="4" fill="var(--primary-container)" />
          <circle cx="100" cy="78" r="4" fill="var(--primary-container)" />
          <circle cx="118" cy="78" r="4" fill="var(--on-surface-muted)" opacity="0.3" />
          <circle cx="82" cy="95" r="4" fill="var(--on-surface-muted)" opacity="0.3" />
          <circle cx="100" cy="95" r="4" fill="var(--on-surface-muted)" opacity="0.3" />

          {/* Question mark */}
          <text
            x="100"
            y="140"
            textAnchor="middle"
            fontSize="28"
            fontWeight="bold"
            fill="var(--primary)"
            opacity="0.6"
          >
            404
          </text>
        </svg>
      </div>

      {/* Text */}
      <h1 className="text-on-surface mb-2 text-center text-2xl font-bold tracking-tight md:text-3xl">
        {t("notFoundTitle")}
      </h1>
      <p className="text-on-surface-variant mb-8 max-w-md text-center text-base">
        {t("notFoundDescription")}
      </p>

      {/* Search input */}
      <div className="bg-surface-low focus-within:bg-surface-high focus-within:border-outline-strong mb-6 flex h-12 w-full max-w-md items-center gap-3 rounded-[var(--radius-lg)] border border-transparent px-4 transition-all focus-within:shadow-[0_0_0_4px_rgba(108,63,235,0.12)]">
        <Search
          className="text-on-surface-muted h-5 w-5 shrink-0"
          strokeWidth={1.75}
        />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="text-on-surface placeholder:text-on-surface-muted min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              window.location.href = `/?q=${encodeURIComponent(e.currentTarget.value.trim())}`;
            }
          }}
        />
      </div>

      {/* Homepage link */}
      <Link
        href="/"
        className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors"
      >
        <Home className="h-4 w-4" strokeWidth={1.75} />
        {t("backToHome")}
      </Link>
    </div>
  );
}
