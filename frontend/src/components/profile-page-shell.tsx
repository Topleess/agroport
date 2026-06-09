import { ProfileNavigation } from "@/components/profile-navigation";

export function ProfilePageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block lg:pt-1">
        <ProfileNavigation />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
