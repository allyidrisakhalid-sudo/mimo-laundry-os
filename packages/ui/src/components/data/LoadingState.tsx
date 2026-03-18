import * as React from "react";

export type LoadingStateProps = {
  lines?: number;
  className?: string;
};

export function LoadingState({
  lines = 4,
  className = "",
}: LoadingStateProps) {
  const items = Array.from({ length: lines });

  return (
    <div className={`mimo-loading-state ${className}`.trim()} aria-busy="true" aria-live="polite">
      {items.map((_, index) => (
        <div
          key={index}
          className="mimo-loading-state__line"
          style={{ width: index === 0 ? "38%" : index === lines - 1 ? "54%" : "100%" }}
        />
      ))}
    </div>
  );
}
