"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ClipboardCheck, FileText, PackagePlus, ShieldCheck, Sparkles, Store, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { OrganizationPageShell } from "@/components/organization-page-shell";
import { OrganizationDetailSkeleton } from "@/components/skeletons";
import { Button, Card, LinkButton } from "@/components/ui";
import { getOrganization, submitOrganizationVerification } from "@/lib/api/organizations";
import { organizationCategoryLabels, organizationTypeLabels, verificationStatusClasses, verificationStatusLabels } from "@/lib/labels";
import type { Organization } from "@/lib/types";

export default function OrganizationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrganization(params.id).then(setOrganization).finally(() => setLoading(false));
  }, [params.id]);

  async function submitVerification() {
    if (!organization) return;
    const updated = await submitOrganizationVerification(organization.id);
    setOrganization(updated);
    router.refresh();
  }

  if (loading) return <OrganizationDetailSkeleton />;
  if (!organization) return <p className="text-sm text-zinc-500">Организация не найдена</p>;

  const organizationSections = [
    {
      label: "Профиль организации",
      description: "Реквизиты, регион и контактные данные организации.",
      href: `/app/organizations/${organization.id}`,
      icon: Store,
    },
    {
      label: "Анкета",
      description: `${organization.profile_completion_percent}% заполнено`,
      href: `/app/organizations/${organization.id}/questionnaire`,
      icon: ClipboardCheck,
    },
    {
      label: "Заявки",
      description: "Заявки хозяйства по сервисам и мерам поддержки.",
      href: `/app/organizations/${organization.id}/applications`,
      icon: FileText,
    },
    {
      label: "Сервисы",
      description: "Сервисы, рекомендованные для этой организации.",
      href: `/app/organizations/${organization.id}/services`,
      icon: Store,
    },
    {
      label: "Решения",
      description: "Карточки цифровых решений, публикация и заявки.",
      href: `/app/organizations/${organization.id}/solutions`,
      icon: Sparkles,
    },
    {
      label: "Продукция",
      description: "Каталог товаров, услуг и решений организации.",
      href: `/app/organizations/${organization.id}/products`,
      icon: PackagePlus,
    },
    {
      label: "Пользователи",
      description: "Команда и доступы к кабинету организации.",
      href: `/app/organizations/${organization.id}/users`,
      icon: UsersRound,
    },
  ];

  return (
    <OrganizationPageShell organizationId={organization.id}>
    <div className="grid gap-6">
      <section className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="grid size-20 shrink-0 place-items-center rounded-[22px] bg-zinc-950 text-2xl font-black text-white md:size-24">
            {organization.name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-600">Кабинет организации</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight tracking-normal md:text-4xl">{organization.name}</h1>
            <p className="mt-3 text-sm text-zinc-500">{organizationCategoryLabels[organization.category]} · {organizationTypeLabels[organization.type]} · ИНН {organization.inn}</p>
            <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${verificationStatusClasses[organization.verification_status]}`}>
              {verificationStatusLabels[organization.verification_status]}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href={`/app/organizations/${organization.id}/questionnaire`} variant="secondary" className="rounded-2xl">Заполнить анкету</LinkButton>
          {organization.verification_status === "draft" ? (
            <Button onClick={submitVerification} className="rounded-2xl">Отправить на проверку</Button>
          ) : null}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {organizationSections.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-[22px] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,23,42,0.11)]"
          >
            <item.icon className="text-emerald-600" size={24} />
            <h2 className="mt-4 text-lg font-bold">{item.label}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{item.description}</p>
          </Link>
        ))}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-[24px] border-0 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <h2 className="text-xl font-bold">Реквизиты</h2>
          <dl className="mt-5 grid gap-4 text-sm">
            <div className="rounded-2xl bg-zinc-50 p-4"><dt className="text-zinc-500">ОГРН</dt><dd className="mt-1 font-semibold">{organization.ogrn || "Не указан"}</dd></div>
            <div className="rounded-2xl bg-zinc-50 p-4"><dt className="text-zinc-500">КПП</dt><dd className="mt-1 font-semibold">{organization.kpp || "Не указан"}</dd></div>
            <div className="rounded-2xl bg-zinc-50 p-4"><dt className="text-zinc-500">Регион</dt><dd className="mt-1 font-semibold">{organization.region || "Не указан"}</dd></div>
            <div className="rounded-2xl bg-zinc-50 p-4"><dt className="text-zinc-500">Адрес</dt><dd className="mt-1 font-semibold">{organization.address || "Не указан"}</dd></div>
          </dl>
        </Card>
        <Card className="rounded-[24px] border-0 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 text-emerald-600" size={24} />
            <div>
              <h2 className="text-xl font-bold">Проверка и анкета</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">Данные анкеты станут основой для подбора мер поддержки, сервисов и заявок.</p>
            </div>
          </div>
          <div className="mt-8 h-3 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${organization.profile_completion_percent}%` }} />
          </div>
          <p className="mt-3 text-sm font-semibold">{organization.profile_completion_percent}% заполнено</p>
          <LinkButton href={`/app/organizations/${organization.id}/questionnaire`} className="mt-6 rounded-2xl">Открыть анкету</LinkButton>
        </Card>
      </div>
    </div>
    </OrganizationPageShell>
  );
}
