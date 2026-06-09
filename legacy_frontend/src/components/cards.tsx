import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SupportMeasure } from "@/lib/mock-data";

export function StatusPill({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "blue" | "amber" | "zinc" }) {
  const tones = {
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-sky-100 text-sky-700",
    amber: "bg-amber-100 text-amber-700",
    zinc: "bg-zinc-100 text-zinc-600",
  };
  return <span className={`rounded-lg px-3 py-1 text-sm font-medium ${tones[tone]}`}>{children}</span>;
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-[0_12px_35px_rgba(25,32,43,0.09)] ring-1 ring-zinc-100">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </article>
  );
}

export function SupportCard({ item }: { item: SupportMeasure }) {
  const tone = item.status === "Скоро откроется" ? "amber" : item.status === "Прием открыт" ? "blue" : "green";
  return (
    <article className="rounded-[24px] border border-zinc-200 bg-white p-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill tone={tone}>{item.status}</StatusPill>
        <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-500">{item.category}</span>
      </div>
      <h3 className="mt-4 text-2xl font-semibold leading-snug">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-500">{item.details}</p>
      <div className="mt-6 grid gap-4 border-t border-zinc-100 pt-5 md:grid-cols-3">
        <Field label="Размер" value={item.amount} />
        <Field label="Условия" value={item.rate} />
        <Field label="Организатор" value={item.organizer} />
      </div>
      <div className="mt-6 rounded-2xl bg-zinc-50 p-4">
        <p className="text-sm font-semibold text-zinc-800">Частые вопросы</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {item.faq.slice(0, 2).map((faq) => (
            <div key={faq.question}>
              <p className="text-sm font-semibold leading-5">{faq.question}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <Link href={`/support/${item.id}`} className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#24a8f2] px-5 text-sm font-semibold text-white">
        Открыть детали
        <ArrowRight size={17} />
      </Link>
    </article>
  );
}

export function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-zinc-100 md:border-r md:pr-4 last:md:border-r-0">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6">{value}</p>
    </div>
  );
}

export function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 py-4 text-sm md:grid-cols-[210px_1fr]">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="font-medium text-zinc-800 md:text-right">{value}</dd>
    </div>
  );
}
