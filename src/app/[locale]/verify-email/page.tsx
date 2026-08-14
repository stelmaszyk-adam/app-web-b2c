"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Mail, AlertCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { user } = useAuth();

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  async function handleResend() {
    if (!user?.email) return;
    setResendLoading(true);
    try {
      await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      }).catch(() => {});
      setResendSent(true);
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <AuthCard title={t("verifyEmailTitle")}>
      <div className="flex flex-col items-center gap-5 py-2 text-center">
        {error ? (
          <AlertCircle className="text-[var(--destructive)] h-12 w-12" strokeWidth={1.5} />
        ) : (
          <Mail className="text-primary h-12 w-12" strokeWidth={1.5} />
        )}

        <p className="text-on-surface-variant text-sm leading-relaxed">
          {error
            ? error === "invalid_token"
              ? t("verifyEmailInvalidToken")
              : t("verifyEmailError")
            : t("verifyEmailDesc", { email: user?.email ?? "" })}
        </p>

        {!error && (
          <>
            {resendSent ? (
              <p className="text-[var(--success)] text-sm">{t("verifyEmailResent")}</p>
            ) : (
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={resendLoading || !user?.email}
                size="sm"
              >
                {resendLoading ? t("sending") : t("resendEmail")}
              </Button>
            )}
          </>
        )}
      </div>
    </AuthCard>
  );
}
