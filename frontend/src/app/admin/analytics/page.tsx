"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/admin-shell";
import { AdminCard, AdminCardSkeleton, AdminStatCard, AdminTable, AdminTableSkeleton } from "@/components/admin/admin-ui";
import { getAdminAnalytics, type AnalyticsPayload } from "@/lib/api/admin";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);

  useEffect(() => {
    getAdminAnalytics().then(setData);
  }, []);

  return (
    <AdminPage title="Аналитика" description="Покрытие таксономии решениями, незакрытые категории и базовые метрики платформы.">
      {data ? (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Пользователи" value={data.metrics.users} href="/admin/users" />
            <AdminStatCard label="Хозяйства" value={data.metrics.farms} href="/admin/companies/farms" />
            <AdminStatCard label="Решения" value={data.metrics.published_solutions} href="/admin/solutions" />
            <AdminStatCard label="На модерации" value={data.metrics.pending_moderation} href="/admin/moderation" />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <AdminCard>
              <h2 className="text-lg font-bold">Незакрытые категории</h2>
              <p className="mt-1 text-sm text-zinc-500">L4-разделы, где пока нет решений поставщиков.</p>
              <div className="mt-4">
                {data.white_spots.length ? (
                  <AdminTable
                    rows={data.white_spots}
                    columns={[
                      { key: "l4_id", label: "L4 ID" },
                      { key: "l4_name", label: "Категория" },
                      { key: "solutions_count", label: "Всего решений" },
                      { key: "published_solutions_count", label: "Опубликовано" },
                    ]}
                  />
                ) : (
                  <p className="rounded-xl bg-zinc-50 px-4 py-5 text-sm font-semibold text-zinc-500">Нет данных.</p>
                )}
              </div>
            </AdminCard>
            <AdminCard>
              <h2 className="text-lg font-bold">Покрытие L4</h2>
              <p className="mt-1 text-sm text-zinc-500">Сколько решений привязано к категориям таксономии.</p>
              <div className="mt-4">
                {data.coverage.length ? (
                  <AdminTable
                    rows={data.coverage}
                    columns={[
                      { key: "l4_id", label: "L4 ID" },
                      { key: "l4_name", label: "Категория" },
                      { key: "solutions_count", label: "Всего решений" },
                      { key: "published_solutions_count", label: "Опубликовано" },
                      {
                        key: "coverage_status",
                        label: "Статус",
                        render: (row) => (row.coverage_status === "empty" ? "Нет решений" : "Низкое покрытие"),
                      },
                    ]}
                  />
                ) : (
                  <p className="rounded-xl bg-zinc-50 px-4 py-5 text-sm font-semibold text-zinc-500">Нет данных.</p>
                )}
              </div>
            </AdminCard>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          <AdminCardSkeleton count={4} />
          <div className="grid gap-6 xl:grid-cols-2">
            <AdminTableSkeleton rows={6} columns={4} />
            <AdminTableSkeleton rows={6} columns={5} />
          </div>
        </div>
      )}
    </AdminPage>
  );
}
