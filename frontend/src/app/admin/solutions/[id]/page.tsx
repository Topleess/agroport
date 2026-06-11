"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/admin-shell";
import { AdminCard, AdminEmptyState, AdminStatusBadge } from "@/components/admin/admin-ui";
import { listAdminSolutions, type AdminSolution } from "@/lib/api/admin";

export default function AdminSolutionPage() {
  const params = useParams<{ id: string }>();
  const [solution, setSolution] = useState<AdminSolution | null>(null);

  useEffect(() => {
    listAdminSolutions().then((items) => setSolution(items.find((item) => String(item.id) === params.id) ?? null));
  }, [params.id]);

  return (
    <AdminPage title={solution?.name ?? "Решение"} description={solution?.supplier_name ?? params.id}>
      {solution ? (
        <div className="grid gap-4">
          <AdminCard>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">{solution.payment_model ?? "Без модели оплаты"}</p>
                <h2 className="mt-1 text-xl font-bold">{solution.name}</h2>
                <p className="mt-2 text-sm text-zinc-500">{solution.short_description}</p>
              </div>
              <AdminStatusBadge status={solution.status} />
            </div>
          </AdminCard>
          <AdminCard className="grid gap-2 text-sm text-zinc-600">
            <p>L4: {solution.taxonomy_l4_ids.join(", ") || "—"}</p>
            <p>Подотрасли: {solution.subsector_ids.join(", ") || "—"}</p>
            <p>Проблемы: {solution.problem_ids.join(", ") || "—"}</p>
          </AdminCard>
        </div>
      ) : (
        <AdminEmptyState title="Решение не найдено" description="Проверь id в URL." />
      )}
    </AdminPage>
  );
}
