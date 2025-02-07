from django.db import models
import uuid
from django.contrib.auth.models import User
from projects.models import Project

class MarkdownContent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='writeups')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='writeups_created')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Content {self.id}"
    
class MarkdownImage(models.Model):
    image = models.ImageField(upload_to='markdown_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class MarkdownFile(models.Model):
    file = models.FileField(upload_to='markdown_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)