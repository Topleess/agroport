"use client";

import Link from "next/link";
import { Building2, Mail, MapPin, Pencil, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { ProfilePageShell } from "@/components/profile-page-shell";
import { ProfilePageSkeleton } from "@/components/skeletons";
import { getMyProfile } from "@/lib/api/users";

export default function ProfilePage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    phone: "",
    region: "",
    role: "",
  });
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

  if (loading) return <ProfilePageSkeleton />;

  const displayName = `${form.first_name} ${form.last_name}`.trim() || "Пользователь Агропорт";
  const initials = `${form.first_name[0] ?? "А"}${form.last_name[0] ?? ""}`.toUpperCase();

  return (
    <ProfilePageShell>
        <section className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="grid size-36 shrink-0 place-items-center rounded-[28px] bg-zinc-950 text-5xl font-black text-white shadow-[0_20px_60px_rgba(15,23,42,0.14)] md:size-44">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-emerald-600">Профиль физлица</p>
                <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">
                  {displayName}
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-base text-zinc-400 md:text-lg">
                  <span className="inline-flex items-center gap-2"><Mail size={18} />{form.role || "Роль не указана"}</span>
                  <span className="inline-flex items-center gap-2"><Phone size={18} />{form.phone || "Телефон не указан"}</span>
                  <span className="inline-flex items-center gap-2"><MapPin size={18} />{form.region || "Регион не указан"}</span>
                </div>
              </div>
              <Link
                href="/app/profile/edit"
                className="grid size-14 shrink-0 place-items-center rounded-2xl border border-zinc-200 text-emerald-500 transition hover:bg-emerald-50 md:size-16"
                aria-label="Редактировать профиль"
              >
                <Pencil size={24} strokeWidth={1.8} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4">
          <Link
            href="/app/profile/organizations"
            className="rounded-[26px] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(15,23,42,0.12)]"
          >
            <Building2 className="text-emerald-600" size={26} />
            <p className="mt-5 text-sm text-zinc-500">Профили организаций</p>
            <p className="mt-1 text-xl font-bold">Мои хозяйства</p>
            <p className="mt-2 text-sm text-zinc-500">Перейти к юридическим профилям и анкетам.</p>
          </Link>
        </section>
    </ProfilePageShell>
  );
}
