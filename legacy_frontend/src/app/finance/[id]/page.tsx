import { notFound } from "next/navigation";
import { DetailShell } from "@/components/platform-shell";
import { DataRow } from "@/components/cards";
import { financePrograms } from "@/lib/mock-data";

export default async function FinanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = financePrograms.find((program) => program.id === id);
  if (!item) notFound();

  return (
    <DetailShell breadcrumbs={[{ label: "Главная", href: "/" }, { label: "Финансы", href: "/finance" }, { label: item.bank }]}>
      <section className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <span className="rounded-lg bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">{item.bank}</span>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-normal md:text-6xl">{item.product}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-500">
            Условия льготного финансирования для АПК. В прототипе карточка показывает параметры из собранной фактуры и помогает понять, подходит ли программа хозяйству.
          </p>
        </div>
        <aside className="rounded-[28px] border border-sky-100 bg-sky-50 p-6">
          <p className="text-sm text-zinc-500">Предварительная ставка</p>
          <p className="mt-2 text-3xl font-semibold">{item.rate}</p>
          <button className="mt-7 h-12 w-full rounded-xl bg-[#24a8f2] text-sm font-semibold text-white">Рассчитать заявку</button>
        </aside>
      </section>
      <section className="mt-10 rounded-[28px] border border-zinc-200 p-6">
        <h2 className="text-2xl font-semibold">Условия программы</h2>
        <dl className="mt-5 divide-y divide-zinc-100">
          <DataRow label="Сумма" value={item.amount} />
          <DataRow label="Срок" value={item.term} />
          <DataRow label="Требования" value={item.requirement} />
          <DataRow label="Целевое назначение" value={item.goal} />
          <DataRow label="Что потребуется" value="анкета, документы хозяйства, финансовая отчетность, обеспечение по решению банка" />
        </dl>
      </section>
    </DetailShell>
  );
}
