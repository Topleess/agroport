from fastapi import APIRouter, Depends

from app.auth.dependencies import require_admin
from app.models.organization import Organization
from app.models.user import User
from app.routers.organizations import serialize_organization
from app.schemas.organizations import OrganizationResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/organizations", response_model=list[OrganizationResponse])
async def admin_list_organizations(
    status: str | None = None,
    _: User = Depends(require_admin),
) -> list[OrganizationResponse]:
    query = Organization.all()
    if status:
        query = query.filter(verification_status=status)
    organizations = await query.order_by("-updated_at")
    return [await serialize_organization(organization) for organization in organizations]


@router.post("/organizations/{organization_id}/approve", response_model=OrganizationResponse)
async def approve_organization(
    organization_id: int,
    _: User = Depends(require_admin),
) -> OrganizationResponse:
    organization = await Organization.get(id=organization_id)
    organization.verification_status = "verified"
    await organization.save(update_fields=["verification_status", "updated_at"])
    return await serialize_organization(organization)


@router.post("/organizations/{organization_id}/reject", response_model=OrganizationResponse)
async def reject_organization(
    organization_id: int,
    _: User = Depends(require_admin),
) -> OrganizationResponse:
    organization = await Organization.get(id=organization_id)
    organization.verification_status = "rejected"
    await organization.save(update_fields=["verification_status", "updated_at"])
    return await serialize_organization(organization)
