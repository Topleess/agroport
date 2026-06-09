"use client";

import { PackagePlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { OrganizationPageShell } from "@/components/organization-page-shell";
import { Skeleton } from "@/components/skeletons";
import { Button, Card, ErrorNotice, Field, Input, Select, Textarea } from "@/components/ui";
import { createOrganizationProduct, listOrganizationProducts } from "@/lib/api/organizations";
import { productCategoryLabels } from "@/lib/labels";
import type { OrganizationProduct, ProductCategory } from "@/lib/types";

const productCategories = Object.keys(productCategoryLabels) as ProductCategory[];

export default function OrganizationProductsPage() {
  const params = useParams<{ id: string }>();
  const [products, setProducts] = useState<OrganizationProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    category: "vegetables" as ProductCategory,
    name: "",
    description: "",
    unit: "",
    price: "",
  });

  useEffect(() => {
    listOrganizationProducts(params.id)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [params.id]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const product = await createOrganizationProduct(params.id, {
        category: form.category,
        name: form.name,
        description: form.description || undefined,
        unit: form.unit || undefined,
        price: form.price || null,
      });
      setProducts((current) => [product, ...current]);
      setForm({ category: "vegetables", name: "", description: "", unit: "", price: "" });
    } catch {
      setError("Не удалось добавить продукцию. Проверьте название и цену.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <OrganizationPageShell organizationId={params.id}>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-semibold text-emerald-600">Кабинет организации</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">Продукция</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Добавьте товары, услуги или решения, которые организация сможет использовать в витрине и заявках.</p>
        </div>

        <Card className="rounded-[24px] border-0 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2"><ErrorNotice message={error} /></div>
            <Field label="Категория">
              <Select value={form.category} onChange={(event) => update("category", event.target.value as ProductCategory)}>
                {productCategories.map((category) => (
                  <option key={category} value={category}>{productCategoryLabels[category]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Название">
              <Input value={form.name} required onChange={(event) => update("name", event.target.value)} placeholder="Например, картофель столовый" />
            </Field>
            <Field label="Единица">
              <Input value={form.unit} onChange={(event) => update("unit", event.target.value)} placeholder="кг, тонна, услуга" />
            </Field>
            <Field label="Цена">
              <Input value={form.price} type="number" min="0" step="0.01" onChange={(event) => update("price", event.target.value)} placeholder="Необязательно" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Описание">
                <Textarea value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Коротко опишите товар или решение" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Button disabled={saving || !form.name}>
                <PackagePlus size={18} />
                {saving ? "Добавляем..." : "Добавить продукцию"}
              </Button>
            </div>
          </form>
        </Card>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-36 rounded-[22px]" />
            <Skeleton className="h-36 rounded-[22px]" />
          </div>
        ) : products.length === 0 ? (
          <Card className="rounded-[24px] border-0 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
            <h2 className="text-xl font-bold">Продукции пока нет</h2>
            <p className="mt-2 text-sm text-zinc-500">Добавьте первую позицию, чтобы подготовить профиль организации к витрине.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {products.map((product) => (
              <Card key={product.id} className="rounded-[22px] border-0 p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {productCategoryLabels[product.category]}
                </span>
                <h2 className="mt-4 text-xl font-bold">{product.name}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{product.description || "Описание не добавлено"}</p>
                <p className="mt-4 text-sm font-semibold text-zinc-700">
                  {product.price ? `${product.price} ₽` : "Цена не указана"}{product.unit ? ` · ${product.unit}` : ""}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </OrganizationPageShell>
  );
}
