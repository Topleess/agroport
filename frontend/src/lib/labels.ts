import type { OrganizationCategory, OrganizationType, ProductCategory, SolutionStatus, VerificationStatus } from "@/lib/types";

export const organizationCategoryLabels: Record<OrganizationCategory, string> = {
  farm: "Хозяйство",
  solution_provider: "Поставщик решений",
};

export const organizationTypeLabels: Record<OrganizationType, string> = {
  IP: "ИП",
  KFH: "КФХ",
  OOO: "ООО",
  SPK: "Сельхозкооператив",
  OTHER: "Другое",
};

export const productCategoryLabels: Record<ProductCategory, string> = {
  grain: "Зерновые",
  vegetables: "Овощи",
  dairy: "Молочная продукция",
  meat: "Мясо",
  machinery: "Техника",
  digital: "Цифровое решение",
  consulting: "Консалтинг",
  other: "Другое",
};

export const verificationStatusLabels: Record<VerificationStatus, string> = {
  draft: "Черновик",
  pending_verification: "Ожидает проверки",
  verified: "Подтверждено",
  rejected: "Отклонено",
};

export const verificationStatusClasses: Record<VerificationStatus, string> = {
  draft: "bg-zinc-100 text-zinc-700",
  pending_verification: "bg-amber-100 text-amber-800",
  verified: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export const solutionStatusLabels: Record<SolutionStatus, string> = {
  draft: "Черновик",
  pending_moderation: "На модерации",
  published: "Опубликовано",
  rejected: "Отклонено",
};

export const solutionStatusClasses: Record<SolutionStatus, string> = {
  draft: "bg-zinc-100 text-zinc-700",
  pending_moderation: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};
