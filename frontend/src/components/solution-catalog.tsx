"use client";

import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { listPublicSolutions } from "@/lib/api/solutions";
import type { SolutionSummary } from "@/lib/types";

export function SolutionCatalog({ inApp = false }: { inApp?: boolean }) {
  const [solutions, setSolutions] = useState<SolutionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    listPublicSolutions()
      .then(setSolutions)
      .catch(() => setSolutions([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return solutions;
    return solutions.filter((solution) =>
      [solution.name, solution.short_description, solution.supplier_name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized)),
    );
  }, [query, solutions]);

  return (
    <div className={inApp ? "grid gap-6" : "mx-auto max-w-6xl px-5 py-8"}>
      <section className={inApp ? "grid gap-4" : "rounded-[28px] bg-[#f5fbf8] p-6 md:p-10"}>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-600">Каталог</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal md:text-5xl">Цифровые решения</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
              Опубликованные решения поставщиков: можно изучить карточку, оставить заявку или зарегистрироваться для работы через кабинет.
            </p>
          </div>
          {!inApp ? (
            <Link href="/app" className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700">
              Войти в платформу
            </Link>
          ) : null}
        </div>
        <label className="mt-6 flex h-12 max-w-xl items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 shadow-sm focus-within:border-emerald-500">
          <Search size={20} className="text-zinc-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по названию, описанию или поставщику"
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-zinc-400"
          />
        </label>
      </section>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-56 animate-pulse rounded-[24px] bg-zinc-100" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((solution) => (
            <Link
              key={solution.id}
              href={`/solutions/${solution.id}`}
              className="group rounded-[24px] bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Sparkles size={23} />
                </span>
                <ArrowRight className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" size={22} />
              </div>
              <h2 className="mt-5 text-xl font-black">{solution.name}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
                {solution.short_description || "Описание появится после заполнения карточки поставщиком."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-zinc-500">
                {solution.supplier_name ? <span className="rounded-full bg-zinc-100 px-3 py-1">{solution.supplier_name}</span> : null}
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Опубликовано</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] bg-white p-8 text-center shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
          <p className="text-xl font-bold">Решений пока нет</p>
          <p className="mt-2 text-sm text-zinc-500">После публикации поставщиками они появятся в каталоге.</p>
        </div>
      )}
    </div>
  );
}
