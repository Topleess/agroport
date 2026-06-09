"use client";

import { X } from "lucide-react";

type ListingType = "product" | "request";

export function ListingModal({ type, onClose }: { type: ListingType; onClose: () => void }) {
  const isProduct = type === "product";
  const title = isProduct ? "Добавить товар" : "Добавить запрос";
  const description = isProduct
    ? "Заполните основные данные позиции для витрины. В прототипе публикация остается визуальным действием."
    : "Опишите потребность, объем и срок, чтобы покупатели или партнеры могли откликнуться.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/35 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.25)] md:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">{description}</p>
          </div>
          <button onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200" aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label={isProduct ? "Название товара" : "Что нужно найти"} placeholder={isProduct ? "Например, пшеница 3 класса" : "Например, партия подсолнечника"} />
          <Field label="Категория" placeholder={isProduct ? "Продукция, корма, техника" : "Спрос, кооперация, услуга"} />
          <Field label={isProduct ? "Цена" : "Бюджет"} placeholder={isProduct ? "18 900 ₽/т" : "по договоренности"} />
          <Field label={isProduct ? "Объем партии" : "Нужный объем"} placeholder={isProduct ? "120 тонн" : "до 300 тонн"} />
          <Field label="Регион" placeholder="Самарская область" />
          <Field label="Срок" placeholder={isProduct ? "готово к отгрузке" : "до 15 июня"} />
          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-zinc-700">Описание</span>
            <textarea
              className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#17c7c8]"
              placeholder={isProduct ? "Укажите качество, условия отгрузки и документы." : "Опишите требования к поставщику, качеству и логистике."}
            />
          </label>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="h-11 rounded-xl border border-zinc-200 px-5 text-sm font-semibold text-zinc-600">
            Сохранить черновик
          </button>
          <button onClick={onClose} className="h-11 rounded-xl bg-[#24a8f2] px-5 text-sm font-semibold text-white">
            {isProduct ? "Добавить товар" : "Добавить запрос"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label>
      <span className="text-sm font-semibold text-zinc-700">{label}</span>
      <input className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-[#17c7c8]" placeholder={placeholder} />
    </label>
  );
}
