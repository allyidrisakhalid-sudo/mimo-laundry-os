import * as React from "react";

export type TableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
};

export type TableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  loading?: boolean;
  loadingState?: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
};

export function Table<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  loadingState,
  emptyState,
  className = "",
}: TableProps<T>) {
  if (loading) {
    return <div className={mimo-table-wrap .trim()}>{loadingState}</div>;
  }

  if (!rows.length) {
    return <div className={mimo-table-wrap .trim()}>{emptyState}</div>;
  }

  return (
    <div className={mimo-table-wrap .trim()}>
      <table className="mimo-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  width: column.width,
                  textAlign: column.align ?? "left",
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={rowKey(row, index)}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    textAlign: column.align ?? "left",
                  }}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
