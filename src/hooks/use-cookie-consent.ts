"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  type ConsentCategories,
  getStoredConsent,
  setStoredConsent,
} from "@/lib/cookie-consent";

type Listener = () => void;
const listeners = new Set<Listener>();

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((l) => l());
}

let cachedSnapshot: ConsentCategories | null = null;
let cachedRaw: string | null = null;

function getSnapshot(): ConsentCategories | null {
  const raw =
    typeof window !== "undefined"
      ? localStorage.getItem("eventapp_cookie_consent")
      : null;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = getStoredConsent()?.categories ?? null;
  }
  return cachedSnapshot;
}

function getServerSnapshot(): ConsentCategories | null {
  return null;
}

export function useCookieConsent() {
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const saveConsent = useCallback((categories: ConsentCategories) => {
    setStoredConsent(categories);
    cachedRaw = null;
    notifyListeners();
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  }, [saveConsent]);

  const rejectAll = useCallback(() => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  }, [saveConsent]);

  return {
    consent,
    showBanner: consent === null,
    acceptAll,
    rejectAll,
    saveConsent,
  };
}
