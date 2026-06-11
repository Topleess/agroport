"use client";

import Link from "next/link";
import { Bell, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ProfilePageShell } from "@/components/profile-page-shell";
import { Button } from "@/components/ui";
import { listNotifications, markNotificationRead } from "@/lib/api/solutions";
import type { NotificationItem } from "@/lib/types";

export default function ProfileNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listNotifications()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  async function markRead(item: NotificationItem) {
    const updated = await markNotificationRead(item.id);
    setItems((current) => current.map((currentItem) => (currentItem.id === item.id ? updated : currentItem)));
  }

  return (
    <ProfilePageShell>
      <div className="grid gap-6">
        <section>
          <p className="text-sm font-semibold text-emerald-600">Личный кабинет</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">Уведомления</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Статусы модерации, публикации решений и заявки по связанным организациям.
          </p>
        </section>

        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-[22px] bg-zinc-100" />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-3">
            {items.map((item) => (
              <article key={item.id} className={`rounded-[22px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.07)] ${item.is_read ? "opacity-75" : ""}`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${item.is_read ? "bg-zinc-100 text-zinc-500" : "bg-emerald-50 text-emerald-600"}`}>
                      {item.is_read ? <CheckCircle2 size={21} /> : <Bell size={21} />}
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-bold">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-zinc-500">{item.body}</p>
                      <p className="mt-2 text-xs font-semibold text-zinc-400">{new Date(item.created_at).toLocaleString("ru-RU")}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {item.href ? (
                      <Link href={item.href} className="inline-flex h-10 items-center rounded-xl border border-zinc-200 px-3 text-sm font-semibold hover:bg-zinc-50">
                        Открыть
                      </Link>
                    ) : null}
                    {!item.is_read ? (
                      <Button variant="secondary" className="h-10 rounded-xl" onClick={() => markRead(item)}>
                        Прочитано
                      </Button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-[0_14px_40px_rgba(15,23,42,0.07)]">
            <p className="text-xl font-bold">Уведомлений пока нет</p>
            <p className="mt-2 text-sm text-zinc-500">Здесь появятся статусы проверок, публикаций и заявок.</p>
          </div>
        )}
      </div>
    </ProfilePageShell>
  );
}
