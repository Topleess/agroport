"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/admin-shell";
import { AdminCard, AdminEmptyState, AdminStatusBadge } from "@/components/admin/admin-ui";
import { listAdminModeration, updateModerationStatus, type ModerationItem } from "@/lib/api/admin";

export default function AdminModerationItemPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<ModerationItem | null>(null);

  useEffect(() => {
    listAdminModeration().then((items) => setItem(items.find((entry) => String(entry.id) === params.id) ?? null));
  }, [params.id]);

  return (
    <AdminPage title={item?.title ?? "Модерация"} description={item?.object_type ?? params.id}>
      {item ? (
        <div className="grid gap-4">
          <AdminCard>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">{item.object_type}</p>
                <h2 className="mt-1 text-xl font-bold">{item.title}</h2>
              </div>
              <AdminStatusBadge status={item.status} />
            </div>
          </AdminCard>
          <AdminCard className="flex gap-2">
            <button className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-bold" onClick={() => updateModerationStatus(item.id, "approved")}>Approve</button>
            <button className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-bold" onClick={() => updateModerationStatus(item.id, "needs_changes")}>Needs changes</button>
          </AdminCard>
        </div>
      ) : (
        <AdminEmptyState title="Задача не найдена" description="Проверь id в URL." />
      )}
    </AdminPage>
  );
}
