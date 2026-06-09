from app.config import get_settings

settings = get_settings()

TORTOISE_ORM = {
    "connections": {"default": settings.database_url},
    "apps": {
        "models": {
            "models": ["app.models.user", "app.models.organization", "aerich.models"],
            "default_connection": "default",
        }
    },
}
