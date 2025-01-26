from django.db import models
from projects.models import Project  # Import Project model

class File(models.Model):
    # Choices for file type
    FILE_TYPE_CHOICES = [
        ('external', 'External Entity'),
        ('exported', 'Exported During Pentest'),
        ('result', 'Result of the Test'),
        ('reply', 'Document Reply'),
        ('letter', 'Letter'),
        ('firmware', 'Firmware'),
        ('log', 'Log File'),
        ('exploit', 'Exploit Script/Code'),
        ('configuration', 'Configuration File'),
        ('tool', 'Tool'),
        ('other', 'Other'),
        ('writeup', 'Writeup Related'),
    ]

    # Choices for file status
    FILE_STATUS_CHOICES = [
        ('pending', 'Pending Analysis'),
        ('in_progress', 'In Progress'),
        ('completed', 'Analysis Completed'),
    ]

    # Choices for confidentiality level
    CONFIDENTIALITY_LEVEL_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    project = models.ForeignKey(Project, related_name='files', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='project_files/')
    created_at = models.DateTimeField(auto_now_add=True)
    file_type = models.CharField(
        max_length=20,
        choices=FILE_TYPE_CHOICES,
        default='other'  # Default value
    ) 
    file_status = models.CharField(max_length=15, choices=FILE_STATUS_CHOICES, default='pending')
    confidentiality_level = models.CharField(max_length=10, choices=CONFIDENTIALITY_LEVEL_CHOICES, default='medium')
    tags = models.CharField(max_length=255, blank=True, null=True, help_text="Comma-separated tags for categorization")
    related_vulnerabilities = models.TextField(blank=True, null=True, help_text="IDs or names of related vulnerabilities")
    uploaded_by = models.ForeignKey(
        'auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='uploaded_files'
    )
    uploaded_at = models.DateTimeField(null=True, blank=True,)
    last_modified_at = models.DateTimeField(auto_now=True)

    
    def __str__(self):
        return f"{self.name} ({self.get_file_type_display()})"

    def is_confidential(self):
        """Check if the file has a high confidentiality level."""
        return self.confidentiality_level == 'high'

    def get_tags_list(self):
        """Return tags as a list."""
        return [tag.strip() for tag in self.tags.split(',')] if self.tags else []
