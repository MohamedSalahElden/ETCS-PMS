from django import template

register = template.Library()

@register.filter
def initials(value):
    """
    Extracts initials from a full name.
    Example: "John Doe" -> "JD"
    """
    if not value:
        return ""
    parts = value.split()
    return "".join(part[0].upper() for part in parts[:2])  # Take the first two initials
