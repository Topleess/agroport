import { notFound } from "next/navigation";
import { DetailShell } from "@/components/platform-shell";
import { DataRow } from "@/components/cards";
import { exportPrograms } from "@/lib/mock-data";

export default async function ExportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = exportPrograms.find((program) => program.id === id);
  if (!item) notFound();

  return (
    <DetailShell breadcrumbs={[{ label: "Главная", href: "/" }, { label: "Экспорт", href: "/export" }, { label: item.title }]}>
      <section className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">{item.status}</span>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-normal md:text-6xl">{item.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-500">
            Экспортная мера поддержки для производителей и поставщиков АПК. Заявка обычно готовится через профильные экспортные институты и требует подтверждающих документов.
          </p>
        </div>
        <aside className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-6">
          <p className="text-sm text-zinc-500">Размер поддержки</p>
          <p className="mt-2 text-3xl font-semibold">{item.amount}</p>
          <button className="mt-7 h-12 w-full rounded-xl bg-emerald-500 text-sm font-semibold text-white">Проверить готовность</button>
        </aside>
      </section>
      <section className="mt-10 rounded-[28px] border border-zinc-200 p-6">
        <h2 className="text-2xl font-semibold">Условия программы</h2>
        <dl className="mt-5 divide-y divide-zinc-100">
          <DataRow label="Организатор" value={item.organizer} />
          <DataRow label="Назначение" value={item.goal} />
          <DataRow label="Подача" value="через профильный экспортный контур и отборы по объявленным срокам" />
          <DataRow label="Документы" value="контракт, счета, акты, транспортные или сертификационные подтверждения" />
        </dl>
      </section>
    </DetailShell>
  );
}
