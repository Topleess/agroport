import { ProfilePlaceholderPage } from "@/components/profile-placeholder-page";

export default function ProfileEventsPage() {
  return (
    <ProfilePlaceholderPage
      title="Мероприятия"
      description="Личные регистрации, приглашения и события, которые относятся к пользователю."
      items={["Мои регистрации", "Приглашения", "Календарь"]}
    />
  );
}
