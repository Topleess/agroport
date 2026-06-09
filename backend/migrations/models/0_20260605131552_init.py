from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "phone" VARCHAR(32),
    "password_hash" VARCHAR(255) NOT NULL,
    "is_active" BOOL NOT NULL DEFAULT True,
    "is_admin" BOOL NOT NULL DEFAULT False,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "user_profiles" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "first_name" VARCHAR(120) NOT NULL,
    "last_name" VARCHAR(120) NOT NULL,
    "middle_name" VARCHAR(120),
    "region" VARCHAR(160),
    "role" VARCHAR(120),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INT NOT NULL UNIQUE REFERENCES "users" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "organizations" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "type" VARCHAR(16) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "inn" VARCHAR(12) NOT NULL,
    "ogrn" VARCHAR(32),
    "kpp" VARCHAR(16),
    "region" VARCHAR(160),
    "address" TEXT,
    "verification_status" VARCHAR(32) NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "organization_members" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "role" VARCHAR(16) NOT NULL DEFAULT 'owner',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organization_id" INT NOT NULL REFERENCES "organizations" ("id") ON DELETE CASCADE,
    "user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "uid_organizatio_user_id_a28e0b" UNIQUE ("user_id", "organization_id")
);
CREATE TABLE IF NOT EXISTS "organization_profiles" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "production_types" JSONB NOT NULL,
    "land_area_ha" DECIMAL(12,2),
    "livestock_count" INT,
    "main_crops" JSONB,
    "machinery" JSONB,
    "digital_maturity" VARCHAR(80),
    "support_needs" JSONB,
    "service_needs" JSONB,
    "marketplace_interests" JSONB,
    "comment" TEXT,
    "completion_percent" INT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organization_id" INT NOT NULL UNIQUE REFERENCES "organizations" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """


