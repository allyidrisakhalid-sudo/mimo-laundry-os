import * as React from "react";
import { cn } from "../lib/cn";

export type OrderTimelineStatus = "done" | "current" | "pending" | "error";

export type OrderTimelineItem = {
  label: string;
  timestamp?: string;
  status: OrderTimelineStatus;
  proofHref?: string;
};

export type OrderTimelineProps = {
  items: OrderTimelineItem[];
  className?: string;
};

const dotClasses: Record<OrderTimelineStatus, string> = {
  done: "bg-[var(--mimo-color-success)] border-[var(--mimo-color-success)]",
  current: "bg-[var(--mimo-color-primary)] border-[var(--mimo-color-primary)]",
  pending: "bg-[var(--mimo-color-surface)] border-[var(--mimo-color-border)]",
  error: "bg-[var(--mimo-color-danger)] border-[var(--mimo-color-danger)]",
};

const lineClasses: Record<OrderTimelineStatus, string> = {
  done: "bg-[var(--mimo-color-success-soft)]",
  current: "bg-[var(--mimo-color-primary-soft)]",
  pending: "bg-[var(--mimo-color-border)]",
  error: "bg-[var(--mimo-color-danger-soft)]",
};

export function OrderTimeline({ items, className }: OrderTimelineProps) {
  return (
    <ol className={cn("flex flex-col gap-0", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <li key={`${item.label}-${index}`} className="grid grid-cols-[24px_1fr] gap-3">
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className={cn("mt-1 h-4 w-4 rounded-full border-2", dotClasses[item.status])}
              />
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={cn("mt-2 w-0.5 flex-1 min-h-8", lineClasses[item.status])}
                />
              ) : null}
            </div>

            <div className="pb-6">
              <div className="flex flex-col gap-1 rounded-[var(--mimo-radius-md)] border border-[var(--mimo-color-border)] bg-[var(--mimo-color-surface)] p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-sm font-semibold text-[var(--mimo-color-text)]">
                    {item.label}
                  </p>
                  <span className="text-xs text-[var(--mimo-color-text-muted)]">
                    {item.timestamp ?? "Pending timestamp"}
                  </span>
                </div>

                <p className="text-xs uppercase tracking-wide text-[var(--mimo-color-text-muted)]">
                  {item.status}
                </p>

                {item.proofHref ? (
                  <a
                    href={item.proofHref}
                    className="text-sm font-medium text-[var(--mimo-color-primary)] underline underline-offset-2"
                  >
                    View proof
                  </a>
                ) : (
                  <span className="text-sm text-[var(--mimo-color-text-muted)]">
                    Proof placeholder
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
