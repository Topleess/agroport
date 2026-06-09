import Link from "next/link";
import { CheckCircle2, Plus } from "lucide-react";
import { CabinetShell } from "@/components/platform-shell";
import { DataRow, Metric } from "@/components/cards";
import { OnboardingModal } from "@/components/onboarding-modal";
import { applications, farmerProfile, marketplaceItems, supportMeasures } from "@/lib/mock-data";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ onboarding?: string }> }) {
  const { onboarding } = await searchParams;

  return (
    <CabinetShell eyebrow="Кабинет • Профиль" title={farmerProfile.farm} description={`${farmerProfile.owner}. ${farmerProfile.type}. ${farmerProfile.scale}.`}>
      <section className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="rounded-3xl border border-emerald-100 bg-[linear-gradient(105deg,#f2fff8,#e9fbff)] p-6">
          <div className="flex h-1.5 overflow-hidden rounded-full bg-white/80">
            <div className="rounded-full bg-emerald-500" style={{ width: `${farmerProfile.completion}%` }} />
          </div>
          <h2 className="mt-6 text-2xl font-semibold">Профиль заполнен на {farmerProfile.completion}%</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            Заполните данные о выручке, технике и документах, чтобы рекомендации по грантам, кредитам и покупателям были точнее.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {farmerProfile.missing.map((item) => (
              <span key={item} className="rounded-full bg-white px-3 py-1 text-sm text-amber-700 ring-1 ring-amber-100">{item}</span>
            ))}
          </div>
          <Link href="/profile?onboarding=1" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white">
            <Plus size={17} />
            Продолжить заполнение
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <Metric label="Рекомендаций" value={`${supportMeasures.length} мер`} />
          <Metric label="Товаров в кабинете" value={`${marketplaceItems.length}`} />
          <Metric label="Заявок" value={`${applications.length}`} />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-zinc-200 p-6">
        <h2 className="text-2xl font-semibold">Данные хозяйства</h2>
        <dl className="mt-5 divide-y divide-zinc-100">
          <DataRow label="Регион" value={farmerProfile.region} />
          <DataRow label="Направления" value={farmerProfile.sectors.join(", ")} />
          <DataRow label="Масштаб" value={farmerProfile.scale} />
          <DataRow label="Цель сезона" value={farmerProfile.seasonGoal} />
          <DataRow label="Документы" value={farmerProfile.documents.join(", ")} />
        </dl>
      </section>

      <section className="mt-10 rounded-3xl bg-zinc-50 p-6">
        <h2 className="text-2xl font-semibold">Быстрые действия в кабинете</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            ["Мои товары", "/profile/products"],
            ["Мои заявки", "/profile/applications"],
            ["Сервисы хозяйства", "/profile/services"],
          ].map(([label, href]) => (
            <Link key={label} href={href} className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-semibold">
              <CheckCircle2 className="text-emerald-500" size={18} />
              {label}
            </Link>
          ))}
        </div>
      </section>

      {onboarding === "1" ? <OnboardingModal /> : null}
    </CabinetShell>
  );
}
