"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PlatformHeader } from "@/components/platform-header";
import { logout } from "@/lib/api/auth";
import { listOrganizations } from "@/lib/api/organizations";
import { getMyProfile } from "@/lib/api/users";
import { clearToken } from "@/lib/auth";
import type { Organization, UserProfile } from "@/lib/types";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    Promise.all([getMyProfile(), listOrganizations()])
      .then(([profileData, organizationData]) => {
        setProfile(profileData);
        setOrganizations(organizationData);
      })
      .catch(() => {
        setProfile(null);
        setOrganizations([]);
      });
  }, [pathname]);

  const sortedOrganizations = useMemo(() => organizations, [organizations]);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Token is stateless in the MVP, so local logout is enough.
    }
    clearToken();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(118deg,#27c27d_0%,#28b7cb_48%,#f7fbff_100%)] text-zinc-950">
      <PlatformHeader mode="app" profile={profile} organizations={sortedOrganizations} onLogout={handleLogout} />

      <main className="mx-auto max-w-[1760px] px-4 pb-8 md:px-8">
        <section className="min-h-[calc(100vh-112px)] rounded-[30px] bg-white px-5 py-7 shadow-[0_26px_90px_rgba(22,79,91,0.14)] md:rounded-[44px] md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">{children}</div>
        </section>
      </main>
    </div>
  );
}
