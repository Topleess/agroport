from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "organizations" ADD COLUMN IF NOT EXISTS "category" VARCHAR(32) NOT NULL DEFAULT 'farm';
        CREATE TABLE IF NOT EXISTS "organization_products" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "category" VARCHAR(32) NOT NULL,
            "name" VARCHAR(255) NOT NULL,
            "description" TEXT,
            "unit" VARCHAR(40),
            "price" DECIMAL(12,2),
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "organization_id" INT NOT NULL REFERENCES "organizations" ("id") ON DELETE CASCADE
        );
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "organization_products";
        ALTER TABLE "organizations" DROP COLUMN IF EXISTS "category";
    """
