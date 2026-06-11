from datetime import UTC, datetime
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from tortoise.expressions import Q

from app.auth.dependencies import (
    get_current_user,
    get_current_user_optional,
    require_organization_owner_or_admin,
)
from app.models.admin import FarmerRequest, ModerationItem, Notification, Solution, SolutionTaxonomyLink, TaxonomyNode
from app.models.organization import Organization, OrganizationMember
from app.models.user import User
from app.schemas.solutions import (
    FarmerRequestResponse,
    FormTemplateResponse,
    NotificationResponse,
    SolutionDetailResponse,
    SolutionLeadPayload,
    SolutionSummaryResponse,
    SolutionUpsertPayload,
)
from app.services.notifications import create_notification
from app.services.reference_forms import build_form_template

router = APIRouter(tags=["solutions"])


def iso(value) -> str | None:
    return value.isoformat() if value else None


def as_list(value) -> list[str]:
    if value is None or value == "":
        return []
    if isinstance(value, list):
        return [str(item) for item in value if item not in (None, "")]
    return [str(value)]


def first_value(value) -> str | None:
    values = as_list(value)
    return values[0] if values else None


def normalize_solution_data(data: dict) -> dict:
    fields = data.get("extra_fields") or {}
    data.setdefault("name", fields.get("solution_name") or "Новое цифровое решение")
    data.setdefault("short_description", fields.get("free_description") or fields.get("case_description"))
    data.setdefault("full_description", fields.get("free_description"))
    data.setdefault("partner_type", first_value(fields.get("partner_type")))
    data.setdefault("payment_model", ", ".join(as_list(fields.get("payment_model"))) or None)
    data.setdefault("implementation_type", first_value(fields.get("implementation_format")))
    data.setdefault("deployment_type", ", ".join(as_list(fields.get("deployment_model"))) or None)
    data.setdefault("subsector_ids", as_list(fields.get("subsectors")))
    data.setdefault("process_ids", as_list(fields.get("processes")))
    data.setdefault("problem_ids", as_list(fields.get("farmer_problems")))
    data.setdefault("integration_ids", as_list(fields.get("integrations")))
    data.setdefault("region_ids", as_list(fields.get("regions")))
    if data.get("price_from") is None and fields.get("cost_start_rub") not in (None, ""):
        data["price_from"] = fields.get("cost_start_rub")
    return data


def build_solution_response(solution: Solution, supplier_name: str | None = None) -> SolutionDetailResponse:
    return SolutionDetailResponse(
        id=solution.id,
        supplier_id=solution.supplier_id,
        supplier_name=supplier_name,
        name=solution.name,
        short_description=solution.short_description,
        status=solution.status,
        updated_at=iso(solution.updated_at) or "",
        published_at=iso(solution.published_at),
        extra_fields=solution.extra_fields or {},
        full_description=solution.full_description,
        partner_type=solution.partner_type,
        payment_model=solution.payment_model,
        implementation_type=solution.implementation_type,
        deployment_type=solution.deployment_type,
        evidence_level=solution.evidence_level,
        price_from=str(solution.price_from) if solution.price_from is not None else None,
        subsector_ids=solution.subsector_ids or [],
        process_ids=solution.process_ids or [],
        problem_ids=solution.problem_ids or [],
        integration_ids=solution.integration_ids or [],
        region_ids=solution.region_ids or [],
        taxonomy_l4_ids=[],
    )


async def attach_taxonomy(solution: Solution, taxonomy_l4_ids: list[str]) -> None:
    if not taxonomy_l4_ids:
        return
    nodes = await TaxonomyNode.filter(external_id__in=taxonomy_l4_ids)
    for node in nodes:
        await SolutionTaxonomyLink.get_or_create(solution=solution, taxonomy_node=node, defaults={"is_primary": False})


async def solution_taxonomy_ids(solution: Solution) -> list[str]:
    links = await SolutionTaxonomyLink.filter(solution=solution).prefetch_related("taxonomy_node")
    return [link.taxonomy_node.external_id for link in links]


async def serialize_solution(solution: Solution) -> SolutionDetailResponse:
    supplier_name = None
    if solution.supplier_id:
        supplier = await Organization.get_or_none(id=solution.supplier_id)
        supplier_name = supplier.name if supplier else None
    response = build_solution_response(solution, supplier_name)
    response.taxonomy_l4_ids = await solution_taxonomy_ids(solution)
    return response


