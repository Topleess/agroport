import Link from "next/link";
import { CabinetShell } from "@/components/platform-shell";
import { applications } from "@/lib/mock-data";

export default function ProfileApplicationsPage() {
  return (
    <CabinetShell eyebrow="Кабинет • Заявки" title="Мои заявки" description="Статусы, прогресс и следующий шаг по заявкам на поддержку и финансирование.">
      <section className="space-y-4">
        {applications.map((item) => (
          <article key={item.number} className="rounded-3xl border border-zinc-200 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg border border-zinc-200 px-3 py-1 text-sm">{item.number}</span>
                  <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700">{item.status}</span>
                  <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm text-zinc-500">{item.program}</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-zinc-500">Следующий шаг: {item.next}</p>
              </div>
              <Link href="/support/farmer-grant" className="h-11 rounded-xl bg-[#24a8f2] px-5 py-3 text-sm font-semibold text-white">Открыть</Link>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <div className="h-2 flex-1 rounded-full bg-zinc-100">
                <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${item.progress}%` }} />
              </div>
              <span className="text-sm font-semibold text-zinc-500">{item.progress}%</span>
            </div>
          </article>
        ))}
      </section>
    </CabinetShell>
  );
}
