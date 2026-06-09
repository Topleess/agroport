"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProfilePageShell } from "@/components/profile-page-shell";
import { FormPageSkeleton } from "@/components/skeletons";
import { Button, Card, ErrorNotice, Field, Input } from "@/components/ui";
import { getMyProfile, updateMyProfile } from "@/lib/api/users";

export default function ProfileEditPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    phone: "",
    region: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile()
      .then((profile) =>
        setForm({
          first_name: profile.first_name ?? "",
          last_name: profile.last_name ?? "",
          middle_name: profile.middle_name ?? "",
          phone: profile.phone ?? "",
          region: profile.region ?? "",
          role: profile.role ?? "",
        })
      )
      .finally(() => setLoading(false));
  }, []);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      await updateMyProfile(form);
      setSuccess("Профиль сохранен");
    } catch {
      setError("Не удалось сохранить профиль");
    }
  }

  if (loading) return <FormPageSkeleton />;

  return (
    <ProfilePageShell>
      <div className="grid gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Редактирование</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">Изменить личные данные</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Эти данные используются в личном кабинете и при работе с организациями.</p>
          </div>
          <Link
            href="/app/profile"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold transition hover:bg-zinc-50"
          >
            <ArrowLeft size={17} />
            В профиль
          </Link>
        </div>

        <Card className="rounded-[26px] border-0 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <ErrorNotice message={error} />
              {success ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}
            </div>
            <Field label="Имя"><Input value={form.first_name} onChange={(event) => update("first_name", event.target.value)} required /></Field>
            <Field label="Фамилия"><Input value={form.last_name} onChange={(event) => update("last_name", event.target.value)} required /></Field>
            <Field label="Отчество"><Input value={form.middle_name} onChange={(event) => update("middle_name", event.target.value)} /></Field>
            <Field label="Телефон"><Input value={form.phone} onChange={(event) => update("phone", event.target.value)} /></Field>
            <Field label="Регион"><Input value={form.region} onChange={(event) => update("region", event.target.value)} /></Field>
            <Field label="Роль"><Input value={form.role} onChange={(event) => update("role", event.target.value)} /></Field>
            <div className="md:col-span-2"><Button className="rounded-2xl">Сохранить профиль</Button></div>
          </form>
        </Card>
      </div>
    </ProfilePageShell>
  );
}
