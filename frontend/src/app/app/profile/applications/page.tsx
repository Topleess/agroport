import { ProfilePlaceholderPage } from "@/components/profile-placeholder-page";

export default function ProfileApplicationsPage() {
  return (
    <ProfilePlaceholderPage
      title="Заявки"
      description="Личные заявки пользователя по сервисам, мерам поддержки, мероприятиям и обращениям."
      items={["Активные заявки", "История обращений", "Следующие действия"]}
    />
  );
}
