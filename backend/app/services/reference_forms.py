from functools import lru_cache
import json
from pathlib import Path

from app.models.admin import Dictionary, DictionaryItem, FieldDefinition, TaxonomyNode
from app.schemas.solutions import FormFieldResponse, FormOptionResponse, FormTemplateResponse

REFERENCE_PATH = Path(__file__).resolve().parents[1] / "seed_data" / "admin_reference.json"


@lru_cache(maxsize=1)
def load_reference_data() -> dict:
    return json.loads(REFERENCE_PATH.read_text())


def get_template_config(code: str) -> tuple[str, str | None, list[str]]:
    data = load_reference_data()
    templates = {
        "supplier": ("supplier", "Форма поставщика цифрового решения", data.get("supplier_form", [])),
        "farmer": ("farmer", "Форма заявки фермера", data.get("farmer_form", [])),
    }
    return templates[code]


async def build_form_template(code: str) -> FormTemplateResponse:
    template_code, name, template_fields = get_template_config(code)
    field_keys = [item["field_key"] for item in template_fields]
    fields = await FieldDefinition.filter(field_key__in=field_keys).order_by("id")
    by_key = {field.field_key: field for field in fields}
    result: list[FormFieldResponse] = []
    dictionary_codes = {field.dictionary_code for field in fields if field.dictionary_code}
    dictionaries = {
        dictionary.code: dictionary
        for dictionary in await Dictionary.filter(code__in=list(dictionary_codes))
    }
    taxonomy_nodes = await TaxonomyNode.filter(level=4).prefetch_related("parent").order_by("sort_order", "name")
    taxonomy_parent_map = {node.external_id: node.parent.external_id if node.parent_id else None for node in taxonomy_nodes}
    taxonomy_options = [
        FormOptionResponse(code=node.external_id, label=node.name, level=node.level, parent_code=taxonomy_parent_map.get(node.external_id))
        for node in taxonomy_nodes
    ]
    for config in template_fields:
        field = by_key.get(config["field_key"])
        if field is None:
            continue
        options: list[FormOptionResponse] = []
        if field.dictionary_code == "Taxonomy_L1_L4":
            options = taxonomy_options
        elif field.dictionary_code and field.dictionary_code in dictionaries:
            dictionary = dictionaries[field.dictionary_code]
            items = await DictionaryItem.filter(dictionary=dictionary).order_by("sort_order", "label")
            options = [
                FormOptionResponse(code=item.code, label=item.label, parent_code=item.parent_code)
                for item in items
            ]
        result.append(
            FormFieldResponse(
                field_key=field.field_key,
                field_name=field.field_name,
                input_type=config["input_type"],
                required=str(config.get("required", "Нет")).lower() in {"да", "true", "1"},
                dictionary_code=field.dictionary_code,
                block=field.block,
                allow_other_text=field.allow_other_text,
                options=options,
            )
        )
    description = (
        "Составлена по словарям и таксономии seed-данных."
        if code == "supplier"
        else "Составлена по словарям seed-данных для заявки фермера."
    )
    return FormTemplateResponse(code=template_code, name=name, description=description, fields=result)
