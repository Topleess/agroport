import { CheckCircle2 } from "lucide-react";
import { ProfilePageShell } from "@/components/profile-page-shell";
import { Card, StatusBadge } from "@/components/ui";

export function ProfilePlaceholderPage({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <ProfilePageShell>
      <div className="grid gap-6">
        <div>
          <StatusBadge className="bg-emerald-50 text-emerald-700">Личный кабинет</StatusBadge>
          <h1 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <Card key={item} className="rounded-[22px] border-0 p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
              <CheckCircle2 className="text-emerald-600" size={22} />
              <h2 className="mt-4 text-base font-semibold">{item}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">Раздел будет связан с вашими данными и организациями.</p>
            </Card>
          ))}
        </div>
      </div>
    </ProfilePageShell>
  );
}
