import { Card } from "@/components/ui";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-zinc-100 ${className}`} />;
}

export function ProfilePageSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:grid lg:gap-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-12" />
        ))}
      </aside>
      <div className="min-w-0">
        <section className="flex flex-col gap-6 md:flex-row md:items-start">
          <Skeleton className="size-36 shrink-0 rounded-[28px] md:size-44" />
          <div className="min-w-0 flex-1 pt-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-4 h-12 w-full max-w-xl md:h-16" />
            <div className="mt-5 flex flex-wrap gap-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-44" />
            </div>
          </div>
        </section>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Skeleton className="h-36 rounded-[26px]" />
          <Skeleton className="h-36 rounded-[26px]" />
        </div>
      </div>
    </div>
  );
}

export function FormPageSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:grid lg:gap-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-12" />
        ))}
      </aside>
      <div className="grid gap-6">
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-10 w-full max-w-md" />
          <Skeleton className="mt-3 h-5 w-full max-w-xl" />
        </div>
        <Card className="rounded-[26px] border-0 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="grid gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11" />
              </div>
            ))}
            <Skeleton className="h-11 w-40 md:col-span-2" />
          </div>
        </Card>
      </div>
    </div>
  );
}

export function OrganizationListSkeleton({ withProfileNav = false }: { withProfileNav?: boolean }) {
  return (
    <div className={withProfileNav ? "grid gap-6 lg:grid-cols-[240px_1fr]" : "grid gap-6"}>
      {withProfileNav ? (
        <aside className="hidden lg:grid lg:gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-12" />
          ))}
        </aside>
      ) : null}
      <div className="grid gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="mt-3 h-10 w-full max-w-sm" />
            <Skeleton className="mt-3 h-5 w-full max-w-lg" />
          </div>
          <Skeleton className="hidden h-11 w-32 sm:block" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-[24px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrganizationDetailSkeleton() {
  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <Skeleton className="size-20 shrink-0 rounded-[22px] md:size-24" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="mt-3 h-11 w-full max-w-lg" />
            <Skeleton className="mt-3 h-5 w-56" />
            <Skeleton className="mt-4 h-6 w-28 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-11 w-40" />
      </section>
      <section className="grid gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-[22px]" />
        ))}
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-72 rounded-[24px]" />
        <Skeleton className="h-72 rounded-[24px]" />
      </div>
    </div>
  );
}

export function QuestionnaireSkeleton() {
  return (
    <div className="grid gap-5">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-3 h-5 w-80" />
      </div>
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className={index === 9 ? "grid gap-2 md:col-span-2" : "grid gap-2"}>
              <Skeleton className="h-4 w-36" />
              <Skeleton className={index === 9 ? "h-28" : "h-11"} />
            </div>
          ))}
          <Skeleton className="h-11 w-44 md:col-span-2" />
        </div>
      </Card>
    </div>
  );
}

export function AppShellSkeleton() {
  return (
    <div className="min-h-screen bg-[linear-gradient(118deg,#27c27d_0%,#28b7cb_48%,#f7fbff_100%)] p-6">
      <div className="mx-auto max-w-[1760px]">
        <div className="flex items-center gap-3">
          <Skeleton className="h-14 w-20 bg-white/30" />
          <Skeleton className="h-14 w-full max-w-2xl bg-white/25" />
          <Skeleton className="ml-auto size-12 bg-white/25" />
          <Skeleton className="size-12 bg-white/25" />
        </div>
        <div className="mt-6 rounded-[34px] bg-white p-6 md:p-10">
          <ProfilePageSkeleton />
        </div>
      </div>
    </div>
  );
}
