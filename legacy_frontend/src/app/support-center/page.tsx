import { Mail, MessageCircle, Phone } from "lucide-react";
import { PublicShell } from "@/components/platform-shell";

export default function SupportCenterPage() {
  return (
    <PublicShell eyebrow="Помощь • Служба поддержки" title="Поддержка" description="Помощь с профилем, заявками, документами, витриной и подбором программ.">
      <section className="grid gap-5 md:grid-cols-3">
        {[
          ["Чат с консультантом", "Ответим по заявке и документам", MessageCircle],
          ["Телефон", "+7 (499) 460-69-04", Phone],
          ["Email", "support@agroport.ru", Mail],
        ].map(([title, text, Icon]) => (
          <article key={title as string} className="rounded-3xl border border-emerald-100 bg-[linear-gradient(105deg,#f2fff8,#e9fbff)] p-6">
            <div className="grid size-12 place-items-center rounded-2xl bg-white text-emerald-600">
              <Icon size={24} />
            </div>
            <h2 className="mt-5 text-xl font-semibold">{title as string}</h2>
            <p className="mt-2 text-sm text-zinc-500">{text as string}</p>
            <button className="mt-6 h-11 rounded-xl bg-[#17c7c8] px-5 text-sm font-semibold text-white">Обратиться</button>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}
