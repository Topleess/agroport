import { AdminPage } from "@/components/admin/admin-shell";
import { AdminEmptyState } from "@/components/admin/admin-ui";

export default function AdminSettingsPage() {
  return (
    <AdminPage title="Настройки" description="Системные настройки, feature flags, публикация и модерация.">
      <AdminEmptyState title="Настройки в разработке" description="Здесь появятся группы платформенных параметров и режимов." />
    </AdminPage>
  );
}
