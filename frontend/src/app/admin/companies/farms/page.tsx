"use client";

import { AdminTablePage, statusColumn } from "@/components/admin/admin-table-page";
import { listAdminFarms } from "@/lib/api/admin";

export default function AdminFarmsPage() {
  return (
    <AdminTablePage
      title="Хозяйства"
      description="Фермерские и аграрные организации, производственный профиль и статус проверки."
      load={() => listAdminFarms() as unknown as Promise<Array<Record<string, unknown>>>}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Название" },
        { key: "type", label: "Тип" },
        { key: "inn", label: "ИНН" },
        { key: "region", label: "Регион" },
        { key: "profile_completion_percent", label: "Заполненность" },
        statusColumn("verification_status", "Проверка"),
      ]}
    />
  );
}
