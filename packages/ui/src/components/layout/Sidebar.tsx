import * as React from "react";

export type SidebarItem = {
  key: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  badge?: React.ReactNode;
};

export type SidebarProps = {
  brand?: React.ReactNode;
  roleLabel?: string;
  items: SidebarItem[];
  footer?: React.ReactNode;
  className?: string;
};

export function Sidebar({
  brand,
  roleLabel,
  items,
  footer,
  className = "",
}: SidebarProps) {
  return (
    <div className={`mimo-sidebar ${className}`.trim()}>
      {brand ? <div className="mimo-sidebar__brand">{brand}</div> : null}
      {roleLabel ? <div className="mimo-sidebar__role">{roleLabel}</div> : null}

      <div className="mimo-sidebar__nav">
        {items.map((item) => {
          const content = (
            <>
              <span className="mimo-sidebar__item-main">
                {item.icon ? <span className="mimo-sidebar__icon">{item.icon}</span> : null}
                <span>{item.label}</span>
              </span>
              {item.badge ? <span className="mimo-sidebar__badge">{item.badge}</span> : null}
            </>
          );

          if (item.disabled) {
            return (
              <div
                key={item.key}
                className={`mimo-sidebar__item mimo-sidebar__item--disabled ${item.active ? "mimo-sidebar__item--active" : ""}`.trim()}
                aria-disabled="true"
              >
                {content}
              </div>
            );
          }

          return (
            <a
              key={item.key}
              href={item.href}
              className={`mimo-sidebar__item ${item.active ? "mimo-sidebar__item--active" : ""}`.trim()}
              aria-current={item.active ? "page" : undefined}
            >
              {content}
            </a>
          );
        })}
      </div>

      {footer ? <div className="mimo-sidebar__footer">{footer}</div> : null}
    </div>
  );
}
