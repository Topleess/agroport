import { ProfilePlaceholderPage } from "@/components/profile-placeholder-page";

export default function ProfileLearningPage() {
  return (
    <ProfilePlaceholderPage
      title="Обучение"
      description="Персональные курсы, вебинары и материалы, подобранные под профиль пользователя."
      items={["Рекомендованные курсы", "Мои программы", "Материалы"]}
    />
  );
}
