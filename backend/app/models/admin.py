from tortoise import fields, models


class AdminUserRole(models.Model):
    id = fields.IntField(pk=True)
    user = fields.OneToOneField("models.User", related_name="admin_role", on_delete=fields.CASCADE)
    role = fields.CharField(max_length=40, default="admin")
    is_active = fields.BooleanField(default=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "admin_user_roles"


class Dictionary(models.Model):
    id = fields.IntField(pk=True)
    code = fields.CharField(max_length=120, unique=True)
    name = fields.CharField(max_length=255)
    description = fields.TextField(null=True)
    status = fields.CharField(max_length=32, default="active")
    is_system = fields.BooleanField(default=True)
    is_locked = fields.BooleanField(default=False)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    items: fields.ReverseRelation["DictionaryItem"]

    class Meta:
        table = "dictionaries"


class DictionaryItem(models.Model):
    id = fields.IntField(pk=True)
    dictionary = fields.ForeignKeyField("models.Dictionary", related_name="items", on_delete=fields.CASCADE)
    code = fields.CharField(max_length=160)
    label = fields.CharField(max_length=255)
    description = fields.TextField(null=True)
    status = fields.CharField(max_length=32, default="active")
    sort_order = fields.IntField(default=0)
    is_system = fields.BooleanField(default=True)
    parent_code = fields.CharField(max_length=160, null=True)
    synonyms = fields.JSONField(default=list)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "dictionary_items"
        unique_together = (("dictionary", "code"),)


class DictionaryProposal(models.Model):
    id = fields.IntField(pk=True)
    dictionary = fields.ForeignKeyField("models.Dictionary", related_name="proposals", on_delete=fields.CASCADE)
    proposed_code = fields.CharField(max_length=160, null=True)
    proposed_label = fields.CharField(max_length=255)
    source_field = fields.CharField(max_length=160, null=True)
    source_entity_type = fields.CharField(max_length=80, null=True)
    source_entity_id = fields.CharField(max_length=80, null=True)
    status = fields.CharField(max_length=32, default="proposed")
    created_by = fields.ForeignKeyField("models.User", related_name="dictionary_proposals", null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "dictionary_proposals"


class FieldDefinition(models.Model):
    id = fields.IntField(pk=True)
    field_key = fields.CharField(max_length=160, unique=True)
    field_name = fields.CharField(max_length=255)
    block = fields.CharField(max_length=160, null=True)
    control_type = fields.CharField(max_length=40)
    dictionary_code = fields.CharField(max_length=120, null=True)
    allow_other_text = fields.BooleanField(default=False)
    required = fields.BooleanField(default=False)
    used_for_filtering = fields.BooleanField(default=True)
    used_for_scoring = fields.BooleanField(default=False)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "field_definitions"


class TaxonomyNode(models.Model):
    id = fields.IntField(pk=True)
    external_id = fields.CharField(max_length=80, unique=True)
    parent = fields.ForeignKeyField(
        "models.TaxonomyNode", related_name="children", null=True, on_delete=fields.SET_NULL
    )
    level = fields.IntField()
    name = fields.CharField(max_length=255)
    slug = fields.CharField(max_length=255)
    description = fields.TextField(null=True)
    notes = fields.TextField(null=True)
    is_selectable = fields.BooleanField(default=False)
    is_active = fields.BooleanField(default=True)
    sort_order = fields.IntField(default=0)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "taxonomy_nodes"


class Solution(models.Model):
    id = fields.IntField(pk=True)
    supplier = fields.ForeignKeyField(
        "models.Organization", related_name="solutions", null=True, on_delete=fields.SET_NULL
    )
    name = fields.CharField(max_length=255)
    short_description = fields.TextField(null=True)
    full_description = fields.TextField(null=True)
    status = fields.CharField(max_length=32, default="draft")
    partner_type = fields.CharField(max_length=80, null=True)
    payment_model = fields.CharField(max_length=80, null=True)
    implementation_type = fields.CharField(max_length=80, null=True)
    deployment_type = fields.CharField(max_length=80, null=True)
    evidence_level = fields.IntField(null=True)
    price_from = fields.DecimalField(max_digits=14, decimal_places=2, null=True)
    subsector_ids = fields.JSONField(default=list)
    process_ids = fields.JSONField(default=list)
    problem_ids = fields.JSONField(default=list)
    integration_ids = fields.JSONField(default=list)
    region_ids = fields.JSONField(default=list)
    extra_fields = fields.JSONField(default=dict)
    created_by = fields.ForeignKeyField(
        "models.User", related_name="created_solutions", null=True, on_delete=fields.SET_NULL
    )
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    published_at = fields.DatetimeField(null=True)

    class Meta:
        table = "solutions"


class SolutionTaxonomyLink(models.Model):
    id = fields.IntField(pk=True)
    solution = fields.ForeignKeyField("models.Solution", related_name="taxonomy_links", on_delete=fields.CASCADE)
    taxonomy_node = fields.ForeignKeyField(
        "models.TaxonomyNode", related_name="solution_links", on_delete=fields.CASCADE
    )
    is_primary = fields.BooleanField(default=False)

    class Meta:
        table = "solution_taxonomy_links"
        unique_together = (("solution", "taxonomy_node"),)


class FarmerRequest(models.Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("models.User", related_name="farmer_requests", null=True, on_delete=fields.SET_NULL)
    farm = fields.ForeignKeyField(
        "models.Organization", related_name="farmer_requests", null=True, on_delete=fields.SET_NULL
    )
    solution = fields.ForeignKeyField(
        "models.Solution", related_name="leads", null=True, on_delete=fields.SET_NULL
    )
    title = fields.CharField(max_length=255)
    contact_name = fields.CharField(max_length=255, null=True)
    contact_email = fields.CharField(max_length=255, null=True)
    contact_phone = fields.CharField(max_length=32, null=True)
    organization_name = fields.CharField(max_length=255, null=True)
    message = fields.TextField(null=True)
    source = fields.CharField(max_length=40, default="platform")
    region_id = fields.CharField(max_length=80, null=True)
    subsector_ids = fields.JSONField(default=list)
    process_ids = fields.JSONField(default=list)
    problem_ids = fields.JSONField(default=list)
    urgency = fields.CharField(max_length=32, default="medium")
    budget_rub = fields.DecimalField(max_digits=14, decimal_places=2, null=True)
    current_integration_ids = fields.JSONField(default=list)
    digital_maturity_id = fields.CharField(max_length=80, null=True)
    desired_effect_ids = fields.JSONField(default=list)
    free_description = fields.TextField(null=True)
    extra_fields = fields.JSONField(default=dict)
    status = fields.CharField(max_length=40, default="new")
    assigned_admin = fields.ForeignKeyField(
        "models.User", related_name="assigned_farmer_requests", null=True, on_delete=fields.SET_NULL
    )
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "farmer_requests"


class Notification(models.Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("models.User", related_name="notifications", on_delete=fields.CASCADE)
    organization = fields.ForeignKeyField(
        "models.Organization", related_name="notifications", null=True, on_delete=fields.SET_NULL
    )
    kind = fields.CharField(max_length=40, default="system")
    title = fields.CharField(max_length=255)
    body = fields.TextField()
    href = fields.CharField(max_length=255, null=True)
    is_read = fields.BooleanField(default=False)
    payload = fields.JSONField(default=dict)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "notifications"


class MatchingRun(models.Model):
    id = fields.IntField(pk=True)
    farmer_request = fields.ForeignKeyField(
        "models.FarmerRequest", related_name="matching_runs", on_delete=fields.CASCADE
    )
    status = fields.CharField(max_length=32, default="completed")
    triggered_by = fields.CharField(max_length=32, default="system")
    created_by = fields.ForeignKeyField(
        "models.User", related_name="matching_runs", null=True, on_delete=fields.SET_NULL
    )
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "matching_runs"


class MatchingResult(models.Model):
    id = fields.IntField(pk=True)
    matching_run = fields.ForeignKeyField("models.MatchingRun", related_name="results", on_delete=fields.CASCADE)
    solution = fields.ForeignKeyField("models.Solution", related_name="matching_results", on_delete=fields.CASCADE)
    total_score = fields.IntField(default=0)
    score_details = fields.JSONField(default=dict)
    explanation = fields.TextField(null=True)
    warnings = fields.JSONField(default=list)
    is_pinned_by_admin = fields.BooleanField(default=False)
    is_excluded_by_admin = fields.BooleanField(default=False)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "matching_results"


class ModerationItem(models.Model):
    id = fields.IntField(pk=True)
    object_type = fields.CharField(max_length=80)
    object_id = fields.CharField(max_length=80)
    title = fields.CharField(max_length=255)
    status = fields.CharField(max_length=40, default="submitted")
    priority = fields.CharField(max_length=32, default="normal")
    created_by = fields.ForeignKeyField(
        "models.User", related_name="created_moderation_items", null=True, on_delete=fields.SET_NULL
    )
    assigned_admin = fields.ForeignKeyField(
        "models.User", related_name="assigned_moderation_items", null=True, on_delete=fields.SET_NULL
    )
    company_id = fields.IntField(null=True)
    solution_id = fields.IntField(null=True)
    before_snapshot = fields.JSONField(null=True)
    after_snapshot = fields.JSONField(null=True)
    checklist = fields.JSONField(default=list)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    comments: fields.ReverseRelation["ModerationComment"]

    class Meta:
        table = "moderation_items"


class ModerationComment(models.Model):
    id = fields.IntField(pk=True)
    item = fields.ForeignKeyField("models.ModerationItem", related_name="comments", on_delete=fields.CASCADE)
    author = fields.ForeignKeyField("models.User", related_name="moderation_comments", null=True)
    body = fields.TextField()
    visibility = fields.CharField(max_length=32, default="internal")
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "moderation_comments"


class ImportJob(models.Model):
    id = fields.IntField(pk=True)
    import_type = fields.CharField(max_length=80)
    file_name = fields.CharField(max_length=255)
    file_url = fields.TextField(null=True)
    status = fields.CharField(max_length=40, default="uploaded")
    total_rows = fields.IntField(default=0)
    successful_rows = fields.IntField(default=0)
    error_rows = fields.IntField(default=0)
    warning_rows = fields.IntField(default=0)
    mapping_config = fields.JSONField(default=dict)
    errors = fields.JSONField(default=list)
    created_by = fields.ForeignKeyField("models.User", related_name="import_jobs", null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "import_jobs"


class AnalyticsEvent(models.Model):
    id = fields.IntField(pk=True)
    event_name = fields.CharField(max_length=120)
    user_id = fields.IntField(null=True)
    company_id = fields.IntField(null=True)
    solution_id = fields.IntField(null=True)
    farmer_request_id = fields.IntField(null=True)
    metadata = fields.JSONField(default=dict)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "analytics_events"


class AuditLogEntry(models.Model):
    id = fields.IntField(pk=True)
    admin_user = fields.ForeignKeyField("models.User", related_name="audit_log_entries", null=True)
    action = fields.CharField(max_length=160)
    object_type = fields.CharField(max_length=80)
    object_id = fields.CharField(max_length=80)
    object_title = fields.CharField(max_length=255, null=True)
    before_snapshot = fields.JSONField(null=True)
    after_snapshot = fields.JSONField(null=True)
    ip = fields.CharField(max_length=80, null=True)
    user_agent = fields.TextField(null=True)
    risk_level = fields.CharField(max_length=32, default="medium")
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "audit_log_entries"