async def solution_owner_or_admin(solution: Solution, current_user: User) -> bool:
    if current_user.is_admin:
        return True
    if solution.supplier_id is None:
        return False
    membership = await OrganizationMember.get_or_none(user=current_user, organization_id=solution.supplier_id)
    return membership is not None and membership.role in ("owner", "admin")


async def create_solution_moderation_item(solution: Solution, admin: User | None = None) -> ModerationItem:
    item, _ = await ModerationItem.get_or_create(
        object_type="solution",
        object_id=str(solution.id),
        defaults={
            "title": solution.name,
            "status": "submitted",
            "priority": "normal",
            "company_id": solution.supplier_id,
            "solution_id": solution.id,
            "created_by_id": admin.id if admin else solution.created_by_id,
            "checklist": [],
        },
    )
    item.title = solution.name
    item.status = "submitted"
    item.company_id = solution.supplier_id
    item.solution_id = solution.id
    await item.save()
    return item


async def solution_to_summary(solution: Solution) -> SolutionSummaryResponse:
    supplier_name = None
    if solution.supplier_id:
        supplier = await Organization.get_or_none(id=solution.supplier_id)
        supplier_name = supplier.name if supplier else None
    return SolutionSummaryResponse(
        id=solution.id,
        supplier_id=solution.supplier_id,
        supplier_name=supplier_name,
        name=solution.name,
        short_description=solution.short_description,
        status=solution.status,
        updated_at=iso(solution.updated_at) or "",
        published_at=iso(solution.published_at),
        extra_fields=solution.extra_fields or {},
    )


@router.get("/reference/forms/{form_code}", response_model=FormTemplateResponse)
async def get_reference_form(form_code: str) -> FormTemplateResponse:
    if form_code not in {"supplier", "farmer"}:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form template not found")
    return await build_form_template(form_code)


@router.get("/solutions", response_model=list[SolutionSummaryResponse])
async def list_public_solutions() -> list[SolutionSummaryResponse]:
    solutions = await Solution.filter(status="published").order_by("-published_at", "-updated_at")
    return [await solution_to_summary(solution) for solution in solutions]


@router.get("/solutions/{solution_id}", response_model=SolutionDetailResponse)
async def get_public_solution(
    solution_id: int,
    current_user: User | None = Depends(get_current_user_optional),
) -> SolutionDetailResponse:
    solution = await Solution.get_or_none(id=solution_id)
    if solution is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found")
    if solution.status != "published":
        if current_user is None or not await solution_owner_or_admin(solution, current_user):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found")
    return await serialize_solution(solution)


@router.get("/organizations/{organization_id}/solutions", response_model=list[SolutionSummaryResponse])
async def list_organization_solutions(
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_owner_or_admin),
) -> list[SolutionSummaryResponse]:
    organization, _ = context
    solutions = await Solution.filter(supplier=organization).order_by("-updated_at")
    return [await solution_to_summary(solution) for solution in solutions]


@router.post("/organizations/{organization_id}/solutions", response_model=SolutionDetailResponse)
async def create_organization_solution(
    payload: SolutionUpsertPayload,
    current_user: User = Depends(get_current_user),
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_owner_or_admin),
) -> SolutionDetailResponse:
    organization, _member = context
    if payload.supplier_organization_id and payload.supplier_organization_id != organization.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Supplier organization mismatch")
    data = payload.model_dump(exclude={"taxonomy_l4_ids"}, exclude_unset=True)
    data.pop("supplier_organization_id", None)
    data["supplier"] = organization
    data["created_by_id"] = current_user.id
    data.pop("status", None)
    data["status"] = "draft"
    data = normalize_solution_data(data)
    data["price_from"] = Decimal(str(data["price_from"])) if data.get("price_from") is not None else None
    solution = await Solution.create(**data)
    await attach_taxonomy(solution, payload.taxonomy_l4_ids)
    return await serialize_solution(solution)


