"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AdminPage } from "@/components/admin/admin-shell";
import { AdminCard, AdminEmptyState, AdminStatusBadge, AdminTable, AdminTableSkeleton } from "@/components/admin/admin-ui";

type Row = Record<string, unknown>;

export type AdminColumn = {
  key: string;
  label: string;
  render?: (row: Row) => ReactNode;
};

export function AdminTablePage({
  title,
  description,
  load,
  columns,
  emptyTitle = "Данных пока нет",
  emptyDescription = "Раздел готов к подключению данных.",
  editableFields,
  onRowSave,
  getRowHref,
}: {
  title: string;
  description?: string;
  load: () => Promise<Row[]>;
  columns: AdminColumn[];
  emptyTitle?: string;
  emptyDescription?: string;
  editableFields?: Array<{ key: string; label: string; type?: "text" | "number" | "boolean" }>;
  onRowSave?: (row: Row) => Promise<Row | void>;
  getRowHref?: (row: Row) => string | undefined;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load()
      .then(setRows)
      .catch(() => setError("Не удалось загрузить данные раздела."))
      .finally(() => setLoading(false));
  }, [load]);

  return (
    <AdminPage title={title} description={description}>
      {error ? <AdminCard className="mb-4 border-rose-100 bg-rose-50 text-sm font-semibold text-rose-700">{error}</AdminCard> : null}
      {loading ? (
        <AdminTableSkeleton rows={7} columns={Math.min(columns.length, 6)} />
      ) : rows.length ? (
        <AdminTable
          columns={columns}
          rows={rows}
          editableFields={editableFields}
          getRowHref={getRowHref}
          onRowSave={
            onRowSave
              ? async (row) => {
                  const saved = await onRowSave(row);
                  const next = (saved || row) as Row;
                  setRows((current) => current.map((item) => (String(item.id) === String(next.id) ? next : item)));
                  return next;
                }
              : undefined
          }
        />
      ) : (
        <AdminEmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </AdminPage>
  );
}

export function statusColumn(key = "status", label = "Статус"): AdminColumn {
  return {
    key,
    label,
    render: (row) => <AdminStatusBadge status={String(row[key] ?? "")} />,
  };
}

export function dateColumn(key: string, label: string): AdminColumn {
  return {
    key,
    label,
    render: (row) => {
      const value = row[key];
      if (!value) return "";
      return new Date(String(value)).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" });
    },
  };
}
