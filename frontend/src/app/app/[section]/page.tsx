import { ComingSoonPage } from "@/components/coming-soon-page";
import { placeholderSections } from "@/lib/placeholders";

type SectionKey = keyof typeof placeholderSections;

export default async function PlaceholderPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const content = placeholderSections[section as SectionKey] ?? {
    title: "Раздел платформы",
    description: "Этот раздел будет добавлен на следующем этапе развития MVP.",
    plannedFeatures: ["Сценарии пользователя", "Интеграция с профилем", "Статусы и уведомления"],
  };

  return <ComingSoonPage {...content} />;
}
