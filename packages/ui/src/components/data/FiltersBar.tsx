import * as React from "react";

export type FiltersBarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  onClear?: () => void;
  className?: string;
};

export function FiltersBar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search",
  children,
  onClear,
  className = "",
}: FiltersBarProps) {
  return (
    <div className={mimo-filters .trim()}>
      <div className="mimo-filters__search">
        <label className="mimo-visually-hidden" htmlFor="mimo-filters-search">
          {searchPlaceholder}
        </label>
        <input
          id="mimo-filters-search"
          className="mimo-input"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={searchPlaceholder}
        />
      </div>

      {children ? <div className="mimo-filters__controls">{children}</div> : null}

      {onClear ? (
        <button type="button" className="mimo-button mimo-button--ghost" onClick={onClear}>
          Clear
        </button>
      ) : null}
    </div>
  );
}
