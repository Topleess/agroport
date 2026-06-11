from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import (
    get_current_user,
    require_organization_member,
    require_organization_owner_or_admin,
)
from app.models.admin import ModerationItem
from app.models.organization import Organization, OrganizationMember, OrganizationProduct, OrganizationProfile
from app.models.user import User
from app.schemas.organizations import (
    OrganizationCreate,
    OrganizationCategory,
    OrganizationLookupResponse,
    OrganizationProductPayload,
    OrganizationProductResponse,
    OrganizationProductUpdate,
    OrganizationProfilePayload,
    OrganizationProfileResponse,
    OrganizationResponse,
    OrganizationUpdate,
)
from app.services.notifications import create_notification

router = APIRouter(prefix="/organizations", tags=["organizations"])


def calculate_completion(payload: OrganizationProfilePayload) -> int:
    checks = [
        bool(payload.production_types),
        payload.land_area_ha is not None,
        payload.livestock_count is not None,
        bool(payload.main_crops),
        bool(payload.machinery),
        bool(payload.digital_maturity),
        bool(payload.support_needs),
        bool(payload.service_needs),
        bool(payload.marketplace_interests),
        bool(payload.comment),
    ]
    return round(sum(checks) / len(checks) * 100)


async def serialize_organization(
    organization: Organization, member_role: str | None = None
) -> OrganizationResponse:
    profile = await OrganizationProfile.get_or_none(organization=organization)
    return OrganizationResponse(
        id=organization.id,
        category=organization.category,
        type=organization.type,
        name=organization.name,
        inn=organization.inn,
        ogrn=organization.ogrn,
        kpp=organization.kpp,
        region=organization.region,
        address=organization.address,
        verification_status=organization.verification_status,
        member_role=member_role,
        profile_completion_percent=profile.completion_percent if profile else 0,
    )


def serialize_product(product: OrganizationProduct) -> OrganizationProductResponse:
    return OrganizationProductResponse(
        id=product.id,
        organization_id=product.organization_id,
        category=product.category,
        name=product.name,
        description=product.description,
        unit=product.unit,
        price=product.price,
    )


async def serialize_profile(
    organization: Organization, profile: OrganizationProfile | None
) -> OrganizationProfileResponse:
    if profile is None:
        return OrganizationProfileResponse(organization_id=organization.id)
    return OrganizationProfileResponse(
        id=profile.id,
        organization_id=organization.id,
        production_types=profile.production_types or [],
        land_area_ha=Decimal(profile.land_area_ha) if profile.land_area_ha is not None else None,
        livestock_count=profile.livestock_count,
        main_crops=profile.main_crops,
        machinery=profile.machinery,
        digital_maturity=profile.digital_maturity,
        support_needs=profile.support_needs,
        service_needs=profile.service_needs,
        marketplace_interests=profile.marketplace_interests,
        comment=profile.comment,
        completion_percent=profile.completion_percent,
    )


MOCK_LOOKUP_DATA = {
    "500100000001": {
        "type": "KFH",
        "name": "КФХ Зеленое поле",
        "ogrn": "1234567890123",
        "kpp": None,
        "region": "Московская область",
        "address": "Московская область, Дмитровский округ",
    },
    "7701000000": {
        "type": "OOO",
        "name": "ООО АгроТех Решения",
        "ogrn": "1027700000000",
        "kpp": "770101001",
        "region": "Москва",
        "address": "г. Москва, ул. Технологическая, д. 1",
    },
}


@router.get("", response_model=list[OrganizationResponse])
async def list_organizations(current_user: User = Depends(get_current_user)) -> list[OrganizationResponse]:
    memberships = await OrganizationMember.filter(user=current_user).prefetch_related("organization")
    result = []
    for membership in memberships:
        result.append(await serialize_organization(membership.organization, membership.role))
    return result


@router.get("/lookup", response_model=OrganizationLookupResponse)
async def lookup_organization(
    inn: str,
    category: OrganizationCategory = OrganizationCategory.farm,
    current_user: User = Depends(get_current_user),
) -> OrganizationLookupResponse:
    if len(inn) not in (10, 12) or not inn.isdigit():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="INN must contain 10 or 12 digits",
        )

    data = MOCK_LOOKUP_DATA.get(inn)
    if data is None:
        return OrganizationLookupResponse(
            found=False,
            category=category,
            type="OTHER",
            name="",
            inn=inn,
        )
    return OrganizationLookupResponse(found=True, category=category, inn=inn, **data)


