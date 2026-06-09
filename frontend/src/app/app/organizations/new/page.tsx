"use client";

import { useRouter } from "next/navigation";
import { OrganizationCreateWizard } from "@/components/organization-create-wizard";
import type { Organization } from "@/lib/types";

export default function NewOrganizationPage() {
  const router = useRouter();

  function handleCreated(organization: Organization) {
    router.replace(`/app/organizations/${organization.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <OrganizationCreateWizard embedded onCreated={handleCreated} />
    </div>
  );
}
