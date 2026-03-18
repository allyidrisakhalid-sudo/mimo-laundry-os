import * as React from "react";

export type SLAChipTone = "calm" | "watch" | "urgent";

export type SLAChipProps = {
  label: string;
  tone?: SLAChipTone;
  className?: string;
};

export function SLAChip({
  label,
  tone = "calm",
  className = "",
}: SLAChipProps) {
  return (
    <span className={`mimo-sla-chip mimo-sla-chip--${tone} ${className}`.trim()}>
      {label}
    </span>
  );
}
