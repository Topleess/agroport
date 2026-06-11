"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import { getAdminMe } from "@/lib/api/admin";
import { login } from "@/lib/api/auth";
import { setToken } from "@/lib/auth";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("admin@agroport.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = await login({ identifier, password });
      setToken(token.access_token);
      await getAdminMe();
      router.replace(searchParams.get("next") ?? "/admin");
    } catch {
      setError("Не удалось войти в админку. Проверьте доступ администратора.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-[420px] rounded-[28px] bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.12)]">
      <div className="mb-7">
        <span className="grid size-12 place-items-center rounded-2xl bg-emerald-600 text-xl font-black text-white">А</span>
        <h1 className="mt-5 text-3xl font-black tracking-normal">Админка Агропорт</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">Отдельный вход для команды платформы, модераторов и операторов справочников.</p>
      </div>
      {error ? <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}
      <label className="grid gap-2 text-sm font-semibold text-zinc-700">
        Email или телефон
        <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="h-12 rounded-xl border border-zinc-200 px-4 outline-none focus:border-emerald-500" autoComplete="username" />
      </label>
      <label className="mt-4 grid gap-2 text-sm font-semibold text-zinc-700">
        Пароль
        <input value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-xl border border-zinc-200 px-4 outline-none focus:border-emerald-500" type="password" autoComplete="current-password" />
      </label>
      <button disabled={loading} className="mt-6 h-12 w-full rounded-xl bg-zinc-950 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:opacity-60">
        {loading ? "Проверяем доступ..." : "Войти"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f7fb] px-4">
      <Suspense>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
