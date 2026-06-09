"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AuthGuard } from "@/components/auth-guard";
import { Button, Card, Select } from "@/components/ui";
import { approveOrganization, listAdminOrganizations, rejectOrganization } from "@/lib/api/admin";
import { organizationTypeLabels, verificationStatusClasses, verificationStatusLabels } from "@/lib/labels";
import type { Organization } from "@/lib/types";

export default function AdminOrganizationsPage() {
  const [status, setStatus] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const load = useCallback((nextStatus = "") => {
    listAdminOrganizations(nextStatus || undefined).then(setOrganizations);
  }, []);

  useEffect(() => {
    load("");
  }, [load]);

  async function changeStatus(id: number, action: "approve" | "reject") {
    const updated = action === "approve" ? await approveOrganization(id) : await rejectOrganization(id);
    setOrganizations((current) => current.map((item) => (item.id === id ? updated : item)));
  }

  return (
    <AuthGuard>
      <AppShell>
        <div className="grid gap-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">Админка: проверка хозяйств</h1>
              <p className="mt-2 text-sm text-zinc-600">Подтверждение и отклонение организаций в MVP.</p>
            </div>
            <div className="w-56">
              <Select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  load(event.target.value);
                }}
              >
                <option value="">Все статусы</option>
                <option value="draft">Черновик</option>
                <option value="pending_verification">Ожидает проверки</option>
                <option value="verified">Подтверждено</option>
                <option value="rejected">Отклонено</option>
              </Select>
            </div>
          </div>
          <div className="grid gap-3">
            {organizations.map((organization) => (
              <Card key={organization.id} className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">{organization.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {organizationTypeLabels[organization.type]} · ИНН {organization.inn} · {organization.region ?? "Регион не указан"}
                  </p>
                  <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${verificationStatusClasses[organization.verification_status]}`}>
                    {verificationStatusLabels[organization.verification_status]}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => changeStatus(organization.id, "approve")}>Подтвердить</Button>
                  <Button variant="danger" onClick={() => changeStatus(organization.id, "reject")}>Отклонить</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
