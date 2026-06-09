"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ListingModal } from "@/components/listing-modal";
import { PublicShell } from "@/components/platform-shell";
import { marketplaceItems } from "@/lib/mock-data";

const categories = ["Все", "Продукция", "Корма", "Техника", "Цифровой сервис"];

export default function MarketplacePage() {
  const [modal, setModal] = useState<"product" | "request" | null>(null);

  return (
    <PublicShell eyebrow="Витрина • Товары и решения" title="Маркетплейс и цифровая витрина" description="Товары фермеров, предложения компаний, техника, корма и сервисы для ведения хозяйства.">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => <button key={item} className="h-10 shrink-0 rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-600 first:border-emerald-500 first:text-emerald-600">{item}</button>)}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button onClick={() => setModal("product")} className="h-11 rounded-xl bg-[#17c7c8] px-5 text-sm font-semibold text-white">
            Добавить товар
          </button>
          <button onClick={() => setModal("request")} className="h-11 rounded-xl border border-zinc-200 px-5 text-sm font-semibold text-zinc-700">
            Добавить запрос
          </button>
          <label className="flex h-12 items-center gap-3 rounded-xl border border-zinc-200 px-4 sm:w-72">
            <Search size={19} className="text-zinc-400" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Поиск" />
          </label>
        </div>
      </div>
      <section className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {marketplaceItems.map(({ title, type, price, seller, region, tag, icon: Icon }) => (
          <article key={title} className="rounded-[24px] border border-zinc-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><Icon size={24} /></div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500">{type}</span>
            </div>
            <h3 className="mt-5 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-2xl font-semibold text-[#1595b9]">{price}</p>
            <p className="mt-4 text-sm text-zinc-500">{seller} • {region}</p>
            <p className="mt-2 text-sm text-emerald-700">{tag}</p>
            <button className="mt-5 h-11 rounded-xl bg-[#24a8f2] px-5 text-sm font-semibold text-white">Открыть детали</button>
          </article>
        ))}
      </section>
      {modal ? <ListingModal type={modal} onClose={() => setModal(null)} /> : null}
    </PublicShell>
  );
}
