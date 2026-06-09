import Link from "next/link";
import { PublicShell } from "@/components/platform-shell";
import { Field } from "@/components/cards";
import { financePrograms } from "@/lib/mock-data";

export default function FinancePage() {
  return (
    <PublicShell eyebrow="Финансы • Банки и инвестиции" title="Инвестиции и кредитование" description="Льготные кредиты, гарантии МСП, банковские программы и частные инвестиционные предложения для АПК.">
      <section className="grid gap-5">
        {financePrograms.map((item) => (
          <article key={`${item.bank}-${item.product}`} className="rounded-[24px] border border-zinc-200 bg-white p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className={`grid size-14 shrink-0 place-items-center rounded-2xl text-sm font-black ${item.logoTone}`}>
                  {item.logo}
                </div>
                <div className="min-w-0">
                  <span className="rounded-lg bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">{item.bank}</span>
                  <h2 className="mt-4 text-2xl font-semibold">{item.product}</h2>
                </div>
              </div>
              <Link href={`/finance/${item.id}`} className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#24a8f2] px-5 text-sm font-semibold text-white">
                Открыть условия
              </Link>
            </div>
            <div className="mt-6 grid gap-4 border-t border-zinc-100 pt-5 md:grid-cols-5">
              <Field label="Сумма" value={item.amount} />
              <Field label="Ставка" value={item.rate} />
              <Field label="Срок" value={item.term} />
              <Field label="Требования" value={item.requirement} />
              <Field label="Цель" value={item.goal} />
            </div>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}
