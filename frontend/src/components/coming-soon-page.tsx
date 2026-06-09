import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, LinkButton, StatusBadge } from "@/components/ui";

export function ComingSoonPage({
  title,
  description,
  plannedFeatures,
}: {
  title: string;
  description: string;
  plannedFeatures: string[];
}) {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <StatusBadge className="bg-amber-100 text-amber-800">Раздел в разработке</StatusBadge>
          <h1 className="mt-3 text-3xl font-bold tracking-normal md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">{description}</p>
        </div>
        <LinkButton href="/app" variant="secondary">
          <ArrowLeft size={17} />
          Вернуться в кабинет
        </LinkButton>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plannedFeatures.map((feature) => (
          <Card key={feature} className="rounded-[24px] border-0 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
            <CheckCircle2 className="text-emerald-600" size={22} />
            <h2 className="mt-4 text-base font-semibold">{feature}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">Будет связано с профилем хозяйства и статусами заявок.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
