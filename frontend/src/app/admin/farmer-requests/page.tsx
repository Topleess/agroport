"use client";

import { AdminTablePage, statusColumn, dateColumn } from "@/components/admin/admin-table-page";
import { listAdminFarmerRequests } from "@/lib/api/admin";

export default function AdminFarmerRequestsPage() {
  return (
    <AdminTablePage
      title="Заявки фермеров"
      description="Структурированные запросы хозяйств, которые дальше участвуют в подборе решений."
      load={() => listAdminFarmerRequests() as unknown as Promise<Array<Record<string, unknown>>>}
      columns={[
        { key: "id", label: "ID" },
        { key: "title", label: "Заявка" },
        { key: "farm_name", label: "Хозяйство" },
        { key: "region_id", label: "Регион" },
        { key: "urgency", label: "Срочность" },
        { key: "budget_rub", label: "Бюджет" },
        statusColumn("status", "Статус"),
        dateColumn("updated_at", "Обновлено"),
      ]}
    />
  );
}
