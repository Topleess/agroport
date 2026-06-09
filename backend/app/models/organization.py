from tortoise import fields, models


class Organization(models.Model):
    id = fields.IntField(pk=True)
    category = fields.CharField(max_length=32, default="farm")
    type = fields.CharField(max_length=16)
    name = fields.CharField(max_length=255)
    inn = fields.CharField(max_length=12)
    ogrn = fields.CharField(max_length=32, null=True)
    kpp = fields.CharField(max_length=16, null=True)
    region = fields.CharField(max_length=160, null=True)
    address = fields.TextField(null=True)
    verification_status = fields.CharField(max_length=32, default="draft")
    created_by = fields.ForeignKeyField("models.User", related_name="created_organizations")
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    members: fields.ReverseRelation["OrganizationMember"]
    profile: fields.ReverseRelation["OrganizationProfile"]
    products: fields.ReverseRelation["OrganizationProduct"]

    class Meta:
        table = "organizations"


class OrganizationMember(models.Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("models.User", related_name="organization_memberships")
    organization = fields.ForeignKeyField("models.Organization", related_name="members")
    role = fields.CharField(max_length=16, default="owner")
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "organization_members"
        unique_together = (("user", "organization"),)


class OrganizationProfile(models.Model):
    id = fields.IntField(pk=True)
    organization = fields.OneToOneField(
        "models.Organization", related_name="profile", on_delete=fields.CASCADE
    )
    production_types = fields.JSONField(default=list)
    land_area_ha = fields.DecimalField(max_digits=12, decimal_places=2, null=True)
    livestock_count = fields.IntField(null=True)
    main_crops = fields.JSONField(null=True)
    machinery = fields.JSONField(null=True)
    digital_maturity = fields.CharField(max_length=80, null=True)
    support_needs = fields.JSONField(null=True)
    service_needs = fields.JSONField(null=True)
    marketplace_interests = fields.JSONField(null=True)
    comment = fields.TextField(null=True)
    completion_percent = fields.IntField(default=0)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "organization_profiles"


class OrganizationProduct(models.Model):
    id = fields.IntField(pk=True)
    organization = fields.ForeignKeyField(
        "models.Organization", related_name="products", on_delete=fields.CASCADE
    )
    category = fields.CharField(max_length=32)
    name = fields.CharField(max_length=255)
    description = fields.TextField(null=True)
    unit = fields.CharField(max_length=40, null=True)
    price = fields.DecimalField(max_digits=12, decimal_places=2, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "organization_products"
