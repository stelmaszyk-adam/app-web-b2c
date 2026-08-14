import { Link } from "@/i18n/navigation";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label="Wydarzka"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-gradient)] text-base font-bold tracking-wide text-white shadow-brand">
              E
            </span>
            <span className="text-on-surface text-xl font-bold tracking-tight">
              wydarzka
            </span>
          </Link>
        </div>

        <div className="bg-surface-high rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-lg)]">
          <h1 className="text-on-surface mb-1 text-center text-2xl font-bold tracking-[var(--tracking-tight)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-on-surface-variant mb-6 text-center text-sm">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
