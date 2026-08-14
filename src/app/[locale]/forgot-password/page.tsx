"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Fire-and-forget: always show success to prevent email enumeration.
      await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => {});
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title={t("forgotPasswordTitle")}
      subtitle={!submitted ? t("forgotPasswordSubtitle") : undefined}
    >
      {submitted ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <CheckCircle className="text-[var(--success)] h-12 w-12" strokeWidth={1.5} />
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {t("forgotPasswordSuccess")}
          </p>
          <Link
            href="/login"
            className="text-primary text-sm font-medium hover:underline"
          >
            {t("backToSignIn")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthInput
            label={t("email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t("sending") : t("sendResetLink")}
          </Button>

          <p className="text-center">
            <Link
              href="/login"
              className="text-on-surface-variant hover:text-primary text-sm transition-colors"
            >
              {t("backToSignIn")}
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}
