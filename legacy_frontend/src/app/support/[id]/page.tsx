import { notFound } from "next/navigation";
import { CheckCircle2, Clock3, FileText, HelpCircle, MessageCircle, ShieldAlert } from "lucide-react";
import { DetailShell } from "@/components/platform-shell";
import { supportMeasures } from "@/lib/mock-data";

export default async function SupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = supportMeasures.find((measure) => measure.id === id);
  if (!item) notFound();

  const risks = [
    "Неполный профиль хозяйства снижает точность предварительного подбора.",
    "Сроки и лимиты зависят от региона и конкурсного отбора.",
    "Для части программ требуется подтверждение софинансирования или кредитное решение.",
  ];

  return (
    <DetailShell
      breadcrumbs={[
        { label: "Главная", href: "/" },
        { label: "Субсидии и гранты", href: "/support" },
        { label: item.title },
      ]}
    >
      <section className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">{item.status}</span>
            <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-500">{item.category}</span>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-normal md:text-6xl">{item.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-500">{item.details}</p>
        </div>
        <aside className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(105deg,#f2fff8,#e9fbff)] p-6">
          <p className="text-sm text-zinc-500">Организатор</p>
          <p className="mt-2 text-xl font-semibold">{item.organizer}</p>
          <button className="mt-7 h-12 w-full rounded-xl bg-emerald-500 text-sm font-semibold text-white">Начать заявку</button>
          <button className="mt-3 h-12 w-full rounded-xl border border-emerald-300 bg-white/70 text-sm font-semibold text-emerald-700">Проверить профиль</button>
        </aside>
      </section>

      <section className="mt-10 rounded-[28px] border border-zinc-200">
        <div className="border-b border-zinc-200 p-6">
          <h2 className="text-2xl font-semibold">Ключевые условия</h2>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3">
          <Condition label="Размер поддержки" value={item.amount} />
          <Condition label="Покрытие / ставка" value={item.rate} />
          <Condition label="Срок" value={item.term} />
          <Condition label="Кто может подать" value={item.requirements.slice(0, 2).join(", ")} />
          <Condition label="Регион" value={item.region} />
          <Condition label="Назначение" value={item.goal} />
        </div>
      </section>

      <section className="mt-10">
        <InfoBlock icon={CheckCircle2} title="Кому подходит" items={item.requirements} />
      </section>

      <section className="mt-10 rounded-[28px] border border-zinc-200 p-6">
        <div className="flex items-center gap-3">
          <FileText className="text-emerald-500" size={22} />
          <h2 className="text-2xl font-semibold">Какие документы нужно загрузить</h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-500">
          Список ниже помогает заранее понять, что понадобится для подачи. Справа указаны примеры содержания шаблонов, чтобы фермер не гадал, что именно от него ждут.
        </p>
        <div className="mt-6 divide-y divide-zinc-100 rounded-2xl border border-zinc-100">
          {item.documentExamples.map((doc) => (
            <div key={doc.name} className="grid gap-3 p-4 md:grid-cols-[240px_1fr] md:p-5">
              <div>
                <p className="text-sm font-semibold text-zinc-900">{doc.name}</p>
                <p className="mt-1 text-xs text-zinc-400">шаблон / пример заполнения</p>
              </div>
              <p className="text-sm leading-6 text-zinc-600">{doc.example}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[28px] border border-zinc-200 p-6">
        <div className="flex items-center gap-3">
          <Clock3 className="text-[#1595b9]" size={22} />
          <h2 className="text-2xl font-semibold">Порядок подачи</h2>
        </div>
        <div className="mt-6 space-y-5">
          {item.steps.map((step, index) => (
            <div key={step} className="grid grid-cols-[36px_1fr] gap-4">
              <div className="grid size-9 place-items-center rounded-full bg-[#24a8f2] text-sm font-semibold text-white">{index + 1}</div>
              <p className="pt-2 text-sm font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <InfoBlock icon={ShieldAlert} title="Ограничения и риски" items={risks} tone="amber" />
      </section>

      <section className="mt-10 rounded-[28px] border border-zinc-200 p-6">
        <div className="flex items-center gap-3">
          <HelpCircle className="text-[#1595b9]" size={22} />
          <h2 className="text-2xl font-semibold">FAQ по программе</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {item.faq.map((faq) => (
            <article key={faq.question} className="rounded-2xl bg-zinc-50 p-5">
              <h3 className="text-base font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm leading-7 text-zinc-500">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-emerald-600">
              <MessageCircle size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Остались вопросы?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
                Можно обратиться в службу поддержки Агропорта: поможем понять условия, документы и следующий шаг по заявке.
              </p>
            </div>
          </div>
          <button className="h-12 shrink-0 rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-white">Связаться</button>
        </div>
      </section>
    </DetailShell>
  );
}

function Condition({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-32 border-b border-r border-zinc-200 p-6 last:border-r-0">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-3 text-lg font-semibold leading-7">{value}</p>
    </div>
  );
}

function InfoBlock({
  icon: Icon,
  title,
  items,
  tone = "green",
}: {
  icon: typeof CheckCircle2;
  title: string;
  items: string[];
  tone?: "green" | "amber";
}) {
  return (
    <div className="rounded-[28px] border border-zinc-200 p-6">
      <div className="flex items-center gap-3">
        <Icon className={tone === "amber" ? "text-amber-500" : "text-emerald-500"} size={22} />
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 text-sm leading-6 text-zinc-600">
            <span className={`mt-2 size-1.5 shrink-0 rounded-full ${tone === "amber" ? "bg-amber-400" : "bg-emerald-500"}`} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
