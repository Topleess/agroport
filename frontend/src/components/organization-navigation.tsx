"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  ClipboardCheck,
  FileText,
  PackagePlus,
  Sparkles,
  Store,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export function getOrganizationNavigationItems(organizationId: string | number): Array<{ label: string; href: string; icon: LucideIcon }> {
  const base = `/app/organizations/${organizationId}`;
  return [
    { label: "Профиль организации", href: base, icon: Building2 },
    { label: "Анкета", href: `${base}/questionnaire`, icon: ClipboardCheck },
    { label: "Продукция", href: `${base}/products`, icon: PackagePlus },
    { label: "Решения", href: `${base}/solutions`, icon: Sparkles },
    { label: "Пользователи", href: `${base}/users`, icon: UsersRound },
    { label: "Заявки", href: `${base}/applications`, icon: FileText },
    { label: "Сервисы", href: `${base}/services`, icon: Store },
    { label: "Проверка", href: `${base}/verification`, icon: BadgeCheck },
  ];
}

export function OrganizationNavigation({ organizationId }: { organizationId: string | number }) {
  const pathname = usePathname();
  const items = getOrganizationNavigationItems(organizationId);

  return (
    <nav className="hidden lg:grid lg:gap-1.5">
      {items.map((item) => {
        const active = item.href === `/app/organizations/${organizationId}`
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              active ? "bg-emerald-50 text-emerald-600" : "text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <item.icon className={active ? "text-emerald-600" : "text-zinc-400"} size={21} strokeWidth={1.8} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
