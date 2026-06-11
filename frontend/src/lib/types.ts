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

export type FormOption = {
  code: string;
  label: string;
  level?: number | null;
  parent_code?: string | null;
};

export type FormField = {
  field_key: string;
  field_name: string;
  input_type: string;
  required: boolean;
  dictionary_code?: string | null;
  block?: string | null;
  allow_other_text: boolean;
  options: FormOption[];
};

export type FormTemplate = {
  code: string;
  name: string;
  description?: string | null;
  fields: FormField[];
};

export type SolutionStatus = "draft" | "pending_moderation" | "published" | "rejected" | string;

export type SolutionSummary = {
  id: number;
  supplier_id?: number | null;
  supplier_name?: string | null;
  name: string;
  short_description?: string | null;
  status: SolutionStatus;
  updated_at: string;
  published_at?: string | null;
  extra_fields: Record<string, unknown>;
};

export type SolutionDetail = SolutionSummary & {
  full_description?: string | null;
  partner_type?: string | null;
  payment_model?: string | null;
  implementation_type?: string | null;
  deployment_type?: string | null;
  evidence_level?: string | null;
  price_from?: string | number | null;
  subsector_ids: string[];
  process_ids: string[];
  problem_ids: string[];
  integration_ids: string[];
  region_ids: string[];
  taxonomy_l4_ids: string[];
};

export type SolutionPayload = Partial<Omit<SolutionDetail, "id" | "updated_at" | "published_at" | "supplier_name">> & {
  supplier_organization_id?: number;
};

export type FarmerRequest = {
  id: number;
  solution_id?: number | null;
  solution_name?: string | null;
  user_id?: number | null;
  farm_id?: number | null;
  contact_name: string;
  contact_email: string;
  contact_phone?: string | null;
  organization_name?: string | null;
  message?: string | null;
  source: string;
  region_id?: string | null;
  problem_ids: string[];
  urgency?: string | null;
  budget_rub?: string | number | null;
  status: string;
  updated_at: string;
};

export type NotificationItem = {
  id: number;
  title: string;
  body: string;
  kind: string;
  href?: string | null;
  is_read: boolean;
  organization_id?: number | null;
  created_at: string;
};
