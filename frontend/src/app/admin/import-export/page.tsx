"use client";

import { AdminTablePage, statusColumn } from "@/components/admin/admin-table-page";
import { listAdminImportJobs } from "@/lib/api/admin";

export default function AdminImportExportPage() {
  return (
    <AdminTablePage
      title="Импорт / Экспорт"
      description="Очередь импортов, preview, статусы, результаты и история обработанных файлов."
      load={() => listAdminImportJobs() as unknown as Promise<Array<Record<string, unknown>>>}
      columns={[
        { key: "id", label: "ID" },
        { key: "file_name", label: "Файл" },
        { key: "import_type", label: "Тип" },
        { key: "total_rows", label: "Строк" },
        { key: "error_rows", label: "Ошибок" },
        statusColumn("status", "Статус"),
      ]}
    />
  );
}
