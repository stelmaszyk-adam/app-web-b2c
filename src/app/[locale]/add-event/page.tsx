"use client";

import { useState, useEffect, useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import { CITIES } from "@/lib/cities";
import { MOCK_VENUES } from "@/lib/mock-venues";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { api } from "@/api/client";
import { User, Sparkles, ArrowUpRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FREE_TEXT_VENUE_ID = "00000000-0000-0000-0000-000000000000";

interface FormState {
  name: string;
  venueQuery: string;
  venueId: string;
  description: string;
  startTime: string;
  endTime: string;
  category: CategorySlug | "";
  ticketUrl: string;
  price: string;
  city: string;
  postCode: string;
  street: string;
  buildingNumber: string;
  unit: string;
}

interface FormErrors {
  name?: string;
  venue?: string;
  description?: string;
  startTime?: string;
  category?: string;
  ticketUrl?: string;
  price?: string;
  city?: string;
  postCode?: string;
  street?: string;
  buildingNumber?: string;
  general?: string;
}

const initialForm: FormState = {
  name: "",
  venueQuery: "",
  venueId: "",
  description: "",
  startTime: "",
  endTime: "",
  category: "",
  ticketUrl: "",
  price: "",
  city: "",
  postCode: "",
  street: "",
  buildingNumber: "",
  unit: "",
};

function SectionCard({
  step,
  title,
  subtitle,
  children,
}: {
  step: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-surface-high rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-sm)]">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-gradient)] text-sm font-bold text-white shadow-brand">
          {step}
        </span>
        <div>
          <h2 className="text-on-surface font-semibold">{title}</h2>
          <p className="text-on-surface-variant text-sm">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[var(--destructive)] mt-1 text-xs">{message}</p>;
}

function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-on-surface text-sm font-medium">
      {children}
      {optional && (
        <em className="text-on-surface-muted ml-1 font-normal not-italic">
          (opcjonalnie)
        </em>
      )}
    </label>
  );
}

const inputCls = (hasError?: boolean) =>
  cn(
    "w-full bg-surface-low rounded-[var(--radius-md)] px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted outline-none ring-0 transition-all",
    "focus:bg-surface-high focus:ring-2 focus:ring-[var(--primary)]/20",
    hasError && "ring-2 ring-[var(--destructive)]/40",
  );

