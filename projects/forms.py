from django import forms
from .models import Project
from django.contrib.auth.models import User

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = [
            'name', 'start_date', 'duration', 'vendor',
            'manufacturer', 'project_type', 'project_workers', 'description'
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Project Name'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Project Description'}),
            'start_date': forms.DateInput(attrs={'class': 'form-control', 'placeholder': 'Start Date', 'type': 'date'}),
            'duration': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Project Duration (days)', 'min': '1'}),
            'vendor': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Device Vendor'}),
            'manufacturer': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Device Manufacturer'}),
            'project_type': forms.Select(choices=Project.PROJECT_TYPE_CHOICES, attrs={'class': 'form-control'}),
            'project_workers': forms.SelectMultiple(attrs={'class': 'form-select  select2'}), 
        }
