"use client";

import { useState, useCallback, createContext, useContext, type ReactNode } from "react";
import { X, RefreshCw, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

type ErrorToast = {
  id: string;
  message: string;
  onRetry?: () => void;
};

type ErrorToastContextValue = {
  showError: (message: string, onRetry?: () => void) => void;
};

const ErrorToastContext = createContext<ErrorToastContextValue>({
  showError: () => {},
});

export function useErrorToast() {
  return useContext(ErrorToastContext);
}

export function ErrorToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ErrorToast[]>([]);

  const showError = useCallback((message: string, onRetry?: () => void) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, onRetry }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 8000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ErrorToastContext value={{ showError }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-md:bottom-20 max-md:left-4 max-md:right-4">
          {toasts.map((toast) => (
            <ErrorToastItem
              key={toast.id}
              toast={toast}
              onDismiss={() => dismiss(toast.id)}
            />
          ))}
        </div>
      )}
    </ErrorToastContext>
  );
}

function ErrorToastItem({
  toast,
  onDismiss,
}: {
  toast: ErrorToast;
  onDismiss: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <div
      className="bg-error-container flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 shadow-lg animate-in slide-in-from-bottom-2"
      role="alert"
    >
      <AlertCircle className="text-error h-5 w-5 shrink-0" strokeWidth={1.75} />
      <p className="text-on-error-container flex-1 text-sm font-medium">
        {toast.message}
      </p>
      {toast.onRetry && (
        <button
          onClick={() => {
            toast.onRetry?.();
            onDismiss();
          }}
          className="text-error hover:bg-error/10 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
        >
          <RefreshCw className="h-3 w-3" strokeWidth={2} />
          {t("retry")}
        </button>
      )}
      <button
        onClick={onDismiss}
        className="text-on-error-container/60 hover:text-on-error-container flex h-6 w-6 items-center justify-center rounded-full transition-colors"
        aria-label={t("dismiss")}
      >
        <X className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}
