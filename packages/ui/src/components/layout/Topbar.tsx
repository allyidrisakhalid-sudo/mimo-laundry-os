import * as React from "react";

export type TopbarProps = {
  title?: string;
  context?: React.ReactNode;
  languageSlot?: React.ReactNode;
  actions?: React.ReactNode;
  profileSlot?: React.ReactNode;
  className?: string;
};

export function Topbar({
  title,
  context,
  languageSlot,
  actions,
  profileSlot,
  className = "",
}: TopbarProps) {
  return (
    <header className={mimo-topbar .trim()}>
      <div className="mimo-topbar__left">
        {title ? <div className="mimo-topbar__title">{title}</div> : null}
        {context ? <div className="mimo-topbar__context">{context}</div> : null}
      </div>

      <div className="mimo-topbar__right">
        {languageSlot ? <div className="mimo-topbar__slot">{languageSlot}</div> : null}
        {actions ? <div className="mimo-topbar__slot">{actions}</div> : null}
        {profileSlot ? <div className="mimo-topbar__slot">{profileSlot}</div> : null}
      </div>
    </header>
  );
}
