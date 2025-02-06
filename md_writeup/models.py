from django.db import models
import uuid

class MarkdownContent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Content {self.id}"
    


class MarkdownImage(models.Model):
    image = models.ImageField(upload_to='markdown_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class MarkdownFile(models.Model):
    file = models.FileField(upload_to='markdown_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)