MODELS_STATE = (
    "eJztnP1P2zgYx/+Vqj8xiUO0sA6dTicV6G69UTpBdzdtmiI3cVuLxM4cB+h2/O9nO0nz5o"
    "SmbyQlvyBwniexP3ac5/vY5lfTIgY0naPPDqTN3xu/mhhYkP8SKz9sNIFth6WigIGxKQ1d"
    "biFLwNhhFOiMF06A6UBeZEBHp8hmiGBeil3TFIVE54YIT8MiF6MfLtQYmUI2kxX59p0XI2"
    "zAR+gEf9p32gRB04jVExni2bJcY3NblvUxey8NxdPGmk5M18KhsT1nM4IX1ggzUTqFGFLA"
    "oLg9o66ovqid38ygRV5NQxOvihEfA06Aa7JIc5dkoBMs+PHaOLKBU/GU39qt03enZyed0z"
    "NuImuyKHn35DUvbLvnKAlcj5pP8jpgwLOQGENu0ALITKO7mAGqZrdwSODjlU7iC2C9KD8L"
    "PGomxFM2E9Devs2h9U/35uJD9+aAW70RbSF8GHuD+9q/1PauCaQhQptjgEUQLhxWQugDWh"
    "AMTEKE4Wu3DYYn7SUQnrQzCYpLCYDAcR4INbQZcGaFQCYdNzMmd010K6MSORqfhNG9YmSe"
    "E2JCgDPmxqhfgueYO24L6OK9XwloDr/z4fBKVNpynB+mLOiPEhw/D857NwctiZcbIQajk2"
    "ecqWEhvALSwG2HRIt+fV8EqU6haLYGWBrqJb/CkAXVVOOeCa6G73oU/FLSeYC3wRhic+6/"
    "ADnMR/1B73bUHXyKgb/sjnriSluWzhOlB53EjLG4SePf/uhDQ/zZ+Dq87kmCxGFTKp8Y2o"
    "2+NkWdgMuIhskDH8eRb3RQGoCJdaxrGyt2bNyz7tgX7VhZeRF1T+4i8aMoGAP97gHwj2/s"
    "SvrNJnQKMPoJBEJHMXP6t3n/8Qaa0kjR674KGUZuVc5+fwoGc1Aa9n9IJkpEs6A15spphu"
    "wNwhnIm1YMkRhUpE2yhln8UiR6pGSCTFWY43sOMRwR/uN5hELlfgpvV7pAPBed1bYS6CyA"
    "wVRWRNxOOCvamSH2IxjyNb/m86+1f+W0/wRRh2nyrxS/bNEV96qm4mq1j5dQXNwqU3HJa/"
    "FQ1gQr0Iw51TDDqQgZhgkL40y4VTLBshWeFE79T9+yKEOPalLsLEWxk0Oxk6ZIVIFGDkPf"
    "vpoEtzEOa72/F7Kw1vt72rEpsSpj/EIRdsTj+TC7FGtEG4izC6RI0jo3TjuNOlCwknef1x"
    "1gXfVdSSzWlo1zlnzlxRQ8LIRddADxxvEmQS97fNG9vehe9ppPOXmBgko4llFSSOFkxilb"
    "C6fSXLUWLts7epijhWXrC0R2gX1FJVtnqdg4JzROxnVFhVq1Je92VmxxIX3mm1cTYGuZTQ"
    "St7E0ErdQmAjKlhfAF9pWUZpvfg3HHP2wF6PnmlYS3+cmvTq5sIrnCJQlXLYpVsBF8zAhg"
    "Ii4V4ZgnDHtfRjFNGNA6GHS/vInpwqvh9V+BeYTuxdXwPAH1HlI0Qbq31siFA3MVgLPHaY"
    "b77j46TYOCiQxISzpx1gmtvch71AmtPe3YVEIreO3G82JprZTfZpJbO+jKbaS3VDzTMN8T"
    "CtEUf4TzLaeuXm7vxWEieZUaJkuksDLI+luD0ljrbUE73RYURfgatgcphswzqdFwYC2XIN"
    "UiQ3uzedJvixR69HnN73X+dLv5052ujK+mJMgD9kZGSbMItZLYi4AzrSRiM1+hCUbh+Zqi"
    "zpKtQ1cDWk6orl5dfoVB+rMrzFmv7wboVfcQQ5KiYnYqKnYKBfdrhLE5u90zovslA9l693"
    "tVI1bec4ary070XFMU/74dXqsxqnyTYRfSWeO/homcrX1rmn9MXCxr0Ri7yGQIO0fieX+u"
    "EeTmIBU48tcnkksRiVBK3CC5PmECzONWHvtpM6AIe6GOLGBmbZ2PuyY7wPM98u9RZsWuon"
    "3Zu+gPulcHrfZhO3GKNsB+mj6CgO6hw4h+xzG5WKEjMicGhedKQdMLrExuONC0+J01nRLV"
    "ebzsGSHutdZcUKphuJWX3gL6DHEGioxxHuGIUw04F7CBpogBU7MAcyliCs7ZmRmVb0UW1+"
    "MZmrNl9iicZW9ROEtNr45r24QyDUNoFJodUo71+M0dv1ye3SMdrgA66ViDfmYmpneQ2Sbg"
    "zHgdIDdlBb97GTeoweeC14llQVWElr3ZKeJSkfl415udOCHbhJ4uh1RX8s1e31c67y5zeF"
    "yeELheidjTlYh6T9NedGz+f5QpxwpTFdKDGzq0l79AUPDw3rrLA2U5xLfa4sBaCf8upEif"
    "NRU5fv/KYV5aH4Q2dR6/ZC/qYU4e/x5Sp+Dpi4hLNY9PbeX8GSh2BAiscQToxQG2jpc6wH"
    "Kcc4DlOP2/LQgXwCrNkS2fIy67Xz8qv2Je6wO97ofl6X8K8PyG"
)
