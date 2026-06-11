"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/admin-shell";
import { AdminCard, AdminEmptyState } from "@/components/admin/admin-ui";
import { listAdminMatching, type MatchingRun } from "@/lib/api/admin";

export default function AdminMatchingDetailPage() {
  const params = useParams<{ requestId: string }>();
  const [run, setRun] = useState<MatchingRun | null>(null);

  useEffect(() => {
    listAdminMatching().then((items) => setRun(items.find((item) => String(item.farmer_request_id) === params.requestId) ?? null));
  }, [params.requestId]);

  return (
    <AdminPage title="Подбор решений" description={run?.farmer_request_title ?? params.requestId}>
      {run ? (
        <AdminCard className="grid gap-2 text-sm text-zinc-600">
          <p>Статус: {run.status}</p>
          <p>Решений: {run.results_count}</p>
          <p>Best score: {run.best_score ?? "—"}</p>
        </AdminCard>
      ) : (
        <AdminEmptyState title="Подбор не найден" description="Проверь requestId в URL." />
      )}
    </AdminPage>
  );
}
