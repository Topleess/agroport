"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShellSkeleton } from "@/components/skeletons";
import { getMe } from "@/lib/api/auth";
import { clearToken, getToken } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    getMe()
      .then(() => setLoading(false))
      .catch(() => {
        clearToken();
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      })
  }, [pathname, router]);

  if (loading) {
    return <AppShellSkeleton />;
  }

  return <>{children}</>;
}
