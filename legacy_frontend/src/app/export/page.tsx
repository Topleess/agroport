import Link from "next/link";
import { PublicShell } from "@/components/platform-shell";
import { Field } from "@/components/cards";
import { exportPrograms } from "@/lib/mock-data";

export default function ExportPage() {
  return (
    <PublicShell eyebrow="Экспорт • Программы АПК" title="Программы для экспортеров" description="Компенсация логистики, сертификация, выставки и экспортное финансирование через профильные институты поддержки.">
      <section className="grid gap-5">
        {exportPrograms.map((item) => (
          <article key={item.title} className="rounded-[24px] border border-zinc-200 bg-white p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">{item.status}</span>
                <h2 className="mt-4 text-2xl font-semibold">{item.title}</h2>
              </div>
              <Link href={`/export/${item.id}`} className="h-11 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white">Открыть условия</Link>
            </div>
            <div className="mt-6 grid gap-4 border-t border-zinc-100 pt-5 md:grid-cols-3">
              <Field label="Размер" value={item.amount} />
              <Field label="Организатор" value={item.organizer} />
              <Field label="Назначение" value={item.goal} />
            </div>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}
