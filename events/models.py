from django.db import models
from django.conf import settings
from projects.models import Project  # Import the Project model
from django.utils import timezone


class File(models.Model):
    file = models.FileField(upload_to='event_files/')


class Event(models.Model):
    EVENT_TYPES = [
        ('MEETING', 'Meeting'),
        ('RECEIVE', 'Receive Devices or Documentation'),
        ('DELIVER', 'Delivery of Results'),
        ('MILESTONE', 'Milestone Achieved'),
        ('KICKOFF', 'Kickoff Meeting'),
        ('UPDATE', 'Progress Update'),
        ('INCIDENT', 'Incident Report'),
        ('RETURN', 'Return of Test Devices'),
        ('REPORT', 'Report Sent'),
        ('FEEDBACK', 'Post-Engagement Feedback'),
        ('OTHER', 'Other'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    note = models.TextField(blank=True, null=True)
    event_date = models.DateTimeField(blank=True, null=True, default=timezone.now)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES , default='OTHER', null=True, blank=True)
    related_files = models.ManyToManyField(File, related_name='events', blank=True)


    # New fields for participants and action creator
    action_creator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_events'
    )
    team_participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name='team_events', blank=True
    )
    external_participants = models.CharField(max_length=500, blank=True, null=True)  # Comma-separated list of names

    def __str__(self):
        return self.title
