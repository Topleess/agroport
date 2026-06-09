"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const farmerTypes = ["КФХ", "ИП", "ООО", "Кооператив", "Начинающий фермер"];
const sectors = ["Растениеводство", "Молочное животноводство", "Мясное животноводство", "Овощи и теплицы", "Переработка"];
const goals = ["Грант", "Техника", "Кредит", "Сбыт", "Экспорт", "Обучение"];
const documents = ["ЕГРИП/ЕГРЮЛ", "Бизнес-план", "Финансовая модель", "Коммерческие предложения", "Справка о задолженности"];

export function OnboardingModal() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("КФХ");

  const stepTitle = useMemo(() => {
    return [
      "Выберите тип хозяйства",
      type === "Кооператив" ? "Опишите кооперацию" : "Опишите хозяйство",
      "Выберите цели сезона",
      "Добавьте данные для рекомендаций",
      "Проверьте анкету",
    ][step];
  }, [step, type]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#10251d]/25 px-4 backdrop-blur-sm">
      <section className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[30px] bg-white p-6 shadow-[0_30px_100px_rgba(0,0,0,0.22)] md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-emerald-600">Шаг {step + 1} из 5</p>
            <h2 className="mt-2 text-3xl font-semibold">{stepTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              Анкета помогает подобрать меры поддержки, финансирование, покупателей и сервисы под реальный профиль хозяйства.
            </p>
          </div>
          <div className="group relative">
            <Link href="/profile" className="text-sm font-semibold text-zinc-500 hover:text-[#1595b9]">
              Пропустить
            </Link>
            <div className="pointer-events-none absolute right-0 top-8 hidden w-64 rounded-xl border border-zinc-200 bg-white p-3 text-xs leading-5 text-zinc-500 shadow-lg group-hover:block group-focus-within:block">
              Вы можете вернуться к заполнению анкеты позже из профиля.
            </div>
          </div>
        </div>

        <div className="mt-7 h-1.5 rounded-full bg-zinc-100">
          <div className="h-1.5 rounded-full bg-emerald-500 transition-all" style={{ width: `${((step + 1) / 5) * 100}%` }} />
        </div>

        <div className="mt-7">
          {step === 0 ? <ChoiceGrid items={farmerTypes} selected={type} onSelect={setType} /> : null}
          {step === 1 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <ChoiceGrid items={sectors} compact />
              <Input label="Регион" placeholder="Самарская область" />
              <Input label={type === "Кооператив" ? "Участников" : "Площадь / поголовье"} placeholder={type === "Кооператив" ? "12 хозяйств" : "420 га, 86 голов"} />
            </div>
          ) : null}
          {step === 2 ? <ChoiceGrid items={goals} compact /> : null}
          {step === 3 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Техника" placeholder="трактор, комбайн, оборудование" />
              <Input label="Выручка от сельхоздеятельности" placeholder="например, 70%+" />
              <Input label="Цель финансирования" placeholder="ферма, техника, оборотные средства" />
              <ChoiceGrid items={documents} compact />
            </div>
          ) : null}
          {step === 4 ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 text-emerald-600" size={22} />
                <div>
                  <h3 className="font-semibold">Анкета готова как черновик</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    После сохранения Агропорт уточнит рекомендации по грантам, кредитам, экспорту и витрине. В прототипе состояние остается mock.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <button
            disabled={step === 0}
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            className="h-11 rounded-xl border border-zinc-200 px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Назад
          </button>
          <div className="flex flex-wrap gap-3">
            <button className="h-11 rounded-xl border border-emerald-300 px-5 text-sm font-semibold text-emerald-700">Сохранить как черновик</button>
            {step < 4 ? (
              <button onClick={() => setStep((value) => Math.min(4, value + 1))} className="h-11 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white">
                Продолжить
              </button>
            ) : (
              <Link href="/profile" className="grid h-11 place-items-center rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white">
                Завершить
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ChoiceGrid({
  items,
  selected,
  onSelect,
  compact = false,
}: {
  items: string[];
  selected?: string;
  onSelect?: (value: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={`grid gap-3 ${compact ? "md:col-span-2 md:grid-cols-3" : "md:grid-cols-2"}`}>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect?.(item)}
          className={`min-h-12 rounded-xl border px-4 text-left text-sm font-semibold ${
            selected === item ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-zinc-200 bg-white text-zinc-700"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
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
