"use client";

import Link from "next/link";
import { Edit3, FileText, Plus, Send, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { OrganizationPageShell } from "@/components/organization-page-shell";
import { SolutionWizard } from "@/components/solution-wizard";
import { Button, StatusBadge } from "@/components/ui";
import { getSolution, listOrganizationSolutions, listSolutionRequests, submitSolutionForModeration } from "@/lib/api/solutions";
import { solutionStatusClasses, solutionStatusLabels } from "@/lib/labels";
import type { FarmerRequest, SolutionDetail, SolutionSummary } from "@/lib/types";

export default function OrganizationSolutionsPage() {
  const params = useParams<{ id: string }>();
  const [solutions, setSolutions] = useState<SolutionSummary[]>([]);
  const [requests, setRequests] = useState<Record<number, FarmerRequest[]>>({});
  const [editing, setEditing] = useState<SolutionDetail | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  useEffect(() => {
    listOrganizationSolutions(params.id)
      .then((items) => {
        setSolutions(items);
        return Promise.all(
          items.map((item) =>
            listSolutionRequests(item.id)
              .then((solutionRequests) => [item.id, solutionRequests] as const)
              .catch(() => [item.id, []] as const),
          ),
        );
      })
      .then((entries) => {
        setRequests(Object.fromEntries(entries));
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  async function openEdit(solutionId: number) {
    const detail = await getSolution(solutionId);
    setEditing(detail);
    setWizardOpen(true);
  }

  function handleSaved(solution: SolutionDetail) {
    setSolutions((current) => {
      const summary: SolutionSummary = solution;
      const exists = current.some((item) => item.id === solution.id);
      return exists ? current.map((item) => (item.id === solution.id ? summary : item)) : [summary, ...current];
    });
    setEditing(solution);
  }

  async function submit(solution: SolutionSummary) {
    setActionId(solution.id);
    try {
      const updated = await submitSolutionForModeration(params.id, solution.id);
      handleSaved(updated);
    } finally {
      setActionId(null);
    }
  }

  return (
    <OrganizationPageShell organizationId={params.id}>
      <div className="grid gap-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Кабинет поставщика</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">Цифровые решения</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Создавайте карточки решений, отправляйте их на модерацию и смотрите заявки от аграриев.
            </p>
          </div>
          <Button
            className="rounded-2xl"
            onClick={() => {
              setEditing(null);
              setWizardOpen(true);
            }}
          >
            <Plus size={18} />
            Добавить решение
          </Button>
        </section>

        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-44 animate-pulse rounded-[24px] bg-zinc-100" />
            ))}
          </div>
        ) : solutions.length ? (
          <div className="grid gap-4">
            {solutions.map((solution) => (
              <article key={solution.id} className="rounded-[24px] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge className={solutionStatusClasses[solution.status] ?? "bg-zinc-100 text-zinc-700"}>
                        {solutionStatusLabels[solution.status] ?? solution.status}
                      </StatusBadge>
                      <span className="text-xs font-semibold text-zinc-400">
                        {requests[solution.id]?.length ?? 0} заявок
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-bold">{solution.name}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
                      {solution.short_description || "Краткое описание не заполнено."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {solution.status === "published" ? (
                      <Link href={`/solutions/${solution.id}`} className="inline-flex h-11 items-center gap-2 rounded-2xl border border-zinc-200 px-4 text-sm font-semibold hover:bg-zinc-50">
                        <Sparkles size={18} />
                        Карточка
                      </Link>
                    ) : null}
                    <Button variant="secondary" className="rounded-2xl" onClick={() => openEdit(solution.id)}>
                      <Edit3 size={18} />
                      Открыть
                    </Button>
                    {solution.status !== "pending_moderation" && solution.status !== "published" ? (
                      <Button className="rounded-2xl" onClick={() => submit(solution)} disabled={actionId === solution.id}>
                        <Send size={18} />
                        На модерацию
                      </Button>
                    ) : null}
                  </div>
                </div>
                {requests[solution.id]?.length ? (
                  <div className="mt-5 grid gap-2 rounded-2xl bg-zinc-50 p-3">
                    {requests[solution.id].slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm">
                        <span className="inline-flex min-w-0 items-center gap-2">
                          <FileText size={17} className="shrink-0 text-emerald-600" />
                          <span className="truncate font-semibold">{request.contact_name}</span>
                        </span>
                        <span className="shrink-0 text-zinc-500">{request.status}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
            <p className="text-xl font-bold">Решений пока нет</p>
            <p className="mt-2 text-sm text-zinc-500">Добавьте первое решение и отправьте его на модерацию.</p>
          </div>
        )}
      </div>
      <SolutionWizard
        key={wizardOpen ? editing?.id ?? "new" : "closed"}
        organizationId={params.id}
        open={wizardOpen}
        solution={editing}
        onClose={() => setWizardOpen(false)}
        onSaved={handleSaved}
      />
    </OrganizationPageShell>
  );
}
