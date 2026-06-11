from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import get_settings
from app.models.organization import Organization, OrganizationMember
from app.models.user import User
from app.services.security import decode_access_token

bearer_scheme = HTTPBearer(auto_error=False)
settings = get_settings()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> User:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    user_id = decode_access_token(credentials.credentials)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = await User.get_or_none(id=int(user_id))
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user")
    return user


async def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> User | None:
    if credentials is None:
        return None
    user_id = decode_access_token(credentials.credentials)
    if user_id is None:
        return None
    user = await User.get_or_none(id=int(user_id))
    if user is None or not user.is_active:
        return None
    return user


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.is_admin or current_user.email == settings.admin_email:
        return current_user
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")


async def get_organization_or_404(organization_id: int) -> Organization:
    organization = await Organization.get_or_none(id=organization_id)
    if organization is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    return organization


async def require_organization_member(
    organization_id: int,
    current_user: User = Depends(get_current_user),
) -> tuple[Organization, OrganizationMember]:
    organization = await get_organization_or_404(organization_id)
    member = await OrganizationMember.get_or_none(user=current_user, organization=organization)
    if member is None and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Organization access denied")
    if member is None:
        member = OrganizationMember(user=current_user, organization=organization, role="admin")
    return organization, member


async def require_organization_owner_or_admin(
    organization_id: int,
    current_user: User = Depends(get_current_user),
) -> tuple[Organization, OrganizationMember]:
    organization, member = await require_organization_member(organization_id, current_user)
    if current_user.is_admin or member.role in ("owner", "admin"):
        return organization, member
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Owner or admin role required")
