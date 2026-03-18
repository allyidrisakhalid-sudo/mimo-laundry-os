import * as React from "react";

export type ToastTone = "success" | "error" | "info";

export type ToastProps = {
  tone?: ToastTone;
  title: string;
  body?: React.ReactNode;
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
};

export function Toast({
  tone = "info",
  title,
  body,
  action,
  onDismiss,
  className = "",
}: ToastProps) {
  return (
    <div className={`mimo-toast mimo-toast--${tone} ${className}`.trim()} role="status" aria-live="polite">
      <div className="mimo-toast__copy">
        <div className="mimo-toast__title">{title}</div>
        {body ? <div className="mimo-toast__body">{body}</div> : null}
      </div>

      <div className="mimo-toast__actions">
        {action}
        {onDismiss ? (
          <button type="button" className="mimo-button mimo-button--ghost" onClick={onDismiss}>
            Dismiss
          </button>
        ) : null}
      </div>
    </div>
  );
}
