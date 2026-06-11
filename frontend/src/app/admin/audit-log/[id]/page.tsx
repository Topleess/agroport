"use client";

import { useParams } from "next/navigation";
import { AdminPage } from "@/components/admin/admin-shell";
import { AdminEmptyState } from "@/components/admin/admin-ui";

export default function AdminAuditLogDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <AdminPage title="Audit log" description={params.id}>
      <AdminEmptyState title="Детальная запись в разработке" description="Основной журнал уже доступен в таблице; detail endpoint добавим следующим шагом." />
    </AdminPage>
  );
}
