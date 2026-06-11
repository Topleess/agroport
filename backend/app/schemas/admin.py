from pydantic import BaseModel, Field

from app.schemas.organizations import OrganizationResponse


class AdminMeResponse(BaseModel):
    id: int
    email: str
    is_admin: bool
    admin_role: str | None = None


class AdminDashboardResponse(BaseModel):
    users: int
    farms: int
    suppliers: int
    solutions: int
    published_solutions: int
    pending_moderation: int
    dictionaries: int
    dictionary_items: int
    taxonomy_nodes: int
    farmer_requests: int
    audit_events: int


class AdminUserResponse(BaseModel):
    id: int
    email: str
    phone: str | None
    full_name: str
    is_active: bool
    is_admin: bool
    admin_role: str | None = None
    organizations_count: int = 0
    created_at: str


class AdminUserUpdatePayload(BaseModel):
    email: str | None = None
    phone: str | None = None
    full_name: str | None = None
    is_active: bool | None = None
    admin_role: str | None = None
    is_admin: bool | None = None


class AdminRolePayload(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    role: str = Field(default="admin", min_length=2, max_length=40)


class DictionarySummaryResponse(BaseModel):
    id: int
    code: str
    name: str
    description: str | None
    status: str
    is_system: bool
    is_locked: bool
    items_count: int
    updated_at: str


class DictionaryItemResponse(BaseModel):
    id: int
    code: str
    label: str
    description: str | None
    status: str
    sort_order: int
    is_system: bool
    parent_code: str | None


class DictionaryDetailResponse(DictionarySummaryResponse):
    items: list[DictionaryItemResponse]


class DictionaryItemPayload(BaseModel):
    code: str = Field(min_length=1, max_length=160)
    label: str = Field(min_length=1, max_length=255)
    description: str | None = None
    status: str = "active"
    sort_order: int = 0
    parent_code: str | None = None


class TaxonomyNodeResponse(BaseModel):
    id: int
    external_id: str
    parent_id: int | None
    parent_external_id: str | None
    level: int
    name: str
    slug: str
    description: str | None
    notes: str | None
    is_selectable: bool
    is_active: bool
    sort_order: int
    solutions_count: int = 0


class TaxonomyNodePayload(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    notes: str | None = None
    is_selectable: bool | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class SolutionResponse(BaseModel):
    id: int
    supplier_id: int | None
    supplier_name: str | None
    name: str
    short_description: str | None
    status: str
    taxonomy_l4_ids: list[str]
    subsector_ids: list[str]
    process_ids: list[str]
    problem_ids: list[str]
    payment_model: str | None
    evidence_level: int | None
    updated_at: str


class FarmerRequestResponse(BaseModel):
    id: int
    title: str
    farmer_email: str | None
    farm_name: str | None
    region_id: str | None
    problem_ids: list[str]
    urgency: str
    budget_rub: str | None
    status: str
    updated_at: str


class MatchingRunResponse(BaseModel):
    id: int
    farmer_request_id: int
    farmer_request_title: str
    status: str
    triggered_by: str
    results_count: int
    best_score: int | None
    updated_at: str


class ModerationItemResponse(BaseModel):
    id: int
    object_type: str
    object_id: str
    title: str
    status: str
    priority: str
    assigned_admin_id: int | None
    company_id: int | None
    solution_id: int | None
    comments_count: int = 0
    updated_at: str


class ModerationStatusPayload(BaseModel):
    status: str
    comment: str | None = None


class AuditLogResponse(BaseModel):
    id: int
    admin_user_id: int | None
    admin_email: str | None
    action: str
    object_type: str
    object_id: str
    object_title: str | None
    risk_level: str
    created_at: str


class ImportJobResponse(BaseModel):
    id: int
    import_type: str
    file_name: str
    status: str
    total_rows: int
    successful_rows: int
    error_rows: int
    warning_rows: int
    updated_at: str


class AnalyticsResponse(BaseModel):
    metrics: AdminDashboardResponse
    white_spots: list[dict]
    coverage: list[dict]


class CompanyListResponse(BaseModel):
    farms: list[OrganizationResponse]
    suppliers: list[OrganizationResponse]
