import type { NextRequest } from "next/server";
import { CITIES } from "@/lib/cities";

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .split("")
    .filter((c) => c.charCodeAt(0) < 0x0300 || c.charCodeAt(0) > 0x036f)
    .join("")
    .trim();
}

export async function GET(request: NextRequest): Promise<Response> {
  const country = request.headers.get("cf-ipcountry") ?? "";
  const cfCity = request.headers.get("cf-ipcity") ?? "";

  // Only attempt city matching for Polish IPs (or when country is unknown)
  if (country && country !== "PL") {
    return Response.json({ citySlug: null });
  }

  if (cfCity) {
    const q = normalize(cfCity);

    // Exact match after diacritic normalization
    const exact = CITIES.find(
      (c) => normalize(c.namePl) === q || normalize(c.name) === q,
    );
    if (exact) {
      return Response.json({ citySlug: exact.slug });
    }

    // Prefix match as fallback (handles truncated city names from Cloudflare)
    if (q.length >= 4) {
      const prefix = CITIES.find(
        (c) =>
          normalize(c.namePl).startsWith(q) ||
          normalize(c.name).startsWith(q),
      );
      if (prefix) {
        return Response.json({ citySlug: prefix.slug });
      }
    }
  }

  return Response.json({ citySlug: null });
}
