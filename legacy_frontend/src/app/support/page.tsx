"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertCircle, Search } from "lucide-react";
import { PublicShell } from "@/components/platform-shell";
import { SupportCard } from "@/components/cards";
import { farmerProfile, supportMeasures } from "@/lib/mock-data";

const categories = ["Все", "Грант", "Субсидия", "Лизинг", "Грант + кредит"];

export default function SupportPage() {
  const [category, setCategory] = useState("Все");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return supportMeasures.filter((item) => {
      const categoryMatch = category === "Все" || item.category === category;
      const queryMatch = `${item.title} ${item.goal} ${item.organizer}`.toLowerCase().includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  return (
    <PublicShell>
      <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <p className="mb-4 text-sm text-zinc-400">Господдержка • Каталог</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-normal md:text-6xl">Субсидии и гранты</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-500">
            Каталог мер поддержки с рекомендациями по профилю хозяйства, фильтрами и детальными условиями подачи.
          </p>
        </div>
        <aside className="rounded-[20px] border border-emerald-100 bg-emerald-50/60 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 shrink-0 text-emerald-600" size={20} />
            <div>
              <h2 className="text-base font-semibold">Рекомендации станут точнее</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Профиль заполнен на {farmerProfile.completion}%. Не хватает данных о выручке, технике и документах.
              </p>
              <Link href="/profile?onboarding=1" className="mt-4 inline-flex h-10 items-center rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white">
                Продолжить заполнение
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`h-10 shrink-0 rounded-full border px-4 text-sm font-medium ${
                  category === item ? "border-emerald-500 text-emerald-600" : "border-zinc-200 text-zinc-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="flex h-12 items-center gap-3 rounded-xl border border-zinc-200 px-4 md:w-80">
            <Search size={19} className="text-zinc-400" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Поиск по мерам" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
        </div>

        <div className="mt-6 grid gap-5">
          {visible.map((item) => (
            <SupportCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
