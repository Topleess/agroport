import Link from "next/link";
import { Leaf } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(118deg,#22d186_0%,#18b7d5_52%,#22a8e8_100%)] px-5">
      <section className="w-full max-w-md rounded-[34px] bg-white p-8 shadow-[0_26px_90px_rgba(52,84,94,0.2)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <Leaf size={27} />
          </div>
          <div>
            <p className="text-xl font-semibold">Агропорт</p>
            <p className="text-sm text-zinc-500">вход в кабинет</p>
          </div>
        </Link>
        <h1 className="mt-8 text-3xl font-semibold">Войти</h1>
        <div className="mt-6 space-y-4">
          <Input label="Телефон или email" placeholder="agro@example.ru" />
          <Input label="Пароль" placeholder="Введите пароль" />
          <Link href="/profile?onboarding=1" className="grid h-12 w-full place-items-center rounded-xl bg-[#17c7c8] text-sm font-semibold text-white">Войти</Link>
        </div>
        <p className="mt-5 text-sm text-zinc-500">
          Нет аккаунта? <Link href="/register" className="font-semibold text-[#1595b9]">Зарегистрироваться</Link>
        </p>
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
