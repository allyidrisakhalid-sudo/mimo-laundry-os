import * as React from "react";

export type AppShellProps = {
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
  mobileTabs?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function AppShell({
  sidebar,
  topbar,
  mobileTabs,
  children,
  className = "",
}: AppShellProps) {
  return (
    <div className={mimo-shell .trim()}>
      {sidebar ? <aside className="mimo-shell__sidebar">{sidebar}</aside> : null}
      <div className="mimo-shell__surface">
        {topbar ? <div className="mimo-shell__topbar">{topbar}</div> : null}
        <main className="mimo-shell__main">{children}</main>
      </div>
      {mobileTabs ? <nav className="mimo-shell__mobile-tabs">{mobileTabs}</nav> : null}
    </div>
  );
}
