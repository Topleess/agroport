from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import require_admin
from app.models.admin import (
    AdminUserRole,
    AuditLogEntry,
    Dictionary,
    DictionaryItem,
    FarmerRequest,
    ImportJob,
    MatchingResult,
    MatchingRun,
    ModerationComment,
    ModerationItem,
    Solution,
    SolutionTaxonomyLink,
    TaxonomyNode,
)
from app.models.organization import Organization, OrganizationMember
from app.models.user import User, UserProfile
from app.routers.organizations import serialize_organization
from app.schemas.admin import (
    AdminDashboardResponse,
    AdminMeResponse,
    AdminRolePayload,
    AdminUserUpdatePayload,
    AdminUserResponse,
    AnalyticsResponse,
    AuditLogResponse,
    CompanyListResponse,
    DictionaryDetailResponse,
    DictionaryItemPayload,
    DictionaryItemResponse,
    DictionarySummaryResponse,
    FarmerRequestResponse,
    ImportJobResponse,
    MatchingRunResponse,
    ModerationItemResponse,
    ModerationStatusPayload,
    SolutionResponse,
    TaxonomyNodePayload,
    TaxonomyNodeResponse,
)
from app.schemas.organizations import OrganizationResponse
from app.services.notifications import create_notification

router = APIRouter(prefix="/admin", tags=["admin"])


async def write_audit(
    admin: User,
    action: str,
    object_type: str,
    object_id: str | int,
    object_title: str | None = None,
    before: dict | None = None,
    after: dict | None = None,
    risk_level: str = "medium",
) -> None:
    await AuditLogEntry.create(
        admin_user=admin,
        action=action,
        object_type=object_type,
        object_id=str(object_id),
        object_title=object_title,
        before_snapshot=before,
        after_snapshot=after,
        risk_level=risk_level,
    )


async def get_admin_role(user: User) -> str | None:
    role = await AdminUserRole.get_or_none(user=user, is_active=True)
    if role:
        return role.role
    if user.is_admin:
        return "super_admin"
    return None


async def serialize_admin_user(user: User) -> AdminUserResponse:
    profile = await UserProfile.get_or_none(user=user)
    full_name = " ".join(
        part for part in [profile.last_name if profile else "", profile.first_name if profile else ""] if part
    ) or user.email
    memberships_count = await OrganizationMember.filter(user=user).count()
    return AdminUserResponse(
        id=user.id,
        email=user.email,
        phone=user.phone,
        full_name=full_name,
        is_active=user.is_active,
        is_admin=user.is_admin,
        admin_role=await get_admin_role(user),
        organizations_count=memberships_count,
        created_at=iso(user.created_at),
    )


def iso(value) -> str:
    return value.isoformat()


async def notify_organization_members(
    organization: Organization,
    *,
    kind: str,
    title: str,
    body: str,
    href: str | None = None,
    payload: dict | None = None,
) -> None:
    members = await OrganizationMember.filter(organization=organization).prefetch_related("user")
    for member in members:
        await create_notification(
            user=member.user,
            organization=organization,
            kind=kind,
            title=title,
            body=body,
            href=href,
            payload=payload or {},
        )


@router.get("/auth/me", response_model=AdminMeResponse)
async def admin_me(admin: User = Depends(require_admin)) -> AdminMeResponse:
    return AdminMeResponse(
        id=admin.id,
        email=admin.email,
        is_admin=admin.is_admin,
        admin_role=await get_admin_role(admin),
    )


@router.get("/dashboard", response_model=AdminDashboardResponse)
async def admin_dashboard(_: User = Depends(require_admin)) -> AdminDashboardResponse:
    return AdminDashboardResponse(
        users=await User.all().count(),
        farms=await Organization.filter(category="farm").count(),
        suppliers=await Organization.filter(category="solution_provider").count(),
        solutions=await Solution.all().count(),
        published_solutions=await Solution.filter(status="published").count(),
        pending_moderation=await ModerationItem.filter(status__in=["submitted", "in_review", "needs_changes"]).count(),
        dictionaries=await Dictionary.all().count(),
        dictionary_items=await DictionaryItem.all().count(),
        taxonomy_nodes=await TaxonomyNode.all().count(),
        farmer_requests=await FarmerRequest.all().count(),
        audit_events=await AuditLogEntry.all().count(),
    )


