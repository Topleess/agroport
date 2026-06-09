import { CalendarDays } from "lucide-react";
import { PublicShell } from "@/components/platform-shell";
import { events } from "@/lib/mock-data";

export default function EventsPage() {
  return (
    <PublicShell eyebrow="Календарь • Мероприятия" title="Мероприятия" description="Полевые дни, закупочные сессии, консультации и обучающие события для аграриев.">
      <section className="grid gap-5">
        {events.map((item) => (
          <article key={item.title} className="flex flex-col gap-5 rounded-[24px] border border-zinc-200 bg-white p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CalendarDays size={24} />
              </div>
              <div>
                <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-500">{item.tag}</span>
                <h2 className="mt-4 text-2xl font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-zinc-500">{item.location}</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-2xl font-semibold">{item.date}</p>
              <button className="mt-4 h-11 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white">Записаться</button>
            </div>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}
