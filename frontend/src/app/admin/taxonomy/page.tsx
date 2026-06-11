"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/admin-shell";
import { AdminEmptyState, AdminStatusBadge, AdminTable, AdminTableSkeleton } from "@/components/admin/admin-ui";
import { listAdminTaxonomy, updateAdminTaxonomyNode, type TaxonomyNode } from "@/lib/api/admin";

export default function AdminTaxonomyPage() {
  const [items, setItems] = useState<TaxonomyNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAdminTaxonomy()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminPage title="Таксономия" description="Дерево L1–L4 из Excel, где L4 selectable и используется в карточках решений.">
      {loading ? (
        <AdminTableSkeleton rows={8} columns={7} />
      ) : items.length ? (
        <AdminTable
          rows={items as unknown as Array<Record<string, unknown>>}
          columns={[
            { key: "external_id", label: "ID" },
            { key: "level", label: "Уровень", render: (row) => `L${row.level}` },
            { key: "name", label: "Название" },
            { key: "parent_external_id", label: "Родитель" },
            { key: "solutions_count", label: "Решений" },
            { key: "is_selectable", label: "Тип", render: (row) => <AdminStatusBadge status={row.is_selectable ? "selectable" : "group"} /> },
            { key: "is_active", label: "Активен", render: (row) => <AdminStatusBadge status={row.is_active ? "active" : "inactive"} /> },
          ]}
          editableFields={[
            { key: "name", label: "Название" },
            { key: "description", label: "Описание" },
            { key: "notes", label: "Заметки" },
            { key: "is_selectable", label: "Выбираемый L4", type: "boolean" },
            { key: "is_active", label: "Активен", type: "boolean" },
            { key: "sort_order", label: "Сортировка", type: "number" },
          ]}
          onRowSave={async (row) => {
            const saved = await updateAdminTaxonomyNode(String(row.id), {
              name: String(row.name ?? ""),
              description: row.description ? String(row.description) : null,
              notes: row.notes ? String(row.notes) : null,
              is_selectable: Boolean(row.is_selectable),
              is_active: Boolean(row.is_active),
              sort_order: Number(row.sort_order ?? 0),
            });
            setItems((current) => current.map((item) => (item.id === saved.id ? saved : item)));
            return saved as unknown as Record<string, unknown>;
          }}
        />
      ) : (
        <AdminEmptyState title="Таксономия пока пустая" description="После seed из Excel здесь появится дерево L1–L4." />
      )}
    </AdminPage>
  );
}
