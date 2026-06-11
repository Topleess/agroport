"use client";

import { AdminTablePage, statusColumn, dateColumn } from "@/components/admin/admin-table-page";
import { listAdminModeration, updateModerationStatus } from "@/lib/api/admin";

export default function AdminModerationPage() {
  return (
    <AdminTablePage
      title="Модерация"
      description="Единая очередь объектов на проверку: решения, компании, словари, таксономия и импорты."
      load={() => listAdminModeration() as unknown as Promise<Array<Record<string, unknown>>>}
      columns={[
        { key: "id", label: "ID" },
        { key: "object_type", label: "Тип" },
        { key: "title", label: "Объект" },
        { key: "priority", label: "Приоритет" },
        statusColumn("status", "Статус"),
        { key: "comments_count", label: "Комм." },
        dateColumn("updated_at", "Обновлено"),
        {
          key: "actions",
          label: "Действия",
          render: (row) => (
            <div className="flex gap-2">
              <button className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-bold" onClick={() => updateModerationStatus(String(row.id), "approved")}>Approve</button>
              <button className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-bold" onClick={() => updateModerationStatus(String(row.id), "needs_changes")}>Needs changes</button>
            </div>
          ),
        },
      ]}
    />
  );
}
