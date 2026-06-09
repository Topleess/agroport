import { CabinetShell } from "@/components/platform-shell";
import { learningItems } from "@/lib/mock-data";

export default function ProfileLearningPage() {
  return (
    <CabinetShell eyebrow="Кабинет • Обучение" title="Мое обучение" description="Курсы и материалы, полезные для текущих заявок и целей сезона.">
      <section className="grid gap-4 md:grid-cols-3">
        {learningItems.map((item) => (
          <article key={item.title} className="rounded-3xl border border-zinc-200 p-6">
            <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700">{item.format}</span>
            <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
            <p className="mt-3 text-sm text-zinc-500">{item.progress}</p>
          </article>
        ))}
      </section>
    </CabinetShell>
  );
}
