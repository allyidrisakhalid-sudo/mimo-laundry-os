import * as React from "react";

export type TimelineItem = {
  key: string;
  time: string;
  title: string;
  note?: string;
  proof?: React.ReactNode;
  isLatest?: boolean;
};

export type TimelineProps = {
  items: TimelineItem[];
  className?: string;
};

export function Timeline({
  items,
  className = "",
}: TimelineProps) {
  return (
    <ol className={mimo-timeline .trim()}>
      {items.map((item) => (
        <li
          key={item.key}
          className={mimo-timeline__item .trim()}
        >
          <div className="mimo-timeline__rail">
            <span className="mimo-timeline__dot" />
          </div>
          <div className="mimo-timeline__content">
            <div className="mimo-timeline__time">{item.time}</div>
            <div className="mimo-timeline__title">{item.title}</div>
            {item.note ? <div className="mimo-timeline__note">{item.note}</div> : null}
            {item.proof ? <div className="mimo-timeline__proof">{item.proof}</div> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
