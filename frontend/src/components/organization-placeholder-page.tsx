"use client";

import { ArrowLeft, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OrganizationPageShell } from "@/components/organization-page-shell";
import { Card, LinkButton } from "@/components/ui";

export function OrganizationPlaceholderPage({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  const params = useParams<{ id: string }>();

  return (
    <OrganizationPageShell organizationId={params.id}>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-semibold text-emerald-600">Кабинет организации</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{description}</p>
        </div>
        <Card className="rounded-[26px] border-0 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
          <span className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Icon size={27} />
          </span>
          <h2 className="mt-5 text-xl font-bold">Раздел подготовлен</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">Сейчас это отдельная страница кабинета организации. Позже здесь появятся данные, действия и статусы именно этой компании.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <LinkButton href={`/app/organizations/${params.id}`} variant="secondary" className="rounded-2xl">
              <ArrowLeft size={17} />
              В профиль организации
            </LinkButton>
            <Link href="/app/profile" className="inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100">
              Профиль физлица
            </Link>
          </div>
        </Card>
      </div>
    </OrganizationPageShell>
  );
}
