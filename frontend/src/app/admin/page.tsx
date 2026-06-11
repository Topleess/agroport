"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/admin-shell";
import { AdminCard, AdminCardSkeleton, AdminStatCard, AdminStatusBadge, AdminTable, AdminTableSkeleton } from "@/components/admin/admin-ui";
import { getAdminDashboard, listAdminModeration, type AdminDashboard, type ModerationItem } from "@/lib/api/admin";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminDashboard | null>(null);
  const [moderation, setModeration] = useState<ModerationItem[]>([]);

  useEffect(() => {
    getAdminDashboard().then(setMetrics);
    listAdminModeration().then((items) => setModeration(items.slice(0, 6)));
  }, []);

  return (
    <AdminPage title="Главная" description="Операционный обзор платформы: пользователи, компании, решения, модерация, справочники и таксономия.">
      {metrics ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Пользователи" value={metrics.users} href="/admin/users" />
          <AdminStatCard label="Хозяйства" value={metrics.farms} href="/admin/companies/farms" />
          <AdminStatCard label="Решения" value={metrics.solutions} hint={`${metrics.published_solutions} опубликовано`} href="/admin/solutions" />
          <AdminStatCard label="На модерации" value={metrics.pending_moderation} href="/admin/moderation" />
          <AdminStatCard label="Словари" value={metrics.dictionaries} hint={`${metrics.dictionary_items} значений`} href="/admin/dictionaries" />
          <AdminStatCard label="Таксономия" value={metrics.taxonomy_nodes} href="/admin/taxonomy" />
          <AdminStatCard label="Заявки фермеров" value={metrics.farmer_requests} href="/admin/farmer-requests" />
          <AdminStatCard label="Audit events" value={metrics.audit_events} href="/admin/audit-log" />
        </div>
      ) : (
        <AdminCardSkeleton count={8} />
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <AdminCard>
          <h2 className="text-lg font-bold">Последняя модерация</h2>
          <div className="mt-4">
            {metrics ? (
              <AdminTable
                rows={moderation as unknown as Array<Record<string, unknown>>}
                columns={[
                  { key: "id", label: "ID" },
                  { key: "object_type", label: "Тип" },
                  { key: "title", label: "Объект" },
                  { key: "status", label: "Статус", render: (row) => <AdminStatusBadge status={String(row.status)} /> },
                  { key: "priority", label: "Приоритет" },
                ]}
              />
            ) : (
              <AdminTableSkeleton rows={4} columns={5} />
            )}
          </div>
        </AdminCard>
        <AdminCard>
          <h2 className="text-lg font-bold">Следующие подключения</h2>
          <div className="mt-4 rounded-xl bg-zinc-50 px-4 py-5 text-sm font-semibold text-zinc-500">
            Нет данных для отображения. Здесь появятся ближайшие интеграции и задачи после подключения рабочего процесса.
          </div>
        </AdminCard>
      </div>
    </AdminPage>
  );
}
