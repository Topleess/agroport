"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, ErrorNotice, Field, Input, Textarea } from "@/components/ui";
import { createSolutionRequest, getSolution } from "@/lib/api/solutions";
import { getToken } from "@/lib/auth";
import type { SolutionDetail } from "@/lib/types";

type LeadState = {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  organization_name: string;
  message: string;
};

const emptyLead: LeadState = {
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  organization_name: "",
  message: "",
};

export function SolutionDetailPage({ id }: { id: string }) {
  const [solution, setSolution] = useState<SolutionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState(emptyLead);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const isAuthorized = Boolean(getToken());

  useEffect(() => {
    getSolution(id)
      .then(setSolution)
      .catch(() => setSolution(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function submitLead(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      await createSolutionRequest(id, lead);
      setSent(true);
      setLead(emptyLead);
    } catch {
      setError("Не удалось отправить заявку. Проверьте контактные данные.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-5 py-8 text-zinc-950">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-40 animate-pulse rounded-xl bg-zinc-100" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="h-96 animate-pulse rounded-[28px] bg-zinc-100" />
            <div className="h-96 animate-pulse rounded-[28px] bg-zinc-100" />
          </div>
        </div>
      </main>
    );
  }

  if (!solution) {
    return (
      <main className="min-h-screen bg-white px-5 py-8 text-zinc-950">
        <div className="mx-auto max-w-3xl rounded-[24px] bg-zinc-50 p-8 text-center">
          <p className="text-xl font-bold">Решение не найдено</p>
          <Link href="/solutions" className="mt-4 inline-flex text-sm font-bold text-emerald-700">Вернуться в каталог</Link>
        </div>
      </main>
    );
  }

  const detailRows = [
    ["Поставщик", solution.supplier_name],
    ["Формат внедрения", solution.implementation_type],
    ["Модель оплаты", solution.payment_model],
    ["Размещение", solution.deployment_type],
    ["Стоимость от", solution.price_from ? `${solution.price_from} руб.` : null],
  ].filter(([, value]) => value);

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-zinc-950">
      <div className="mx-auto max-w-6xl">
        <Link href="/solutions" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-emerald-700">
          <ArrowLeft size={18} />
          Каталог решений
        </Link>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="rounded-[28px] bg-[#f5fbf8] p-6 md:p-9">
            <p className="text-sm font-bold text-emerald-600">Цифровое решение</p>
            <h1 className="mt-3 text-3xl font-black tracking-normal md:text-5xl">{solution.name}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-700">
              {solution.full_description || solution.short_description || "Поставщик пока не добавил подробное описание."}
            </p>
            <dl className="mt-8 grid gap-3 md:grid-cols-2">
              {detailRows.map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white p-4 shadow-sm">
                  <dt className="text-xs font-bold uppercase text-zinc-400">{label}</dt>
                  <dd className="mt-1 text-sm font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <aside className="rounded-[28px] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.1)]">
            <h2 className="text-xl font-black">Заявка на внедрение</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {isAuthorized
                ? "Заявка сохранится в вашем кабинете и уйдёт поставщику."
                : "Без входа можно оставить контактные данные. После регистрации заявка будет доступна в кабинете."}
            </p>
            {sent ? (
              <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                <CheckCircle2 className="mr-2 inline" size={18} />
                Заявка отправлена.
              </div>
            ) : null}
            <form onSubmit={submitLead} className="mt-5 grid gap-4">
              <ErrorNotice message={error} />
              <Field label="ФИО *">
                <Input required value={lead.contact_name} onChange={(event) => setLead({ ...lead, contact_name: event.target.value })} />
              </Field>
              <Field label="Email *">
                <Input required type="email" value={lead.contact_email} onChange={(event) => setLead({ ...lead, contact_email: event.target.value })} />
              </Field>
              <Field label="Телефон">
                <Input value={lead.contact_phone} onChange={(event) => setLead({ ...lead, contact_phone: event.target.value })} />
              </Field>
              <Field label="Организация">
                <Input value={lead.organization_name} onChange={(event) => setLead({ ...lead, organization_name: event.target.value })} />
              </Field>
              <Field label="Комментарий">
                <Textarea value={lead.message} onChange={(event) => setLead({ ...lead, message: event.target.value })} />
              </Field>
              <Button disabled={sending}>
                {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                Отправить заявку
              </Button>
              {!isAuthorized ? (
                <Link href="/register" className="text-center text-sm font-bold text-emerald-700 hover:text-emerald-800">
                  Зарегистрироваться на платформе
                </Link>
              ) : null}
            </form>
          </aside>
        </div>
      </div>
    </main>
  );
}
