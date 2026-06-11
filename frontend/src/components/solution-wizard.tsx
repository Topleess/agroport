"use client";

import { Loader2, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DynamicFormFields } from "@/components/dynamic-form-fields";
import { Button, ErrorNotice, Field, Input, Textarea } from "@/components/ui";
import {
  createSolution,
  getReferenceForm,
  submitSolutionForModeration,
  updateSolution,
} from "@/lib/api/solutions";
import type { FormTemplate, SolutionDetail, SolutionPayload } from "@/lib/types";

type SolutionWizardProps = {
  organizationId: string | number;
  open: boolean;
  solution?: SolutionDetail | null;
  onClose: () => void;
  onSaved: (solution: SolutionDetail) => void;
};

type CoreState = {
  name: string;
  short_description: string;
  full_description: string;
  price_from: string;
};

export function SolutionWizard({ organizationId, open, solution, onClose, onSaved }: SolutionWizardProps) {
  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [core, setCore] = useState<CoreState>({
    name: solution?.name ?? "",
    short_description: solution?.short_description ?? "",
    full_description: solution?.full_description ?? "",
    price_from: solution?.price_from ? String(solution.price_from) : "",
  });
  const [extraFields, setExtraFields] = useState<Record<string, unknown>>(solution?.extra_fields ?? {});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    getReferenceForm("supplier")
      .then(setTemplate)
      .catch(() => setError("Не удалось загрузить поля формы решения."))
      .finally(() => setLoading(false));
  }, [open]);

  const groupedFields = useMemo(() => {
    const fields = template?.fields ?? [];
    const middle = Math.ceil(fields.length / 2);
    return [fields.slice(0, middle), fields.slice(middle)];
  }, [template]);

  if (!open) return null;

  function updateCore<K extends keyof CoreState>(key: K, value: CoreState[K]) {
    setCore((current) => ({ ...current, [key]: value }));
  }

  async function saveDraft() {
    setSaving(true);
    setError("");
    const payload: SolutionPayload = {
      name: core.name || undefined,
      short_description: core.short_description || undefined,
      full_description: core.full_description || undefined,
      price_from: core.price_from || undefined,
      extra_fields: extraFields,
      taxonomy_l4_ids: Array.isArray(extraFields.l4_solution_types) ? extraFields.l4_solution_types.map(String) : [],
    };
    try {
      const saved = solution
        ? await updateSolution(organizationId, solution.id, payload)
        : await createSolution(organizationId, payload);
      onSaved(saved);
      return saved;
    } catch {
      setError("Не удалось сохранить решение. Проверьте обязательные поля.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function saveAndSubmit() {
    setSubmitting(true);
    const saved = await saveDraft();
    if (!saved) {
      setSubmitting(false);
      return;
    }
    try {
      const submitted = await submitSolutionForModeration(organizationId, saved.id);
      onSaved(submitted);
      onClose();
    } catch {
      setError("Черновик сохранён, но отправка на модерацию не удалась.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/35 px-4 py-5 backdrop-blur-sm md:py-10">
      <div className="mx-auto flex min-h-full max-w-5xl items-start justify-center md:items-center">
        <div className="w-full rounded-[28px] bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.18)] md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-600">Цифровое решение</p>
              <h2 className="mt-1 text-2xl font-bold tracking-normal md:text-3xl">
                {solution ? "Редактирование решения" : "Новое решение"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-11 shrink-0 place-items-center rounded-2xl bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
              aria-label="Закрыть"
            >
              <X size={22} />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {["Основное", "Поля решения", "Публикация"].map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index + 1)}
                className={`h-2 rounded-full transition ${step >= index + 1 ? "bg-emerald-500" : "bg-zinc-100"}`}
                aria-label={label}
              />
            ))}
          </div>

          <div className="mt-5">
            <ErrorNotice message={error} />
          </div>

          {loading ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-2xl bg-zinc-100" />
              ))}
            </div>
          ) : null}

          {!loading && step === 1 ? (
            <div className="mt-6 grid gap-4">
              <Field label="Название решения *">
                <Input value={core.name} required onChange={(event) => updateCore("name", event.target.value)} />
              </Field>
              <Field label="Краткое описание">
                <Input value={core.short_description} onChange={(event) => updateCore("short_description", event.target.value)} />
              </Field>
              <Field label="Полное описание">
                <Textarea value={core.full_description} onChange={(event) => updateCore("full_description", event.target.value)} />
              </Field>
              <Field label="Стоимость от, руб.">
                <Input value={core.price_from} inputMode="decimal" onChange={(event) => updateCore("price_from", event.target.value)} />
              </Field>
            </div>
          ) : null}

          {!loading && step === 2 ? (
            <div className="mt-6">
              <DynamicFormFields
                fields={groupedFields[0] ?? []}
                values={extraFields}
                onChange={(key, value) => setExtraFields((current) => ({ ...current, [key]: value }))}
              />
            </div>
          ) : null}

          {!loading && step === 3 ? (
            <div className="mt-6">
              <DynamicFormFields
                fields={groupedFields[1] ?? []}
                values={extraFields}
                onChange={(key, value) => setExtraFields((current) => ({ ...current, [key]: value }))}
              />
              <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                После отправки решение попадёт в модерацию. Когда администратор примет решение, уведомление появится в кабинете пользователя и организации.
              </div>
            </div>
          ) : null}

          <div className="mt-7 flex flex-wrap justify-between gap-2">
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
                Назад
              </Button>
              <Button type="button" variant="secondary" onClick={() => setStep(Math.min(3, step + 1))} disabled={step === 3}>
                Далее
              </Button>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={saveDraft} disabled={saving || submitting || !core.name}>
                {saving ? <Loader2 className="animate-spin" size={18} /> : null}
                Сохранить черновик
              </Button>
              <Button type="button" onClick={saveAndSubmit} disabled={saving || submitting || !core.name}>
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                Отправить на модерацию
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
