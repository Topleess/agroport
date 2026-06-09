"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrganizationCreateWizard } from "@/components/organization-create-wizard";
import { ProfilePageShell } from "@/components/profile-page-shell";
import { OrganizationListSkeleton } from "@/components/skeletons";
import { Button, Card } from "@/components/ui";
import { listOrganizations } from "@/lib/api/organizations";
import { organizationCategoryLabels, organizationTypeLabels, verificationStatusClasses, verificationStatusLabels } from "@/lib/labels";
import type { Organization } from "@/lib/types";

export default function ProfileOrganizationsPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    listOrganizations().then(setOrganizations).finally(() => setLoading(false));
  }, []);

  if (loading) return <OrganizationListSkeleton withProfileNav />;

  function handleCreated(organization: Organization) {
    setOrganizations((current) => [organization, ...current]);
    router.push(`/app/organizations/${organization.id}`);
  }

  return (
    <ProfilePageShell>
      <div className="grid gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Личный кабинет</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">Организации</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Хозяйства и юридические профили, к которым у вас есть доступ.</p>
          </div>
          <Button type="button" onClick={() => setWizardOpen(true)} className="rounded-2xl">
            <Plus size={18} />
            Добавить
          </Button>
        </div>

        {!loading && organizations.length === 0 ? (
          <Card className="rounded-[22px] border-0 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
            <h2 className="text-xl font-bold">Организаций пока нет</h2>
            <p className="mt-2 text-sm text-zinc-500">Добавьте хозяйство, чтобы перейти к кабинету организации.</p>
            <Button type="button" onClick={() => setWizardOpen(true)} className="mt-5 rounded-2xl">Добавить организацию</Button>
          </Card>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {organizations.map((organization) => (
            <Link
              key={organization.id}
              href={`/app/organizations/${organization.id}`}
              className="flex min-w-0 items-center justify-between gap-4 rounded-[22px] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,23,42,0.11)]"
            >
              <span className="flex min-w-0 items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-zinc-100 text-lg font-black text-zinc-700">
                  {organization.name[0]}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xl font-bold">{organization.name}</span>
                  <span className="mt-1 block text-sm text-zinc-500">{organizationCategoryLabels[organization.category]} · {organizationTypeLabels[organization.type]} · ИНН {organization.inn}</span>
                  <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${verificationStatusClasses[organization.verification_status]}`}>
                    {verificationStatusLabels[organization.verification_status]}
                  </span>
                </span>
              </span>
              <ArrowRight className="shrink-0 text-zinc-500" size={22} />
            </Link>
          ))}
        </div>
        <OrganizationCreateWizard open={wizardOpen} onClose={() => setWizardOpen(false)} onCreated={handleCreated} />
      </div>
    </ProfilePageShell>
  );
}
