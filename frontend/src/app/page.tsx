import Link from "next/link";
import { ArrowRight, CheckCircle2, Sprout } from "lucide-react";

const audiences = ["КФХ", "ИП", "ООО в АПК", "Сельхозкооперативы", "Поставщики сервисов"];
const inside = [
  "Профиль хозяйства",
  "Анкета хозяйства",
  "Меры поддержки",
  "Marketplace",
  "Сервисы",
  "Цифровые решения",
  "Заявки",
  "Документы",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="text-xl font-bold text-emerald-800">Агропорт</Link>
        <Link href="/login" className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold hover:bg-zinc-50">
          Войти
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            <Sprout size={16} />
            Платформа находится в разработке
          </div>
          <h1 className="text-4xl font-bold tracking-normal md:text-6xl">Агропорт</h1>
          <p className="mt-4 max-w-2xl text-xl font-semibold text-zinc-800">
            Цифровая платформа для малого и среднего агробизнеса
          </p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600">
            Профиль хозяйства, меры поддержки, сервисы, цифровые решения и заявки в одном контуре. Сейчас доступен базовый кабинет хозяйства.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/app" className="inline-flex h-12 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700">
              Перейти в платформу
              <ArrowRight size={18} />
            </Link>
            <Link href="/register" className="inline-flex h-12 items-center rounded-lg border border-zinc-200 px-5 text-sm font-bold hover:bg-zinc-50">
              Создать профиль хозяйства
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-[#f7faf7] p-6">
          <h2 className="text-xl font-bold">Что такое Агропорт</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            Это не просто каталог. MVP собирает рабочий кабинет хозяйства, анкету и проверку организации как основу для будущих сервисов.
          </p>
          <div className="mt-5 grid gap-3">
            {["Рабочий кабинет хозяйства", "Основа для сервисов и заявок", "Единый профиль данных"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-semibold">
                <CheckCircle2 size={18} className="text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-100 bg-[#f7faf7] py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Для кого</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {audiences.map((item) => (
                <span key={item} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Что будет внутри</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {inside.map((item) => (
                <div key={item} className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
