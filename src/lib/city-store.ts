import { CITY_MAP, type City } from "./cities";

const STORAGE_KEY = "wydarzka:selected-city";
const COOKIE_NAME = "wydarzka-city";
const GEO_DENIED_KEY = "wydarzka:geo-denied";

export function getSavedCity(): City | null {
  if (typeof window === "undefined") return null;
  try {
    const slug = localStorage.getItem(STORAGE_KEY);
    if (slug && CITY_MAP[slug]) return CITY_MAP[slug];
  } catch {
    // localStorage unavailable
  }
  return null;
}

export function saveCity(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, slug);
  } catch {
    // localStorage unavailable
  }
  // Also set a cookie so the server (middleware) can read it for redirects
  document.cookie = `${COOKIE_NAME}=${slug};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export function isGeolocationDenied(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(GEO_DENIED_KEY) === "true";
  } catch {
    return false;
  }
}

export function setGeolocationDenied(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GEO_DENIED_KEY, "true");
  } catch {
    // localStorage unavailable
  }
}
