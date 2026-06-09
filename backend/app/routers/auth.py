from fastapi import APIRouter, HTTPException, status

from app.models.user import User, UserProfile
from app.schemas.auth import LoginRequest, MeResponse, RegisterRequest, TokenResponse
from app.services.normalization import normalize_phone
from app.services.security import create_access_token, hash_password, verify_password
from app.auth.dependencies import get_current_user
from fastapi import Depends

router = APIRouter(prefix="/auth", tags=["auth"])


def user_to_me(user: User) -> MeResponse:
    return MeResponse(
        id=user.id,
        email=user.email,
        phone=user.phone,
        is_active=user.is_active,
        is_admin=user.is_admin,
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest) -> TokenResponse:
    existing = await User.get_or_none(email=payload.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    if payload.phone:
        existing_phone = await User.get_or_none(phone=payload.phone)
        if existing_phone:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone already registered")
    user = await User.create(
        email=payload.email,
        phone=payload.phone,
        password_hash=hash_password(payload.password),
    )
    await UserProfile.create(
        user=user,
        first_name=payload.first_name,
        last_name=payload.last_name,
        middle_name=payload.middle_name,
        region=payload.region,
    )
    return TokenResponse(access_token=create_access_token(str(user.id)))


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest) -> TokenResponse:
    if "@" in payload.identifier:
        user = await User.get_or_none(email=payload.identifier)
    else:
        user = await User.get_or_none(phone=normalize_phone(payload.identifier))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return TokenResponse(access_token=create_access_token(str(user.id)))


@router.post("/logout")
async def logout() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/me", response_model=MeResponse)
async def me(current_user: User = Depends(get_current_user)) -> MeResponse:
    return user_to_me(current_user)
