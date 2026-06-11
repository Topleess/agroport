"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getOrganizationNavigationItems } from "@/components/organization-navigation";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  HandCoins,
  LifeBuoy,
  LogOut,
  type LucideIcon,
  Menu,
  Plus,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Organization, UserProfile } from "@/lib/types";

const navigationGroups: Array<{
  key: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  links: Array<{ label: string; href: string; description: string }>;
}> = [
  {
    key: "sales",
    title: "Спрос и продажи",
    description: "Клиенты, заявки, витрина и партнерские каналы продаж.",
    href: "/app/marketplace",
    icon: ShoppingBag,
    links: [
      { label: "Marketplace", href: "/app/marketplace", description: "Витрина товаров и услуг" },
      { label: "Запросы", href: "/app/requests", description: "Покупатели, услуги и отклики" },
      { label: "Экспорт", href: "/app/export", description: "Подготовка к внешним рынкам" },
    ],
  },
  {
    key: "support",
    title: "Меры поддержки",
    description: "Субсидии, гранты, льготные продукты и консультации.",
    href: "/app/support",
    icon: HandCoins,
    links: [
      { label: "Субсидии", href: "/app/support", description: "Подходящие программы поддержки" },
      { label: "Финансы", href: "/app/finance", description: "Кредиты, гарантии и лизинг" },
      { label: "Центр поддержки", href: "/app/support-center", description: "Помощь и обращения" },
    ],
  },
  {
    key: "services",
    title: "Сервисы",
    description: "Операционные сервисы для хозяйства и развития бизнеса.",
    href: "/app/services",
    icon: BriefcaseBusiness,
    links: [
      { label: "Каталог сервисов", href: "/app/services", description: "Цифровые и операционные услуги" },
      { label: "Кооперация", href: "/app/cooperation", description: "Партнеры, закупки и логистика" },
      { label: "Заявки", href: "/app/applications", description: "Единая история обращений" },
    ],
  },
  {
    key: "growth",
    title: "Развитие",
    description: "Обучение, события и инфраструктурные возможности.",
    href: "/app/learning",
    icon: GraduationCap,
    links: [
      { label: "Обучение", href: "/app/learning", description: "Курсы и материалы" },
      { label: "Мероприятия", href: "/app/events", description: "Календарь встреч и выставок" },
      { label: "Инфраструктура", href: "/app/cooperation", description: "Площадки, партнеры и проекты" },
    ],
  },
];

const searchRecommendations: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: "Найти меры поддержки", href: "/app/support", icon: HandCoins },
  { label: "Добавить хозяйство", href: "/app/organizations/new", icon: Plus },
  { label: "Открыть анкету организации", href: "/app/organizations", icon: Building2 },
  { label: "Посмотреть заявки", href: "/app/applications", icon: FileText },
  { label: "Сервисы для хозяйства", href: "/app/services", icon: BriefcaseBusiness },
  { label: "Центр поддержки", href: "/app/support-center", icon: LifeBuoy },
];

const userActions: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: "Профиль", href: "/app/profile", icon: UserRound },
  { label: "Уведомления", href: "/app/profile/notifications", icon: Bell },
  { label: "Заявки", href: "/app/profile/applications", icon: FileText },
  { label: "Обучение", href: "/app/profile/learning", icon: BookOpen },
  { label: "Мероприятия", href: "/app/profile/events", icon: CalendarDays },
  { label: "Сервисы", href: "/app/profile/services", icon: BriefcaseBusiness },
  { label: "Организации", href: "/app/profile/organizations", icon: Building2 },
];

type PlatformHeaderProps = {
  mode?: "app" | "auth";
  profile?: UserProfile | null;
  organizations?: Organization[];
  onLogout?: () => void | Promise<void>;
};

