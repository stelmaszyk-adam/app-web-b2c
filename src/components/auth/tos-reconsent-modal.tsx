"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { TOS_VERSION } from "@/lib/auth-cookies";

interface TosReconsentModalProps {
  onAccepted: () => void;
}

export function TosReconsentModal({ onAccepted }: TosReconsentModalProps) {
  const t = useTranslations("tos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleAccept() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/auth/tos/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: TOS_VERSION }),
      });
      if (!res.ok) throw new Error("accept failed");
      onAccepted();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-high mx-4 w-full max-w-[440px] rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-xl)]">
        <div className="mb-5 flex justify-center">
          <ShieldCheck className="text-primary h-12 w-12" strokeWidth={1.5} />
        </div>

        <h2 className="text-on-surface mb-2 text-center text-xl font-bold tracking-[var(--tracking-tight)]">
          {t("title")}
        </h2>
        <p className="text-on-surface-variant mb-6 text-center text-sm leading-relaxed">
          {t.rich("description", {
            terms: (chunks) => (
              <Link href="/terms" className="text-primary hover:underline" target="_blank">
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link href="/privacy" className="text-primary hover:underline" target="_blank">
                {chunks}
              </Link>
            ),
          })}
        </p>

        {error && (
          <p className="text-[var(--destructive)] mb-4 text-center text-sm">
            {t("acceptError")}
          </p>
        )}

        <Button onClick={handleAccept} disabled={loading} className="w-full">
          {loading ? t("accepting") : t("accept")}
        </Button>
      </div>
    </div>
  );
}
