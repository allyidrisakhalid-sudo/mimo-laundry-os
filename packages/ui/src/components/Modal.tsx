import * as React from "react";
import { cn } from "../lib/cn";

export type ModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, footer, onClose }: ModalProps) {
  React.useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mimo-modal-title"
        className={cn(
          "relative z-10 w-full max-w-lg rounded-[var(--mimo-radius-xl)] border border-[var(--mimo-color-border)]",
          "bg-[var(--mimo-color-surface)] p-6 shadow-xl"
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="mimo-modal-title" className="text-lg font-semibold text-[var(--mimo-color-text)]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--mimo-radius-sm)] p-1 text-[var(--mimo-color-text-muted)] outline-none transition hover:bg-[var(--mimo-color-surface-2)] focus-visible:ring-2 focus-visible:ring-[var(--mimo-color-primary)]"
            aria-label="Close modal"
          ></button>
        </div>

        <div className="text-sm text-[var(--mimo-color-text)]">{children}</div>

        {footer ? <div className="mt-6 flex items-center justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}