@router.patch("/organizations/{organization_id}/solutions/{solution_id}", response_model=SolutionDetailResponse)
async def update_organization_solution(
    solution_id: int,
    payload: SolutionUpsertPayload,
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_owner_or_admin),
) -> SolutionDetailResponse:
    organization, _ = context
    solution = await Solution.get_or_none(id=solution_id, supplier=organization)
    if solution is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found")
    if payload.supplier_organization_id and payload.supplier_organization_id != organization.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Supplier organization mismatch")
    data = payload.model_dump(exclude={"taxonomy_l4_ids"}, exclude_unset=True)
    data.pop("supplier_organization_id", None)
    data.pop("status", None)
    data = normalize_solution_data(data)
    if "price_from" in data and data["price_from"] is not None:
        data["price_from"] = Decimal(str(data["price_from"]))
    for key, value in data.items():
        setattr(solution, key, value)
    await solution.save()
    if "taxonomy_l4_ids" in payload.model_fields_set:
        await SolutionTaxonomyLink.filter(solution=solution).delete()
        await attach_taxonomy(solution, payload.taxonomy_l4_ids)
    return await serialize_solution(solution)


@router.post("/organizations/{organization_id}/solutions/{solution_id}/submit", response_model=SolutionDetailResponse)
async def submit_solution_for_moderation(
    solution_id: int,
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_owner_or_admin),
) -> SolutionDetailResponse:
    organization, _ = context
    solution = await Solution.get_or_none(id=solution_id, supplier=organization)
    if solution is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found")
    solution.status = "pending_moderation"
    await solution.save(update_fields=["status", "updated_at"])
    item = await create_solution_moderation_item(solution)
    members = await OrganizationMember.filter(organization=organization).prefetch_related("user")
    for member in members:
        await create_notification(
            user=member.user,
            organization=organization,
            kind="moderation",
            title="Решение отправлено на проверку",
            body=f"Решение «{solution.name}» отправлено на модерацию.",
            href=f"/app/organizations/{organization.id}/solutions/{solution.id}",
            payload={"moderation_item_id": item.id if item else None, "solution_id": solution.id},
        )
    return await serialize_solution(solution)


@router.post("/solutions/{solution_id}/publish", response_model=SolutionDetailResponse)
async def publish_solution(
    solution_id: int,
    current_user: User = Depends(get_current_user),
) -> SolutionDetailResponse:
    solution = await Solution.get_or_none(id=solution_id)
    if solution is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found")
    if not await solution_owner_or_admin(solution, current_user) and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    solution.status = "published"
    solution.published_at = datetime.now(UTC)
    await solution.save(update_fields=["status", "published_at", "updated_at"])
    if solution.supplier_id:
        organization = await Organization.get_or_none(id=solution.supplier_id)
        if organization:
            members = await OrganizationMember.filter(organization=organization).prefetch_related("user")
            for member in members:
                await create_notification(
                    user=member.user,
                    organization=organization,
                    kind="publish",
                    title="Решение опубликовано",
                    body=f"Решение «{solution.name}» опубликовано и доступно в каталоге.",
                    href=f"/solutions/{solution.id}",
                    payload={"solution_id": solution.id},
                )
    return await serialize_solution(solution)


@router.post("/solutions/{solution_id}/requests", response_model=FarmerRequestResponse)
async def create_solution_request(
    solution_id: int,
    payload: SolutionLeadPayload,
    current_user: User | None = Depends(get_current_user_optional),
) -> FarmerRequestResponse:
    solution = await Solution.get_or_none(id=solution_id)
    if solution is None or solution.status != "published":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found")
    farm = None
    if current_user and payload.farm_id:
        farm = await Organization.get_or_none(id=payload.farm_id)
        if farm is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    elif current_user and not payload.farm_id:
        membership = await OrganizationMember.filter(user=current_user).prefetch_related("organization").first()
        farm = membership.organization if membership else None
    request = await FarmerRequest.create(
        user=current_user,
        farm=farm,
        solution=solution,
        title=f"Заявка на решение: {solution.name}",
        contact_name=payload.contact_name,
        contact_email=payload.contact_email,
        contact_phone=payload.contact_phone,
        organization_name=payload.organization_name,
        message=payload.message,
        source="solution_lead" if current_user else "guest_lead",
        status="new",
        extra_fields=payload.extra_fields,
    )
    if current_user:
        await create_notification(
            user=current_user,
            organization=farm,
            kind="request",
            title="Заявка создана",
            body=f"Заявка на решение «{solution.name}» создана и ждёт обработки.",
            href="/app/profile/applications",
            payload={"request_id": request.id, "solution_id": solution.id},
        )
    if solution.supplier_id:
        supplier = await Organization.get_or_none(id=solution.supplier_id)
        if supplier:
            members = await OrganizationMember.filter(organization=supplier).prefetch_related("user")
            for member in members:
                await create_notification(
                    user=member.user,
                    organization=supplier,
                    kind="request",
                    title="Новая заявка на решение",
                    body=f"На решение «{solution.name}» оставили заявку.",
                    href=f"/app/organizations/{supplier.id}/solutions/{solution.id}",
                    payload={"request_id": request.id, "solution_id": solution.id},
                )
    return await serialize_request(request)


