"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/admin-shell";
import { AdminCard, AdminCardSkeleton, AdminEmptyState, AdminStatusBadge } from "@/components/admin/admin-ui";
import { listAdminDictionaries, type DictionarySummary } from "@/lib/api/admin";

export default function AdminDictionariesPage() {
  const [items, setItems] = useState<DictionarySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAdminDictionaries()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminPage title="Словари" description="Контролируемые значения для форм, фильтров, скоринга и модерации.">
      {loading ? (
        <AdminCardSkeleton count={6} />
      ) : items.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((dictionary) => (
            <Link key={dictionary.code} href={`/admin/dictionaries/${dictionary.code}`}>
              <AdminCard className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">{dictionary.name}</h2>
                    <p className="mt-2 text-sm text-zinc-500">{dictionary.code}</p>
                  </div>
                  <AdminStatusBadge status={dictionary.status} />
                </div>
                <div className="mt-5 grid gap-2 text-sm text-zinc-600">
                  <p>{dictionary.items_count} значений</p>
                  <p>{dictionary.is_system ? "Системный" : "Пользовательский"}</p>
                  <p>{dictionary.is_locked ? "Заблокирован" : "Редактируемый"}</p>
                </div>
              </AdminCard>
            </Link>
          ))}
        </div>
      ) : (
        <AdminEmptyState title="Словари не найдены" description="После seed из Excel здесь появятся справочники и их значения." />
      )}
    </AdminPage>
  );
}
