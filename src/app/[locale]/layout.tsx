import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { CookieConsentProvider } from "@/components/cookie/cookie-consent-provider";
import { CityProvider } from "@/hooks/use-city";
import { CityPickerOverlay } from "@/components/discovery/city-picker-overlay";
import { ErrorToastProvider } from "@/components/ui/error-toast";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { WebVitalsReporter } from "@/components/analytics/web-vitals-reporter";
import { AuthProvider } from "@/lib/auth-context";
import { COOKIE_ACCESS_TOKEN, decodeTokenUser } from "@/lib/auth-cookies";
import { TosReconsentWrapper } from "@/components/auth/tos-reconsent-wrapper";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const languages: Record<string, string> = {};
  for (const cur of routing.locales) {
    languages[cur] = cur === routing.defaultLocale ? "/" : `/${cur}`;
  }
  languages["x-default"] = "/";

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL ?? "https://wydarzka.dev",
    ),
    title: t("title"),
    description: t("description"),
    alternates: {
      languages,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "pl" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  // Read auth state server-side so AppHeader renders with correct initial state.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;
  const initialUser = decodeTokenUser(accessToken);

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider initialUser={initialUser}>
        <CityProvider>
          <CookieConsentProvider>
            <PostHogProvider />
            <WebVitalsReporter />
            <ErrorToastProvider>
              <a href="#main-content" className="skip-to-content">
                {locale === "pl" ? "Przejdź do treści" : "Skip to content"}
              </a>
              <OfflineBanner />
              <AppHeader />
              <main id="main-content" className="flex-1">{children}</main>
              <AppFooter />
              <CityPickerOverlay />
              <TosReconsentWrapper />
            </ErrorToastProvider>
          </CookieConsentProvider>
        </CityProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
