"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpen,
  Building2,
  ClipboardCheck,
  Database,
  FileClock,
  FileText,
  Gauge,
  GitBranch,
  History,
  Import,
  LogOut,
  Loader2,
  Search,
  Settings,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAdminMe, type AdminMe } from "@/lib/api/admin";
import { logout } from "@/lib/api/auth";
import { clearToken, getToken } from "@/lib/auth";

const navItems = [
  { label: "Главная", href: "/admin", icon: Gauge },
  { label: "Пользователи", href: "/admin/users", icon: Users },
  { label: "Хозяйства", href: "/admin/companies/farms", icon: Building2 },
  { label: "Поставщики", href: "/admin/companies/suppliers", icon: Shield },
  { label: "Решения", href: "/admin/solutions", icon: Sparkles },
  { label: "Заявки фермеров", href: "/admin/farmer-requests", icon: FileText },
  { label: "Подбор решений", href: "/admin/matching", icon: Activity },
  { label: "Модерация", href: "/admin/moderation", icon: ClipboardCheck },
  { label: "Таксономия", href: "/admin/taxonomy", icon: GitBranch },
  { label: "Словари", href: "/admin/dictionaries", icon: BookOpen },
  { label: "Импорт / Экспорт", href: "/admin/import-export", icon: Import },
  { label: "Аналитика", href: "/admin/analytics", icon: BarChart3 },
  { label: "Админы", href: "/admin/admins", icon: Shield },
  { label: "Audit log", href: "/admin/audit-log", icon: History },
  { label: "Настройки", href: "/admin/settings", icon: Settings },
];

const searchableItems = [
  ...navItems,
  { label: "Организации на проверке", href: "/admin/organizations", icon: FileClock },
  { label: "Справочники Excel", href: "/admin/dictionaries", icon: Database },
];

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [me, setMe] = useState<AdminMe | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    getAdminMe()
      .then((data) => {
        setMe(data);
        setReady(true);
      })
      .catch(() => {
        clearToken();
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      });
  }, [pathname, router]);

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-[#f5f7fb] text-sm font-semibold text-zinc-500">Загрузка админки...</div>;
  }

  return <AdminMeContext.Provider value={me}>{children}</AdminMeContext.Provider>;
}

const AdminMeContext = {
  Provider({ value, children }: { value: AdminMe | null; children: React.ReactNode }) {
    void value;
    return <>{children}</>;
  },
};

export function AdminLayout({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const needle = query.toLowerCase();
    return searchableItems.filter((item) => item.label.toLowerCase().includes(needle)).slice(0, 6);
  }, [query]);

  const activePendingHref =
    pendingHref && !(pendingHref === "/admin" ? pathname === pendingHref : pathname.startsWith(pendingHref))
      ? pendingHref
      : null;

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Stateless token in MVP.
    }
    clearToken();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-zinc-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-zinc-200 bg-white px-4 py-5 lg:flex">
        <Link href="/admin" className="flex h-12 items-center gap-3 rounded-2xl px-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-lg font-black text-white">А</span>
          <span>
            <span className="block text-sm font-black">Агропорт</span>
            <span className="block text-xs text-zinc-400">Admin panel</span>
          </span>
        </Link>
        <nav className="mt-6 grid flex-1 content-start gap-1 overflow-y-auto pb-4">
          {navItems.map((item) => {
            const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (pathname !== item.href) setPendingHref(item.href);
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active || activePendingHref === item.href ? "bg-rose-50 text-rose-600" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                }`}
              >
                {activePendingHref === item.href ? <Loader2 size={18} className="animate-spin" /> : <item.icon size={18} />}
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex w-full items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
        >
          <LogOut size={18} />
          <span className="truncate">Выйти из админки</span>
        </button>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/92 px-4 py-3 backdrop-blur md:px-6 relative">
          <div className="flex items-center gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск по разделам и сущностям"
                className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none focus:border-rose-300 focus:bg-white"
              />
              {searchResults.length ? (
                <div className="absolute left-0 right-0 top-12 z-40 rounded-xl border border-zinc-100 bg-white p-2 shadow-xl">
                  {searchResults.map((item) => (
                    <Link key={item.href + item.label} href={item.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-zinc-50" onClick={() => setQuery("")}>
                      <item.icon size={16} className="text-zinc-400" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          {activePendingHref ? <div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden bg-rose-50"><div className="h-full w-1/2 animate-pulse rounded-r-full bg-rose-500" /></div> : null}
        </header>

        <main className="px-4 py-6 md:px-6">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-normal md:text-3xl">{title}</h1>
              {description ? <p className="mt-1 max-w-3xl text-sm text-zinc-500">{description}</p> : null}
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminPage({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminLayout title={title} description={description}>
        {children}
      </AdminLayout>
    </AdminGuard>
  );
}
