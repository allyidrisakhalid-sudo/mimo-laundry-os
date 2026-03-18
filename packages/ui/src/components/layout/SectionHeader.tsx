import * as React from "react";

export type SectionHeaderProps = {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  actions,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={mimo-section-header .trim()}>
      <div className="mimo-section-header__body">
        <h2 className="mimo-section-header__title">{title}</h2>
        {description ? <p className="mimo-section-header__description">{description}</p> : null}
      </div>

      {actions ? <div className="mimo-section-header__actions">{actions}</div> : null}
    </div>
  );
}
