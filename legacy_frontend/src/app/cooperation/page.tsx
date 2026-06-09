import { PublicShell } from "@/components/platform-shell";
import { cooperationRequests } from "@/lib/mock-data";

export default function CooperationPage() {
  return (
    <PublicShell eyebrow="Спрос • Кооперация • Продажи" title="Спрос, кооперация и продажи" description="Запросы покупателей, совместные закупки, свободные мощности, аренда и услуги между хозяйствами.">
      <section className="grid gap-5">
        {cooperationRequests.map((item) => (
          <article key={item.title} className="rounded-[24px] border border-zinc-200 bg-white p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">{item.type}</span>
                  <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-500">{item.deadline}</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-zinc-500">{item.buyer}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-zinc-400">Объем</p>
                <p className="mt-1 text-2xl font-semibold">{item.volume}</p>
                <button className="mt-4 h-11 rounded-xl bg-[#24a8f2] px-5 text-sm font-semibold text-white">Откликнуться</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}
