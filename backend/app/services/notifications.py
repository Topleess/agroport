from app.models.admin import Notification
from app.models.organization import Organization
from app.models.user import User


async def create_notification(
    *,
    user: User,
    title: str,
    body: str,
    kind: str = "system",
    href: str | None = None,
    organization: Organization | None = None,
    payload: dict | None = None,
) -> Notification:
    return await Notification.create(
        user=user,
        organization=organization,
        title=title,
        body=body,
        kind=kind,
        href=href,
        payload=payload or {},
    )
