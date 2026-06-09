import { apiRequest } from "@/lib/api/client";
import type { Organization } from "@/lib/types";

export function listAdminOrganizations(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<Organization[]>(`/admin/organizations${query}`);
}

export function approveOrganization(id: string | number) {
  return apiRequest<Organization>(`/admin/organizations/${id}/approve`, { method: "POST" });
}

export function rejectOrganization(id: string | number) {
  return apiRequest<Organization>(`/admin/organizations/${id}/reject`, { method: "POST" });
}
