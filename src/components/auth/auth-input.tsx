import { cn } from "@/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthInput({ label, error, className, id, ...props }: AuthInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-on-surface text-sm font-medium"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "bg-surface-low rounded-[var(--radius-md)] px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted outline-none ring-0 transition-all",
          "focus:bg-surface-high focus:ring-2 focus:ring-[var(--primary)]/20",
          error && "ring-2 ring-[var(--destructive)]/40",
          className,
        )}
        {...props}
      />
      {error && (
        <p className="text-[var(--destructive)] text-xs">{error}</p>
      )}
    </div>
  );
}
