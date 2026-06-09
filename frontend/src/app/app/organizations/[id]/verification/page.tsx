"use client";

import { BadgeCheck } from "lucide-react";
import { OrganizationPlaceholderPage } from "@/components/organization-placeholder-page";

export default function OrganizationVerificationPage() {
  return (
    <OrganizationPlaceholderPage
      title="Проверка"
      description="Статус верификации, замечания администратора и история подтверждения организации."
      icon={BadgeCheck}
    />
  );
}
