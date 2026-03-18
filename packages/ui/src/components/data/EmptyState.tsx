import * as React from "react";

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  body?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  body,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={mimo-empty-state .trim()}>
      {icon ? <div className="mimo-empty-state__icon">{icon}</div> : null}
      <h3 className="mimo-empty-state__title">{title}</h3>
      {body ? <p className="mimo-empty-state__body">{body}</p> : null}
      {action ? <div className="mimo-empty-state__action">{action}</div> : null}
    </div>
  );
}
