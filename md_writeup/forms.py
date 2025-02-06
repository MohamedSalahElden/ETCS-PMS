from django import forms
from .models import MarkdownContent, MarkdownImage , MarkdownFile
from files.models import File

class MarkdownContentForm(forms.ModelForm):
    class Meta:
        model = MarkdownContent
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={'required': False}),
        }


class ImageUploadForm(forms.ModelForm):
    class Meta:
        model = File
        fields = ['file']


class FileUploadForm(forms.ModelForm):
    class Meta:
        model = MarkdownFile
        fields = ['file']