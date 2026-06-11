"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/admin-shell";
import { AdminCard, AdminEmptyState, AdminStatusBadge, AdminTable, AdminTableSkeleton } from "@/components/admin/admin-ui";
import { getAdminDictionary, updateAdminDictionaryItem, type DictionaryDetail } from "@/lib/api/admin";

export default function AdminDictionaryDetailPage() {
  const params = useParams<{ code: string }>();
  const [dictionary, setDictionary] = useState<DictionaryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.code) return;
    getAdminDictionary(params.code)
      .then(setDictionary)
      .finally(() => setLoading(false));
  }, [params.code]);

  return (
    <AdminPage title={dictionary?.name ?? "Словарь"} description={dictionary?.description ?? params.code}>
      {loading ? (
        <AdminTableSkeleton rows={8} columns={5} />
      ) : dictionary ? (
        <div className="grid gap-6">
          <AdminCard>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">{dictionary.code}</p>
                <h2 className="mt-1 text-xl font-bold">{dictionary.name}</h2>
                <p className="mt-2 text-sm text-zinc-500">{dictionary.items_count} значений</p>
              </div>
              <AdminStatusBadge status={dictionary.status} />
            </div>
          </AdminCard>
          <AdminTable
            rows={dictionary.items as unknown as Array<Record<string, unknown>>}
            columns={[
              { key: "code", label: "Code" },
              { key: "label", label: "Label" },
              { key: "status", label: "Status" },
              { key: "sort_order", label: "Sort" },
              { key: "parent_code", label: "Parent" },
            ]}
            editableFields={[
              { key: "code", label: "Code" },
              { key: "label", label: "Label" },
              { key: "description", label: "Description" },
              { key: "status", label: "Status" },
              { key: "sort_order", label: "Sort order", type: "number" },
              { key: "parent_code", label: "Parent code" },
            ]}
            onRowSave={async (row) => {
              return updateAdminDictionaryItem(dictionary.code, row.id as string | number, {
                code: String(row.code ?? ""),
                label: String(row.label ?? ""),
                description: row.description ? String(row.description) : null,
                status: String(row.status ?? "active"),
                sort_order: Number(row.sort_order ?? 0),
                parent_code: row.parent_code ? String(row.parent_code) : null,
              }) as unknown as Promise<Record<string, unknown>>;
            }}
          />
        </div>
      ) : (
        <AdminEmptyState title="Словарь не найден" description="Проверь код словаря в URL." />
      )}
    </AdminPage>
  );
}
