from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "admin_user_roles" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "role" VARCHAR(40) NOT NULL DEFAULT 'admin',
            "is_active" BOOL NOT NULL DEFAULT True,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "user_id" INT NOT NULL UNIQUE REFERENCES "users" ("id") ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS "dictionaries" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "code" VARCHAR(120) NOT NULL UNIQUE,
            "name" VARCHAR(255) NOT NULL,
            "description" TEXT,
            "status" VARCHAR(32) NOT NULL DEFAULT 'active',
            "is_system" BOOL NOT NULL DEFAULT True,
            "is_locked" BOOL NOT NULL DEFAULT False,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS "dictionary_items" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "code" VARCHAR(160) NOT NULL,
            "label" VARCHAR(255) NOT NULL,
            "description" TEXT,
            "status" VARCHAR(32) NOT NULL DEFAULT 'active',
            "sort_order" INT NOT NULL DEFAULT 0,
            "is_system" BOOL NOT NULL DEFAULT True,
            "parent_code" VARCHAR(160),
            "synonyms" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "dictionary_id" INT NOT NULL REFERENCES "dictionaries" ("id") ON DELETE CASCADE,
            CONSTRAINT "uid_dictionary_items_dictionary_code" UNIQUE ("dictionary_id", "code")
        );

        CREATE TABLE IF NOT EXISTS "dictionary_proposals" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "proposed_code" VARCHAR(160),
            "proposed_label" VARCHAR(255) NOT NULL,
            "source_field" VARCHAR(160),
            "source_entity_type" VARCHAR(80),
            "source_entity_id" VARCHAR(80),
            "status" VARCHAR(32) NOT NULL DEFAULT 'proposed',
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "created_by_id" INT REFERENCES "users" ("id") ON DELETE CASCADE,
            "dictionary_id" INT NOT NULL REFERENCES "dictionaries" ("id") ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS "field_definitions" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "field_key" VARCHAR(160) NOT NULL UNIQUE,
            "field_name" VARCHAR(255) NOT NULL,
            "block" VARCHAR(160),
            "control_type" VARCHAR(40) NOT NULL,
            "dictionary_code" VARCHAR(120),
            "allow_other_text" BOOL NOT NULL DEFAULT False,
            "required" BOOL NOT NULL DEFAULT False,
            "used_for_filtering" BOOL NOT NULL DEFAULT True,
            "used_for_scoring" BOOL NOT NULL DEFAULT False,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS "taxonomy_nodes" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "external_id" VARCHAR(80) NOT NULL UNIQUE,
            "level" INT NOT NULL,
            "name" VARCHAR(255) NOT NULL,
            "slug" VARCHAR(255) NOT NULL,
            "description" TEXT,
            "notes" TEXT,
            "is_selectable" BOOL NOT NULL DEFAULT False,
            "is_active" BOOL NOT NULL DEFAULT True,
            "sort_order" INT NOT NULL DEFAULT 0,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "parent_id" INT REFERENCES "taxonomy_nodes" ("id") ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS "solutions" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "name" VARCHAR(255) NOT NULL,
            "short_description" TEXT,
            "full_description" TEXT,
            "status" VARCHAR(32) NOT NULL DEFAULT 'draft',
            "partner_type" VARCHAR(80),
            "payment_model" VARCHAR(80),
            "implementation_type" VARCHAR(80),
            "deployment_type" VARCHAR(80),
            "evidence_level" INT,
            "price_from" DECIMAL(14,2),
            "subsector_ids" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "process_ids" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "problem_ids" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "integration_ids" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "region_ids" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "published_at" TIMESTAMPTZ,
            "created_by_id" INT REFERENCES "users" ("id") ON DELETE SET NULL,
            "supplier_id" INT REFERENCES "organizations" ("id") ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS "solution_taxonomy_links" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "is_primary" BOOL NOT NULL DEFAULT False,
            "solution_id" INT NOT NULL REFERENCES "solutions" ("id") ON DELETE CASCADE,
            "taxonomy_node_id" INT NOT NULL REFERENCES "taxonomy_nodes" ("id") ON DELETE CASCADE,
            CONSTRAINT "uid_solution_taxonomy_links_solution_node" UNIQUE ("solution_id", "taxonomy_node_id")
        );

        CREATE TABLE IF NOT EXISTS "farmer_requests" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "title" VARCHAR(255) NOT NULL,
            "region_id" VARCHAR(80),
            "subsector_ids" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "process_ids" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "problem_ids" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "urgency" VARCHAR(32) NOT NULL DEFAULT 'medium',
            "budget_rub" DECIMAL(14,2),
            "current_integration_ids" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "digital_maturity_id" VARCHAR(80),
            "desired_effect_ids" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "free_description" TEXT,
            "status" VARCHAR(40) NOT NULL DEFAULT 'new',
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "assigned_admin_id" INT REFERENCES "users" ("id") ON DELETE SET NULL,
            "farm_id" INT REFERENCES "organizations" ("id") ON DELETE SET NULL,
            "user_id" INT REFERENCES "users" ("id") ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS "matching_runs" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "status" VARCHAR(32) NOT NULL DEFAULT 'completed',
            "triggered_by" VARCHAR(32) NOT NULL DEFAULT 'system',
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "created_by_id" INT REFERENCES "users" ("id") ON DELETE SET NULL,
            "farmer_request_id" INT NOT NULL REFERENCES "farmer_requests" ("id") ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS "matching_results" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "total_score" INT NOT NULL DEFAULT 0,
            "score_details" JSONB NOT NULL DEFAULT '{}'::jsonb,
            "explanation" TEXT,
            "warnings" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "is_pinned_by_admin" BOOL NOT NULL DEFAULT False,
            "is_excluded_by_admin" BOOL NOT NULL DEFAULT False,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "matching_run_id" INT NOT NULL REFERENCES "matching_runs" ("id") ON DELETE CASCADE,
            "solution_id" INT NOT NULL REFERENCES "solutions" ("id") ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS "moderation_items" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "object_type" VARCHAR(80) NOT NULL,
            "object_id" VARCHAR(80) NOT NULL,
            "title" VARCHAR(255) NOT NULL,
            "status" VARCHAR(40) NOT NULL DEFAULT 'submitted',
            "priority" VARCHAR(32) NOT NULL DEFAULT 'normal',
            "company_id" INT,
            "solution_id" INT,
            "before_snapshot" JSONB,
            "after_snapshot" JSONB,
            "checklist" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "assigned_admin_id" INT REFERENCES "users" ("id") ON DELETE SET NULL,
            "created_by_id" INT REFERENCES "users" ("id") ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS "moderation_comments" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "body" TEXT NOT NULL,
            "visibility" VARCHAR(32) NOT NULL DEFAULT 'internal',
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "author_id" INT REFERENCES "users" ("id") ON DELETE CASCADE,
            "item_id" INT NOT NULL REFERENCES "moderation_items" ("id") ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS "import_jobs" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "import_type" VARCHAR(80) NOT NULL,
            "file_name" VARCHAR(255) NOT NULL,
            "file_url" TEXT,
            "status" VARCHAR(40) NOT NULL DEFAULT 'uploaded',
            "total_rows" INT NOT NULL DEFAULT 0,
            "successful_rows" INT NOT NULL DEFAULT 0,
            "error_rows" INT NOT NULL DEFAULT 0,
            "warning_rows" INT NOT NULL DEFAULT 0,
            "mapping_config" JSONB NOT NULL DEFAULT '{}'::jsonb,
            "errors" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "created_by_id" INT REFERENCES "users" ("id") ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS "analytics_events" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "event_name" VARCHAR(120) NOT NULL,
            "user_id" INT,
            "company_id" INT,
            "solution_id" INT,
            "farmer_request_id" INT,
            "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS "audit_log_entries" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "action" VARCHAR(160) NOT NULL,
            "object_type" VARCHAR(80) NOT NULL,
            "object_id" VARCHAR(80) NOT NULL,
            "object_title" VARCHAR(255),
            "before_snapshot" JSONB,
            "after_snapshot" JSONB,
            "ip" VARCHAR(80),
            "user_agent" TEXT,
            "risk_level" VARCHAR(32) NOT NULL DEFAULT 'medium',
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "admin_user_id" INT REFERENCES "users" ("id") ON DELETE CASCADE
        );
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "audit_log_entries";
        DROP TABLE IF EXISTS "analytics_events";
        DROP TABLE IF EXISTS "import_jobs";
        DROP TABLE IF EXISTS "moderation_comments";
        DROP TABLE IF EXISTS "moderation_items";
        DROP TABLE IF EXISTS "matching_results";
        DROP TABLE IF EXISTS "matching_runs";
        DROP TABLE IF EXISTS "farmer_requests";
        DROP TABLE IF EXISTS "solution_taxonomy_links";
        DROP TABLE IF EXISTS "solutions";
        DROP TABLE IF EXISTS "taxonomy_nodes";
        DROP TABLE IF EXISTS "field_definitions";
        DROP TABLE IF EXISTS "dictionary_proposals";
        DROP TABLE IF EXISTS "dictionary_items";
        DROP TABLE IF EXISTS "dictionaries";
        DROP TABLE IF EXISTS "admin_user_roles";
    """
