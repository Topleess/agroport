export type User = {
  id: number;
  email: string;
  phone: string | null;
  is_active: boolean;
  is_admin: boolean;
};

export type UserProfile = {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  phone: string | null;
  region: string | null;
  role: string | null;
};

export type OrganizationType = "IP" | "KFH" | "OOO" | "SPK" | "OTHER";
export type OrganizationCategory = "farm" | "solution_provider";
export type VerificationStatus = "draft" | "pending_verification" | "verified" | "rejected";
export type ProductCategory =
  | "grain"
  | "vegetables"
  | "dairy"
  | "meat"
  | "machinery"
  | "digital"
  | "consulting"
  | "other";

export type Organization = {
  id: number;
  category: OrganizationCategory;
  type: OrganizationType;
  name: string;
  inn: string;
  ogrn: string | null;
  kpp: string | null;
  region: string | null;
  address: string | null;
  verification_status: VerificationStatus;
  member_role: "owner" | "admin" | "member" | "viewer" | null;
  profile_completion_percent: number;
};

export type OrganizationLookup = Omit<Organization, "id" | "verification_status" | "member_role" | "profile_completion_percent"> & {
  found: boolean;
};

export type OrganizationProduct = {
  id: number;
  organization_id: number;
  category: ProductCategory;
  name: string;
  description: string | null;
  unit: string | null;
  price: string | number | null;
};

export type OrganizationProfile = {
  id: number | null;
  organization_id: number;
  production_types: string[];
  land_area_ha: string | number | null;
  livestock_count: number | null;
  main_crops: string[] | null;
  machinery: string[] | null;
  digital_maturity: string | null;
  support_needs: string[] | null;
  service_needs: string[] | null;
  marketplace_interests: string[] | null;
  comment: string | null;
  completion_percent: number;
};
