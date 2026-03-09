import * as React from "react";
import { cn } from "../lib/cn";

export type InputSize = "sm" | "md";
export type InputType = "text" | "phone" | "password";

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  helperText?: string;
  error?: string;
  inputSize?: InputSize;
  inputType?: InputType;
};

const sizeClasses: Record<InputSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, helperText, error, className, inputSize = "md", inputType = "text", ...props },
  ref
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--mimo-color-text)]">
          {label}
        </label>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        type={inputType === "phone" ? "tel" : inputType}
        className={cn(
          "w-full rounded-[var(--mimo-radius-md)] border bg-[var(--mimo-color-surface)] text-[var(--mimo-color-text)] outline-none transition",
          "placeholder:text-[var(--mimo-color-text-muted)]",
          "focus-visible:ring-2 focus-visible:ring-[var(--mimo-color-primary)] focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[var(--mimo-color-background)]",
          error ? "border-[var(--mimo-color-danger)]" : "border-[var(--mimo-color-border)]",
          sizeClasses[inputSize],
          className
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />

      {error ? (
        <p id={errorId} className="text-sm text-[var(--mimo-color-danger)]">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-[var(--mimo-color-text-muted)]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
