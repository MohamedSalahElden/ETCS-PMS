from django import template
from files.models import File  # Replace 'your_app' with the actual app name where the File model exists

register = template.Library()

def get_file_names(file_ids):
    """Convert a list of file IDs to their corresponding file names."""
    if isinstance(file_ids, list):
        return ','.join([f' file:{file.id}/{file.name} ' for file in File.objects.filter(id__in=file_ids)])
    return ""


register.filter('get_file_names' , get_file_names)