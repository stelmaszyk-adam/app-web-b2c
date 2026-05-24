"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  MapPin,
  Search,
  ChevronDown,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useCity } from "@/hooks/use-city";

const ORGANIZER_DASHBOARD_URL = "https://dashboard.eventapp.dev";

export function AppHeader() {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { city, openCityPicker } = useCity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <header className="bg-surface-high/90 sticky top-0 z-30 border-b border-outline backdrop-blur-[20px]">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-6 md:h-16 max-md:h-14 max-md:gap-2 max-md:px-3">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5"
          aria-label="EventApp"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-gradient)] text-sm font-bold tracking-wide text-white shadow-brand">
            E
          </span>
          <span className="text-on-surface text-lg font-bold tracking-tight max-md:hidden">
            eventapp
          </span>
        </Link>

        {/* City Selector — "Change city" always visible */}
        <button
          onClick={openCityPicker}
          className="bg-surface-high border-outline text-on-surface hover:bg-surface-low inline-flex h-10 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors"
          aria-label={t("changeCity")}
        >
          <MapPin className="h-4 w-4" strokeWidth={1.75} />
          <span className="max-sm:hidden">{city.namePl}</span>
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>

        {/* Search */}
        <div className="bg-surface-low focus-within:bg-surface-high focus-within:border-outline-strong flex h-10 max-w-[420px] flex-1 items-center gap-2.5 rounded-[var(--radius-lg)] border border-transparent px-3.5 transition-all focus-within:shadow-[0_0_0_4px_rgba(108,63,235,0.12)] max-md:hidden">
          <Search
            className="text-on-surface-muted h-4 w-4 shrink-0"
            strokeWidth={1.75}
          />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="text-on-surface placeholder:text-on-surface-muted min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
          />
        </div>

        <div className="flex-1 max-md:hidden" />

        {/* For Organizers — desktop */}
        <a
          href={ORGANIZER_DASHBOARD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface-variant hover:bg-surface-low hover:text-on-surface inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors max-md:hidden"
        >
          {t("forOrganizers")}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </a>

        {/* Language Toggle — desktop */}
        <div className="bg-surface-low inline-flex h-8 items-center rounded-full p-[3px] max-md:hidden">
          <button
            onClick={() => switchLocale("pl")}
            className={`h-full rounded-full px-2.5 text-xs font-semibold transition-colors ${
              locale === "pl"
                ? "bg-surface-high text-on-surface shadow-sm"
                : "text-on-surface-variant"
            }`}
          >
            PL
          </button>
          <button
            onClick={() => switchLocale("en")}
            className={`h-full rounded-full px-2.5 text-xs font-semibold transition-colors ${
              locale === "en"
                ? "bg-surface-high text-on-surface shadow-sm"
                : "text-on-surface-variant"
            }`}
          >
            EN
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] md:hidden"
          aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" strokeWidth={1.75} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="bg-surface-high border-outline border-t px-4 pb-4 pt-2 md:hidden">
          {/* Mobile search */}
          <div className="bg-surface-low flex h-11 items-center gap-2.5 rounded-[var(--radius-lg)] px-3.5">
            <Search
              className="text-on-surface-muted h-4 w-4 shrink-0"
              strokeWidth={1.75}
            />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="text-on-surface placeholder:text-on-surface-muted min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
            />
          </div>

          {/* For Organizers — mobile */}
          <a
            href={ORGANIZER_DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant hover:text-on-surface mt-3 flex h-11 items-center gap-1.5 text-sm font-medium"
          >
            {t("forOrganizers")}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </a>

          {/* Language Toggle — mobile */}
          <div className="bg-surface-low mt-3 inline-flex h-8 items-center rounded-full p-[3px]">
            <button
              onClick={() => {
                switchLocale("pl");
                setMobileMenuOpen(false);
              }}
              className={`h-full rounded-full px-2.5 text-xs font-semibold transition-colors ${
                locale === "pl"
                  ? "bg-surface-high text-on-surface shadow-sm"
                  : "text-on-surface-variant"
              }`}
            >
              PL
            </button>
            <button
              onClick={() => {
                switchLocale("en");
                setMobileMenuOpen(false);
              }}
              className={`h-full rounded-full px-2.5 text-xs font-semibold transition-colors ${
                locale === "en"
                  ? "bg-surface-high text-on-surface shadow-sm"
                  : "text-on-surface-variant"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
