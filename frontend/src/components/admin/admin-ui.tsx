"use client";

import Link from "next/link";
import { X, Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

export function AdminCard({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function AdminStatCard({ label, value, hint, href }: { label: string; value: string | number; hint?: string; href?: string }) {
  const content = (
    <AdminCard>
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
      {hint ? <p className="mt-2 text-sm text-zinc-500">{hint}</p> : null}
    </AdminCard>
  );
  if (!href) return content;
  return (
    <Link href={href} className="block rounded-2xl transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-300">
      {content}
    </Link>
  );
}

export function AdminStatusBadge({ status }: { status: string }) {
  const tone = status.includes("reject") || status.includes("failed") || status.includes("blocked")
    ? "bg-rose-50 text-rose-700"
    : status.includes("pending") || status.includes("submitted") || status.includes("review")
      ? "bg-amber-50 text-amber-700"
      : status.includes("verified") || status.includes("active") || status.includes("published") || status.includes("completed")
        ? "bg-emerald-50 text-emerald-700"
        : "bg-zinc-100 text-zinc-600";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>{status}</span>;
}

export function AdminEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <AdminCard className="grid min-h-52 place-items-center text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-zinc-50 text-zinc-400">
          <Inbox size={24} />
        </span>
        <h2 className="mt-4 text-lg font-bold">{title}</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">{description}</p>
      </div>
    </AdminCard>
  );
}

export function AdminTableSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
      <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-3">
        <div className="h-4 w-44 animate-pulse rounded bg-zinc-200" />
      </div>
      <div className="divide-y divide-zinc-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-4 px-4 py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(120px, 1fr))` }}>
            {Array.from({ length: columns }).map((__, columnIndex) => (
              <div key={columnIndex} className="h-4 animate-pulse rounded bg-zinc-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <AdminCard key={index}>
          <div className="h-4 w-28 animate-pulse rounded bg-zinc-100" />
          <div className="mt-4 h-8 w-16 animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-36 animate-pulse rounded bg-zinc-100" />
        </AdminCard>
      ))}
    </div>
  );
}

export function AdminTable({
  columns,
  rows,
  getKey,
  pageSize = 12,
  editableFields = [],
  onRowSave,
  getRowHref,
}: {
  columns: Array<{ key: string; label: string; render?: (row: Record<string, unknown>) => ReactNode }>;
  rows: Array<Record<string, unknown>>;
  getKey?: (row: Record<string, unknown>) => string | number;
  pageSize?: number;
  editableFields?: Array<{ key: string; label: string; type?: "text" | "number" | "boolean" }>;
  onRowSave?: (row: Record<string, unknown>) => Promise<Record<string, unknown> | void>;
  getRowHref?: (row: Record<string, unknown>) => string | undefined;
}) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentRows = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [page, pageSize, rows]);

  if (!rows.length) {
    return <AdminEmptyState title="Данных пока нет" description="Раздел готов к подключению данных. После появления записей они будут отображаться в этой таблице." />;
  }

  function openRow(row: Record<string, unknown>) {
    setSelected(row);
    setDraft(row);
  }

  async function saveRow() {
    if (!selected || !onRowSave) return;
    setSaving(true);
    try {
      const saved = await onRowSave({ ...selected, ...draft });
      setSelected((saved as Record<string, unknown>) || { ...selected, ...draft });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-bold uppercase tracking-wide text-zinc-400">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="whitespace-nowrap px-4 py-3">{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {currentRows.map((row, index) => (
                <tr
                  key={getKey ? getKey(row) : String(row.id ?? index)}
                  className="cursor-pointer hover:bg-zinc-50/70"
                  onClick={() => openRow(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="max-w-[320px] px-4 py-3 align-middle text-zinc-700">
                      {column.render ? column.render(row) : String(row[column.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3 text-sm">
            <span className="font-semibold text-zinc-500">
              Страница {page} из {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-lg border border-zinc-200 px-3 py-1.5 font-bold disabled:opacity-40" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                Назад
              </button>
              <button type="button" className="rounded-lg border border-zinc-200 px-3 py-1.5 font-bold disabled:opacity-40" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
                Вперед
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {selected ? (
        <div className="fixed inset-0 z-50 bg-zinc-950/30" onClick={() => setSelected(null)}>
          <aside className="ml-auto flex h-full w-full max-w-xl flex-col bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-6 py-5">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Детали записи</p>
                <h2 className="mt-1 truncate text-xl font-black">{String(selected.name ?? selected.full_name ?? selected.title ?? selected.label ?? selected.email ?? `ID ${selected.id ?? ""}`)}</h2>
              </div>
              <button type="button" className="grid size-10 place-items-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50" onClick={() => setSelected(null)} aria-label="Закрыть">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {editableFields.length ? (
                <div className="mb-6 grid gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                  <h3 className="text-sm font-black">Редактирование</h3>
                  {editableFields.map((field) => (
                    <label key={field.key} className="grid gap-1 text-sm font-semibold text-zinc-600">
                      {field.label}
                      {field.type === "boolean" ? (
                        <select
                          value={String(draft[field.key] ?? false)}
                          onChange={(event) => setDraft((value) => ({ ...value, [field.key]: event.target.value === "true" }))}
                          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-zinc-950 outline-none focus:border-rose-300"
                        >
                          <option value="true">Да</option>
                          <option value="false">Нет</option>
                        </select>
                      ) : (
                        <input
                          type={field.type === "number" ? "number" : "text"}
                          value={String(draft[field.key] ?? "")}
                          onChange={(event) => setDraft((value) => ({ ...value, [field.key]: field.type === "number" ? Number(event.target.value) : event.target.value }))}
                          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-zinc-950 outline-none focus:border-rose-300"
                        />
                      )}
                    </label>
                  ))}
                  <button type="button" disabled={saving} className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-black text-white disabled:opacity-50" onClick={saveRow}>
                    {saving ? "Сохранение..." : "Сохранить изменения"}
                  </button>
                </div>
              ) : null}
              <div className="grid gap-3">
                {Object.entries(selected).map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-zinc-100 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">{key}</p>
                    <p className="mt-1 break-words text-sm font-semibold text-zinc-700">{formatValue(value)}</p>
                  </div>
                ))}
              </div>
            </div>
            {getRowHref?.(selected) ? (
              <div className="border-t border-zinc-100 px-6 py-4">
                <Link href={getRowHref(selected) || "#"} className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 text-sm font-black hover:bg-zinc-50">
                  Открыть страницу записи
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}
    </>
  );
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Да" : "Нет";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
