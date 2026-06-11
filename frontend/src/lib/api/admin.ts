import { apiRequest } from "@/lib/api/client";
import type { Organization } from "@/lib/types";

export type AdminMe = {
  id: number;
  email: string;
  is_admin: boolean;
  admin_role: string | null;
};

export type AdminDashboard = {
  users: number;
  farms: number;
  suppliers: number;
  solutions: number;
  published_solutions: number;
  pending_moderation: number;
  dictionaries: number;
  dictionary_items: number;
  taxonomy_nodes: number;
  farmer_requests: number;
  audit_events: number;
};

export type AdminUser = {
  id: number;
  email: string;
  phone: string | null;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  admin_role: string | null;
  organizations_count: number;
  created_at: string;
};

export type DictionarySummary = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  status: string;
  is_system: boolean;
  is_locked: boolean;
  items_count: number;
  updated_at: string;
};

export type DictionaryItem = {
  id: number;
  code: string;
  label: string;
  description: string | null;
  status: string;
  sort_order: number;
  is_system: boolean;
  parent_code: string | null;
};

export type DictionaryDetail = DictionarySummary & {
  items: DictionaryItem[];
};

export type TaxonomyNode = {
  id: number;
  external_id: string;
  parent_id: number | null;
  parent_external_id: string | null;
  level: number;
  name: string;
  slug: string;
  description: string | null;
  notes: string | null;
  is_selectable: boolean;
  is_active: boolean;
  sort_order: number;
  solutions_count: number;
};

export type AdminSolution = {
  id: number;
  supplier_id: number | null;
  supplier_name: string | null;
  name: string;
  short_description: string | null;
  status: string;
  taxonomy_l4_ids: string[];
  subsector_ids: string[];
  process_ids: string[];
  problem_ids: string[];
  payment_model: string | null;
  evidence_level: number | null;
  updated_at: string;
};

export type FarmerRequest = {
  id: number;
  title: string;
  farmer_email: string | null;
  farm_name: string | null;
  region_id: string | null;
  problem_ids: string[];
  urgency: string;
  budget_rub: string | null;
  status: string;
  updated_at: string;
};

export type MatchingRun = {
  id: number;
  farmer_request_id: number;
  farmer_request_title: string;
  status: string;
  triggered_by: string;
  results_count: number;
  best_score: number | null;
  updated_at: string;
};

export type ModerationItem = {
  id: number;
  object_type: string;
  object_id: string;
  title: string;
  status: string;
  priority: string;
  assigned_admin_id: number | null;
  company_id: number | null;
  solution_id: number | null;
  comments_count: number;
  updated_at: string;
};

export type ImportJob = {
  id: number;
  import_type: string;
  file_name: string;
  status: string;
  total_rows: number;
  successful_rows: number;
  error_rows: number;
  warning_rows: number;
  updated_at: string;
};

export type AuditLogEntry = {
  id: number;
  admin_user_id: number | null;
  admin_email: string | null;
  action: string;
  object_type: string;
  object_id: string;
  object_title: string | null;
  risk_level: string;
  created_at: string;
};

export type AnalyticsPayload = {
  metrics: AdminDashboard;
  white_spots: Array<Record<string, string | number>>;
  coverage: Array<Record<string, string | number>>;
};

export type AdminUserUpdatePayload = Partial<Pick<AdminUser, "email" | "phone" | "full_name" | "is_active" | "admin_role" | "is_admin">>;

export type AdminRolePayload = {
  email: string;
  role: string;
};

export type TaxonomyNodeUpdatePayload = Partial<Pick<TaxonomyNode, "name" | "description" | "notes" | "is_selectable" | "is_active" | "sort_order">>;

export function getAdminMe() {
  return apiRequest<AdminMe>("/admin/auth/me");
}

export function getAdminDashboard() {
  return apiRequest<AdminDashboard>("/admin/dashboard");
}

export function listAdminUsers() {
  return apiRequest<AdminUser[]>("/admin/users");
}

export function updateAdminUser(id: string | number, payload: AdminUserUpdatePayload) {
  return apiRequest<AdminUser>(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function assignAdminRole(payload: AdminRolePayload) {
  return apiRequest<AdminUser>("/admin/admins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function removeAdminRole(id: string | number) {
  return apiRequest<AdminUser>(`/admin/admins/${id}`, { method: "DELETE" });
}

export function listAdminOrganizations(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<Organization[]>(`/admin/organizations${query}`);
}

export function listAdminFarms() {
  return apiRequest<Organization[]>("/admin/companies/farms");
}

export function listAdminSuppliers() {
  return apiRequest<Organization[]>("/admin/companies/suppliers");
}

export function approveOrganization(id: string | number) {
  return apiRequest<Organization>(`/admin/organizations/${id}/approve`, { method: "POST" });
}

export function rejectOrganization(id: string | number) {
  return apiRequest<Organization>(`/admin/organizations/${id}/reject`, { method: "POST" });
}

export function listAdminDictionaries() {
  return apiRequest<DictionarySummary[]>("/admin/dictionaries");
}

export function getAdminDictionary(code: string) {
  return apiRequest<DictionaryDetail>(`/admin/dictionaries/${encodeURIComponent(code)}`);
}

export function updateAdminDictionaryItem(dictionaryCode: string, id: string | number, payload: {
  code: string;
  label: string;
  description: string | null;
  status: string;
  sort_order: number;
  parent_code: string | null;
}) {
  return apiRequest<DictionaryItem>(`/admin/dictionaries/${encodeURIComponent(dictionaryCode)}/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function listAdminTaxonomy() {
  return apiRequest<TaxonomyNode[]>("/admin/taxonomy");
}

export function updateAdminTaxonomyNode(id: string | number, payload: TaxonomyNodeUpdatePayload) {
  return apiRequest<TaxonomyNode>(`/admin/taxonomy/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function listAdminSolutions() {
  return apiRequest<AdminSolution[]>("/admin/solutions");
}

export function listAdminFarmerRequests() {
  return apiRequest<FarmerRequest[]>("/admin/farmer-requests");
}

export function listAdminMatching() {
  return apiRequest<MatchingRun[]>("/admin/matching");
}

export function listAdminModeration() {
  return apiRequest<ModerationItem[]>("/admin/moderation");
}

export function updateModerationStatus(id: string | number, status: string, comment?: string) {
  return apiRequest<ModerationItem>(`/admin/moderation/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status, comment }),
  });
}

export function listAdminImportJobs() {
  return apiRequest<ImportJob[]>("/admin/import-export");
}

export function listAdminAuditLog() {
  return apiRequest<AuditLogEntry[]>("/admin/audit-log");
}

export function getAdminAnalytics() {
  return apiRequest<AnalyticsPayload>("/admin/analytics");
}
