import * as React from "react";

export type StatusBadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type StatusBadgeProps = {
  label: string;
  tone?: StatusBadgeTone;
  className?: string;
};

export function StatusBadge({
  label,
  tone = "neutral",
  className = "",
}: StatusBadgeProps) {
  return (
    <span className={mimo-status-badge mimo-status-badge-- .trim()}>
      {label}
    </span>
  );
}
