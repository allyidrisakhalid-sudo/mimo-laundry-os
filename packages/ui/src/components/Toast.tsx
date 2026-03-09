import * as React from "react";
import { cn } from "../lib/cn";

export type ToastVariant = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
};

type ToastContextValue = {
  toasts: ToastItem[];
  showSuccess: (title: string, description?: string, duration?: number) => void;
  showError: (title: string, description?: string, duration?: number) => void;
  showInfo: (title: string, description?: string, duration?: number) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const variantClasses: Record<ToastVariant, string> = {
  success:
    "border-[var(--mimo-color-success-soft)] bg-[var(--mimo-color-surface)] text-[var(--mimo-color-text)]",
  error:
    "border-[var(--mimo-color-danger-soft)] bg-[var(--mimo-color-surface)] text-[var(--mimo-color-text)]",
  info: "border-[var(--mimo-color-info-soft)] bg-[var(--mimo-color-surface)] text-[var(--mimo-color-text)]",
};

function createToast(
  variant: ToastVariant,
  title: string,
  description?: string,
  duration = 3500
): ToastItem {
  return {
    id: `${variant}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    ...(description ? { description } : {}),
    variant,
    duration,
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const enqueue = React.useCallback(
    (toast: ToastItem) => {
      setToasts((current) => [...current, toast]);

      window.setTimeout(() => {
        dismiss(toast.id);
      }, toast.duration ?? 3500);
    },
    [dismiss]
  );

  const value = React.useMemo<ToastContextValue>(
    () => ({
      toasts,
      dismiss,
      showSuccess: (title, description, duration) =>
        enqueue(createToast("success", title, description, duration)),
      showError: (title, description, duration) =>
        enqueue(createToast("error", title, description, duration)),
      showInfo: (title, description, duration) =>
        enqueue(createToast("info", title, description, duration)),
    }),
    [dismiss, enqueue, toasts]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className={cn(
            "pointer-events-auto rounded-[var(--mimo-radius-lg)] border p-4 shadow-lg",
            variantClasses[toast.variant]
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description ? (
                <p className="text-sm text-[var(--mimo-color-text-muted)]">{toast.description}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-[var(--mimo-radius-sm)] p-1 text-[var(--mimo-color-text-muted)] outline-none transition hover:bg-[var(--mimo-color-surface-2)] focus-visible:ring-2 focus-visible:ring-[var(--mimo-color-primary)]"
              aria-label="Dismiss notification"
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
}
