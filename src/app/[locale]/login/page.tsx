"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/lib/auth-cookies";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const nextPath = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { user?: AuthUser; error?: string; message?: string };

      if (!res.ok) {
        setError(
          res.status === 401
            ? t("errorInvalidCredentials")
            : (data.message ?? t("errorGeneric")),
        );
        return;
      }

      if (data.user) setUser(data.user);
      router.push(nextPath);
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title={t("loginTitle")} subtitle={t("loginSubtitle")}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label={t("email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <AuthInput
          label={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-on-surface-variant hover:text-primary text-xs transition-colors"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        {error && (
          <p className="text-[var(--destructive)] rounded-[var(--radius-md)] bg-[var(--destructive-container)] px-4 py-3 text-sm">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t("signingIn") : t("signIn")}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="bg-outline h-px flex-1" />
        <span className="text-on-surface-muted text-xs">{t("orContinueWith")}</span>
        <div className="bg-outline h-px flex-1" />
      </div>

      <GoogleSignInButton nextPath={nextPath === "/" ? undefined : nextPath} />

      <p className="text-on-surface-variant mt-6 text-center text-sm">
        {t("noAccount")}{" "}
        <Link
          href={`/register${nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
          className="text-primary font-medium hover:underline"
        >
          {t("signUp")}
        </Link>
      </p>
    </AuthCard>
  );
}
