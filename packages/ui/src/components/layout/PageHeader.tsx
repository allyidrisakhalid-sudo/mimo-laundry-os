import * as React from "react";

export type PageHeaderProps = {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  className = "",
}: PageHeaderProps) {
  return (
    <section className={mimo-page-header .trim()}>
      <div className="mimo-page-header__body">
        {eyebrow ? <div className="mimo-page-header__eyebrow">{eyebrow}</div> : null}
        <h1 className="mimo-page-header__title">{title}</h1>
        {description ? <p className="mimo-page-header__description">{description}</p> : null}
      </div>

      {actions ? <div className="mimo-page-header__actions">{actions}</div> : null}
    </section>
  );
}
