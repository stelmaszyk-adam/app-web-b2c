import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

const ORGANIZER_DASHBOARD_URL = "https://dashboard.eventapp.dev";

const CITIES = ["Poznan", "Krakow", "Warszawa", "Wroclaw"] as const;

export function AppFooter() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-high border-outline mt-8 border-t px-6 pb-6 pt-12">
      <div className="mx-auto grid max-w-[1440px] gap-8 max-md:grid-cols-1 max-lg:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        {/* Brand block */}
        <div>
          <div className="inline-flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-gradient)] text-sm font-bold tracking-wide text-white shadow-brand">
              E
            </span>
            <span className="text-on-surface text-lg font-bold tracking-tight">
              eventapp
            </span>
          </div>
          <p className="text-on-surface-variant mt-3 max-w-[280px] text-sm">
            {t("tagline")}
          </p>
          <div className="mt-4 flex flex-col items-start gap-2">
            <a
              href="#"
              className="bg-on-surface text-surface-high inline-flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3.5 py-2 text-xs font-medium"
            >
              {t("downloadAppStore")}
            </a>
            <a
              href="#"
              className="bg-on-surface text-surface-high inline-flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3.5 py-2 text-xs font-medium"
            >
              {t("downloadGooglePlay")}
            </a>
          </div>
        </div>

        {/* Discover */}
        <div>
          <h4 className="text-on-surface-variant mb-4 text-xs font-medium uppercase tracking-[0.05em]">
            {t("discover")}
          </h4>
          <ul className="flex flex-col gap-2.5">
            {CITIES.map((city) => (
              <li key={city}>
                <a
                  href="#"
                  className="text-on-surface hover:text-primary text-sm"
                >
                  {city}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#"
                className="text-on-surface hover:text-primary text-sm"
              >
                {t("allCities")}
              </a>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-on-surface-variant mb-4 text-xs font-medium uppercase tracking-[0.05em]">
            {t("categories")}
          </h4>
          <ul className="flex flex-col gap-2.5">
            {(["music", "clubs", "theatre", "art", "sport"] as const).map(
              (cat) => (
                <li key={cat}>
                  <a
                    href="#"
                    className="text-on-surface hover:text-primary text-sm"
                  >
                    {t(cat)}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* For Business */}
        <div>
          <h4 className="text-on-surface-variant mb-4 text-xs font-medium uppercase tracking-[0.05em]">
            {t("forBusiness")}
          </h4>
          <ul className="flex flex-col gap-2.5">
            <li>
              <a
                href={ORGANIZER_DASHBOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface hover:text-primary inline-flex items-center gap-1.5 text-sm"
              >
                {t("organizerDashboard")}
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </a>
            </li>
            <li>
              <p className="text-on-surface-variant -mt-1 text-xs">
                {t("organizerDashboardDescription")}
              </p>
            </li>
            <li className="mt-1">
              <a
                href="#"
                className="text-on-surface hover:text-primary text-sm"
              >
                {t("advertising")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-on-surface hover:text-primary text-sm"
              >
                {t("contact")}
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-on-surface-variant mb-4 text-xs font-medium uppercase tracking-[0.05em]">
            {t("legal")}
          </h4>
          <ul className="flex flex-col gap-2.5">
            <li>
              <a
                href="#"
                className="text-on-surface hover:text-primary text-sm"
              >
                {t("terms")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-on-surface hover:text-primary text-sm"
              >
                {t("privacyPolicy")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-on-surface hover:text-primary text-sm"
              >
                {t("cookiePolicy")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-on-surface hover:text-primary text-sm"
              >
                {t("manageCookies")}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-outline text-on-surface-variant mx-auto mt-8 flex max-w-[1440px] items-center justify-between gap-4 border-t pt-5 text-xs">
        <span>{t("copyright", { year })}</span>
        <div className="flex items-center gap-2">
          <a
            href="#"
            className="bg-surface-high border-outline hover:bg-surface-low inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
            aria-label="Instagram"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>
          <a
            href="#"
            className="bg-surface-high border-outline hover:bg-surface-low inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
            aria-label="Facebook"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a
            href="#"
            className="bg-surface-high border-outline hover:bg-surface-low inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
            aria-label="TikTok"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