export function PlatformHeader({
  mode = "app",
  profile = null,
  organizations = [],
  onLogout,
}: PlatformHeaderProps) {
  const pathname = usePathname();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userPanelOpen, setUserPanelOpen] = useState(false);
  const [activeNavKey, setActiveNavKey] = useState(navigationGroups[0].key);
  const overlayOpen = navigationOpen || searchOpen || userPanelOpen;
  const showUserControl = mode === "app";
  const homeHref = mode === "auth" ? "/" : "/app";
  const organizationMatch = pathname.match(/^\/app\/organizations\/(\d+)/);
  const currentOrganizationId = organizationMatch?.[1] ?? null;
  const currentOrganization = currentOrganizationId
    ? organizations.find((organization) => String(organization.id) === currentOrganizationId) ?? null
    : null;

  useEffect(() => {
    if (!overlayOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlayOpen]);

  const initials = useMemo(() => {
    const first = profile?.first_name?.[0] ?? "А";
    const last = profile?.last_name?.[0] ?? "";
    return `${first}${last}`.toUpperCase();
  }, [profile]);

  const latestOrganization = organizations[0];
  const otherOrganizations = currentOrganizationId
    ? organizations.filter((organization) => String(organization.id) !== currentOrganizationId)
    : [];
  const displayName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "Пользователь";
  const activeNavigationGroup = navigationGroups.find((group) => group.key === activeNavKey) ?? navigationGroups[0];
  const organizationPanelActions = currentOrganizationId ? getOrganizationNavigationItems(currentOrganizationId) : [];

  function closeOverlays() {
    setNavigationOpen(false);
    setSearchOpen(false);
    setUserPanelOpen(false);
  }

  function isPanelItemActive(href: string) {
    if (href === "/app/profile") {
      return pathname === href;
    }
    if (currentOrganizationId && href === `/app/organizations/${currentOrganizationId}`) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header className="sticky top-0 z-40 mx-auto flex max-w-[1760px] items-center gap-2 px-4 py-4 md:gap-3 md:px-8">
        <Link href={homeHref} className="mr-1 flex h-12 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-white md:mr-3 md:h-14 md:w-20">
          А
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="grid size-11 place-items-center rounded-xl bg-white/22 text-white backdrop-blur transition hover:bg-white/30 md:size-12"
            aria-label="Поиск"
          >
            <Search size={21} />
          </button>
          <button
            type="button"
            onClick={() => setNavigationOpen(true)}
            className="grid size-11 place-items-center rounded-xl bg-white/22 text-white backdrop-blur transition hover:bg-white/30 md:size-12"
            aria-label="Навигация по платформе"
          >
            <Menu size={22} />
          </button>
          {showUserControl ? (
            <button
              type="button"
              onClick={() => setUserPanelOpen(true)}
              className="grid size-11 place-items-center rounded-xl bg-white/28 backdrop-blur transition hover:bg-white/34 md:size-12"
              aria-label="Меню пользователя"
            >
              <span className="grid size-9 place-items-center rounded-full bg-white text-sm font-black text-emerald-700 shadow-sm">
                {initials}
              </span>
            </button>
          ) : null}
        </div>
      </header>

      {searchOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white/96 px-4 py-5 backdrop-blur-xl md:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <Link href={homeHref} onClick={closeOverlays} className="flex h-12 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-black text-white">
              А
            </Link>
            <button type="button" onClick={() => setSearchOpen(false)} className="grid size-11 place-items-center rounded-xl bg-zinc-100 text-zinc-800 hover:bg-zinc-200" aria-label="Закрыть поиск">
              <X size={22} />
            </button>
          </div>

          <div className="mx-auto mt-8 max-w-3xl md:mt-14">
            <p className="text-sm font-bold text-emerald-600">Поиск</p>
            <h2 className="mt-2 text-4xl font-black tracking-normal md:text-5xl">Поиск по платформе</h2>
            <label className="mt-7 flex h-16 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 shadow-sm focus-within:border-emerald-500 focus-within:bg-white">
              <Search className="shrink-0 text-zinc-400" size={23} />
              <input
                autoFocus
                type="search"
                placeholder="Введите услугу, меру поддержки или раздел"
                className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-zinc-400 md:text-lg"
              />
            </label>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {searchRecommendations.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={closeOverlays}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <item.icon size={21} />
                  </span>
                  <span className="text-sm font-bold md:text-base">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {navigationOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white px-4 py-5 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <Link href={homeHref} onClick={closeOverlays} className="flex h-12 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-black text-white">
              А
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setNavigationOpen(false);
                  setSearchOpen(true);
                }}
                className="grid size-11 place-items-center rounded-xl bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                aria-label="Открыть поиск"
              >
                <Search size={21} />
              </button>
              <button type="button" onClick={() => setNavigationOpen(false)} className="grid size-11 place-items-center rounded-xl bg-zinc-100 text-zinc-800 hover:bg-zinc-200" aria-label="Закрыть навигацию">
                <X size={22} />
              </button>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-7xl">
            <p className="text-sm font-bold text-emerald-600">Разделы и меры поддержки</p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">Навигация по платформе</h2>
          </div>

          <div className="mx-auto mt-7 grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
            <aside className="rounded-3xl bg-zinc-50 p-2">
              {navigationGroups.map((group) => (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => setActiveNavKey(group.key)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-4 text-left transition ${
                    activeNavKey === group.key ? "bg-white shadow-sm" : "hover:bg-white/70"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-600">
                      <group.icon size={21} />
                    </span>
                    <span className="font-bold">{group.title}</span>
                  </span>
                  <ArrowRight size={18} className="shrink-0 text-zinc-500" />
                </button>
              ))}
            </aside>

            <section className="min-h-[560px] rounded-3xl bg-white">
              <div className="rounded-3xl border border-emerald-100 bg-[linear-gradient(110deg,#effff9_0%,#c8fbff_100%)] p-6 md:p-8">
                <div className="flex max-w-3xl items-start gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/75 text-emerald-600">
                    <activeNavigationGroup.icon size={28} />
                  </span>
                  <div>
                    <h2 className="text-2xl font-black md:text-3xl">{activeNavigationGroup.title}</h2>
                    <p className="mt-2 max-w-2xl text-base text-zinc-700 md:text-lg">{activeNavigationGroup.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {activeNavigationGroup.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeOverlays}
                    className="group rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span>
                        <span className="text-xl font-black">{item.label}</span>
                        <span className="mt-2 block text-base text-zinc-500">{item.description}</span>
                      </span>
                      <ArrowRight className="mt-1 shrink-0 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" size={22} />
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-8 grid gap-4 rounded-3xl bg-zinc-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/app/marketplace" onClick={closeOverlays} className="rounded-2xl bg-white p-4 font-bold shadow-sm hover:shadow-md">Витрина</Link>
                <Link href="/app/support" onClick={closeOverlays} className="rounded-2xl bg-white p-4 font-bold shadow-sm hover:shadow-md">Меры поддержки</Link>
                <Link href="/app/finance" onClick={closeOverlays} className="rounded-2xl bg-white p-4 font-bold shadow-sm hover:shadow-md">Финансы</Link>
              </div>
            </section>
          </div>
        </div>
      ) : null}

      {showUserControl && userPanelOpen ? (
        <div className="fixed inset-0 z-50 bg-zinc-950/20 backdrop-blur-sm">
          <aside className="ml-auto flex h-full w-full max-w-[460px] flex-col overflow-y-auto bg-white p-5 shadow-2xl sm:rounded-l-[28px] sm:p-7">
            <div className="flex justify-end">
              <button type="button" onClick={() => setUserPanelOpen(false)} className="grid size-11 place-items-center rounded-xl bg-zinc-100 text-zinc-800 hover:bg-zinc-200" aria-label="Закрыть меню пользователя">
                <X size={22} />
              </button>
            </div>

            <div className="mt-1 flex flex-col items-center text-center">
              <span className="grid size-22 place-items-center rounded-full bg-zinc-950 text-3xl font-black text-white shadow-xl">
                {currentOrganization ? currentOrganization.name[0]?.toUpperCase() ?? "О" : initials}
              </span>
              <h2 className="mt-4 text-2xl font-bold">{currentOrganization?.name ?? displayName}</h2>
              <p className="mt-1 text-base text-zinc-400">{currentOrganization ? "Кабинет организации" : "Кабинет пользователя"}</p>
            </div>

            <nav className="mt-6 grid gap-1">
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {currentOrganization ? "Навигация организации" : "Личный кабинет"}
              </p>
              {(currentOrganization ? organizationPanelActions : userActions).map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={closeOverlays}
                  className={`flex items-center gap-4 rounded-2xl px-3 py-2.5 text-lg font-semibold transition hover:bg-zinc-50 ${
                    isPanelItemActive(item.href) ? "bg-emerald-50 text-emerald-700" : ""
                  }`}
                >
                  <span className="grid size-11 shrink-0 place-items-center text-zinc-400">
                    <item.icon size={25} strokeWidth={1.8} />
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {currentOrganization ? (
              <div className="mt-6">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <span>Личный кабинет и организации</span>
                  <span className="h-px flex-1 bg-zinc-200" />
                </div>
                <div className="mt-4 grid gap-3">
                  <Link
                    href="/app/profile"
                    onClick={closeOverlays}
                    className="flex min-w-0 items-center gap-4 rounded-2xl p-2 transition hover:bg-zinc-50"
                  >
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-zinc-100 text-lg font-black text-emerald-700">
                      {initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-lg font-semibold">{displayName}</span>
                      <span className="block truncate text-base text-zinc-400">Личный кабинет физлица</span>
                    </span>
                  </Link>
                  {otherOrganizations.map((organization) => (
                    <Link
                      key={organization.id}
                      href={`/app/organizations/${organization.id}`}
                      onClick={closeOverlays}
                      className="flex min-w-0 items-center gap-4 rounded-2xl p-2 transition hover:bg-zinc-50"
                    >
                      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-zinc-100 text-lg font-black text-zinc-700">
                        {organization.name[0]?.toUpperCase() ?? "О"}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-lg font-semibold">{organization.name}</span>
                        <span className="block truncate text-base text-zinc-400">Кабинет организации</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <span>Организация</span>
                  <span className="h-px flex-1 bg-zinc-200" />
                </div>
                <div className="mt-4 grid gap-3">
                  {latestOrganization ? (
                  <Link
                    href={`/app/organizations/${latestOrganization.id}`}
                    onClick={closeOverlays}
                    className="flex items-center gap-4 rounded-2xl p-2 transition hover:bg-zinc-50"
                  >
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-zinc-100 text-lg font-black text-zinc-700">
                      {latestOrganization.name[0]?.toUpperCase() ?? "О"}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-lg font-semibold">{latestOrganization.name}</span>
                      <span className="block text-base text-zinc-400">Кабинет организации</span>
                    </span>
                  </Link>
                  ) : null}
                  <Link
                    href="/app/organizations/new"
                    onClick={closeOverlays}
                    className="flex items-center gap-4 rounded-2xl p-2 text-lg font-semibold transition hover:bg-zinc-50"
                  >
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-zinc-100">
                      <Plus size={30} />
                    </span>
                    Добавить хозяйство
                  </Link>
                </div>
              </div>
            )}

            {onLogout ? (
              <button
                type="button"
                onClick={onLogout}
                className="mt-6 flex items-center gap-4 rounded-2xl px-3 py-3 text-left text-base font-semibold text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-950"
              >
                <LogOut size={24} />
                Выйти
              </button>
            ) : null}
          </aside>
        </div>
      ) : null}
    </>
  );
}
