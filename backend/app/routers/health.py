from fastapi import APIRouter
from tortoise.transactions import in_transaction

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/db")
async def db_health() -> dict[str, str]:
    async with in_transaction() as connection:
        await connection.execute_query("SELECT 1")
    return {"status": "ok"}
