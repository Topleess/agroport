import re


def normalize_phone(phone: str | None) -> str | None:
    if phone is None:
        return None
    value = phone.strip()
    if not value:
        return None
    has_plus = value.startswith("+")
    digits = re.sub(r"\D", "", value)
    if not digits:
        return None
    if has_plus:
        return f"+{digits}"
    if len(digits) == 11 and digits.startswith("8"):
        return f"+7{digits[1:]}"
    if len(digits) == 11 and digits.startswith("7"):
        return f"+{digits}"
    return digits


def normalize_email(email: str) -> str:
    return email.strip().lower()
