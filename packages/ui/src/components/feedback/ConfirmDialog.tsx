import * as React from "react";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  body: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="mimo-dialog-backdrop" role="presentation">
      <div className="mimo-dialog" role="dialog" aria-modal="true" aria-label={title}>
        <div className="mimo-dialog__title">{title}</div>
        <div className="mimo-dialog__body">{body}</div>
        <div className="mimo-dialog__actions">
          <button type="button" className="mimo-button mimo-button--ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={danger ? "mimo-button mimo-button--danger" : "mimo-button mimo-button--primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
