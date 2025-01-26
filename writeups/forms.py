from django import forms
from django.shortcuts import get_object_or_404
from projects.models import Project
from .models import Writeup
from .models import Task
from django.contrib.auth.models import User
from django.db.models import Q
import json
from django.core.serializers.json import DjangoJSONEncoder
from colorama import Fore, Back, Style, init
init()

class WriteupForm(forms.ModelForm):
    class Meta:
        model = Writeup
        fields = ['title', 'description', 'findings', 'tasks']

    def __init__(self, *args, **kwargs):
        
        user = kwargs.pop('user')
        project = kwargs.pop('project')

        preselected_task = ''
        if 'writeup_id' in kwargs:
            writeup_id = kwargs.pop('writeup_id')  
            writeup = get_object_or_404(Writeup, id=writeup_id)
            preselected_task = None
            if writeup.tasks.exists():
                tasks = writeup.tasks.all()
                preselected_task = [{
                    "value": task.id,  
                    "name": task.title,
                    "description": task.description,
                } for task in tasks ]

        

        super().__init__(*args, **kwargs)


        user_tasks = Task.objects.filter(
            Q(assigned_to=user) | 
            Q(created_by=user) | 
            Q(project=project)  # Assuming `owner` is the field for project owner
        )

        self.fields['tasks'] = forms.CharField(
            widget=forms.Textarea(
                attrs={
                    'class': 'form-control',
                    'id': 'related_tasks_multiselect',
                    'name': 'tags',
                    'placeholder': 'Related Tasks',
                    'whitelist': json.dumps(
                                                [
                                                    {
                                                        "value": task.id,
                                                        "name": task.title,
                                                        "description": task.description,
                                                    }
                                                    for task in user_tasks
                                                ],
                                                cls=DjangoJSONEncoder
                                            ),
                    'data-preselected': json.dumps(preselected_task, cls=DjangoJSONEncoder) if preselected_task else '',
                }
            )    
        )
        
    title       = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            
            'placeholder': 'Writeup Title'
        })
    )
    description = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            
            'placeholder': 'Content of the Writeup',
            'rows': 1,  # Start with 1 row
            'style': 'resize: none; overflow-y: auto;'  # Prevent manual resizing, allow vertical scrolling
        })
    )
    findings    = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            
            'placeholder': 'Content of the Writeup',
            'rows': 1,  # Start with 1 row
            'style': 'resize: none; overflow-y: auto;'  # Prevent manual resizing, allow vertical scrolling
        })
    )



class UploadWriteupFileForm(forms.Form):
    file = forms.FileField()