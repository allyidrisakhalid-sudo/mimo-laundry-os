import * as React from "react";
import { cn } from "../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--mimo-color-primary)] text-[var(--mimo-color-primary-foreground)] border-[var(--mimo-color-primary)] hover:opacity-90",
  secondary:
    "bg-[var(--mimo-color-surface-2)] text-[var(--mimo-color-text)] border-[var(--mimo-color-border)] hover:bg-[var(--mimo-color-primary-soft)]",
  ghost:
    "bg-transparent text-[var(--mimo-color-text)] border-transparent hover:bg-[var(--mimo-color-surface-2)]",
  danger:
    "bg-[var(--mimo-color-danger)] text-[var(--mimo-color-danger-foreground)] border-[var(--mimo-color-danger)] hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    children,
    type = "button",
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--mimo-radius-md)] border font-medium transition outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--mimo-color-primary)] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--mimo-color-background)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}
      {children ? <span>{children}</span> : null}
      {!loading ? rightIcon : null}
    </button>
  );
});
