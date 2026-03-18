import * as React from "react";

export type FieldStateTone = "default" | "error" | "success" | "helper";

export type FieldStateProps = {
  tone?: FieldStateTone;
  message?: React.ReactNode;
  htmlFor?: string;
  className?: string;
};

export function FieldState({
  tone = "helper",
  message,
  htmlFor,
  className = "",
}: FieldStateProps) {
  if (!message) return null;

  return (
    <div
      className={mimo-field-state mimo-field-state-- .trim()}
      htmlFor={htmlFor as any}
    >
      {message}
    </div>
  );
}
