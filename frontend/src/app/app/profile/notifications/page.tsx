import { ProfilePlaceholderPage } from "@/components/profile-placeholder-page";

export default function ProfileNotificationsPage() {
  return (
    <ProfilePlaceholderPage
      title="Уведомления"
      description="События по профилю, организациям, проверкам и ответам по заявкам."
      items={["Статусы проверок", "Ответы по заявкам", "Напоминания"]}
    />
  );
}
