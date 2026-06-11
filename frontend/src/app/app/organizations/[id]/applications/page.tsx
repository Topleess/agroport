"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { OrganizationPageShell } from "@/components/organization-page-shell";
import { listOrganizationRequests } from "@/lib/api/solutions";
import type { FarmerRequest } from "@/lib/types";

export default function OrganizationApplicationsPage() {
  const params = useParams<{ id: string }>();
  const [items, setItems] = useState<FarmerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listOrganizationRequests(params.id)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <OrganizationPageShell organizationId={params.id}>
      <div className="grid gap-6">
        <section>
          <p className="text-sm font-semibold text-emerald-600">Кабинет организации</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">Заявки организации</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Заявки, созданные от имени этой организации или связанные с ней.
          </p>
        </section>

        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-[22px] bg-zinc-100" />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-[22px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.07)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <FileText size={21} />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-bold">{item.solution_name || "Заявка на решение"}</h2>
                      <p className="mt-1 text-sm leading-6 text-zinc-500">{item.message || "Комментарий не указан."}</p>
                      <p className="mt-2 text-xs font-semibold text-zinc-400">
                        {item.contact_name} · {item.contact_email} · {new Date(item.updated_at).toLocaleString("ru-RU")}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-zinc-100 px-3 text-xs font-bold text-zinc-700">
                    {item.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-[0_14px_40px_rgba(15,23,42,0.07)]">
            <p className="text-xl font-bold">Заявок пока нет</p>
            <p className="mt-2 text-sm text-zinc-500">Здесь появятся обращения по решениям и сервисам организации.</p>
            <Link href="/solutions" className="mt-5 inline-flex h-11 items-center rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700">
              Открыть каталог
            </Link>
          </div>
        )}
      </div>
    </OrganizationPageShell>
  );
}
