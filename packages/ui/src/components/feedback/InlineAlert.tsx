import * as React from "react";

export type InlineAlertTone = "info" | "success" | "warning" | "danger";

export type InlineAlertProps = {
  tone?: InlineAlertTone;
  icon?: React.ReactNode;
  title: string;
  body?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function InlineAlert({
  tone = "info",
  icon,
  title,
  body,
  action,
  className = "",
}: InlineAlertProps) {
  return (
    <div className={`mimo-inline-alert mimo-inline-alert--${tone} ${className}`.trim()} role="alert">
      {icon ? <div className="mimo-inline-alert__icon">{icon}</div> : null}
      <div className="mimo-inline-alert__copy">
        <div className="mimo-inline-alert__title">{title}</div>
        {body ? <div className="mimo-inline-alert__body">{body}</div> : null}
      </div>
      {action ? <div className="mimo-inline-alert__action">{action}</div> : null}
    </div>
  );
}
