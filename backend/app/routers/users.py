from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.models.user import User, UserProfile
from app.schemas.users import UserProfileResponse, UserProfileUpdate

router = APIRouter(prefix="/users", tags=["users"])


async def serialize_profile(user: User) -> UserProfileResponse:
    profile = await UserProfile.get(user=user)
    return UserProfileResponse(
        id=profile.id,
        first_name=profile.first_name,
        last_name=profile.last_name,
        middle_name=profile.middle_name,
        phone=user.phone,
        region=profile.region,
        role=profile.role,
    )


@router.get("/me/profile", response_model=UserProfileResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)) -> UserProfileResponse:
    return await serialize_profile(current_user)


@router.patch("/me/profile", response_model=UserProfileResponse)
async def update_my_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
) -> UserProfileResponse:
    profile = await UserProfile.get(user=current_user)
    data = payload.model_dump(exclude_unset=True)
    phone = data.pop("phone", None)
    if phone is not None:
        current_user.phone = phone
        await current_user.save(update_fields=["phone", "updated_at"])
    for key, value in data.items():
        setattr(profile, key, value)
    await profile.save()
    return await serialize_profile(current_user)
