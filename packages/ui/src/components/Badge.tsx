import * as React from "react";
import { cn } from "../lib/cn";

export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    "bg-[var(--mimo-color-surface-2)] text-[var(--mimo-color-text)] border-[var(--mimo-color-border)]",
  info: "bg-[var(--mimo-color-info-soft)] text-[var(--mimo-color-info)] border-[var(--mimo-color-info-soft)]",
  success:
    "bg-[var(--mimo-color-success-soft)] text-[var(--mimo-color-success)] border-[var(--mimo-color-success-soft)]",
  warning:
    "bg-[var(--mimo-color-warning-soft)] text-[var(--mimo-color-warning)] border-[var(--mimo-color-warning-soft)]",
  danger:
    "bg-[var(--mimo-color-danger-soft)] text-[var(--mimo-color-danger)] border-[var(--mimo-color-danger-soft)]",
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
