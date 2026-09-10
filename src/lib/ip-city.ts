export async function detectCityFromIp(): Promise<string | null> {
  try {
    const res = await fetch("/api/geo/city", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { citySlug: string | null };
    return data.citySlug ?? null;
  } catch {
    return null;
  }
}
