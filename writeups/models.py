from django.db import models
from django.contrib.auth.models import User
from projects.models import Project
from tasks.models import Task
from files.models import File
from easymde.fields import EasyMDEField

class Writeup(models.Model):

    CREATED_BY_CHOICES = [
        ('file_upload', 'File Upload'),
        ('editor', 'Editor'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    findings = models.TextField(null=True, blank=True)
    content = EasyMDEField(verbose_name=u'mardown content' , null=True, blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='writeups_created')
    editors = models.ManyToManyField(User, related_name='writeups_edited', blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='writeups')
    # tasks = models.ManyToManyField(Task, related_name='writeups', blank=True)
    evidence_files = models.ManyToManyField(File, related_name='writeups', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.CharField(
        max_length=20,
        choices=CREATED_BY_CHOICES,
        default='file_upload'  # Default to 'editor' if not specified
    )
    def __str__(self):
        return self.title