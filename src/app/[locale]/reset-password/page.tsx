"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <AuthCard title={t("resetPasswordTitle")}>
        <p className="text-on-surface-variant text-center text-sm">
          {t("resetPasswordInvalidLink")}
        </p>
        <Link
          href="/forgot-password"
          className="text-primary mt-4 block text-center text-sm font-medium hover:underline"
        >
          {t("requestNewLink")}
        </Link>
      </AuthCard>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirm) {
      setError(t("errorPasswordMismatch"));
      return;
    }
    if (newPassword.length < 8) {
      setError(t("errorPasswordTooShort"));
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        setError(data?.message ?? t("errorGeneric"));
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthCard title={t("resetPasswordTitle")}>
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <CheckCircle className="text-[var(--success)] h-12 w-12" strokeWidth={1.5} />
          <p className="text-on-surface-variant text-sm">{t("resetPasswordSuccess")}</p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title={t("resetPasswordTitle")} subtitle={t("resetPasswordSubtitle")}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label={t("newPassword")}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
        />
        <AuthInput
          label={t("confirmPassword")}
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
        />

        {error && (
          <p className="text-[var(--destructive)] rounded-[var(--radius-md)] bg-[var(--destructive-container)] px-4 py-3 text-sm">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t("resetting") : t("resetPassword")}
        </Button>
      </form>
    </AuthCard>
  );
}