export default function AddEventPage() {
  const t = useTranslations("addEvent");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const datalistId = useId();

  useEffect(() => {
    if (!user) {
      const prefix = locale === "pl" ? "" : `/${locale}`;
      router.replace(
        `${prefix}/login?next=${encodeURIComponent(`${prefix}/add-event`)}`,
      );
    }
  }, [user, locale, router]);

  if (!user) return null;

  const cityVenues =
    form.city !== ""
      ? MOCK_VENUES.filter((v) => v.city === form.city)
      : MOCK_VENUES;

  const handleField =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      const errKey =
        key === "venueQuery" || key === "venueId" ? "venue" : key;
      setErrors((err) => ({ ...err, [errKey]: undefined, general: undefined }));
    };

  const handleVenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const matched = cityVenues.find((v) => v.name === value);
    setForm((f) => ({ ...f, venueQuery: value, venueId: matched?.id ?? "" }));
    setErrors((err) => ({ ...err, venue: undefined, general: undefined }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((f) => ({
      ...f,
      city: e.target.value,
      venueQuery: "",
      venueId: "",
    }));
    setErrors((err) => ({
      ...err,
      city: undefined,
      venue: undefined,
      general: undefined,
    }));
  };

  const setCategory = (slug: CategorySlug) => {
    setForm((f) => ({ ...f, category: slug }));
    setErrors((err) => ({ ...err, category: undefined, general: undefined }));
  };

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = t("errorRequired");
    if (!form.venueQuery.trim()) e.venue = t("errorRequired");
    if (!form.description.trim()) e.description = t("errorRequired");
    if (!form.startTime) {
      e.startTime = t("errorRequired");
    } else if (new Date(form.startTime) <= new Date()) {
      e.startTime = t("errorFutureTime");
    }
    if (!form.category) e.category = t("errorRequired");
    if (!form.ticketUrl.trim()) {
      e.ticketUrl = t("errorRequired");
    } else {
      try {
        new URL(form.ticketUrl);
      } catch {
        e.ticketUrl = t("errorInvalidUrl");
      }
    }
    if (form.price === "") e.price = t("errorRequired");
    if (!form.city) e.city = t("errorRequired");
    if (!form.postCode.trim()) e.postCode = t("errorRequired");
    if (!form.street.trim()) e.street = t("errorRequired");
    if (!form.buildingNumber.trim()) e.buildingNumber = t("errorRequired");
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors({ ...errs, general: t("errorMissingFields") });
      const firstErrorKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstErrorKey}`)?.focus();
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const { error } = await api.POST("/api/v1/events/user-submit", {
        body: {
          name: form.name.trim(),
          venue_id: form.venueId || FREE_TEXT_VENUE_ID,
          start_time: new Date(form.startTime).toISOString(),
          ...(form.endTime
            ? { end_time: new Date(form.endTime).toISOString() }
            : {}),
          category: form.category as CategorySlug,
          description: form.description.trim(),
          price: form.price,
          ticket_url: form.ticketUrl.trim(),
        },
      });

      if (error) {
        setErrors({ general: t("errorSubmit") });
        return;
      }

      router.push("/add-event/confirmation");
    } catch {
      setErrors({ general: t("errorSubmit") });
    } finally {
      setSubmitting(false);
    }
  }

  const displayName = user.displayName ?? user.email.split("@")[0];

  return (
    <div className="mx-auto max-w-[720px] px-4 py-10">
      {/* Hero */}
      <header className="mb-8">
        <span className="text-primary mb-1 block text-xs font-semibold uppercase tracking-[var(--tracking-wide)]">
          {t("eyebrow")}
        </span>
        <h1 className="text-on-surface mb-2 text-3xl font-bold tracking-[var(--tracking-tight)]">
          {t("title")}
        </h1>
        <p className="text-on-surface-variant text-sm">{t("subtitle")}</p>
        <p className="text-on-surface-variant mt-3 flex items-center gap-1.5 text-sm">
          <User className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {t("addingAs", { name: displayName, email: user.email })}
        </p>
      </header>

      {/* Organizer callout */}
      <div className="bg-[var(--primary-container)] mb-6 flex flex-wrap items-center gap-4 rounded-[var(--radius-xl)] p-4 md:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-gradient)] text-white shadow-brand">
          <Sparkles className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="flex-1">
          <p className="text-on-surface font-semibold">
            {t("organizerCalloutTitle")}
          </p>
          <p className="text-on-surface-variant text-sm">
            {t("organizerCalloutText")}
          </p>
        </div>
        <a
          href="https://dashboard.wydarzka.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {t("organizerCalloutCta")}
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </a>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Section 1 — Basic Info */}
        <SectionCard
          step={1}
          title={t("section1Title")}
          subtitle={t("section1Subtitle")}
        >
          <div className="flex flex-col gap-4">
            <AuthInput
              id="field-name"
              label={`${t("fieldName")} *`}
              value={form.name}
              onChange={handleField("name")}
              placeholder="np. Nils Frahm — All Encores Tour"
              error={errors.name}
            />

            {/* Venue combobox */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="field-venue">
                {t("fieldVenue")} *
              </FieldLabel>
              <datalist id={datalistId}>
                {cityVenues.map((v) => (
                  <option key={v.id} value={v.name} />
                ))}
              </datalist>
              <input
                id="field-venue"
                list={datalistId}
                value={form.venueQuery}
                onChange={handleVenueChange}
                placeholder={t("fieldVenuePlaceholder")}
                className={inputCls(!!errors.venue)}
                autoComplete="off"
              />
              {form.venueId ? (
                <p className="text-[var(--success)] text-xs">
                  ✓ {cityVenues.find((v) => v.id === form.venueId)?.name}
                </p>
              ) : form.venueQuery ? (
                <p className="text-on-surface-muted text-xs">
                  {t("freeTextVenueNote")}
                </p>
              ) : null}
              <FieldError message={errors.venue} />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="field-description">
                {t("fieldDescription")} *
              </FieldLabel>
              <textarea
                id="field-description"
                value={form.description}
                onChange={handleField("description")}
                placeholder={t("fieldDescriptionPlaceholder")}
                rows={5}
                className={inputCls(!!errors.description)}
              />
              <FieldError message={errors.description} />
            </div>
          </div>
        </SectionCard>

        {/* Section 2 — Date & Time */}
        <SectionCard
          step={2}
          title={t("section2Title")}
          subtitle={t("section2Subtitle")}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="field-startTime">
                {t("fieldStartTime")} *
              </FieldLabel>
              <input
                id="field-startTime"
                type="datetime-local"
                value={form.startTime}
                onChange={handleField("startTime")}
                className={inputCls(!!errors.startTime)}
              />
              <FieldError message={errors.startTime} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="field-endTime" optional>
                {t("fieldEndTime")}
              </FieldLabel>
              <input
                id="field-endTime"
                type="datetime-local"
                value={form.endTime}
                onChange={handleField("endTime")}
                className={inputCls()}
              />
            </div>
          </div>
        </SectionCard>

        {/* Section 3 — Category */}
        <SectionCard
          step={3}
          title={t("section3Title")}
          subtitle={t("section3Subtitle")}
        >
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label={t("fieldCategory")}
          >
            {CATEGORIES.map((cat) => {
              const selected = form.category === cat.slug;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setCategory(cat.slug)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    selected
                      ? "text-white shadow-brand"
                      : "bg-surface-low text-on-surface-variant hover:bg-surface-mid",
                  )}
                  style={selected ? { backgroundColor: cat.color } : undefined}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {cat.labelPl}
                </button>
              );
            })}
          </div>
          <FieldError message={errors.category} />
        </SectionCard>

        {/* Section 4 — Tickets & Price */}
        <SectionCard
          step={4}
          title={t("section4Title")}
          subtitle={t("section4Subtitle")}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <FieldLabel htmlFor="field-ticketUrl">
                {t("fieldTicketUrl")} *
              </FieldLabel>
              <input
                id="field-ticketUrl"
                type="url"
                value={form.ticketUrl}
                onChange={handleField("ticketUrl")}
                placeholder={t("fieldTicketUrlPlaceholder")}
                inputMode="url"
                className={inputCls(!!errors.ticketUrl)}
              />
              <FieldError message={errors.ticketUrl} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="field-price">
                {t("fieldPrice")} *
              </FieldLabel>
              <input
                id="field-price"
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={handleField("price")}
                placeholder={t("fieldPricePlaceholder")}
                className={inputCls(!!errors.price)}
              />
              <FieldError message={errors.price} />
            </div>
          </div>
        </SectionCard>

        {/* Section 5 — Address */}
        <SectionCard
          step={5}
          title={t("section5Title")}
          subtitle={t("section5Subtitle")}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {/* City — full width */}
            <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-4">
              <FieldLabel htmlFor="field-city">{t("fieldCity")} *</FieldLabel>
              <select
                id="field-city"
                value={form.city}
                onChange={handleCityChange}
                className={inputCls(!!errors.city)}
              >
                <option value="" disabled>
                  {t("fieldCityPlaceholder")}
                </option>
                {CITIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.namePl}
                  </option>
                ))}
              </select>
              <FieldError message={errors.city} />
            </div>

            {/* Street — 2 cols */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <FieldLabel htmlFor="field-street">
                {t("fieldStreet")} *
              </FieldLabel>
              <input
                id="field-street"
                value={form.street}
                onChange={handleField("street")}
                placeholder={t("fieldStreetPlaceholder")}
                className={inputCls(!!errors.street)}
              />
              <FieldError message={errors.street} />
            </div>

            {/* Building number */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="field-buildingNumber">
                {t("fieldBuildingNumber")} *
              </FieldLabel>
              <input
                id="field-buildingNumber"
                value={form.buildingNumber}
                onChange={handleField("buildingNumber")}
                placeholder={t("fieldBuildingNumberPlaceholder")}
                className={inputCls(!!errors.buildingNumber)}
              />
              <FieldError message={errors.buildingNumber} />
            </div>

            {/* Unit — optional */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="field-unit" optional>
                {t("fieldUnit")}
              </FieldLabel>
              <input
                id="field-unit"
                value={form.unit}
                onChange={handleField("unit")}
                placeholder={t("fieldUnitPlaceholder")}
                className={inputCls()}
              />
            </div>

            {/* Post code */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <FieldLabel htmlFor="field-postCode">
                {t("fieldPostCode")} *
              </FieldLabel>
              <input
                id="field-postCode"
                value={form.postCode}
                onChange={handleField("postCode")}
                placeholder={t("fieldPostCodePlaceholder")}
                className={inputCls(!!errors.postCode)}
              />
              <FieldError message={errors.postCode} />
            </div>
          </div>
        </SectionCard>

        {/* General error banner */}
        {errors.general && (
          <div className="bg-[var(--destructive-container)] flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3">
            <p className="text-[var(--destructive)] text-sm">{errors.general}</p>
            {!Object.keys(errors).filter((k) => k !== "general").length && (
              <button
                type="submit"
                className="text-[var(--destructive)] ml-auto shrink-0 text-sm font-medium underline underline-offset-2"
              >
                {t("retry")}
              </button>
            )}
          </div>
        )}

        {/* Form actions */}
        <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-on-surface-muted text-xs">{t("moderationNote")}</p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={submitting}>
              <Plus className="h-4 w-4" strokeWidth={2} />
              {submitting ? t("submitting") : t("submitButton")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