@router.post("", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    payload: OrganizationCreate,
    current_user: User = Depends(get_current_user),
) -> OrganizationResponse:
    organization = await Organization.create(created_by=current_user, **payload.model_dump())
    member = await OrganizationMember.create(
        user=current_user, organization=organization, role="owner"
    )
    return await serialize_organization(organization, member.role)


@router.get("/{organization_id}/products", response_model=list[OrganizationProductResponse])
async def list_products(
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_member),
) -> list[OrganizationProductResponse]:
    organization, _ = context
    products = await OrganizationProduct.filter(organization=organization).order_by("-created_at")
    return [serialize_product(product) for product in products]


@router.post(
    "/{organization_id}/products",
    response_model=OrganizationProductResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_product(
    payload: OrganizationProductPayload,
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_owner_or_admin),
) -> OrganizationProductResponse:
    organization, _ = context
    product = await OrganizationProduct.create(organization=organization, **payload.model_dump())
    return serialize_product(product)


@router.patch("/{organization_id}/products/{product_id}", response_model=OrganizationProductResponse)
async def update_product(
    product_id: int,
    payload: OrganizationProductUpdate,
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_owner_or_admin),
) -> OrganizationProductResponse:
    organization, _ = context
    product = await OrganizationProduct.get_or_none(id=product_id, organization=organization)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    await product.save()
    return serialize_product(product)


@router.get("/{organization_id}", response_model=OrganizationResponse)
async def get_organization(
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_member),
) -> OrganizationResponse:
    organization, member = context
    return await serialize_organization(organization, member.role)


@router.patch("/{organization_id}", response_model=OrganizationResponse)
async def update_organization(
    payload: OrganizationUpdate,
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_owner_or_admin),
) -> OrganizationResponse:
    organization, member = context
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(organization, key, value)
    await organization.save()
    return await serialize_organization(organization, member.role)


@router.post("/{organization_id}/submit-verification", response_model=OrganizationResponse)
async def submit_verification(
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_owner_or_admin),
) -> OrganizationResponse:
    organization, member = context
    if organization.verification_status != "draft":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft organizations can be submitted",
        )
    organization.verification_status = "pending_verification"
    await organization.save(update_fields=["verification_status", "updated_at"])
    item, _ = await ModerationItem.get_or_create(
        object_type="organization",
        object_id=str(organization.id),
        defaults={
            "title": organization.name,
            "status": "submitted",
            "priority": "normal",
            "company_id": organization.id,
            "created_by_id": organization.created_by_id,
            "checklist": [],
        },
    )
    item.title = organization.name
    item.status = "submitted"
    item.company_id = organization.id
    await item.save()
    members = await OrganizationMember.filter(organization=organization).prefetch_related("user")
    for current_member in members:
        await create_notification(
            user=current_member.user,
            organization=organization,
            kind="moderation",
            title="Организация отправлена на проверку",
            body=f"Организация «{organization.name}» отправлена на модерацию.",
            href=f"/app/organizations/{organization.id}",
            payload={"moderation_item_id": item.id, "organization_id": organization.id},
        )
    return await serialize_organization(organization, member.role)


@router.get("/{organization_id}/profile", response_model=OrganizationProfileResponse)
async def get_organization_profile(
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_member),
) -> OrganizationProfileResponse:
    organization, _ = context
    profile = await OrganizationProfile.get_or_none(organization=organization)
    return await serialize_profile(organization, profile)


@router.put("/{organization_id}/profile", response_model=OrganizationProfileResponse)
async def put_organization_profile(
    payload: OrganizationProfilePayload,
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_owner_or_admin),
) -> OrganizationProfileResponse:
    organization, _ = context
    data = payload.model_dump()
    data["completion_percent"] = calculate_completion(payload)
    profile = await OrganizationProfile.get_or_none(organization=organization)
    if profile is None:
        profile = await OrganizationProfile.create(organization=organization, **data)
    else:
        for key, value in data.items():
            setattr(profile, key, value)
        await profile.save()
    return await serialize_profile(organization, profile)
