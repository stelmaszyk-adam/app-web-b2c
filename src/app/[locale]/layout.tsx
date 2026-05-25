import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
      process.env.NEXT_PUBLIC_BASE_URL ?? "https://eventapp.dev",
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

  return (
    <NextIntlClientProvider messages={messages}>
      <CityProvider>
        <CookieConsentProvider>
          <PostHogProvider />
          <WebVitalsReporter />
          <ErrorToastProvider>
            <OfflineBanner />
            <AppHeader />
            <main className="flex-1">{children}</main>
            <AppFooter />
            <CityPickerOverlay />
          </ErrorToastProvider>
        </CookieConsentProvider>
      </CityProvider>
    </NextIntlClientProvider>
  );
}
