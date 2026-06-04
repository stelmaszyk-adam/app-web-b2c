import type { MetadataRoute } from "next";
import { CITIES } from "@/lib/cities";
import { CATEGORIES } from "@/lib/categories";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://eventapp.dev";

// Date-based filters that have dedicated pages
const DATE_FILTERS = ["this-weekend", "today", "tomorrow"];

export const revalidate = 3600; // ISR: revalidate every 1 hour

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const entries: MetadataRoute.Sitemap = [];

  // Home page
  entries.push({
    url: BASE_URL,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
  });

  // City listing pages
  for (const city of CITIES) {
    entries.push({
      url: `${BASE_URL}/${city.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    });

    // Category listing pages per city
    for (const cat of CATEGORIES) {
      entries.push({
        url: `${BASE_URL}/${city.slug}/${cat.slug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }

    // Date filter pages per city
    for (const df of DATE_FILTERS) {
      entries.push({
        url: `${BASE_URL}/${city.slug}/${df}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.6,
      });
    }
  }

  return entries;
}
