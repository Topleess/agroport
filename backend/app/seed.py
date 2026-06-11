import asyncio
from datetime import UTC, datetime
import json
from decimal import Decimal
from pathlib import Path

from tortoise import Tortoise

from app.db import TORTOISE_ORM
from app.models.admin import (
    AdminUserRole,
    AuditLogEntry,
    Dictionary,
    DictionaryItem,
    FarmerRequest,
    FieldDefinition,
    MatchingResult,
    MatchingRun,
    ModerationItem,
    Notification,
    Solution,
    SolutionTaxonomyLink,
    TaxonomyNode,
)
from app.models.organization import Organization, OrganizationMember, OrganizationProduct, OrganizationProfile
from app.models.user import User, UserProfile
from app.services.security import hash_password


SEED_DATA_PATH = Path(__file__).parent / "seed_data" / "admin_reference.json"


async def upsert_user(
    email: str,
    password: str,
    first_name: str,
    last_name: str,
    is_admin: bool = False,
) -> User:
    user = await User.get_or_none(email=email)
    if user is None:
        user = await User.create(
            email=email,
            phone="+79990000000" if is_admin else "+79990000001",
            password_hash=hash_password(password),
            is_admin=is_admin,
        )
        await UserProfile.create(
            user=user,
            first_name=first_name,
            last_name=last_name,
            region="Московская область",
            role="Руководитель хозяйства" if not is_admin else "Администратор",
        )
    return user


async def run_seed() -> None:
    await Tortoise.init(config=TORTOISE_ORM)
    admin = await upsert_user("admin@agroport.local", "admin12345", "Админ", "Агропорт", True)
    await AdminUserRole.get_or_create(user=admin, defaults={"role": "super_admin"})
    farmer = await upsert_user("farmer@agroport.local", "farmer12345", "Иван", "Фермер")
    organization = await Organization.get_or_none(inn="500100000001")
    if organization is None:
        organization = await Organization.create(
            category="farm",
            type="KFH",
            name="КФХ Зеленое поле",
            inn="500100000001",
            ogrn="1234567890123",
            region="Московская область",
            address="Московская область, Дмитровский округ",
            verification_status="pending_verification",
            created_by=farmer,
        )
        await OrganizationMember.create(user=farmer, organization=organization, role="owner")
        await OrganizationProfile.create(
            organization=organization,
            production_types=["Растениеводство", "Овощи открытого грунта"],
            land_area_ha=Decimal("125.5"),
            livestock_count=0,
            main_crops=["Картофель", "Морковь", "Свекла"],
            machinery=["Трактор", "Картофелекопалка"],
            digital_maturity="Базовый учет в таблицах",
            support_needs=["Субсидии на технику", "Льготное кредитование"],
            service_needs=["Бухгалтерия", "Логистика"],
            marketplace_interests=["Продажа овощей", "Поиск покупателей"],
            comment="Демо-хозяйство для проверки MVP.",
            completion_percent=90,
        )
        await OrganizationProduct.create(
            organization=organization,
            category="vegetables",
            name="Картофель столовый",
            description="Демо-позиция продукции хозяйства.",
            unit="кг",
        )
    await seed_admin_reference(admin, farmer, organization)
    print("Seed complete")
    print("Admin: admin@agroport.local / admin12345")
    print("Demo user: farmer@agroport.local / farmer12345")
    await Tortoise.close_connections()


