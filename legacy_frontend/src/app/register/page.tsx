import Link from "next/link";
import { CheckCircle2, Leaf } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(118deg,#22d186_0%,#18b7d5_52%,#22a8e8_100%)] px-5 py-10">
      <section className="grid w-full max-w-5xl gap-6 rounded-[34px] bg-white p-8 shadow-[0_26px_90px_rgba(52,84,94,0.2)] lg:grid-cols-[0.85fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <Leaf size={27} />
            </div>
            <div>
              <p className="text-xl font-semibold">Агропорт</p>
              <p className="text-sm text-zinc-500">регистрация хозяйства</p>
            </div>
          </Link>
          <h1 className="mt-8 text-3xl font-semibold">Создать профиль агрария</h1>
          <div className="mt-6 space-y-3">
            {["Рекомендации мер поддержки", "Витрина товаров и услуг", "Заявки и документы в одном кабинете"].map((item) => (
              <div key={item} className="flex gap-3 text-sm">
                <CheckCircle2 className="text-emerald-500" size={18} />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          <Input label="Название хозяйства" placeholder="КФХ Зеленая долина" />
          <Input label="Регион" placeholder="Самарская область" />
          <Input label="Основное направление" placeholder="растениеводство, животноводство" />
          <Input label="Контактный email" placeholder="agro@example.ru" />
          <Link href="/profile?onboarding=1" className="grid h-12 place-items-center rounded-xl bg-[#17c7c8] text-sm font-semibold text-white">Зарегистрироваться</Link>
          <p className="text-sm text-zinc-500">Уже есть аккаунт? <Link href="/login" className="font-semibold text-[#1595b9]">Войти</Link></p>
        </div>
      </section>
    </main>
  );
}

function Input({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-600">{label}</span>
      <input className="mt-2 h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none focus:border-emerald-400" placeholder={placeholder} />
    </label>
  );
}
