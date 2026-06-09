"use client";

import { Store } from "lucide-react";
import { OrganizationPlaceholderPage } from "@/components/organization-placeholder-page";

export default function OrganizationServicesPage() {
  return (
    <OrganizationPlaceholderPage
      title="Сервисы организации"
      description="Рекомендованные и подключенные сервисы, связанные с профилем компании."
      icon={Store}
    />
  );
}
