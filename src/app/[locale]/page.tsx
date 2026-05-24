import { redirect } from "next/navigation";

// Root page redirects to default city (Poznań)
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const prefix = locale === "pl" ? "" : `/${locale}`;
  redirect(`${prefix}/poznan`);
}
