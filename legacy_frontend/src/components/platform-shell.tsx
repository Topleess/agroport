"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Bell, Mail, Menu, Phone, UserCircle } from "lucide-react";
import { farmerProfile, profileMenu, topNav } from "@/lib/mock-data";

function Header({ transparent = false, authenticated = false }: { transparent?: boolean; authenticated?: boolean }) {
  const pathname = usePathname();
  const textClass = transparent ? "text-white" : "text-[#20212a]";
  const mutedClass = transparent ? "text-white/70" : "text-zinc-500";

  return (
    <header className={`mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-6 ${textClass}`}>
      <Link href="/" className="text-2xl font-semibold tracking-normal">
        Агропорт
      </Link>

      <nav className="hidden items-center gap-5 text-sm font-medium lg:flex">
        {topNav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`whitespace-nowrap ${active ? "font-semibold" : mutedClass} transition hover:opacity-80`}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        {authenticated ? (
          <>
            <Link href="/profile" className={`hidden whitespace-nowrap text-sm font-medium lg:block ${mutedClass}`}>
              {farmerProfile.owner}
            </Link>
            <button className={`grid size-10 place-items-center rounded-full ${transparent ? "bg-white/12" : "bg-zinc-50"}`}>
              <Bell size={18} />
            </button>
            <Link href="/profile" className={`grid size-10 place-items-center rounded-full ${transparent ? "bg-white/12" : "bg-zinc-50 text-zinc-600"}`}>
              <UserCircle size={20} />
            </Link>
          </>
        ) : (
          <Link href="/login" className={`grid h-10 place-items-center rounded-full px-5 text-sm font-semibold ${transparent ? "bg-white text-[#1595b9]" : "bg-[#17c7c8] text-white"}`}>
            Войти
          </Link>
        )}
        <button className={`grid size-10 place-items-center rounded-full lg:hidden ${transparent ? "bg-white/12" : "bg-zinc-50"}`}>
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}

export function PublicShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <main className="min-h-screen bg-white text-[#20212a]">
      <Header />
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-8">
        {title ? (
          <div className="mb-10 max-w-4xl">
            {eyebrow ? <p className="mb-4 text-sm text-zinc-400">{eyebrow}</p> : null}
            <h1 className="text-4xl font-semibold leading-tight tracking-normal md:text-6xl">{title}</h1>
            {description ? <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-500">{description}</p> : null}
          </div>
        ) : null}
        {children}
      </section>
      <Footer />
    </main>
  );
}

export function CabinetShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[linear-gradient(118deg,#22d186_0%,#18b7d5_52%,#22a8e8_100%)] text-[#20212a]">
      <section className="min-h-[260px] text-white">
        <Header transparent authenticated />
      </section>
      <section className="mx-auto -mt-24 max-w-7xl px-5 pb-16">
        <div className="rounded-[38px] bg-white px-5 py-8 shadow-[0_26px_90px_rgba(52,84,94,0.16)] md:px-10 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12 lg:px-12">
          <aside className="hidden border-r border-zinc-100 pr-7 lg:block">
            <nav className="sticky top-8 space-y-2">
              {profileMenu.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`flex h-12 w-full items-center gap-3 rounded-full px-5 text-sm font-semibold transition ${
                      active ? "bg-emerald-100 text-emerald-700" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    <Icon size={19} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <div className="min-w-0">
            {title ? (
              <div className="mb-8">
                {eyebrow ? <p className="mb-4 text-sm text-zinc-400">{eyebrow}</p> : null}
                <h1 className="text-4xl font-semibold leading-tight tracking-normal md:text-5xl">{title}</h1>
                {description ? <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-500">{description}</p> : null}
              </div>
            ) : null}
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}

export function DetailShell({
  children,
  breadcrumbs,
}: {
  children: React.ReactNode;
  breadcrumbs: Array<{ label: string; href?: string }>;
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(118deg,#22d186_0%,#18b7d5_52%,#22a8e8_100%)] text-[#20212a]">
      <section className="min-h-[240px] text-white">
        <Header transparent />
      </section>
      <section className="mx-auto -mt-20 max-w-7xl px-5 pb-16">
        <div className="rounded-[38px] bg-white px-5 py-8 shadow-[0_26px_90px_rgba(52,84,94,0.16)] md:px-10 lg:px-12">
          <nav className="mb-8 flex flex-wrap gap-2 text-sm text-zinc-400">
            {breadcrumbs.map((item, index) => (
              <span key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.href ? <Link href={item.href} className="hover:text-[#1595b9]">{item.label}</Link> : <span className="text-zinc-700">{item.label}</span>}
                {index < breadcrumbs.length - 1 ? <span>/</span> : null}
              </span>
            ))}
          </nav>
          {children}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Footer() {
  const links = ["Субсидии", "Финансы", "Экспорт", "Витрина", "Кооперация", "Обучение"];
  return (
    <footer className="mx-auto mt-12 max-w-7xl border-t border-zinc-200 px-5 pb-10 pt-10">
      <div className="grid gap-4 lg:grid-cols-[0.75fr_1.45fr_0.75fr]">
        <div className="overflow-hidden rounded-[22px] border border-zinc-200 bg-white">
          <div className="flex min-h-24 items-center p-6">
            <div>
              <p className="text-xl font-semibold">Агропорт</p>
              <p className="mt-1 text-sm text-zinc-500">поддержка малого агробизнеса</p>
            </div>
          </div>
          <div className="border-t border-zinc-200 p-6 text-xs leading-5 text-zinc-500">
            Прототип цифровой платформы для подбора мер поддержки, финансирования, сбыта и сервисов.
          </div>
        </div>

        <div className="rounded-[22px] border border-zinc-200 bg-white p-6">
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {links.map((item) => (
              <Link key={item} href={item === "Субсидии" ? "/support" : item === "Финансы" ? "/finance" : item === "Экспорт" ? "/export" : item === "Витрина" ? "/marketplace" : item === "Кооперация" ? "/cooperation" : "/learning"} className="text-base font-semibold hover:text-[#1595b9]">
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {[
            ["Навигатор мер поддержки", "/support"],
            ["Мероприятия", "/events"],
          ].map(([label, href]) => (
            <Link key={label} href={href} className="flex items-center justify-between rounded-[18px] border border-zinc-200 bg-white p-5 text-base font-semibold">
              {label}
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-col gap-5 rounded-[22px] border border-zinc-200 bg-white p-6 md:flex-row md:items-center md:justify-between lg:min-h-28">
          <div className="space-y-2 text-base font-medium">
            <p className="flex items-center gap-2"><Phone size={18} />8-495-870-45-55</p>
            <p className="flex items-center gap-2"><Mail size={18} />support@agroport.ru</p>
          </div>
          <Link href="/support-center" className="rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold">Служба поддержки</Link>
        </div>
      </div>
      <p className="mt-5 text-xs text-zinc-400">Соглашение о пользовании информационной системой Агропорт</p>
    </footer>
  );
}
