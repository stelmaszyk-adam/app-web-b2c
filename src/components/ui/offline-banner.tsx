"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";

export function OfflineBanner() {
  const isMocking = process.env.NEXT_PUBLIC_API_MOCKING === "true";
  const [isOffline, setIsOffline] = useState(() =>
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );
  const t = useTranslations("errors");

  useEffect(() => {
    function handleOffline() {
      setIsOffline(true);
    }

    function handleOnline() {
      setIsOffline(false);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline || isMocking || process.env.NODE_ENV === "development") return null;

  return (
    <div
      className="bg-warning-container fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 px-4 py-2.5"
      role="alert"
    >
      <WifiOff className="text-on-warning-container h-4 w-4 shrink-0" strokeWidth={1.75} />
      <p className="text-on-warning-container text-sm font-medium">
        {t("offlineTitle")} — {t("offlineDescription")}
      </p>
    </div>
  );
}
