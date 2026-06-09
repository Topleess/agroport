from tortoise import fields, models


class User(models.Model):
    id = fields.IntField(pk=True)
    email = fields.CharField(max_length=255, unique=True)
    phone = fields.CharField(max_length=32, null=True)
    password_hash = fields.CharField(max_length=255)
    is_active = fields.BooleanField(default=True)
    is_admin = fields.BooleanField(default=False)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    profile: fields.ReverseRelation["UserProfile"]

    class Meta:
        table = "users"


class UserProfile(models.Model):
    id = fields.IntField(pk=True)
    user = fields.OneToOneField("models.User", related_name="profile", on_delete=fields.CASCADE)
    first_name = fields.CharField(max_length=120)
    last_name = fields.CharField(max_length=120)
    middle_name = fields.CharField(max_length=120, null=True)
    region = fields.CharField(max_length=160, null=True)
    role = fields.CharField(max_length=120, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "user_profiles"
