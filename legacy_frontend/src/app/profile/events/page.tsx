import { CabinetShell } from "@/components/platform-shell";
import { events } from "@/lib/mock-data";

export default function ProfileEventsPage() {
  return (
    <CabinetShell eyebrow="Кабинет • Мероприятия" title="Мои мероприятия" description="События, на которые хозяйство записалось или которые подходят по профилю.">
      <section className="space-y-4">
        {events.map((item) => (
          <article key={item.title} className="rounded-3xl border border-zinc-200 p-6">
            <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm text-zinc-500">{item.tag}</span>
            <h2 className="mt-4 text-2xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-zinc-500">{item.date} • {item.location}</p>
          </article>
        ))}
      </section>
    </CabinetShell>
  );
}
