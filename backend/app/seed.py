import asyncio
from decimal import Decimal

from tortoise import Tortoise

from app.db import TORTOISE_ORM
from app.models.organization import Organization, OrganizationMember, OrganizationProduct, OrganizationProfile
from app.models.user import User, UserProfile
from app.services.security import hash_password


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
    await upsert_user("admin@agroport.local", "admin12345", "Админ", "Агропорт", True)
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
    print("Seed complete")
    print("Admin: admin@agroport.local / admin12345")
    print("Demo user: farmer@agroport.local / farmer12345")
    await Tortoise.close_connections()


if __name__ == "__main__":
    asyncio.run(run_seed())
