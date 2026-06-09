"use client";

import { UsersRound } from "lucide-react";
import { OrganizationPlaceholderPage } from "@/components/organization-placeholder-page";

export default function OrganizationUsersPage() {
  return (
    <OrganizationPlaceholderPage
      title="Пользователи"
      description="Команда организации, роли и доступы к юридическому кабинету."
      icon={UsersRound}
    />
  );
}
