"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      {/* Illustration */}
      <div className="mb-8">
        <div className="bg-error-container flex h-24 w-24 items-center justify-center rounded-full">
          <AlertTriangle className="text-error h-12 w-12" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text */}
      <h1 className="text-on-surface mb-2 text-center text-2xl font-bold tracking-tight md:text-3xl">
        {t("serverErrorTitle")}
      </h1>
      <p className="text-on-surface-variant mb-8 max-w-md text-center text-base">
        {t("serverErrorDescription")}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => unstable_retry()}
          className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
          {t("tryAgain")}
        </button>
        <Link
          href="/"
          className="text-on-surface hover:bg-surface-low inline-flex items-center gap-2 rounded-full border border-outline px-6 py-3 text-sm font-semibold transition-colors"
        >
          <Home className="h-4 w-4" strokeWidth={1.75} />
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}
