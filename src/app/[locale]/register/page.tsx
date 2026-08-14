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
import { TOS_VERSION } from "@/lib/auth-cookies";
import type { AuthUser } from "@/lib/auth-cookies";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const nextPath = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tosAccepted) {
      setError(t("errorTosRequired"));
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          tosAccepted: true,
          tosVersion: TOS_VERSION,
        }),
      });

      const data = (await res.json()) as {
        user?: AuthUser;
        redirectTo?: string;
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        setError(
          res.status === 409
            ? t("errorEmailExists")
            : (data.message ?? t("errorGeneric")),
        );
        return;
      }

      if (data.user) setUser(data.user);
      router.push(data.redirectTo ?? "/verify-email");
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title={t("registerTitle")} subtitle={t("registerSubtitle")}>
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
          autoComplete="new-password"
          required
          minLength={8}
        />

        {/* ToS acceptance */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={tosAccepted}
            onChange={(e) => setTosAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer accent-[var(--primary)]"
          />
          <span className="text-on-surface-variant text-sm leading-relaxed">
            {t.rich("tosAcceptance", {
              terms: (chunks) => (
                <Link
                  href="/terms"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link
                  href="/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>

        {error && (
          <p className="text-[var(--destructive)] rounded-[var(--radius-md)] bg-[var(--destructive-container)] px-4 py-3 text-sm">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading || !tosAccepted} className="w-full">
          {loading ? t("creatingAccount") : t("createAccount")}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="bg-outline h-px flex-1" />
        <span className="text-on-surface-muted text-xs">{t("orContinueWith")}</span>
        <div className="bg-outline h-px flex-1" />
      </div>

      <GoogleSignInButton nextPath={nextPath === "/" ? undefined : nextPath} />

      <p className="text-on-surface-variant mt-6 text-center text-sm">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href={`/login${nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
          className="text-primary font-medium hover:underline"
        >
          {t("signIn")}
        </Link>
      </p>
    </AuthCard>
  );
}
