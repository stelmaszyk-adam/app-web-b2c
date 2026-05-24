"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { CookieBanner } from "./cookie-banner";
import { CookiePrefsOverlay } from "./cookie-prefs-overlay";
import type { ConsentCategories } from "@/lib/cookie-consent";

type CookieConsentContextValue = {
  consent: ConsentCategories | null;
  openPreferences: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue>({
  consent: null,
  openPreferences: () => {},
});

export function useCookieConsentContext() {
  return useContext(CookieConsentContext);
}

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { consent, showBanner, acceptAll, rejectAll, saveConsent } =
    useCookieConsent();
  const [showPrefs, setShowPrefs] = useState(false);

  const openPreferences = useCallback(() => {
    setShowPrefs(true);
  }, []);

  const handleSavePrefs = useCallback(
    (categories: ConsentCategories) => {
      saveConsent(categories);
      setShowPrefs(false);
    },
    [saveConsent],
  );

  return (
    <CookieConsentContext.Provider value={{ consent, openPreferences }}>
      {children}
      {showBanner && !showPrefs && (
        <CookieBanner
          onAcceptAll={acceptAll}
          onRejectAll={rejectAll}
          onManage={openPreferences}
        />
      )}
      {showPrefs && (
        <CookiePrefsOverlay
          initialConsent={consent}
          onSave={handleSavePrefs}
          onClose={() => setShowPrefs(false)}
        />
      )}
    </CookieConsentContext.Provider>
  );
}
