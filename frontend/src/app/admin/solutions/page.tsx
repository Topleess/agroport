"use client";

import { AdminTablePage, statusColumn, dateColumn } from "@/components/admin/admin-table-page";
import { listAdminSolutions } from "@/lib/api/admin";

export default function AdminSolutionsPage() {
  return (
    <AdminTablePage
      title="Решения"
      description="Карточки решений поставщиков, таксономия, подотрасли и статусы публикации."
      load={() => listAdminSolutions() as unknown as Promise<Array<Record<string, unknown>>>}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Название" },
        { key: "supplier_name", label: "Поставщик" },
        { key: "payment_model", label: "Модель оплаты" },
        { key: "evidence_level", label: "Доказанность" },
        statusColumn("status", "Статус"),
        dateColumn("updated_at", "Обновлено"),
      ]}
    />
  );
}
