import { CabinetShell } from "@/components/platform-shell";
import { serviceTiles } from "@/lib/mock-data";

export default function ProfileServicesPage() {
  return (
    <CabinetShell eyebrow="Кабинет • Сервисы" title="Сервисы хозяйства" description="Инструменты и интеграции для учета, документов, техники и аналитики.">
      <section className="grid gap-4 md:grid-cols-2">
        {serviceTiles.map(({ title, text, icon: Icon }) => (
          <article key={title} className="rounded-3xl border border-zinc-200 p-6">
            <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Icon size={24} />
            </div>
            <h2 className="mt-5 text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p>
            <button className="mt-5 h-11 rounded-xl border border-zinc-200 px-5 text-sm font-semibold">Настроить</button>
          </article>
        ))}
      </section>
    </CabinetShell>
  );
}
