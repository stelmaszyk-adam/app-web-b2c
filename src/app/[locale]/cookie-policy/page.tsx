import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookiePolicy" });
  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

type CookieTableRow = {
  name: string;
  purpose: string;
  retention: string;
};

function CookieTable({
  rows,
  headers,
}: {
  rows: CookieTableRow[];
  headers: { name: string; purpose: string; retention: string };
}) {
  return (
    <div className="overflow-x-auto">
      <table className="text-on-surface w-full text-left text-sm">
        <thead>
          <tr className="border-outline border-b">
            <th className="text-on-surface-variant px-4 py-3 text-xs font-medium uppercase tracking-[0.05em]">
              {headers.name}
            </th>
            <th className="text-on-surface-variant px-4 py-3 text-xs font-medium uppercase tracking-[0.05em]">
              {headers.purpose}
            </th>
            <th className="text-on-surface-variant px-4 py-3 text-xs font-medium uppercase tracking-[0.05em]">
              {headers.retention}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-outline border-b last:border-0">
              <td className="px-4 py-3 font-mono text-xs">{row.name}</td>
              <td className="text-on-surface-variant px-4 py-3">{row.purpose}</td>
              <td className="text-on-surface-variant px-4 py-3 whitespace-nowrap">
                {row.retention}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicyPage() {
  const t = useTranslations("cookiePolicy");

  const tableHeaders = {
    name: t("tableName"),
    purpose: t("tablePurpose"),
    retention: t("tableRetention"),
  };

  const essentialCookies: CookieTableRow[] = [
    {
      name: "wydarzka_cookie_consent",
      purpose: t("consentCookiePurpose"),
      retention: t("consentCookieRetention"),
    },
    {
      name: "NEXT_LOCALE",
      purpose: t("localeCookiePurpose"),
      retention: t("localeCookieRetention"),
    },
  ];

  const analyticsCookies: CookieTableRow[] = [
    {
      name: "ph_*",
      purpose: t("posthogCookiePurpose"),
      retention: t("posthogCookieRetention"),
    },
  ];

  const marketingCookies: CookieTableRow[] = [
    {
      name: "_fbp",
      purpose: t("fbpCookiePurpose"),
      retention: t("fbpCookieRetention"),
    },
    {
      name: "_gcl_*",
      purpose: t("gclCookiePurpose"),
      retention: t("gclCookieRetention"),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="text-on-surface text-3xl font-bold tracking-tight">
        {t("title")}
      </h1>
      <p className="text-on-surface-variant mt-4 text-base leading-relaxed">
        {t("intro")}
      </p>

      <section className="mt-10">
        <h2 className="text-on-surface text-xl font-semibold">
          {t("essentialTitle")}
        </h2>
        <p className="text-on-surface-variant mt-2 text-sm">
          {t("essentialDescription")}
        </p>
        <div className="bg-surface-low mt-4 rounded-2xl p-1">
          <CookieTable rows={essentialCookies} headers={tableHeaders} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-on-surface text-xl font-semibold">
          {t("analyticsTitle")}
        </h2>
        <p className="text-on-surface-variant mt-2 text-sm">
          {t("analyticsDescription")}
        </p>
        <div className="bg-surface-low mt-4 rounded-2xl p-1">
          <CookieTable rows={analyticsCookies} headers={tableHeaders} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-on-surface text-xl font-semibold">
          {t("marketingTitle")}
        </h2>
        <p className="text-on-surface-variant mt-2 text-sm">
          {t("marketingDescription")}
        </p>
        <div className="bg-surface-low mt-4 rounded-2xl p-1">
          <CookieTable rows={marketingCookies} headers={tableHeaders} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-on-surface text-xl font-semibold">
          {t("managingTitle")}
        </h2>
        <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
          {t("managingDescription")}
        </p>
      </section>

      <p className="text-on-surface-muted mt-12 text-xs">
        {t("lastUpdated")}
      </p>
    </div>
  );
}
