"use client";

import { useState } from "react";
import { ListingModal } from "@/components/listing-modal";
import { CabinetShell } from "@/components/platform-shell";
import { cooperationRequests } from "@/lib/mock-data";

export default function ProfileRequestsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <CabinetShell eyebrow="Кабинет • Запросы" title="Мои запросы" description="Потребности хозяйства: закупки, поиск покупателей, кооперация и услуги.">
      <div className="mb-6 flex justify-end">
        <button onClick={() => setModalOpen(true)} className="h-11 rounded-xl bg-[#17c7c8] px-5 text-sm font-semibold text-white">
          Добавить
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {cooperationRequests.map((item) => (
          <article key={item.title} className="rounded-3xl border border-zinc-200 p-6">
            <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm text-zinc-600">{item.type}</span>
            <h2 className="mt-4 text-2xl font-semibold">{item.title}</h2>
            <div className="mt-4 grid gap-3 text-sm text-zinc-500 sm:grid-cols-2">
              <p><span className="font-semibold text-zinc-800">Объем:</span> {item.volume}</p>
              <p><span className="font-semibold text-zinc-800">Срок:</span> {item.deadline}</p>
              <p className="sm:col-span-2"><span className="font-semibold text-zinc-800">Контрагент:</span> {item.buyer}</p>
            </div>
            <button className="mt-5 h-11 rounded-xl bg-[#24a8f2] px-5 text-sm font-semibold text-white">Редактировать</button>
          </article>
        ))}
      </section>

      {modalOpen ? <ListingModal type="request" onClose={() => setModalOpen(false)} /> : null}
    </CabinetShell>
  );
}
