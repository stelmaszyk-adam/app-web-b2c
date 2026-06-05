import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCityBySlug } from "@/lib/cities";

const DEFAULT_CITY = "poznan";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const prefix = locale === "pl" ? "" : `/${locale}`;

  // 1. Check for persisted city cookie (set by client when user picks a city)
  const cookieStore = await cookies();
  const savedSlug = cookieStore.get("wydarzka-city")?.value;
  if (savedSlug && getCityBySlug(savedSlug)) {
    redirect(`${prefix}/${savedSlug}`);
  }

  // 2. No saved city — redirect to default.
  //    The city page will detect first-visit and show city picker if needed.
  redirect(`${prefix}/${DEFAULT_CITY}`);
}
