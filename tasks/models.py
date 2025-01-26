from django.db import models
from django.contrib.auth.models import User
from files.models import File
from projects.models import Project  # Import the Project model
from datetime import timedelta
from django.utils import timezone


def get_default_due_date():
    return timezone.now().date() + timedelta(weeks=1) 


class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(null=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    due_date = models.DateField(default=get_default_due_date)
    assigned_to = models.ForeignKey(User, related_name='tasks', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed')
    ], default='todo')
    project = models.ForeignKey(Project, related_name='tasks', on_delete=models.CASCADE)  # Link to Project
    created_by = models.ForeignKey(User, related_name='created_tasks', on_delete=models.SET_NULL, null=True)
    files = models.ManyToManyField(File, related_name='tasks' ,null=True ,)  # Many-to-Many Relationship with File
    
    def __str__(self):
        return self.title
