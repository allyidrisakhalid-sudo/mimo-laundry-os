import * as React from "react";
import { cn } from "../lib/cn";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function SkeletonLine({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "h-4 w-full animate-pulse rounded-[var(--mimo-radius-sm)] bg-[var(--mimo-color-surface-2)]",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--mimo-radius-lg)] border border-[var(--mimo-color-border)] bg-[var(--mimo-color-surface)] p-5",
        className
      )}
      {...props}
    >
      <div className="mb-4 h-32 w-full animate-pulse rounded-[var(--mimo-radius-md)] bg-[var(--mimo-color-surface-2)]" />
      <div className="space-y-3">
        <SkeletonLine />
        <SkeletonLine className="w-4/5" />
        <SkeletonLine className="w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 4, className, ...props }: SkeletonProps & { rows?: number }) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-[var(--mimo-radius-md)] border border-[var(--mimo-color-border)] bg-[var(--mimo-color-surface)] p-4"
        >
          <SkeletonLine />
          <SkeletonLine className="mt-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}
