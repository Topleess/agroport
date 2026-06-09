"use client";

import { useState } from "react";
import { ListingModal } from "@/components/listing-modal";
import { CabinetShell } from "@/components/platform-shell";
import { marketplaceItems } from "@/lib/mock-data";

export default function ProfileProductsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <CabinetShell eyebrow="Кабинет • Товары" title="Мои товары" description="Позиции хозяйства, которые можно разместить или подготовить к публикации в витрине.">
      <div className="mb-6 flex justify-end">
        <button onClick={() => setModalOpen(true)} className="h-11 rounded-xl bg-[#17c7c8] px-5 text-sm font-semibold text-white">
          Добавить
        </button>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        {marketplaceItems.slice(0, 3).map((item) => (
          <article key={item.title} className="rounded-3xl border border-zinc-200 p-6">
            <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm text-zinc-600">{item.type}</span>
            <h2 className="mt-4 text-2xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-xl font-semibold text-[#1595b9]">{item.price}</p>
            <p className="mt-3 text-sm text-zinc-500">{item.tag}</p>
            <button className="mt-5 h-11 rounded-xl bg-[#24a8f2] px-5 text-sm font-semibold text-white">Редактировать</button>
          </article>
        ))}
      </section>
      {modalOpen ? <ListingModal type="product" onClose={() => setModalOpen(false)} /> : null}
    </CabinetShell>
  );
}
