import Link from "next/link";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { PublicShell } from "@/components/platform-shell";
import { landingCards } from "@/lib/mock-data";

const farmerActions = [
  "Найти грант или субсидию под свое хозяйство",
  "Сравнить кредиты и гарантии для покупки техники",
  "Разместить товар или найти покупателя",
  "Найти партнеров для совместной закупки или хранения",
  "Проверить экспортные программы и требования",
];

const faq = [
  {
    question: "Для кого Агропорт?",
    answer: "Для фермеров, КФХ, ИП, небольших агропредприятий и кооперативов, которым нужно быстро понять, где взять поддержку, кому продать продукцию и какие сервисы подключить.",
  },
  {
    question: "Зачем заполнять профиль?",
    answer: "Профиль помогает точнее подобрать меры поддержки, банки, покупателей и документы. Чем больше данных о хозяйстве, тем меньше ручного поиска и лишних заявок.",
  },
  {
    question: "Почему это удобнее обычного поиска?",
    answer: "Платформа собирает субсидии, кредиты, витрину, спрос, обучение и поддержку в одном месте. Фермер видит не список ссылок, а понятные действия и следующие шаги.",
  },
];

export default function Home() {
  return (
    <PublicShell>
      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-5 text-sm font-semibold text-emerald-600">Платформа для фермеров и КФХ</div>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
            Понятный навигатор по деньгам, сбыту и сервисам для хозяйства
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-500">
            Агропорт показывает, что можно сделать прямо сейчас: подобрать субсидию, найти финансирование, разместить товар, найти спрос, собрать документы и получить консультацию.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/support" className="flex h-12 items-center gap-2 rounded-xl bg-[#17c7c8] px-6 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(23,199,200,0.25)]">
              Найти субсидию
              <ArrowRight size={17} />
            </Link>
            <Link href="/profile" className="flex h-12 items-center gap-2 rounded-xl border border-emerald-300 px-6 text-sm font-semibold text-emerald-700">
              Открыть профиль
            </Link>
          </div>
        </div>
        <div className="rounded-[28px] border border-zinc-200 bg-[#f7fbfb] p-6 md:p-7">
          <h2 className="text-2xl font-semibold">Что можно сделать</h2>
          <div className="mt-5 space-y-3">
            {farmerActions.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-medium leading-6 text-zinc-700">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={18} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Основные разделы</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Каждый раздел ведет к конкретному действию, а не к абстрактному каталогу.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {landingCards.map(({ title, text, href, icon: Icon }) => (
          <Link key={title} href={href} className="group rounded-[24px] border border-zinc-200 bg-white p-5">
            <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Icon size={24} />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className="mt-2 min-h-16 text-sm leading-6 text-zinc-500">{text}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1595b9]">
              Перейти
              <ArrowRight className="transition group-hover:translate-x-1" size={16} />
            </span>
          </Link>
        ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-center gap-3">
          <HelpCircle className="text-[#1595b9]" size={24} />
          <h2 className="text-3xl font-semibold">FAQ: для кого, зачем и почему</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {faq.map((item) => (
            <article key={item.question} className="rounded-[24px] border border-zinc-200 bg-white p-6">
              <h3 className="text-xl font-semibold">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-500">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
