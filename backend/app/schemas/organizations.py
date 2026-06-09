from decimal import Decimal
from enum import StrEnum
from pydantic import BaseModel, Field, field_validator


class OrganizationType(StrEnum):
    IP = "IP"
    KFH = "KFH"
    OOO = "OOO"
    SPK = "SPK"
    OTHER = "OTHER"


class OrganizationCategory(StrEnum):
    farm = "farm"
    solution_provider = "solution_provider"


class VerificationStatus(StrEnum):
    draft = "draft"
    pending_verification = "pending_verification"
    verified = "verified"
    rejected = "rejected"


class MemberRole(StrEnum):
    owner = "owner"
    admin = "admin"
    member = "member"
    viewer = "viewer"


class ProductCategory(StrEnum):
    grain = "grain"
    vegetables = "vegetables"
    dairy = "dairy"
    meat = "meat"
    machinery = "machinery"
    digital = "digital"
    consulting = "consulting"
    other = "other"


class OrganizationBase(BaseModel):
    category: OrganizationCategory = OrganizationCategory.farm
    type: OrganizationType
    name: str = Field(min_length=1, max_length=255)
    inn: str
    ogrn: str | None = None
    kpp: str | None = None
    region: str | None = None
    address: str | None = None

    @field_validator("inn")
    @classmethod
    def validate_inn(cls, value: str) -> str:
        if len(value) not in (10, 12) or not value.isdigit():
            raise ValueError("INN must contain 10 or 12 digits")
        return value


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    category: OrganizationCategory | None = None
    type: OrganizationType | None = None
    name: str | None = Field(default=None, min_length=1, max_length=255)
    inn: str | None = None
    ogrn: str | None = None
    kpp: str | None = None
    region: str | None = None
    address: str | None = None

    @field_validator("inn")
    @classmethod
    def validate_optional_inn(cls, value: str | None) -> str | None:
        if value is not None and (len(value) not in (10, 12) or not value.isdigit()):
            raise ValueError("INN must contain 10 or 12 digits")
        return value


class OrganizationResponse(OrganizationBase):
    id: int
    verification_status: VerificationStatus
    member_role: MemberRole | None = None
    profile_completion_percent: int = 0


class OrganizationLookupResponse(OrganizationBase):
    found: bool = True


class OrganizationProfilePayload(BaseModel):
    production_types: list[str] = Field(default_factory=list)
    land_area_ha: Decimal | None = Field(default=None, ge=0)
    livestock_count: int | None = Field(default=None, ge=0)
    main_crops: list[str] | None = None
    machinery: list[str] | None = None
    digital_maturity: str | None = None
    support_needs: list[str] | None = None
    service_needs: list[str] | None = None
    marketplace_interests: list[str] | None = None
    comment: str | None = None


class OrganizationProfileResponse(OrganizationProfilePayload):
    id: int | None = None
    organization_id: int
    completion_percent: int = 0


class OrganizationProductPayload(BaseModel):
    category: ProductCategory
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    unit: str | None = Field(default=None, max_length=40)
    price: Decimal | None = Field(default=None, ge=0)


class OrganizationProductUpdate(BaseModel):
    category: ProductCategory | None = None
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    unit: str | None = Field(default=None, max_length=40)
    price: Decimal | None = Field(default=None, ge=0)


class OrganizationProductResponse(OrganizationProductPayload):
    id: int
    organization_id: int
