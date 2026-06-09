"use client";

import { ArrowRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrganizationCreateWizard } from "@/components/organization-create-wizard";
import { OrganizationListSkeleton } from "@/components/skeletons";
import { Button, Card, LinkButton } from "@/components/ui";
import { listOrganizations } from "@/lib/api/organizations";
import { organizationCategoryLabels, organizationTypeLabels, verificationStatusClasses, verificationStatusLabels } from "@/lib/labels";
import type { Organization } from "@/lib/types";

export default function OrganizationsPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    listOrganizations().then(setOrganizations).finally(() => setLoading(false));
  }, []);

  if (loading) return <OrganizationListSkeleton />;

  function handleCreated(organization: Organization) {
    setOrganizations((current) => [organization, ...current]);
    router.push(`/app/organizations/${organization.id}`);
  }

  return (
    <div className="grid gap-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-600">Профили организаций</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal md:text-5xl">Мои хозяйства</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">Карточки организаций, анкеты хозяйств и статусы проверки.</p>
        </div>
        <Button type="button" onClick={() => setWizardOpen(true)} className="rounded-2xl">
          <Plus size={18} />
          Добавить организацию
        </Button>
      </div>
      {!loading && organizations.length === 0 ? (
        <Card className="rounded-[28px] border-0 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <h2 className="text-xl font-bold">Хозяйств пока нет</h2>
          <p className="mt-2 text-sm text-zinc-500">Создайте первое хозяйство, чтобы заполнить анкету и отправить его на проверку.</p>
          <Button type="button" onClick={() => setWizardOpen(true)} className="mt-5 rounded-2xl">Добавить организацию</Button>
        </Card>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {organizations.map((organization) => (
          <Card key={organization.id} className="rounded-[28px] border-0 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-zinc-100 text-xl font-black text-zinc-700">
                {organization.name[0]}
              </div>
              <span className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${verificationStatusClasses[organization.verification_status]}`}>
                {verificationStatusLabels[organization.verification_status]}
              </span>
            </div>
            <div className="mt-5">
              <h2 className="text-2xl font-bold">{organization.name}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{organizationCategoryLabels[organization.category]} · {organizationTypeLabels[organization.type]} · ИНН {organization.inn}</p>
              <p className="text-sm leading-6 text-zinc-500">{organization.region ?? "Регион не указан"} · роль {organization.member_role ?? "admin"}</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${organization.profile_completion_percent}%` }} />
              </div>
              <p className="mt-2 text-xs font-semibold text-zinc-500">Анкета заполнена на {organization.profile_completion_percent}%</p>
            </div>
            <LinkButton href={`/app/organizations/${organization.id}`} variant="secondary" className="mt-6 rounded-full">
              Открыть <ArrowRight size={16} />
            </LinkButton>
          </Card>
        ))}
      </div>
      <OrganizationCreateWizard open={wizardOpen} onClose={() => setWizardOpen(false)} onCreated={handleCreated} />
    </div>
  );
}
