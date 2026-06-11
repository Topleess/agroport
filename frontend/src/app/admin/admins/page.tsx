"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/admin-shell";
import { dateColumn, statusColumn } from "@/components/admin/admin-table-page";
import { AdminCard, AdminTable, AdminTableSkeleton } from "@/components/admin/admin-ui";
import { assignAdminRole, listAdminUsers, removeAdminRole, updateAdminUser, type AdminUser } from "@/lib/api/admin";

export default function AdminAdminsPage() {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAdminUsers()
      .then((users) => setRows(users.filter((user) => user.is_admin || user.admin_role)))
      .finally(() => setLoading(false));
  }, []);

  async function addAdmin() {
    setError("");
    try {
      await assignAdminRole({ email, role });
      setEmail("");
      setRole("admin");
      const users = await listAdminUsers();
      setRows(users.filter((user) => user.is_admin || user.admin_role));
    } catch {
      setError("Не удалось выдать права. Проверь email существующего пользователя.");
    }
  }

  return (
    <AdminPage title="Админы" description="Пользователи с доступом в admin-контур и их роли.">
      <div className="grid gap-6">
        <AdminCard>
          <h2 className="text-lg font-bold">Добавить администратора</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email существующего пользователя"
              className="h-11 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-rose-300"
            />
            <input
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="role"
              className="h-11 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-rose-300"
            />
            <button type="button" className="h-11 rounded-xl bg-rose-600 px-5 text-sm font-black text-white" onClick={addAdmin}>
              Выдать права
            </button>
          </div>
          {error ? <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p> : null}
        </AdminCard>
        {loading ? (
          <AdminTableSkeleton rows={5} columns={7} />
        ) : (
          <AdminTable
            rows={rows as unknown as Array<Record<string, unknown>>}
            columns={[
              { key: "full_name", label: "ФИО" },
              { key: "email", label: "Email" },
              { key: "admin_role", label: "Role" },
              { key: "organizations_count", label: "Связи" },
              statusColumn("is_active", "Активен"),
              dateColumn("created_at", "Создан"),
              {
                key: "actions",
                label: "Действия",
                render: (row) => (
                  <button
                    type="button"
                    className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeAdminRole(String(row.id)).then(() =>
                        listAdminUsers().then((users) => setRows(users.filter((user) => user.is_admin || user.admin_role))),
                      );
                    }}
                  >
                    Снять доступ
                  </button>
                ),
              },
            ]}
            editableFields={[
              { key: "full_name", label: "ФИО" },
              { key: "email", label: "Email" },
              { key: "admin_role", label: "Role" },
              { key: "is_active", label: "Активен", type: "boolean" },
            ]}
            onRowSave={(row) =>
              updateAdminUser(String(row.id), {
                full_name: String(row.full_name ?? ""),
                email: String(row.email ?? ""),
                admin_role: row.admin_role ? String(row.admin_role) : null,
                is_active: Boolean(row.is_active),
              }) as unknown as Promise<Record<string, unknown>>
            }
          />
        )}
      </div>
    </AdminPage>
  );
}
