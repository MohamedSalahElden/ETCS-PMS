

from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    PROJECT_TYPE_CHOICES = [
        ('sa', 'Security Assessment'),
        ('pt', 'Pentest'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="proj")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # New fields
    start_date = models.DateField(null=True, blank=True)  # Project start date
    duration = models.PositiveIntegerField(default=0) # Project duration in days (positive number)
    vendor = models.CharField(max_length=255 , default='')  # Vendor name
    manufacturer = models.CharField(max_length=255 , default='')  # Manufacturer name
    project_type = models.CharField(
        max_length=2,
        choices=PROJECT_TYPE_CHOICES,
        default='sa',  # Default to 'Security Assessment'
    )
    project_workers = models.ManyToManyField(User, related_name="assigned_projects" , blank=True)  # Many-to-many relationship to users

    def __str__(self):
        return self.name
