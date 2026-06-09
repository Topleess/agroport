"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export const profileNavigationItems: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: "Профиль", href: "/app/profile", icon: UserRound },
  { label: "Уведомления", href: "/app/profile/notifications", icon: Bell },
  { label: "Заявки", href: "/app/profile/applications", icon: FileText },
  { label: "Обучение", href: "/app/profile/learning", icon: BookOpen },
  { label: "Мероприятия", href: "/app/profile/events", icon: CalendarDays },
  { label: "Сервисы", href: "/app/profile/services", icon: BriefcaseBusiness },
  { label: "Организации", href: "/app/profile/organizations", icon: Building2 },
];

export function ProfileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:grid lg:gap-1.5">
      {profileNavigationItems.map((item) => {
        const active = item.href === "/app/profile"
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
