"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrganizationPageShell } from "@/components/organization-page-shell";
import { QuestionnaireSkeleton } from "@/components/skeletons";
import { Button, Card, ErrorNotice, Field, Input, Select, Textarea } from "@/components/ui";
import { getOrganizationProfile, saveOrganizationProfile } from "@/lib/api/organizations";
import { joinList, splitList } from "@/components/form-helpers";

export default function OrganizationQuestionnairePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState({
    production_types: "",
    land_area_ha: "",
    livestock_count: "",
    main_crops: "",
    machinery: "",
    digital_maturity: "",
    support_needs: "",
    service_needs: "",
    marketplace_interests: "",
    comment: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrganizationProfile(params.id)
      .then((profile) =>
        setForm({
          production_types: joinList(profile.production_types),
          land_area_ha: profile.land_area_ha?.toString() ?? "",
          livestock_count: profile.livestock_count?.toString() ?? "",
          main_crops: joinList(profile.main_crops),
          machinery: joinList(profile.machinery),
          digital_maturity: profile.digital_maturity ?? "",
          support_needs: joinList(profile.support_needs),
          service_needs: joinList(profile.service_needs),
          marketplace_interests: joinList(profile.marketplace_interests),
          comment: profile.comment ?? "",
        })
      )
      .finally(() => setLoading(false));
  }, [params.id]);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await saveOrganizationProfile(params.id, {
        production_types: splitList(form.production_types),
        land_area_ha: form.land_area_ha ? Number(form.land_area_ha) : null,
        livestock_count: form.livestock_count ? Number(form.livestock_count) : null,
        main_crops: splitList(form.main_crops),
        machinery: splitList(form.machinery),
        digital_maturity: form.digital_maturity || null,
        support_needs: splitList(form.support_needs),
        service_needs: splitList(form.service_needs),
        marketplace_interests: splitList(form.marketplace_interests),
        comment: form.comment || null,
      });
      router.replace(`/app/organizations/${params.id}`);
    } catch {
      setError("Не удалось сохранить анкету. Проверьте числовые поля.");
    }
  }

  if (loading) {
    return (
      <OrganizationPageShell organizationId={params.id}>
        <QuestionnaireSkeleton />
      </OrganizationPageShell>
    );
  }

  return (
    <OrganizationPageShell organizationId={params.id}>
    <div className="grid gap-5">
      <div>
        <h1 className="text-3xl font-bold">Анкета хозяйства</h1>
        <p className="mt-2 text-sm text-zinc-600">Списки можно вводить через запятую.</p>
      </div>
      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2"><ErrorNotice message={error} /></div>
          <Field label="Направления производства"><Input value={form.production_types} onChange={(e) => update("production_types", e.target.value)} /></Field>
          <Field label="Площадь земли, га"><Input type="number" min="0" step="0.01" value={form.land_area_ha} onChange={(e) => update("land_area_ha", e.target.value)} /></Field>
          <Field label="Поголовье"><Input type="number" min="0" value={form.livestock_count} onChange={(e) => update("livestock_count", e.target.value)} /></Field>
          <Field label="Уровень цифровой зрелости">
            <Select value={form.digital_maturity} onChange={(e) => update("digital_maturity", e.target.value)}>
              <option value="">Не указан</option>
              <option value="Бумажный учет">Бумажный учет</option>
              <option value="Базовый учет в таблицах">Базовый учет в таблицах</option>
              <option value="Профильные системы">Профильные системы</option>
              <option value="Интегрированные цифровые процессы">Интегрированные цифровые процессы</option>
            </Select>
          </Field>
          <Field label="Основные культуры"><Input value={form.main_crops} onChange={(e) => update("main_crops", e.target.value)} /></Field>
          <Field label="Техника"><Input value={form.machinery} onChange={(e) => update("machinery", e.target.value)} /></Field>
          <Field label="Потребности в господдержке"><Input value={form.support_needs} onChange={(e) => update("support_needs", e.target.value)} /></Field>
          <Field label="Потребности в сервисах"><Input value={form.service_needs} onChange={(e) => update("service_needs", e.target.value)} /></Field>
          <Field label="Интерес к marketplace"><Input value={form.marketplace_interests} onChange={(e) => update("marketplace_interests", e.target.value)} /></Field>
          <div className="md:col-span-2">
            <Field label="Комментарий"><Textarea value={form.comment} onChange={(e) => update("comment", e.target.value)} /></Field>
          </div>
          <div className="md:col-span-2"><Button>Сохранить анкету</Button></div>
        </form>
      </Card>
    </div>
    </OrganizationPageShell>
  );
}
