import * as React from "react";

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPrevious?: () => void;
  onNext?: () => void;
  className?: string;
};

export function Pagination({
  page,
  totalPages,
  onPrevious,
  onNext,
  className = "",
}: PaginationProps) {
  const isPreviousDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  return (
    <div className={mimo-pagination .trim()}>
      <button
        type="button"
        className="mimo-button mimo-button--ghost"
        onClick={onPrevious}
        disabled={isPreviousDisabled}
      >
        Previous
      </button>

      <span className="mimo-pagination__label">
        Page {page} of {Math.max(totalPages, 1)}
      </span>

      <button
        type="button"
        className="mimo-button mimo-button--ghost"
        onClick={onNext}
        disabled={isNextDisabled}
      >
        Next
      </button>
    </div>
  );
}