@router.get("/users", response_model=list[AdminUserResponse])
async def admin_users(_: User = Depends(require_admin)) -> list[AdminUserResponse]:
    users = await User.all().order_by("-created_at").prefetch_related("profile", "admin_role")
    return [await serialize_admin_user(user) for user in users]


@router.get("/users/{user_id}", response_model=AdminUserResponse)
async def admin_user_detail(user_id: int, _: User = Depends(require_admin)) -> AdminUserResponse:
    user = await User.get_or_none(id=user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return await serialize_admin_user(user)


@router.patch("/users/{user_id}", response_model=AdminUserResponse)
async def admin_update_user(
    user_id: int,
    payload: AdminUserUpdatePayload,
    admin: User = Depends(require_admin),
) -> AdminUserResponse:
    user = await User.get_or_none(id=user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    before = await serialize_admin_user(user)
    data = payload.model_dump(exclude_unset=True)
    if "email" in data and data["email"]:
        user.email = data["email"]
    if "phone" in data:
        user.phone = data["phone"]
    if "is_active" in data and data["is_active"] is not None:
        user.is_active = data["is_active"]
    if "is_admin" in data and data["is_admin"] is not None:
        user.is_admin = data["is_admin"]
    await user.save()
    if "full_name" in data and data["full_name"]:
        parts = str(data["full_name"]).split()
        profile = await UserProfile.get_or_none(user=user)
        if profile is None:
            profile = await UserProfile.create(
                user=user,
                last_name=parts[0] if parts else user.email,
                first_name=parts[1] if len(parts) > 1 else "",
                middle_name=" ".join(parts[2:]) or None,
            )
        else:
            profile.last_name = parts[0] if parts else profile.last_name
            profile.first_name = parts[1] if len(parts) > 1 else profile.first_name
            profile.middle_name = " ".join(parts[2:]) or None
            await profile.save()
    if "admin_role" in data:
        role_value = data["admin_role"]
        role = await AdminUserRole.get_or_none(user=user)
        if role_value:
            if role is None:
                await AdminUserRole.create(user=user, role=role_value, is_active=True)
            else:
                role.role = role_value
                role.is_active = True
                await role.save()
            user.is_admin = True
            await user.save(update_fields=["is_admin", "updated_at"])
        elif role is not None:
            role.is_active = False
            await role.save(update_fields=["is_active", "updated_at"])
            if not user.is_admin:
                user.is_admin = False
                await user.save(update_fields=["is_admin", "updated_at"])
    after = await serialize_admin_user(user)
    await write_audit(
        admin,
        "user.update",
        "user",
        user.id,
        user.email,
        before=before.model_dump(),
        after=after.model_dump(),
        risk_level="high" if "admin_role" in data or "is_admin" in data else "medium",
    )
    return after


@router.post("/admins", response_model=AdminUserResponse)
async def admin_assign_role(payload: AdminRolePayload, admin: User = Depends(require_admin)) -> AdminUserResponse:
    user = await User.get_or_none(email=payload.email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User with this email not found")
    before = await serialize_admin_user(user)
    role, _ = await AdminUserRole.get_or_create(user=user, defaults={"role": payload.role, "is_active": True})
    role.role = payload.role
    role.is_active = True
    await role.save()
    user.is_admin = True
    await user.save(update_fields=["is_admin", "updated_at"])
    after = await serialize_admin_user(user)
    await write_audit(
        admin,
        "admin_role.assign",
        "user",
        user.id,
        user.email,
        before=before.model_dump(),
        after=after.model_dump(),
        risk_level="high",
    )
    return after


@router.patch("/admins/{user_id}", response_model=AdminUserResponse)
async def admin_update_role(
    user_id: int,
    payload: AdminRolePayload,
    admin: User = Depends(require_admin),
) -> AdminUserResponse:
    user = await User.get_or_none(id=user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    before = await serialize_admin_user(user)
    role, _ = await AdminUserRole.get_or_create(user=user, defaults={"role": payload.role, "is_active": True})
    role.role = payload.role
    role.is_active = True
    await role.save()
    user.is_admin = True
    await user.save(update_fields=["is_admin", "updated_at"])
    after = await serialize_admin_user(user)
    await write_audit(admin, "admin_role.update", "user", user.id, user.email, before=before.model_dump(), after=after.model_dump(), risk_level="high")
    return after


@router.delete("/admins/{user_id}", response_model=AdminUserResponse)
async def admin_remove_role(user_id: int, admin: User = Depends(require_admin)) -> AdminUserResponse:
    user = await User.get_or_none(id=user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot remove your own admin access")
    before = await serialize_admin_user(user)
    role = await AdminUserRole.get_or_none(user=user)
    if role:
        role.is_active = False
        await role.save(update_fields=["is_active", "updated_at"])
    user.is_admin = False
    await user.save(update_fields=["is_admin", "updated_at"])
    after = await serialize_admin_user(user)
    await write_audit(admin, "admin_role.remove", "user", user.id, user.email, before=before.model_dump(), after=after.model_dump(), risk_level="high")
    return after


async def list_organizations_by_category(category: str | None = None, status_filter: str | None = None):
    query = Organization.all()
    if category:
        query = query.filter(category=category)
    if status_filter:
        query = query.filter(verification_status=status_filter)
    organizations = await query.order_by("-updated_at")
    return [await serialize_organization(organization) for organization in organizations]


@router.get("/organizations", response_model=list[OrganizationResponse])
async def admin_list_organizations(
    status: str | None = None,
    _: User = Depends(require_admin),
) -> list[OrganizationResponse]:
    return await list_organizations_by_category(status_filter=status)


@router.get("/companies", response_model=CompanyListResponse)
async def admin_companies(_: User = Depends(require_admin)) -> CompanyListResponse:
    return CompanyListResponse(
        farms=await list_organizations_by_category("farm"),
        suppliers=await list_organizations_by_category("solution_provider"),
    )


@router.get("/companies/farms", response_model=list[OrganizationResponse])
async def admin_farms(_: User = Depends(require_admin)) -> list[OrganizationResponse]:
    return await list_organizations_by_category("farm")


@router.get("/companies/suppliers", response_model=list[OrganizationResponse])
async def admin_suppliers(_: User = Depends(require_admin)) -> list[OrganizationResponse]:
    return await list_organizations_by_category("solution_provider")


@router.post("/organizations/{organization_id}/approve", response_model=OrganizationResponse)
async def approve_organization(
    organization_id: int,
    admin: User = Depends(require_admin),
) -> OrganizationResponse:
    organization = await Organization.get(id=organization_id)
    before = {"verification_status": organization.verification_status}
    organization.verification_status = "verified"
    await organization.save(update_fields=["verification_status", "updated_at"])
    await write_audit(
        admin,
        "organization.approve",
        "organization",
        organization.id,
        organization.name,
        before=before,
        after={"verification_status": organization.verification_status},
        risk_level="high",
    )
    await notify_organization_members(
        organization,
        kind="moderation",
        title="Организация подтверждена",
        body=f"Проверка организации «{organization.name}» завершилась успешно.",
        href=f"/app/organizations/{organization.id}",
        payload={"verification_status": organization.verification_status},
    )
    return await serialize_organization(organization)


@router.post("/organizations/{organization_id}/reject", response_model=OrganizationResponse)
async def reject_organization(
    organization_id: int,
    admin: User = Depends(require_admin),
) -> OrganizationResponse:
    organization = await Organization.get(id=organization_id)
    before = {"verification_status": organization.verification_status}
    organization.verification_status = "rejected"
    await organization.save(update_fields=["verification_status", "updated_at"])
    await write_audit(
        admin,
        "organization.reject",
        "organization",
        organization.id,
        organization.name,
        before=before,
        after={"verification_status": organization.verification_status},
        risk_level="high",
    )
    await notify_organization_members(
        organization,
        kind="moderation",
        title="Организация отклонена",
        body=f"Проверка организации «{organization.name}» завершилась с отказом.",
        href=f"/app/organizations/{organization.id}",
        payload={"verification_status": organization.verification_status},
    )
    return await serialize_organization(organization)


def serialize_dictionary_item(item: DictionaryItem) -> DictionaryItemResponse:
    return DictionaryItemResponse(
        id=item.id,
        code=item.code,
        label=item.label,
        description=item.description,
        status=item.status,
        sort_order=item.sort_order,
        is_system=item.is_system,
        parent_code=item.parent_code,
    )


async def serialize_dictionary(dictionary: Dictionary, include_items: bool = False):
    items_count = await DictionaryItem.filter(dictionary=dictionary).count()
    base = dict(
        id=dictionary.id,
        code=dictionary.code,
        name=dictionary.name,
        description=dictionary.description,
        status=dictionary.status,
        is_system=dictionary.is_system,
        is_locked=dictionary.is_locked,
        items_count=items_count,
        updated_at=iso(dictionary.updated_at),
    )
    if not include_items:
        return DictionarySummaryResponse(**base)
    items = await DictionaryItem.filter(dictionary=dictionary).order_by("sort_order", "label")
    return DictionaryDetailResponse(**base, items=[serialize_dictionary_item(item) for item in items])


@router.get("/dictionaries", response_model=list[DictionarySummaryResponse])
async def admin_dictionaries(_: User = Depends(require_admin)) -> list[DictionarySummaryResponse]:
    dictionaries = await Dictionary.all().order_by("code")
    return [await serialize_dictionary(dictionary) for dictionary in dictionaries]


@router.get("/dictionaries/{dictionary_code}", response_model=DictionaryDetailResponse)
async def admin_dictionary_detail(
    dictionary_code: str,
    _: User = Depends(require_admin),
) -> DictionaryDetailResponse:
    dictionary = await Dictionary.get_or_none(code=dictionary_code)
    if dictionary is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dictionary not found")
    return await serialize_dictionary(dictionary, include_items=True)


@router.post("/dictionaries/{dictionary_code}/items", response_model=DictionaryItemResponse)
async def admin_create_dictionary_item(
    dictionary_code: str,
    payload: DictionaryItemPayload,
    admin: User = Depends(require_admin),
) -> DictionaryItemResponse:
    dictionary = await Dictionary.get_or_none(code=dictionary_code)
    if dictionary is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dictionary not found")
    item = await DictionaryItem.create(dictionary=dictionary, is_system=False, **payload.model_dump())
    await write_audit(admin, "dictionary_item.create", "dictionary_item", item.id, item.label)
    return serialize_dictionary_item(item)


@router.patch("/dictionaries/{dictionary_code}/items/{item_id}", response_model=DictionaryItemResponse)
async def admin_update_dictionary_item(
    dictionary_code: str,
    item_id: int,
    payload: DictionaryItemPayload,
    admin: User = Depends(require_admin),
) -> DictionaryItemResponse:
    dictionary = await Dictionary.get_or_none(code=dictionary_code)
    item = await DictionaryItem.get_or_none(id=item_id, dictionary=dictionary)
    if dictionary is None or item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dictionary item not found")
    before = {"code": item.code, "label": item.label, "status": item.status}
    for key, value in payload.model_dump().items():
        setattr(item, key, value)
    await item.save()
    await write_audit(
        admin,
        "dictionary_item.update",
        "dictionary_item",
        item.id,
        item.label,
        before=before,
        after={"code": item.code, "label": item.label, "status": item.status},
    )
    return serialize_dictionary_item(item)


@router.get("/taxonomy", response_model=list[TaxonomyNodeResponse])
async def admin_taxonomy(_: User = Depends(require_admin)) -> list[TaxonomyNodeResponse]:
    nodes = await TaxonomyNode.all().order_by("level", "sort_order", "name")
    response = []
    for node in nodes:
        response.append(
            TaxonomyNodeResponse(
                id=node.id,
                external_id=node.external_id,
                parent_id=node.parent_id,
                parent_external_id=None,
                level=node.level,
                name=node.name,
                slug=node.slug,
                description=node.description,
                notes=node.notes,
                is_selectable=node.is_selectable,
                is_active=node.is_active,
                sort_order=node.sort_order,
                solutions_count=await SolutionTaxonomyLink.filter(taxonomy_node=node).count(),
            )
        )
    by_id = {node.id: node.external_id for node in nodes}
    for item in response:
        item.parent_external_id = by_id.get(item.parent_id or 0)
    return response


@router.get("/taxonomy/{node_id}", response_model=TaxonomyNodeResponse)
async def admin_taxonomy_node(node_id: int, _: User = Depends(require_admin)) -> TaxonomyNodeResponse:
    node = await TaxonomyNode.get_or_none(id=node_id)
    if node is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Taxonomy node not found")
    parent_external_id = None
    if node.parent_id:
        parent = await TaxonomyNode.get_or_none(id=node.parent_id)
        parent_external_id = parent.external_id if parent else None
    return TaxonomyNodeResponse(
        id=node.id,
        external_id=node.external_id,
        parent_id=node.parent_id,
        parent_external_id=parent_external_id,
        level=node.level,
        name=node.name,
        slug=node.slug,
        description=node.description,
        notes=node.notes,
        is_selectable=node.is_selectable,
        is_active=node.is_active,
        sort_order=node.sort_order,
        solutions_count=await SolutionTaxonomyLink.filter(taxonomy_node=node).count(),
    )


@router.patch("/taxonomy/{node_id}", response_model=TaxonomyNodeResponse)
async def admin_update_taxonomy_node(
    node_id: int,
    payload: TaxonomyNodePayload,
    admin: User = Depends(require_admin),
) -> TaxonomyNodeResponse:
    node = await TaxonomyNode.get_or_none(id=node_id)
    if node is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Taxonomy node not found")
    before = {
        "name": node.name,
        "description": node.description,
        "notes": node.notes,
        "is_selectable": node.is_selectable,
        "is_active": node.is_active,
        "sort_order": node.sort_order,
    }
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(node, key, value)
    await node.save()
    await write_audit(
        admin,
        "taxonomy_node.update",
        "taxonomy_node",
        node.id,
        node.name,
        before=before,
        after={
            "name": node.name,
            "description": node.description,
            "notes": node.notes,
            "is_selectable": node.is_selectable,
            "is_active": node.is_active,
            "sort_order": node.sort_order,
        },
        risk_level="medium",
    )
    return await admin_taxonomy_node(node.id, admin)


async def serialize_solution(solution: Solution) -> SolutionResponse:
    supplier_name = None
    if solution.supplier_id:
        supplier = await Organization.get_or_none(id=solution.supplier_id)
        supplier_name = supplier.name if supplier else None
    links = await SolutionTaxonomyLink.filter(solution=solution).prefetch_related("taxonomy_node")
    return SolutionResponse(
        id=solution.id,
        supplier_id=solution.supplier_id,
        supplier_name=supplier_name,
        name=solution.name,
        short_description=solution.short_description,
        status=solution.status,
        taxonomy_l4_ids=[link.taxonomy_node.external_id for link in links],
        subsector_ids=solution.subsector_ids or [],
        process_ids=solution.process_ids or [],
        problem_ids=solution.problem_ids or [],
        payment_model=solution.payment_model,
        evidence_level=solution.evidence_level,
        updated_at=iso(solution.updated_at),
    )


@router.get("/solutions", response_model=list[SolutionResponse])
async def admin_solutions(_: User = Depends(require_admin)) -> list[SolutionResponse]:
    solutions = await Solution.all().order_by("-updated_at")
    return [await serialize_solution(solution) for solution in solutions]


@router.get("/solutions/{solution_id}", response_model=SolutionResponse)
async def admin_solution(solution_id: int, _: User = Depends(require_admin)) -> SolutionResponse:
    solution = await Solution.get_or_none(id=solution_id)
    if solution is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found")
    return await serialize_solution(solution)


@router.get("/farmer-requests", response_model=list[FarmerRequestResponse])
async def admin_farmer_requests(_: User = Depends(require_admin)) -> list[FarmerRequestResponse]:
    requests = await FarmerRequest.all().order_by("-updated_at")
    result = []
    for item in requests:
        user = await User.get_or_none(id=item.user_id) if item.user_id else None
        farm = await Organization.get_or_none(id=item.farm_id) if item.farm_id else None
        result.append(
            FarmerRequestResponse(
                id=item.id,
                title=item.title,
                farmer_email=user.email if user else None,
                farm_name=farm.name if farm else None,
                region_id=item.region_id,
                problem_ids=item.problem_ids or [],
                urgency=item.urgency,
                budget_rub=str(item.budget_rub) if item.budget_rub is not None else None,
                status=item.status,
                updated_at=iso(item.updated_at),
            )
        )
    return result


@router.get("/farmer-requests/{request_id}", response_model=FarmerRequestResponse)
async def admin_farmer_request(request_id: int, _: User = Depends(require_admin)) -> FarmerRequestResponse:
    items = await admin_farmer_requests()
    for item in items:
        if item.id == request_id:
            return item
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer request not found")


@router.get("/matching", response_model=list[MatchingRunResponse])
async def admin_matching(_: User = Depends(require_admin)) -> list[MatchingRunResponse]:
    runs = await MatchingRun.all().order_by("-updated_at").prefetch_related("farmer_request")
    result = []
    for run in runs:
        results = await MatchingResult.filter(matching_run=run)
        best = max((item.total_score for item in results), default=None)
        result.append(
            MatchingRunResponse(
                id=run.id,
                farmer_request_id=run.farmer_request_id,
                farmer_request_title=run.farmer_request.title,
                status=run.status,
                triggered_by=run.triggered_by,
                results_count=len(results),
                best_score=best,
                updated_at=iso(run.updated_at),
            )
        )
    return result


@router.get("/matching/{request_id}", response_model=list[MatchingRunResponse])
async def admin_matching_for_request(request_id: int, _: User = Depends(require_admin)) -> list[MatchingRunResponse]:
    runs = await MatchingRun.filter(farmer_request_id=request_id).order_by("-updated_at")
    result = []
    for run in runs:
        request = await FarmerRequest.get(id=run.farmer_request_id)
        results = await MatchingResult.filter(matching_run=run)
        result.append(
            MatchingRunResponse(
                id=run.id,
                farmer_request_id=run.farmer_request_id,
                farmer_request_title=request.title,
                status=run.status,
                triggered_by=run.triggered_by,
                results_count=len(results),
                best_score=max((item.total_score for item in results), default=None),
                updated_at=iso(run.updated_at),
            )
        )
    return result


def serialize_moderation(item: ModerationItem, comments_count: int = 0) -> ModerationItemResponse:
    return ModerationItemResponse(
        id=item.id,
        object_type=item.object_type,
        object_id=item.object_id,
        title=item.title,
        status=item.status,
        priority=item.priority,
        assigned_admin_id=item.assigned_admin_id,
        company_id=item.company_id,
        solution_id=item.solution_id,
        comments_count=comments_count,
        updated_at=iso(item.updated_at),
    )


@router.get("/moderation", response_model=list[ModerationItemResponse])
async def admin_moderation(_: User = Depends(require_admin)) -> list[ModerationItemResponse]:
    items = await ModerationItem.all().order_by("-updated_at")
    result = []
    for item in items:
        result.append(serialize_moderation(item, await ModerationComment.filter(item=item).count()))
    return result


@router.get("/moderation/{item_id}", response_model=ModerationItemResponse)
async def admin_moderation_item(item_id: int, _: User = Depends(require_admin)) -> ModerationItemResponse:
    item = await ModerationItem.get_or_none(id=item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Moderation item not found")
    return serialize_moderation(item, await ModerationComment.filter(item=item).count())


@router.patch("/moderation/{item_id}", response_model=ModerationItemResponse)
async def admin_update_moderation_item(
    item_id: int,
    payload: ModerationStatusPayload,
    admin: User = Depends(require_admin),
) -> ModerationItemResponse:
    item = await ModerationItem.get_or_none(id=item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Moderation item not found")
    before = {"status": item.status}
    item.status = payload.status
    item.assigned_admin = admin
    await item.save()
    if payload.comment:
        await ModerationComment.create(item=item, author=admin, body=payload.comment)
    if item.object_type == "organization" and item.company_id:
        organization = await Organization.get_or_none(id=item.company_id)
        if organization:
            before_org = {"verification_status": organization.verification_status}
            organization.verification_status = "verified" if payload.status in {"approved", "published", "completed"} else "rejected" if "reject" in payload.status else organization.verification_status
            await organization.save(update_fields=["verification_status", "updated_at"])
            await notify_organization_members(
                organization,
                kind="moderation",
                title="Результат модерации организации",
                body=f"Статус проверки изменён на «{organization.verification_status}».",
                href=f"/app/organizations/{organization.id}",
                payload={"before": before_org, "after": {"verification_status": organization.verification_status}},
            )
    if item.object_type == "solution" and item.solution_id:
        solution = await Solution.get_or_none(id=item.solution_id)
        if solution:
            before_solution = {"status": solution.status}
            solution.status = "published" if payload.status in {"approved", "published", "completed"} else "rejected" if "reject" in payload.status else solution.status
            if solution.status == "published":
                solution.published_at = solution.published_at or datetime.now(UTC)
            await solution.save(update_fields=["status", "published_at", "updated_at"])
            if solution.supplier_id:
                organization = await Organization.get_or_none(id=solution.supplier_id)
                if organization:
                    await notify_organization_members(
                        organization,
                        kind="moderation",
                        title="Результат модерации решения",
                        body=f"Решение «{solution.name}» получило статус «{solution.status}».",
                        href=f"/app/organizations/{organization.id}/solutions/{solution.id}",
                        payload={"before": before_solution, "after": {"status": solution.status}},
                    )
    await write_audit(
        admin,
        "moderation.status_change",
        item.object_type,
        item.object_id,
        item.title,
        before=before,
        after={"status": item.status},
        risk_level="high",
    )
    return serialize_moderation(item, await ModerationComment.filter(item=item).count())


@router.get("/import-export", response_model=list[ImportJobResponse])
async def admin_import_export(_: User = Depends(require_admin)) -> list[ImportJobResponse]:
    jobs = await ImportJob.all().order_by("-updated_at")
    return [
        ImportJobResponse(
            id=job.id,
            import_type=job.import_type,
            file_name=job.file_name,
            status=job.status,
            total_rows=job.total_rows,
            successful_rows=job.successful_rows,
            error_rows=job.error_rows,
            warning_rows=job.warning_rows,
            updated_at=iso(job.updated_at),
        )
        for job in jobs
    ]


@router.get("/audit-log", response_model=list[AuditLogResponse])
async def admin_audit_log(_: User = Depends(require_admin)) -> list[AuditLogResponse]:
    entries = await AuditLogEntry.all().order_by("-created_at").limit(200)
    result = []
    for entry in entries:
        admin = await User.get_or_none(id=entry.admin_user_id) if entry.admin_user_id else None
        result.append(
            AuditLogResponse(
                id=entry.id,
                admin_user_id=entry.admin_user_id,
                admin_email=admin.email if admin else None,
                action=entry.action,
                object_type=entry.object_type,
                object_id=entry.object_id,
                object_title=entry.object_title,
                risk_level=entry.risk_level,
                created_at=iso(entry.created_at),
            )
        )
    return result


@router.get("/analytics", response_model=AnalyticsResponse)
async def admin_analytics(admin: User = Depends(require_admin)) -> AnalyticsResponse:
    metrics = await admin_dashboard(admin)
    taxonomy_l4 = await TaxonomyNode.filter(level=4).limit(20)
    coverage = []
    white_spots = []
    for node in taxonomy_l4:
        solutions_count = await SolutionTaxonomyLink.filter(taxonomy_node=node).count()
        row = {
            "l4_id": node.external_id,
            "l4_name": node.name,
            "solutions_count": solutions_count,
            "published_solutions_count": 0,
            "coverage_status": "empty" if solutions_count == 0 else "weak",
        }
        coverage.append(row)
        if solutions_count == 0:
            white_spots.append(row)
    return AnalyticsResponse(metrics=metrics, coverage=coverage, white_spots=white_spots[:10])
