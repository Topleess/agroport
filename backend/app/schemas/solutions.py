from typing import Any

from pydantic import BaseModel, Field


class FormOptionResponse(BaseModel):
    code: str
    label: str
    level: int | None = None
    parent_code: str | None = None


class FormFieldResponse(BaseModel):
    field_key: str
    field_name: str
    input_type: str
    required: bool
    dictionary_code: str | None = None
    block: str | None = None
    allow_other_text: bool = False
    options: list[FormOptionResponse] = Field(default_factory=list)


class FormTemplateResponse(BaseModel):
    code: str
    name: str
    description: str | None = None
    fields: list[FormFieldResponse]


class SolutionSummaryResponse(BaseModel):
    id: int
    supplier_id: int | None
    supplier_name: str | None
    name: str
    short_description: str | None
    status: str
    updated_at: str
    published_at: str | None = None
    extra_fields: dict[str, Any] = Field(default_factory=dict)


class SolutionDetailResponse(SolutionSummaryResponse):
    full_description: str | None = None
    partner_type: str | None = None
    payment_model: str | None = None
    implementation_type: str | None = None
    deployment_type: str | None = None
    evidence_level: int | None = None
    price_from: str | None = None
    subsector_ids: list[str] = Field(default_factory=list)
    process_ids: list[str] = Field(default_factory=list)
    problem_ids: list[str] = Field(default_factory=list)
    integration_ids: list[str] = Field(default_factory=list)
    region_ids: list[str] = Field(default_factory=list)
    taxonomy_l4_ids: list[str] = Field(default_factory=list)


class SolutionUpsertPayload(BaseModel):
    supplier_organization_id: int | None = None
    name: str | None = Field(default=None, min_length=1, max_length=255)
    short_description: str | None = None
    full_description: str | None = None
    partner_type: str | None = None
    payment_model: str | None = None
    implementation_type: str | None = None
    deployment_type: str | None = None
    evidence_level: int | None = Field(default=None, ge=0)
    price_from: float | None = Field(default=None, ge=0)
    status: str | None = None
    taxonomy_l4_ids: list[str] = Field(default_factory=list)
    subsector_ids: list[str] = Field(default_factory=list)
    process_ids: list[str] = Field(default_factory=list)
    problem_ids: list[str] = Field(default_factory=list)
    integration_ids: list[str] = Field(default_factory=list)
    region_ids: list[str] = Field(default_factory=list)
    extra_fields: dict[str, Any] = Field(default_factory=dict)


class SolutionLeadPayload(BaseModel):
    contact_name: str | None = Field(default=None, max_length=255)
    contact_email: str | None = Field(default=None, max_length=255)
    contact_phone: str | None = Field(default=None, max_length=32)
    organization_name: str | None = Field(default=None, max_length=255)
    message: str | None = None
    farm_id: int | None = None
    is_registered_request: bool = False
    extra_fields: dict[str, Any] = Field(default_factory=dict)


class FarmerRequestResponse(BaseModel):
    id: int
    solution_id: int | None = None
    solution_name: str | None = None
    user_id: int | None = None
    farm_id: int | None = None
    contact_name: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    organization_name: str | None = None
    message: str | None = None
    source: str
    region_id: str | None = None
    problem_ids: list[str] = Field(default_factory=list)
    urgency: str
    budget_rub: str | None = None
    status: str
    updated_at: str


class NotificationResponse(BaseModel):
    id: int
    title: str
    body: str
    kind: str
    href: str | None = None
    is_read: bool
    organization_id: int | None = None
    created_at: str

