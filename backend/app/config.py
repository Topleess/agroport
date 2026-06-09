from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Agroport API"
    api_prefix: str = "/api/v1"
    database_url: str = "postgres://agroport:agroport@localhost:5432/agroport"
    jwt_secret: str = "change-this-secret-for-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    admin_email: str = "admin@agroport.local"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
