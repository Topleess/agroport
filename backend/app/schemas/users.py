from pydantic import BaseModel, Field


class UserProfileResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    middle_name: str | None
    phone: str | None
    region: str | None
    role: str | None


class UserProfileUpdate(BaseModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=120)
    last_name: str | None = Field(default=None, min_length=1, max_length=120)
    middle_name: str | None = None
    phone: str | None = None
    region: str | None = None
    role: str | None = None
