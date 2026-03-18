import * as React from "react";

export type FieldStateTone = "default" | "error" | "success" | "helper";

export type FieldStateProps = {
  tone?: FieldStateTone;
  message?: React.ReactNode;
  className?: string;
};

export function FieldState({
  tone = "helper",
  message,
  className = "",
}: FieldStateProps) {
  if (!message) return null;

  return (
    <div className={`mimo-field-state mimo-field-state--${tone} ${className}`.trim()}>
      {message}
    </div>
  );
}
