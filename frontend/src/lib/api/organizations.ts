import { apiRequest } from "@/lib/api/client";
import type {
  Organization,
  OrganizationCategory,
  OrganizationLookup,
  OrganizationProduct,
  OrganizationProfile,
  OrganizationType,
  ProductCategory,
} from "@/lib/types";

export type OrganizationPayload = {
  category: OrganizationCategory;
  type: OrganizationType;
  name: string;
  inn: string;
  ogrn?: string;
  kpp?: string;
  region?: string;
  address?: string;
};

export type OrganizationProductPayload = {
  category: ProductCategory;
  name: string;
  description?: string;
  unit?: string;
  price?: string | number | null;
};

export type OrganizationProfilePayload = Omit<
  OrganizationProfile,
  "id" | "organization_id" | "completion_percent"
>;

export function listOrganizations() {
  return apiRequest<Organization[]>("/organizations");
}

export function createOrganization(payload: OrganizationPayload) {
  return apiRequest<Organization>("/organizations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function lookupOrganization(inn: string, category: OrganizationCategory) {
  const params = new URLSearchParams({ inn, category });
  return apiRequest<OrganizationLookup>(`/organizations/lookup?${params.toString()}`);
}

export function getOrganization(id: string | number) {
  return apiRequest<Organization>(`/organizations/${id}`);
}

export function submitOrganizationVerification(id: string | number) {
  return apiRequest<Organization>(`/organizations/${id}/submit-verification`, {
    method: "POST",
  });
}

export function getOrganizationProfile(id: string | number) {
  return apiRequest<OrganizationProfile>(`/organizations/${id}/profile`);
}

export function saveOrganizationProfile(id: string | number, payload: OrganizationProfilePayload) {
  return apiRequest<OrganizationProfile>(`/organizations/${id}/profile`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function listOrganizationProducts(id: string | number) {
  return apiRequest<OrganizationProduct[]>(`/organizations/${id}/products`);
}

export function createOrganizationProduct(id: string | number, payload: OrganizationProductPayload) {
  return apiRequest<OrganizationProduct>(`/organizations/${id}/products`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateOrganizationProduct(
  organizationId: string | number,
  productId: string | number,
  payload: Partial<OrganizationProductPayload>,
) {
  return apiRequest<OrganizationProduct>(`/organizations/${organizationId}/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
