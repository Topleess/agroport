import { ProfilePlaceholderPage } from "@/components/profile-placeholder-page";

export default function ProfileServicesPage() {
  return (
    <ProfilePlaceholderPage
      title="Сервисы"
      description="Сервисы, подключенные или рекомендованные конкретному пользователю и его хозяйствам."
      items={["Подключенные сервисы", "Рекомендации", "История использования"]}
    />
  );
}
