import Link from "next/link";
import { SolutionCatalog } from "@/components/solution-catalog";

export default function PublicSolutionsPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="text-xl font-bold text-emerald-800">Агропорт</Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold hover:bg-zinc-50">
            Войти
          </Link>
          <Link href="/register" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Регистрация
          </Link>
        </div>
      </header>
      <SolutionCatalog />
    </main>
  );
}
