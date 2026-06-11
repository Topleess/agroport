"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/admin-shell";
import { AdminCard, AdminEmptyState, AdminStatusBadge } from "@/components/admin/admin-ui";
import { listAdminFarmerRequests, type FarmerRequest } from "@/lib/api/admin";

export default function AdminFarmerRequestPage() {
  const params = useParams<{ id: string }>();
  const [request, setRequest] = useState<FarmerRequest | null>(null);

  useEffect(() => {
    listAdminFarmerRequests().then((items) => setRequest(items.find((item) => String(item.id) === params.id) ?? null));
  }, [params.id]);

  return (
    <AdminPage title={request?.title ?? "Заявка фермера"} description={request?.farm_name ?? params.id}>
      {request ? (
        <div className="grid gap-4">
          <AdminCard>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">{request.region_id ?? "Регион не указан"}</p>
                <h2 className="mt-1 text-xl font-bold">{request.title}</h2>
                <p className="mt-2 text-sm text-zinc-500">{request.farmer_email ?? "Фермер не указан"}</p>
              </div>
              <AdminStatusBadge status={request.status} />
            </div>
          </AdminCard>
          <AdminCard className="grid gap-2 text-sm text-zinc-600">
            <p>Бюджет: {request.budget_rub ?? "—"}</p>
            <p>Проблемы: {request.problem_ids.join(", ") || "—"}</p>
            <p>Срочность: {request.urgency}</p>
          </AdminCard>
        </div>
      ) : (
        <AdminEmptyState title="Заявка не найдена" description="Проверь id в URL." />
      )}
    </AdminPage>
  );
}