async def serialize_request(request: FarmerRequest) -> FarmerRequestResponse:
    solution_name = None
    if request.solution_id:
        solution = await Solution.get_or_none(id=request.solution_id)
        solution_name = solution.name if solution else None
    return FarmerRequestResponse(
        id=request.id,
        solution_id=request.solution_id,
        solution_name=solution_name,
        user_id=request.user_id,
        farm_id=request.farm_id,
        contact_name=request.contact_name,
        contact_email=request.contact_email,
        contact_phone=request.contact_phone,
        organization_name=request.organization_name,
        message=request.message,
        source=request.source,
        region_id=request.region_id,
        problem_ids=request.problem_ids or [],
        urgency=request.urgency,
        budget_rub=str(request.budget_rub) if request.budget_rub is not None else None,
        status=request.status,
        updated_at=iso(request.updated_at) or "",
    )


@router.get("/requests/me", response_model=list[FarmerRequestResponse])
async def list_my_requests(current_user: User = Depends(get_current_user)) -> list[FarmerRequestResponse]:
    org_ids = [membership.organization_id for membership in await OrganizationMember.filter(user=current_user)]
    requests = await FarmerRequest.filter(Q(user=current_user) | Q(farm_id__in=org_ids)).order_by("-updated_at")
    return [await serialize_request(item) for item in requests]


@router.get("/organizations/{organization_id}/requests", response_model=list[FarmerRequestResponse])
async def list_organization_requests(
    context: tuple[Organization, OrganizationMember] = Depends(require_organization_owner_or_admin),
) -> list[FarmerRequestResponse]:
    organization, _ = context
    requests = await FarmerRequest.filter(farm=organization).order_by("-updated_at")
    return [await serialize_request(item) for item in requests]


@router.get("/solutions/{solution_id}/requests", response_model=list[FarmerRequestResponse])
async def list_solution_requests(
    solution_id: int,
    current_user: User = Depends(get_current_user),
) -> list[FarmerRequestResponse]:
    solution = await Solution.get_or_none(id=solution_id)
    if solution is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found")
    if not await solution_owner_or_admin(solution, current_user) and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    requests = await FarmerRequest.filter(solution=solution).order_by("-updated_at")
    return [await serialize_request(item) for item in requests]


@router.get("/notifications/me", response_model=list[NotificationResponse])
async def list_my_notifications(current_user: User = Depends(get_current_user)) -> list[NotificationResponse]:
    notifications = await Notification.filter(user=current_user).order_by("-created_at")
    return [
        NotificationResponse(
            id=item.id,
            title=item.title,
            body=item.body,
            kind=item.kind,
            href=item.href,
            is_read=item.is_read,
            organization_id=item.organization_id,
            created_at=iso(item.created_at) or "",
        )
        for item in notifications
    ]


@router.patch("/notifications/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(notification_id: int, current_user: User = Depends(get_current_user)) -> NotificationResponse:
    notification = await Notification.get_or_none(id=notification_id, user=current_user)
    if notification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    notification.is_read = True
    await notification.save(update_fields=["is_read", "updated_at"])
    return NotificationResponse(
        id=notification.id,
        title=notification.title,
        body=notification.body,
        kind=notification.kind,
        href=notification.href,
        is_read=notification.is_read,
        organization_id=notification.organization_id,
        created_at=iso(notification.created_at) or "",
    )
