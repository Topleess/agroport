"use client";

import { PackagePlus, Pencil, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { OrganizationPageShell } from "@/components/organization-page-shell";
import { Skeleton } from "@/components/skeletons";
import { Button, Card, ErrorNotice, Field, Input, Select, Textarea } from "@/components/ui";
import {
  createOrganizationProduct,
  listOrganizationProducts,
  updateOrganizationProduct,
} from "@/lib/api/organizations";
import { productCategoryLabels } from "@/lib/labels";
import type { OrganizationProduct, ProductCategory } from "@/lib/types";

const productCategories = Object.keys(productCategoryLabels) as ProductCategory[];
const emptyForm = {
  category: "vegetables" as ProductCategory,
  name: "",
  description: "",
  unit: "",
  price: "",
};

export default function OrganizationProductsPage() {
  const params = useParams<{ id: string }>();
  const [products, setProducts] = useState<OrganizationProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<OrganizationProduct | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    listOrganizationProducts(params.id)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [params.id]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreateModal() {
    setSelectedProduct(null);
    setForm(emptyForm);
    setError("");
    setModalMode("create");
  }

  function openProductModal(product: OrganizationProduct) {
    setSelectedProduct(product);
    setForm({
      category: product.category,
      name: product.name,
      description: product.description ?? "",
      unit: product.unit ?? "",
      price: product.price === null ? "" : String(product.price),
    });
    setError("");
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedProduct(null);
    setError("");
    setForm(emptyForm);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      category: form.category,
      name: form.name,
      description: form.description || undefined,
      unit: form.unit || undefined,
      price: form.price || null,
    };
    try {
      if (modalMode === "edit" && selectedProduct) {
        const product = await updateOrganizationProduct(params.id, selectedProduct.id, payload);
        setProducts((current) => current.map((item) => (item.id === product.id ? product : item)));
      } else {
        const product = await createOrganizationProduct(params.id, payload);
        setProducts((current) => [product, ...current]);
      }
      closeModal();
    } catch {
      setError("Не удалось сохранить продукцию. Проверьте название и цену.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <OrganizationPageShell organizationId={params.id}>
      <div className="grid gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Кабинет организации</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">Продукция</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Добавьте товары, услуги или решения, которые организация сможет использовать в витрине и заявках.</p>
          </div>
          <Button type="button" onClick={openCreateModal} className="shrink-0">
            <PackagePlus size={18} />
            Добавить
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-36 rounded-[22px]" />
            <Skeleton className="h-36 rounded-[22px]" />
          </div>
        ) : products.length === 0 ? (
          <Card className="rounded-[24px] border-0 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
            <h2 className="text-xl font-bold">Продукции пока нет</h2>
            <p className="mt-2 text-sm text-zinc-500">Добавьте первую позицию, чтобы подготовить профиль организации к витрине.</p>
            <Button type="button" onClick={openCreateModal} className="mt-5">
              <PackagePlus size={18} />
              Добавить
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => openProductModal(product)}
                className="rounded-[22px] text-left transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              >
                <Card className="h-full rounded-[22px] border-0 p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {productCategoryLabels[product.category]}
                  </span>
                  <h2 className="mt-4 text-xl font-bold">{product.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{product.description || "Описание не добавлено"}</p>
                  <p className="mt-4 text-sm font-semibold text-zinc-700">
                    {product.price ? `${product.price} ₽` : "Цена не указана"}{product.unit ? ` · ${product.unit}` : ""}
                  </p>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>

      {modalMode ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/35 px-4 py-5 backdrop-blur-sm md:py-10">
          <div className="mx-auto w-full max-w-3xl rounded-[24px] bg-white p-5 shadow-[0_28px_90px_rgba(15,23,42,0.22)] md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-600">Продукция</p>
                <h2 className="mt-1 text-2xl font-bold tracking-normal">
                  {modalMode === "create" ? "Добавить товар" : "Карточка товара"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
                aria-label="Закрыть карточку товара"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
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
              <div className="flex flex-col-reverse gap-3 md:col-span-2 md:flex-row md:justify-end">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Закрыть
                </Button>
                <Button disabled={saving || !form.name}>
                  {modalMode === "edit" ? <Pencil size={18} /> : <PackagePlus size={18} />}
                  {saving ? "Сохраняем..." : "Сохранить"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </OrganizationPageShell>
  );
}
