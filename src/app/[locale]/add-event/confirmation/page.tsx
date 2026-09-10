import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckCircle } from "lucide-react";

export default async function AddEventConfirmationPage() {
  const t = await getTranslations("addEventConfirmation");

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px] text-center">
        <div className="bg-[var(--success-container)] mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <CheckCircle
            className="text-[var(--success)] h-10 w-10"
            strokeWidth={1.5}
          />
        </div>

        <h1 className="text-on-surface mb-3 text-2xl font-bold tracking-[var(--tracking-tight)]">
          {t("title")}
        </h1>
        <p className="text-on-surface-variant mb-8 text-base">{t("message")}</p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="bg-primary text-on-primary inline-flex h-12 items-center rounded-full px-6 text-sm font-medium shadow-brand transition-opacity hover:opacity-90"
          >
            {t("backToHome")}
          </Link>
          <Link
            href="/add-event"
            className="bg-surface-low text-on-surface-variant hover:bg-surface-mid inline-flex h-12 items-center rounded-full px-6 text-sm font-medium transition-colors"
          >
            {t("addAnother")}
          </Link>
        </div>
      </div>
    </div>
  );
}
