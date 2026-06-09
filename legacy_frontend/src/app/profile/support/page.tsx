import { CabinetShell } from "@/components/platform-shell";

export default function ProfileSupportPage() {
  return (
    <CabinetShell eyebrow="Кабинет • Поддержка" title="Мои обращения" description="История обращений и быстрый контакт с консультантом Агропорта.">
      <section className="rounded-3xl border border-zinc-200 p-6">
        <span className="rounded-lg bg-sky-100 px-3 py-1 text-sm text-sky-700">В работе</span>
        <h2 className="mt-4 text-2xl font-semibold">Помочь проверить пакет документов по Агропрогрессу</h2>
        <p className="mt-3 text-sm text-zinc-500">Консультант ответит до 03.06.2026. Следующий шаг: загрузить финансовую модель.</p>
        <button className="mt-6 h-11 rounded-xl bg-[#24a8f2] px-5 text-sm font-semibold text-white">Открыть обращение</button>
      </section>
    </CabinetShell>
  );
}
