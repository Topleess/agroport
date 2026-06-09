from pydantic import BaseModel, Field, field_validator

from app.services.normalization import normalize_email, normalize_phone


class RegisterRequest(BaseModel):
    email: str
    password: str = Field(min_length=8)
    phone: str | None = None
    first_name: str = Field(min_length=1, max_length=120)
    last_name: str = Field(min_length=1, max_length=120)
    middle_name: str | None = None
    region: str | None = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if "@" not in value or "." not in value.split("@", 1)[1]:
            raise ValueError("Invalid email")
        return normalize_email(value)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        return normalize_phone(value)


class LoginRequest(BaseModel):
    identifier: str = Field(min_length=3)
    password: str = Field(min_length=8)

    @field_validator("identifier")
    @classmethod
    def validate_identifier(cls, value: str) -> str:
        value = value.strip()
        if "@" in value:
            if "." not in value.split("@", 1)[1]:
                raise ValueError("Invalid email")
            return normalize_email(value)
        phone = normalize_phone(value)
        if phone is None:
            raise ValueError("Invalid phone")
        return phone


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MeResponse(BaseModel):
    id: int
    email: str
    phone: str | None
    is_active: bool
    is_admin: bool
