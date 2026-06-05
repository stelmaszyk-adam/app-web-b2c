const STORAGE_KEY = "wydarzka_cookie_consent";
const CONSENT_EXPIRY_DAYS = 365;

export type ConsentCategories = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

export type StoredConsent = {
  categories: ConsentCategories;
  timestamp: number;
};

export function getStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: StoredConsent = JSON.parse(raw);

    const expiryMs = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    if (Date.now() - parsed.timestamp > expiryMs) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function setStoredConsent(categories: ConsentCategories): void {
  const data: StoredConsent = {
    categories,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearStoredConsent(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasAnalyticsConsent(): boolean {
  const consent = getStoredConsent();
  return consent?.categories.analytics ?? false;
}
