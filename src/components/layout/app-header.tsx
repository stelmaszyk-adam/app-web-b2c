"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  MapPin,
  Search,
  ChevronDown,
  ArrowUpRight,
  Menu,
  X,
  LogOut,
  User,
  FileText,
  Lightbulb,
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useCity } from "@/hooks/use-city";
import { useAuth, getUserInitials } from "@/lib/auth-context";

const ORGANIZER_DASHBOARD_URL = "https://dashboard.wydarzka.dev";

function UserAvatar({ initials }: { initials: string }) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-gradient)] text-xs font-bold text-white shadow-brand">
      {initials}
    </span>
  );
}

function AvatarDropdown({ onClose }: { onClose: () => void }) {
  const t = useTranslations("header");
  const router = useRouter();
  const { user, setUser } = useAuth();

  async function handleSignOut() {
    onClose();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setUser(null);
    router.push("/");
  }

  if (!user) return null;

  return (
    <div className="bg-surface-high absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]">
      {/* User info */}
      <div className="border-outline border-b px-4 py-3">
        <p className="text-on-surface truncate text-sm font-medium">
          {user.displayName ?? user.email.split("@")[0]}
        </p>
        <p className="text-on-surface-muted truncate text-xs">{user.email}</p>
      </div>

      {/* Links */}
      <div className="py-1">
        {[
          { href: "/profile", icon: User, label: t("profile") },
          { href: "/my-submissions", icon: FileText, label: t("mySubmissions") },
          { href: "/my-tips", icon: Lightbulb, label: t("myTips") },
        ].map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="text-on-surface hover:bg-surface-low flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </div>

      {/* Sign out */}
      <div className="border-outline border-t py-1">
        <button
          onClick={handleSignOut}
          className="text-on-surface hover:bg-surface-low flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          {t("signOut")}
        </button>
      </div>
    </div>
  );
}

export function AppHeader() {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { city, openCityPicker } = useCity();
  const { user, setUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside.
  useEffect(() => {
    if (!avatarDropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [avatarDropdownOpen]);

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  const signInHref = pathname !== "/" ? `/login?next=${encodeURIComponent(pathname)}` : "/login";

  return (
    <header className="bg-surface-high/90 sticky top-0 z-30 border-b border-outline backdrop-blur-[20px]" role="banner">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-6 md:h-16 max-md:h-14 max-md:gap-2 max-md:px-3">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5"
          aria-label="Wydarzka"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-gradient)] text-sm font-bold tracking-wide text-white shadow-brand">
            E
          </span>
          <span className="text-on-surface text-lg font-bold tracking-tight max-md:hidden">
            wydarzka
          </span>
        </Link>

        {/* City Selector */}
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
            aria-label={t("searchPlaceholder")}
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
        <div className="bg-surface-low inline-flex h-8 items-center rounded-full p-[3px] max-md:hidden" role="group" aria-label={t("languageToggle")}>
          <button
            onClick={() => switchLocale("pl")}
            aria-pressed={locale === "pl"}
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
            aria-pressed={locale === "en"}
            className={`h-full rounded-full px-2.5 text-xs font-semibold transition-colors ${
              locale === "en"
                ? "bg-surface-high text-on-surface shadow-sm"
                : "text-on-surface-variant"
            }`}
          >
            EN
          </button>
        </div>

        {/* Auth — desktop */}
        {user ? (
          <div ref={avatarRef} className="relative max-md:hidden">
            <button
              onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
              aria-label={t("openAccountMenu")}
              aria-expanded={avatarDropdownOpen}
              className="hover:ring-2 hover:ring-[var(--primary)]/30 rounded-full transition-all"
            >
              <UserAvatar initials={getUserInitials(user)} />
            </button>
            {avatarDropdownOpen && (
              <AvatarDropdown onClose={() => setAvatarDropdownOpen(false)} />
            )}
          </div>
        ) : (
          <Link
            href={signInHref}
            className="bg-primary text-on-primary hover:opacity-90 inline-flex h-9 items-center rounded-full px-5 text-sm font-medium transition-opacity max-md:hidden"
          >
            {t("signIn")}
          </Link>
        )}

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
          {/* Auth row — at top of mobile menu */}
          {user ? (
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserAvatar initials={getUserInitials(user)} />
                <div>
                  <p className="text-on-surface text-sm font-medium">
                    {user.displayName ?? user.email.split("@")[0]}
                  </p>
                  <p className="text-on-surface-muted text-xs">{user.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href={signInHref}
              onClick={() => setMobileMenuOpen(false)}
              className="bg-primary text-on-primary mb-3 flex h-11 items-center justify-center rounded-full text-sm font-medium"
            >
              {t("signIn")}
            </Link>
          )}

          {/* Auth links — mobile */}
          {user && (
            <div className="border-outline mb-3 border-b pb-3">
              {[
                { href: "/profile" as const, label: t("profile") },
                { href: "/my-submissions" as const, label: t("mySubmissions") },
                { href: "/my-tips" as const, label: t("myTips") },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-on-surface hover:text-primary flex h-11 items-center text-sm font-medium transition-colors"
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={async () => {
                  setMobileMenuOpen(false);
                  try {
                    await fetch("/api/auth/logout", { method: "POST" });
                  } catch {
                    // ignore
                  }
                  setUser(null);
                  router.push("/");
                }}
                className="text-on-surface-variant hover:text-primary flex h-11 w-full items-center gap-1.5 text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                {t("signOut")}
              </button>
            </div>
          )}

          {/* Mobile search */}
          <div className="bg-surface-low flex h-11 items-center gap-2.5 rounded-[var(--radius-lg)] px-3.5">
            <Search
              className="text-on-surface-muted h-4 w-4 shrink-0"
              strokeWidth={1.75}
            />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
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
          <div className="bg-surface-low mt-3 inline-flex h-8 items-center rounded-full p-[3px]" role="group" aria-label={t("languageToggle")}>
            <button
              onClick={() => {
                switchLocale("pl");
                setMobileMenuOpen(false);
              }}
              aria-pressed={locale === "pl"}
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
              aria-pressed={locale === "en"}
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
