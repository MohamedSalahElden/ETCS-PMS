from django import forms
from .models import File

class FileForm(forms.ModelForm):
    class Meta:
        model = File
        fields = ['name', 'description', 'file', 'file_type', 'file_status', 'confidentiality_level', 'tags', 'related_vulnerabilities']

        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter file title'}),
            'description': forms.Textarea(attrs={
                'class': 'form-control', 
                'placeholder': 'Enter file description', 
                'rows': 4,  # Limit to 4 lines
                'style': 'resize: none;',  # Prevent resizing
            }),
            'file': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'file_type': forms.Select(attrs={'class': 'form-control'}),
            'file_status': forms.Select(attrs={'class': 'form-control'}),
            'confidentiality_level': forms.Select(attrs={'class': 'form-control'}),
            'tags': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter tags, separated by commas'}),
            'related_vulnerabilities': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Enter related vulnerabilities',
                'rows': 2,
                'style': 'resize: none;',
            }),
        }
