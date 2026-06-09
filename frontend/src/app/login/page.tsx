"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, X } from "lucide-react";
import { Suspense, useState } from "react";
import { AuthPasswordField, AuthSubmitButton, AuthTextField } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { ErrorNotice } from "@/components/ui";
import { login } from "@/lib/api/auth";
import { setToken } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = await login({ identifier, password });
      setToken(token.access_token);
      router.replace(searchParams.get("next") ?? "/app");
    } catch {
      setError("Не удалось войти. Проверьте логин и пароль.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} className="grid gap-3.5">
        <ErrorNotice message={error} />
        <AuthTextField
          label="Телефон или электронная почта"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          autoComplete="username"
          required
        />

        <AuthPasswordField
          label="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          minLength={8}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="text-sm font-medium text-zinc-400 transition hover:text-emerald-600"
          >
            Восстановить пароль
          </button>
        </div>

        <AuthSubmitButton disabled={loading} className="mt-2">
          {loading ? "Входим..." : "Войти"}
        </AuthSubmitButton>
      </form>
      {resetOpen ? <PasswordResetDialog onClose={() => setResetOpen(false)} /> : null}
    </>
  );
}

function PasswordResetDialog({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/42 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-[420px] rounded-[28px] bg-white p-5 shadow-[0_28px_90px_rgba(15,23,42,0.2)] md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Mail size={22} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-xl text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-800"
            aria-label="Закрыть восстановление пароля"
          >
            <X size={21} />
          </button>
        </div>

        {sent ? (
          <div className="mt-5">
            <h2 className="text-2xl font-semibold tracking-normal text-zinc-950">Письмо отправлено</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Если аккаунт с адресом {email} есть в системе, на него придет ссылка для смены пароля.
            </p>
            <Link
              href="/reset-password?token=demo-reset-token"
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
            >
              Посмотреть страницу смены пароля
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 h-11 w-full rounded-xl bg-[linear-gradient(100deg,#14d765,#13aee5)] text-sm font-semibold text-white transition hover:brightness-105"
            >
              Понятно
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-normal text-zinc-950">Восстановление пароля</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Введите email, привязанный к профилю. Мы отправим ссылку для смены пароля.
              </p>
            </div>
            <AuthTextField
              label="Электронная почта"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              required
            />
            <AuthSubmitButton>Отправить ссылку</AuthSubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      active="login"
      footer={
        <p className="text-sm text-zinc-500">
          Нет аккаунта? <Link href="/register" className="font-semibold text-emerald-600">Зарегистрироваться</Link>
        </p>
      }
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
