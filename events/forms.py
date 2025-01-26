from django import forms
from .models import Event

class EventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ['title', 'description', 'note', 'event_date', 'event_type',"team_participants" ,"external_participants"  ,'related_files']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter event title'}),
            'description': forms.Textarea(attrs={
                'class': 'form-control', 
                'placeholder': 'Enter event description', 
                'rows': 4,  # Limit to 4 lines
                'style': 'resize: none;',  # Prevent resizing
            }),
            'note': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Add any notes'}),
            'external_participants': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'External Participants Names'  , "custom_id":"multiple_chip_select"}),
            'team_participants' : forms.SelectMultiple(attrs={'class': 'form-control select2'}), 
            'event_date': forms.DateTimeInput(attrs={'type': 'datetime-local', 'class': 'form-control'}),
            'event_type': forms.Select(attrs={'class': 'form-select'}),
            'related_files': forms.ClearableFileInput(attrs={'class': 'form-control'}),
        }