async def seed_admin_reference(admin: User, farmer: User, farm: Organization) -> None:
    if not SEED_DATA_PATH.exists():
        return

    payload = json.loads(SEED_DATA_PATH.read_text(encoding="utf-8"))

    for dictionary_data in payload.get("dictionaries", []):
        dictionary, _ = await Dictionary.get_or_create(
            code=dictionary_data["code"],
            defaults={
                "name": dictionary_data["name"],
                "description": dictionary_data.get("description"),
                "is_system": True,
                "is_locked": False,
            },
        )
        dictionary.name = dictionary_data["name"]
        dictionary.description = dictionary_data.get("description")
        await dictionary.save()
        for item_data in dictionary_data.get("items", []):
            item, _ = await DictionaryItem.get_or_create(
                dictionary=dictionary,
                code=item_data["code"],
                defaults={
                    "label": item_data["label"],
                    "description": item_data.get("description"),
                    "sort_order": item_data.get("sort_order", 0),
                    "is_system": True,
                },
            )
            item.label = item_data["label"]
            item.description = item_data.get("description")
            item.sort_order = item_data.get("sort_order", 0)
            await item.save()

    taxonomy_by_external_id: dict[str, TaxonomyNode] = {}
    for node_data in sorted(payload.get("taxonomy_nodes", []), key=lambda item: item["level"]):
        parent = taxonomy_by_external_id.get(node_data.get("parent_external_id"))
        node, _ = await TaxonomyNode.get_or_create(
            external_id=node_data["external_id"],
            defaults={
                "parent": parent,
                "level": node_data["level"],
                "name": node_data["name"],
                "slug": node_data["slug"],
                "notes": node_data.get("notes"),
                "is_selectable": node_data.get("is_selectable", False),
                "sort_order": node_data.get("sort_order", 0),
            },
        )
        node.parent = parent
        node.level = node_data["level"]
        node.name = node_data["name"]
        node.slug = node_data["slug"]
        node.notes = node_data.get("notes")
        node.is_selectable = node_data.get("is_selectable", False)
        node.sort_order = node_data.get("sort_order", 0)
        await node.save()
        taxonomy_by_external_id[node.external_id] = node

    for field_data in payload.get("field_definitions", []):
        field, _ = await FieldDefinition.get_or_create(
            field_key=field_data["field_key"],
            defaults={
                "field_name": field_data["field_name"],
                "control_type": field_data["control_type"],
            },
        )
        field.field_name = field_data["field_name"]
        field.control_type = field_data["control_type"]
        field.dictionary_code = field_data.get("dictionary_code")
        field.allow_other_text = field_data.get("allow_other_text", False)
        field.required = field_data.get("required", False)
        field.block = field_data.get("block")
        await field.save()

    supplier = await Organization.get_or_none(inn="7701000000")
    if supplier is None:
        supplier = await Organization.create(
            category="solution_provider",
            type="OOO",
            name="ООО АгроТех Решения",
            inn="7701000000",
            ogrn="1027700000000",
            kpp="770101001",
            region="Москва",
            address="г. Москва, ул. Технологическая, д. 1",
            verification_status="pending_verification",
            created_by=admin,
        )
        await OrganizationMember.create(user=admin, organization=supplier, role="owner")

    solution = await Solution.get_or_none(name="АгроПлан ERP")
    if solution is None:
        solution = await Solution.create(
            supplier=supplier,
            name="АгроПлан ERP",
            short_description="Демо-решение для управленческого учета хозяйства.",
            full_description="Помогает вести управленческий учет, план-факт и себестоимость по культурам и полям.",
            status="published",
            partner_type="vendor",
            payment_model="subscription",
            implementation_type="project",
            deployment_type="saas",
            evidence_level=2,
            subsector_ids=["crop_grain", "crop_vegetables"],
            process_ids=["planning", "procurement"],
            problem_ids=["manual_accounting", "poor_cost_visibility"],
            integration_ids=["1c", "erp"],
            region_ids=["rf_all"],
            extra_fields={
                "solution_name": "АгроПлан ERP",
                "vendor_name": "ООО АгроТех Решения",
                "free_description": "Демо-решение для управленческого учета хозяйства.",
                "case_description": "Подходит для хозяйств, которым нужен учет затрат по культурам.",
                "implementation_requirements": "Наличие базовых данных по полям, культурам и операциям.",
            },
            created_by=admin,
            published_at=datetime.now(UTC),
        )
    else:
        solution.status = "published"
        solution.published_at = solution.published_at or datetime.now(UTC)
        solution.extra_fields = solution.extra_fields or {
            "solution_name": solution.name,
            "vendor_name": supplier.name,
            "free_description": solution.short_description or "",
        }
        await solution.save(update_fields=["status", "published_at", "extra_fields", "updated_at"])
    l4 = await TaxonomyNode.get_or_none(external_id="L4_0004")
    if l4:
        await SolutionTaxonomyLink.get_or_create(
            solution=solution,
            taxonomy_node=l4,
            defaults={"is_primary": True},
        )

    farmer_request = await FarmerRequest.get_or_none(title="Нужен единый учет затрат по культурам")
    if farmer_request is None:
        farmer_request = await FarmerRequest.create(
            user=farmer,
            farm=farm,
            solution=solution,
            title="Нужен единый учет затрат по культурам",
            source="solution_lead",
            region_id="cfo",
            subsector_ids=["crop_vegetables"],
            process_ids=["planning"],
            problem_ids=["manual_accounting", "poor_cost_visibility"],
            urgency="high",
            budget_rub=Decimal("150000"),
            digital_maturity_id="basic",
            desired_effect_ids=["cost_reduction", "time_saving"],
            free_description="Хозяйству нужен понятный учет себестоимости и работ.",
            status="matched",
            assigned_admin=admin,
        )
    else:
        farmer_request.solution = solution
        farmer_request.source = farmer_request.source or "solution_lead"
        await farmer_request.save(update_fields=["solution_id", "source", "updated_at"])

    await Notification.get_or_create(
        user=farmer,
        organization=farm,
        title="Демо-уведомление по модерации",
        defaults={
            "kind": "moderation",
            "body": "Организация и заявки теперь будут отправлять события в личный кабинет.",
            "href": f"/app/organizations/{farm.id}",
            "payload": {"organization_id": farm.id},
        },
    )

    matching_run = await MatchingRun.get_or_none(farmer_request=farmer_request)
    if matching_run is None:
        matching_run = await MatchingRun.create(
            farmer_request=farmer_request,
            status="completed",
            triggered_by="system",
            created_by=admin,
        )
    await MatchingResult.get_or_create(
        matching_run=matching_run,
        solution=solution,
        defaults={
            "total_score": 82,
            "score_details": {
                "problem_match": 25,
                "subsector_match": 12,
                "process_match": 15,
                "scale_fit": 8,
                "budget_fit": 7,
                "integration_fit": 8,
                "digital_maturity_fit": 4,
                "region_fit": 3,
                "evidence_score": 0,
            },
            "explanation": "Решение закрывает ручной учет и подходит базовой цифровой зрелости.",
        },
    )

    await ModerationItem.get_or_create(
        object_type="solution",
        object_id=str(solution.id),
        defaults={
            "title": solution.name,
            "status": "submitted",
            "priority": "normal",
            "created_by": admin,
            "assigned_admin": admin,
            "company_id": supplier.id,
            "solution_id": solution.id,
            "after_snapshot": {"name": solution.name, "status": solution.status},
            "checklist": [
                {"label": "Название решения указано", "checked": True},
                {"label": "Выбран L4-тип", "checked": bool(l4)},
                {"label": "Указаны проблемы фермера", "checked": True},
            ],
        },
    )

    if await AuditLogEntry.all().count() == 0:
        await AuditLogEntry.create(
            admin_user=admin,
            action="seed.admin_reference",
            object_type="system",
            object_id="admin_reference",
            object_title="Admin reference seed",
            after_snapshot={
                "dictionaries": len(payload.get("dictionaries", [])),
                "taxonomy_nodes": len(payload.get("taxonomy_nodes", [])),
            },
            risk_level="low",
        )


if __name__ == "__main__":
    asyncio.run(run_seed())
