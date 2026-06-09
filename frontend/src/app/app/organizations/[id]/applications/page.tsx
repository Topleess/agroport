"use client";

import { FileText } from "lucide-react";
import { OrganizationPlaceholderPage } from "@/components/organization-placeholder-page";

export default function OrganizationApplicationsPage() {
  return (
    <OrganizationPlaceholderPage
      title="Заявки организации"
      description="Заявки по сервисам, мерам поддержки и marketplace от имени этой организации."
      icon={FileText}
    />
  );
}
