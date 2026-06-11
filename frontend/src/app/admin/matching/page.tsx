"use client";

import { AdminTablePage, statusColumn, dateColumn } from "@/components/admin/admin-table-page";
import { listAdminMatching } from "@/lib/api/admin";

export default function AdminMatchingPage() {
  return (
    <AdminTablePage
      title="Подбор решений"
      description="Последние запуски матчинга, score по заявкам и результаты ранжирования."
      load={() => listAdminMatching() as unknown as Promise<Array<Record<string, unknown>>>}
      columns={[
        { key: "id", label: "ID" },
        { key: "farmer_request_title", label: "Заявка" },
        { key: "results_count", label: "Решений" },
        { key: "best_score", label: "Best score" },
        { key: "triggered_by", label: "Кто запустил" },
        statusColumn("status", "Статус"),
        dateColumn("updated_at", "Обновлено"),
      ]}
    />
  );
}
