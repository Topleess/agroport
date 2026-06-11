"use client";

import { AdminTablePage, statusColumn } from "@/components/admin/admin-table-page";
import { listAdminSuppliers } from "@/lib/api/admin";

export default function AdminSuppliersPage() {
  return (
    <AdminTablePage
      title="Поставщики"
      description="Компании-поставщики, интеграторы и партнеры с решениями для каталога."
      load={() => listAdminSuppliers() as unknown as Promise<Array<Record<string, unknown>>>}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Компания" },
        { key: "type", label: "Тип" },
        { key: "inn", label: "ИНН" },
        { key: "region", label: "Регион" },
        statusColumn("verification_status", "Проверка"),
      ]}
    />
  );
}
