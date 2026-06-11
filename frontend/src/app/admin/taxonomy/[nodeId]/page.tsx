"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/admin-shell";
import { AdminCard, AdminEmptyState, AdminStatusBadge } from "@/components/admin/admin-ui";
import { listAdminTaxonomy, type TaxonomyNode } from "@/lib/api/admin";

export default function AdminTaxonomyNodePage() {
  const params = useParams<{ nodeId: string }>();
  const [node, setNode] = useState<TaxonomyNode | null>(null);

  useEffect(() => {
    listAdminTaxonomy().then((items) => setNode(items.find((item) => String(item.id) === params.nodeId) ?? null));
  }, [params.nodeId]);

  return (
    <AdminPage title={node?.name ?? "Узел таксономии"} description={node?.external_id ?? params.nodeId}>
      {node ? (
        <div className="grid gap-4">
          <AdminCard>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">L{node.level}</p>
                <h2 className="mt-1 text-xl font-bold">{node.name}</h2>
                <p className="mt-2 text-sm text-zinc-500">{node.slug}</p>
              </div>
              <AdminStatusBadge status={node.is_selectable ? "selectable" : "group"} />
            </div>
          </AdminCard>
          <AdminCard>
            <p className="text-sm text-zinc-500">{node.solutions_count} связанных решений</p>
          </AdminCard>
        </div>
      ) : (
        <AdminEmptyState title="Узел не найден" description="Проверь id в URL." />
      )}
    </AdminPage>
  );
}
