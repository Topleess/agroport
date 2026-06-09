import { PublicShell } from "@/components/platform-shell";
import { learningItems } from "@/lib/mock-data";

export default function LearningPage() {
  return (
    <PublicShell eyebrow="Обучение • Школа фермера" title="Обучение" description="Короткие практические форматы: гранты, кредиты, экспорт, документы и цифровые инструменты хозяйства.">
      <section className="grid gap-5 md:grid-cols-3">
        {learningItems.map((item) => (
          <article key={item.title} className="rounded-[24px] border border-zinc-200 bg-white p-6">
            <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">{item.format}</span>
            <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
            <p className="mt-4 text-sm text-zinc-500">{item.progress}</p>
            <button className="mt-6 h-11 rounded-xl bg-[#24a8f2] px-5 text-sm font-semibold text-white">Открыть</button>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}
