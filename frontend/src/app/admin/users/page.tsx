"use client";

import { AdminTablePage, dateColumn, statusColumn } from "@/components/admin/admin-table-page";
import { listAdminUsers, updateAdminUser } from "@/lib/api/admin";

export default function AdminUsersPage() {
  return (
    <AdminTablePage
      title="Пользователи"
      description="Все пользователи платформы, роли, активность и связи с организациями."
      load={() => listAdminUsers() as unknown as Promise<Array<Record<string, unknown>>>}
      columns={[
        { key: "id", label: "ID" },
        { key: "full_name", label: "ФИО" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Телефон" },
        { key: "admin_role", label: "Admin role" },
        { key: "organizations_count", label: "Орг." },
        statusColumn("is_active", "Активен"),
        dateColumn("created_at", "Создан"),
      ]}
      editableFields={[
        { key: "full_name", label: "ФИО" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Телефон" },
        { key: "admin_role", label: "Admin role" },
        { key: "is_active", label: "Активен", type: "boolean" },
      ]}
      onRowSave={(row) =>
        updateAdminUser(String(row.id), {
          full_name: String(row.full_name ?? ""),
          email: String(row.email ?? ""),
          phone: row.phone ? String(row.phone) : null,
          admin_role: row.admin_role ? String(row.admin_role) : null,
          is_active: Boolean(row.is_active),
        }) as unknown as Promise<Record<string, unknown>>
      }
    />
  );
}
