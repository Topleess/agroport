"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthPasswordField, AuthSubmitButton } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { ErrorNotice } from "@/components/ui";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Ссылка для восстановления недействительна или устарела.");
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен быть не короче 8 символов.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Пароли не совпадают.");
      return;
    }

    setSaved(true);
  }

  if (saved) {
    return (
      <div className="grid gap-5">
        <div>
          <p className="text-sm font-semibold text-emerald-600">Пароль изменен</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">Можно входить</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Новый пароль сохранен. Используйте его при следующем входе в личный кабинет.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[linear-gradient(100deg,#14d765,#13aee5)] text-base font-semibold text-white transition hover:brightness-105"
        >
          Перейти ко входу
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div>
        <p className="text-sm font-semibold text-emerald-600">Восстановление доступа</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">Новый пароль</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Придумайте новый пароль и повторите его. Нажмите на иконку глаза, чтобы проверить введенные символы.
        </p>
      </div>

      <ErrorNotice message={error} />

      <AuthPasswordField
        label="Новый пароль"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        required
        minLength={8}
      />

      <AuthPasswordField
        label="Повторите пароль"
        value={passwordConfirmation}
        onChange={(event) => setPasswordConfirmation(event.target.value)}
        autoComplete="new-password"
        required
        minLength={8}
      />

      <AuthSubmitButton className="mt-2">Сохранить пароль</AuthSubmitButton>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      active="login"
      showTabs={false}
      footer={
        <p className="text-sm text-zinc-500">
          Вспомнили пароль? <Link href="/login" className="font-semibold text-emerald-600">Войти</Link>
        </p>
      }
    >
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
