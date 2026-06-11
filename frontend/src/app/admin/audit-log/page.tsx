"use client";

import { AdminTablePage, dateColumn } from "@/components/admin/admin-table-page";
import { listAdminAuditLog } from "@/lib/api/admin";

export default function AdminAuditLogPage() {
  return (
    <AdminTablePage
      title="Audit log"
      description="Критичные действия админов, before/after snapshots, риск и контекст."
      load={() => listAdminAuditLog() as unknown as Promise<Array<Record<string, unknown>>>}
      columns={[
        { key: "id", label: "ID" },
        { key: "admin_email", label: "Админ" },
        { key: "action", label: "Действие" },
        { key: "object_type", label: "Тип" },
        { key: "object_id", label: "Объект" },
        { key: "risk_level", label: "Risk" },
        dateColumn("created_at", "Создано"),
      ]}
    />
  );
}
