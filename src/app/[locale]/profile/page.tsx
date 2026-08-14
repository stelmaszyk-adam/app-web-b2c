"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { useAuth, getUserInitials } from "@/lib/auth-context";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { CheckCircle, Trash2, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const locale = useLocale();
  const { user, setUser } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      const prefix = locale === "pl" ? "" : `/${locale}`;
      router.replace(`${prefix}/login?next=${encodeURIComponent(`${prefix}/profile`)}`);
    }
  }, [user, locale, router]);

  if (!user) return null;

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError(tAuth("errorPasswordMismatch"));
      return;
    }
    setPasswordError(null);
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        setPasswordError(data?.message ?? tAuth("errorGeneric"));
        return;
      }
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch {
      setPasswordError(tAuth("errorNetwork"));
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    try {
      await fetch("/api/users/me", { method: "DELETE" });
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch {
      setDeleteLoading(false);
    }
  }

  const initials = getUserInitials(user);

  return (
    <div className="mx-auto max-w-[640px] px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-[var(--brand-gradient)] flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-brand">
          {initials}
        </div>
        <div>
          <h1 className="text-on-surface text-2xl font-bold tracking-[var(--tracking-tight)]">
            {user.displayName ?? user.email.split("@")[0]}
          </h1>
          <p className="text-on-surface-variant text-sm">{user.email}</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-surface-high mb-6 overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)]">
        {[
          { label: t("mySubmissions"), href: "/my-submissions" },
          { label: t("myTips"), href: "/my-tips" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-on-surface hover:bg-surface-low flex items-center justify-between px-6 py-4 transition-colors [&:not(:last-child)]:border-b [&:not(:last-child)]:border-outline"
          >
            <span className="text-sm font-medium">{label}</span>
            <ChevronRight className="text-on-surface-muted h-4 w-4" />
          </Link>
        ))}
      </div>

      {/* Change password */}
      <section className="bg-surface-high mb-6 rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-sm)]">
        <h2 className="text-on-surface mb-4 font-semibold">{t("changePassword")}</h2>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
          <AuthInput
            label={t("currentPassword")}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          {passwordError && (
            <p className="text-[var(--destructive)] text-sm">{passwordError}</p>
          )}
          {passwordSuccess && (
            <div className="flex items-center gap-2">
              <CheckCircle className="text-[var(--success)] h-4 w-4" />
              <p className="text-[var(--success)] text-sm">{t("passwordChanged")}</p>
            </div>
          )}

          <Button type="submit" disabled={passwordLoading} size="sm" className="mt-1 self-start">
            {passwordLoading ? t("saving") : t("saveChanges")}
          </Button>
        </form>
      </section>

      {/* Language preference */}
      <section className="bg-surface-high mb-6 rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-sm)]">
        <h2 className="text-on-surface mb-4 font-semibold">{t("languagePreference")}</h2>
        <div className="bg-surface-low inline-flex h-10 items-center rounded-full p-[3px]">
          {(["pl", "en"] as const).map((loc) => (
            <Link
              key={loc}
              href="/profile"
              locale={loc}
              className={`h-full rounded-full px-4 text-sm font-semibold transition-colors ${
                locale === loc
                  ? "bg-surface-high text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {loc.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>

      {/* Account deletion */}
      <section className="bg-surface-high rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-sm)]">
        <h2 className="text-on-surface mb-2 font-semibold">{t("deleteAccount")}</h2>
        <p className="text-on-surface-variant mb-4 text-sm">{t("deleteAccountWarning")}</p>

        {!deleteOpen ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            {t("deleteAccount")}
          </Button>
        ) : (
          <div className="bg-[var(--destructive-container)] rounded-[var(--radius-lg)] p-4">
            <p className="text-on-surface mb-4 text-sm font-medium">
              {t("deleteAccountConfirm")}
            </p>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? t("deleting") : t("confirmDelete")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteOpen(false)}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
