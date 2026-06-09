import { OrganizationNavigation } from "@/components/organization-navigation";

export function OrganizationPageShell({
  organizationId,
  children,
}: {
  organizationId: string | number;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:block lg:pt-1">
        <OrganizationNavigation organizationId={organizationId} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
