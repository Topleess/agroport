from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE IF EXISTS "solutions"
            ADD COLUMN IF NOT EXISTS "extra_fields" JSONB NOT NULL DEFAULT '{}'::jsonb;

        ALTER TABLE IF EXISTS "farmer_requests"
            ADD COLUMN IF NOT EXISTS "solution_id" INT REFERENCES "solutions" ("id") ON DELETE SET NULL,
            ADD COLUMN IF NOT EXISTS "contact_name" VARCHAR(255),
            ADD COLUMN IF NOT EXISTS "contact_email" VARCHAR(255),
            ADD COLUMN IF NOT EXISTS "contact_phone" VARCHAR(32),
            ADD COLUMN IF NOT EXISTS "organization_name" VARCHAR(255),
            ADD COLUMN IF NOT EXISTS "message" TEXT,
            ADD COLUMN IF NOT EXISTS "source" VARCHAR(40) NOT NULL DEFAULT 'platform',
            ADD COLUMN IF NOT EXISTS "extra_fields" JSONB NOT NULL DEFAULT '{}'::jsonb;

        CREATE TABLE IF NOT EXISTS "notifications" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "kind" VARCHAR(40) NOT NULL DEFAULT 'system',
            "title" VARCHAR(255) NOT NULL,
            "body" TEXT NOT NULL,
            "href" VARCHAR(255),
            "is_read" BOOL NOT NULL DEFAULT False,
            "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
            "organization_id" INT REFERENCES "organizations" ("id") ON DELETE SET NULL
        );
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "notifications";
        ALTER TABLE IF EXISTS "farmer_requests"
            DROP COLUMN IF EXISTS "extra_fields",
            DROP COLUMN IF EXISTS "source",
            DROP COLUMN IF EXISTS "message",
            DROP COLUMN IF EXISTS "organization_name",
            DROP COLUMN IF EXISTS "contact_phone",
            DROP COLUMN IF EXISTS "contact_email",
            DROP COLUMN IF EXISTS "contact_name",
            DROP COLUMN IF EXISTS "solution_id";
        ALTER TABLE IF EXISTS "solutions"
            DROP COLUMN IF EXISTS "extra_fields";
    """
