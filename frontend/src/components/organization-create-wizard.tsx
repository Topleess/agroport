"use client";

import { Building2, Check, Loader2, Search, Sprout, X, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, ErrorNotice, Field, Input, Select, Textarea } from "@/components/ui";
import { createOrganization, lookupOrganization } from "@/lib/api/organizations";
import { organizationCategoryLabels, organizationTypeLabels } from "@/lib/labels";
import type { Organization, OrganizationCategory, OrganizationType } from "@/lib/types";

const organizationTypes = Object.keys(organizationTypeLabels) as OrganizationType[];

type FormState = {
  category: OrganizationCategory;
  type: OrganizationType;
  name: string;
  inn: string;
  ogrn: string;
  kpp: string;
  region: string;
  address: string;
};

const emptyForm: FormState = {
  category: "farm",
  type: "KFH",
  name: "",
  inn: "",
  ogrn: "",
  kpp: "",
  region: "",
  address: "",
};

type OrganizationCreateWizardProps = {
  open?: boolean;
  embedded?: boolean;
  onClose?: () => void;
  onCreated: (organization: Organization) => void;
};

export function OrganizationCreateWizard({
  open = true,
  embedded = false,
  onClose,
  onCreated,
}: OrganizationCreateWizardProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [lookupTouched, setLookupTouched] = useState(false);

  const normalizedInn = useMemo(() => form.inn.replace(/\D/g, ""), [form.inn]);
  const canLookup = normalizedInn.length === 10 || normalizedInn.length === 12;

  if (!open) return null;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetAndClose() {
    setStep(1);
    setForm(emptyForm);
    setError("");
    setLookupTouched(false);
    onClose?.();
  }

  async function handleLookup() {
    setError("");
    setLookupLoading(true);
    setLookupTouched(true);
    try {
      const result = await lookupOrganization(normalizedInn, form.category);
      setForm((current) => ({
        ...current,
        category: result.category,
        type: result.type,
        name: result.name,
        inn: result.inn,
        ogrn: result.ogrn ?? "",
        kpp: result.kpp ?? "",
        region: result.region ?? "",
        address: result.address ?? "",
      }));
      setStep(3);
    } catch {
      setError("Не удалось проверить ИНН. Проверьте, что указано 10 или 12 цифр.");
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setCreating(true);
    try {
      const organization = await createOrganization({
        ...form,
        inn: normalizedInn,
        ogrn: form.ogrn || undefined,
        kpp: form.kpp || undefined,
        region: form.region || undefined,
        address: form.address || undefined,
      });
      onCreated(organization);
      resetAndClose();
    } catch {
      setError("Не удалось создать организацию. Проверьте обязательные поля и ИНН.");
    } finally {
      setCreating(false);
    }
  }

  const content = (
    <div className={embedded ? "w-full" : "w-full max-w-3xl"}>
      <div className="rounded-[28px] bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.18)] md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Добавление организации</p>
            <h2 className="mt-1 text-2xl font-bold tracking-normal md:text-3xl">Создайте кабинет компании</h2>
          </div>
          {!embedded ? (
            <button
              type="button"
              onClick={resetAndClose}
              className="grid size-11 shrink-0 place-items-center rounded-2xl bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
              aria-label="Закрыть"
            >
              <X size={22} />
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {["Тип", "ИНН", "Данные"].map((label, index) => {
            const active = step >= index + 1;
            return (
              <div key={label} className={`h-2 rounded-full ${active ? "bg-emerald-500" : "bg-zinc-100"}`} />
            );
          })}
        </div>

        <div className="mt-5">
          <ErrorNotice message={error} />
        </div>

        {step === 1 ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {([
              {
                category: "farm" as const,
                title: "Хозяйство",
                description: "Производитель сельхозпродукции, КФХ, ИП или кооператив.",
                icon: Sprout,
              },
              {
                category: "solution_provider" as const,
                title: "Поставщик решений",
                description: "Сервисы, техника, цифровые продукты и консалтинг.",
                icon: Zap,
              },
            ]).map((item) => (
              <button
                key={item.category}
                type="button"
                onClick={() => {
                  update("category", item.category);
                  setStep(2);
                }}
                className="rounded-[22px] border border-zinc-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <item.icon size={24} />
                </span>
                <span className="mt-4 block text-xl font-bold">{item.title}</span>
                <span className="mt-2 block text-sm leading-6 text-zinc-500">{item.description}</span>
              </button>
            ))}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-5 grid gap-5">
            <div className="rounded-[22px] bg-zinc-50 p-4">
              <p className="text-sm font-semibold text-zinc-900">{organizationCategoryLabels[form.category]}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">Введите ИНН. В MVP реквизиты подтянутся из демонстрационного справочника, а недостающие поля можно поправить вручную.</p>
            </div>
            <Field label="ИНН">
              <Input
                value={form.inn}
                inputMode="numeric"
                placeholder="10 или 12 цифр"
                onChange={(event) => update("inn", event.target.value.replace(/\D/g, ""))}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>Назад</Button>
              <Button type="button" onClick={handleLookup} disabled={!canLookup || lookupLoading}>
                {lookupLoading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                Проверить ИНН
              </Button>
              <Button type="button" variant="ghost" onClick={() => setStep(3)} disabled={!canLookup}>
                Заполнить вручную
              </Button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <form onSubmit={handleCreate} className="mt-5 grid gap-4 md:grid-cols-2">
            {lookupTouched ? (
              <div className="md:col-span-2 rounded-[18px] bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
                <Check className="mr-2 inline" size={17} />
                Проверьте реквизиты перед созданием. Все поля можно уточнить сейчас или позже в кабинете организации.
              </div>
            ) : null}
            <Field label="Категория">
              <Select value={form.category} onChange={(event) => update("category", event.target.value as OrganizationCategory)}>
                <option value="farm">Хозяйство</option>
                <option value="solution_provider">Поставщик решений</option>
              </Select>
            </Field>
            <Field label="Тип юрлица">
              <Select value={form.type} onChange={(event) => update("type", event.target.value as OrganizationType)}>
                {organizationTypes.map((type) => (
                  <option key={type} value={type}>{organizationTypeLabels[type]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Название">
              <Input value={form.name} required onChange={(event) => update("name", event.target.value)} />
            </Field>
            <Field label="ИНН">
              <Input value={form.inn} required inputMode="numeric" onChange={(event) => update("inn", event.target.value.replace(/\D/g, ""))} />
            </Field>
            <Field label="ОГРН/ОГРНИП">
              <Input value={form.ogrn} onChange={(event) => update("ogrn", event.target.value)} />
            </Field>
            <Field label="КПП">
              <Input value={form.kpp} onChange={(event) => update("kpp", event.target.value)} />
            </Field>
            <Field label="Регион">
              <Input value={form.region} onChange={(event) => update("region", event.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Адрес">
                <Textarea value={form.address} onChange={(event) => update("address", event.target.value)} />
              </Field>
            </div>
            <div className="flex flex-wrap gap-2 md:col-span-2">
              <Button type="button" variant="secondary" onClick={() => setStep(2)}>Назад</Button>
              <Button disabled={creating || !form.name || !canLookup}>
                {creating ? <Loader2 className="animate-spin" size={18} /> : <Building2 size={18} />}
                {creating ? "Создаем..." : "Создать организацию"}
              </Button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/35 px-4 py-5 backdrop-blur-sm md:py-10">
      <div className="mx-auto flex min-h-full items-start justify-center md:items-center">{content}</div>
    </div>
  );
}
