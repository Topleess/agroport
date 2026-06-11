import { apiRequest } from "@/lib/api/client";
import type {
  FarmerRequest,
  FormTemplate,
  NotificationItem,
  SolutionDetail,
  SolutionPayload,
  SolutionSummary,
} from "@/lib/types";

export type SolutionLeadPayload = {
  farm_id?: number | null;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  organization_name?: string;
  message?: string;
  extra_fields?: Record<string, unknown>;
};

export function getReferenceForm(code: "supplier" | "farmer") {
  return apiRequest<FormTemplate>(`/reference/forms/${code}`);
}

export function listPublicSolutions() {
  return apiRequest<SolutionSummary[]>("/solutions");
}

export function getSolution(id: string | number) {
  return apiRequest<SolutionDetail>(`/solutions/${id}`);
}

export function createSolution(organizationId: string | number, payload: SolutionPayload) {
  return apiRequest<SolutionDetail>(`/organizations/${organizationId}/solutions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSolution(organizationId: string | number, solutionId: string | number, payload: SolutionPayload) {
  return apiRequest<SolutionDetail>(`/organizations/${organizationId}/solutions/${solutionId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function submitSolutionForModeration(organizationId: string | number, solutionId: string | number) {
  return apiRequest<SolutionDetail>(`/organizations/${organizationId}/solutions/${solutionId}/submit`, {
    method: "POST",
  });
}

export function listOrganizationSolutions(organizationId: string | number) {
  return apiRequest<SolutionSummary[]>(`/organizations/${organizationId}/solutions`);
}

export function createSolutionRequest(solutionId: string | number, payload: SolutionLeadPayload) {
  return apiRequest<FarmerRequest>(`/solutions/${solutionId}/requests`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listMyRequests() {
  return apiRequest<FarmerRequest[]>("/requests/me");
}

export function listOrganizationRequests(organizationId: string | number) {
  return apiRequest<FarmerRequest[]>(`/organizations/${organizationId}/requests`);
}

export function listSolutionRequests(solutionId: string | number) {
  return apiRequest<FarmerRequest[]>(`/solutions/${solutionId}/requests`);
}

export function listNotifications() {
  return apiRequest<NotificationItem[]>("/notifications/me");
}

export function markNotificationRead(id: string | number) {
  return apiRequest<NotificationItem>(`/notifications/${id}/read`, {
    method: "PATCH",
  });
}
