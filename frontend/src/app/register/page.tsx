"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthPasswordField, AuthSubmitButton, AuthTextField } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { ErrorNotice } from "@/components/ui";
import { register } from "@/lib/api/auth";
import { setToken } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    email: "",
    phone: "",
    region: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = await register(form);
      setToken(token.access_token);
      router.replace("/app/profile");
    } catch {
      setError("Не удалось зарегистрироваться. Проверьте email, телефон и пароль.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      active="register"
      footer={
        <p className="text-sm text-zinc-500">
          Уже есть аккаунт? <Link href="/login" className="font-semibold text-emerald-600">Войти</Link>
        </p>
      }
    >
      <form onSubmit={submit} className="grid gap-3.5">
        <ErrorNotice message={error} />
        <AuthTextField
          label="Фамилия"
          value={form.last_name}
          onChange={(event) => update("last_name", event.target.value)}
          autoComplete="family-name"
          required
        />
        <AuthTextField
          label="Имя"
          value={form.first_name}
          onChange={(event) => update("first_name", event.target.value)}
          autoComplete="given-name"
          required
        />
        <AuthTextField
          label="Отчество"
          value={form.middle_name}
          onChange={(event) => update("middle_name", event.target.value)}
          autoComplete="additional-name"
        />
        <AuthTextField
          label="Электронная почта"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          type="email"
          autoComplete="email"
          required
        />
        <AuthTextField
          label="Номер мобильного телефона"
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          type="tel"
          autoComplete="tel"
          required
        />
        <AuthTextField
          label="Регион"
          value={form.region}
          onChange={(event) => update("region", event.target.value)}
          autoComplete="address-level1"
        />
        <AuthPasswordField
          label="Придумайте пароль"
          value={form.password}
          onChange={(event) => update("password", event.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
        />

        <AuthSubmitButton disabled={loading} className="mt-2">
          {loading ? "Создаем профиль..." : "Зарегистрироваться"}
        </AuthSubmitButton>
      </form>
    </AuthShell>
  );
}
