"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";

export function AuthTabs({ active }: { active: "login" | "register" }) {
  return (
    <div className="mb-6 flex items-center gap-5">
      <Link
        href="/login"
        className={`text-2xl font-semibold tracking-normal transition md:text-3xl ${
          active === "login" ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-600"
        }`}
      >
        Вход
      </Link>
      <Link
        href="/register"
        className={`text-2xl font-semibold tracking-normal transition md:text-3xl ${
          active === "register" ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-600"
        }`}
      >
        Регистрация
      </Link>
    </div>
  );
}

export function AuthTextField({
  label,
  className = "",
  ...props
}: ComponentProps<"input"> & { label?: string }) {
  return (
    <label className="grid gap-1.5">
      {label ? <span className="text-sm font-medium text-zinc-700">{label}</span> : null}
      <input
        className={`h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-base outline-none transition placeholder:text-zinc-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${className}`}
        {...props}
      />
    </label>
  );
}

export function AuthPasswordField({
  label,
  className = "",
  ...props
}: ComponentProps<"input"> & { label?: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="grid gap-1.5">
      {label ? <span className="text-sm font-medium text-zinc-700">{label}</span> : null}
      <span className="relative">
        <input
          className={`h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-base outline-none transition placeholder:text-zinc-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${className}`}
          type={visible ? "text" : "password"}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-4 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-700"
          aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </span>
    </label>
  );
}

export function AuthSubmitButton({
  className = "",
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={`h-12 rounded-xl bg-[linear-gradient(100deg,#14d765,#13aee5)] text-base font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}
