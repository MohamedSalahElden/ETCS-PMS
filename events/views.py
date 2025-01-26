from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404, redirect
from .models import Event, File
from .forms import EventForm
from projects.models import Project
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.exceptions import PermissionDenied


@login_required
def event_list(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    # Check if the user is an admin, project owner, or works on the project
    if not (request.user == project.owner or request.user.is_staff or request.user in project.project_workers.all()):
        raise PermissionDenied  # Deny access if the user is not authorized

    events = project.events.all().order_by('-event_date')  # Order events by event_date, newest first
    return render(request, 'events/event_list.html', {'project': project, 'events': events})

@login_required
def create_event(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    print(request.FILES)
    
    # Check if the user is an admin, project owner, or works on the project
    if not (request.user == project.owner or request.user.is_staff or request.user in project.project_workers.all()):
        messages.error(request, 'You do not have permission to create an event for this project.')
        raise PermissionDenied  # Optionally raise an exception to prevent further action

    if request.method == 'POST':
        User = get_user_model()
        form = EventForm(request.POST)
       
        if form.is_valid():
            event = form.save(commit=False)
            event.project = project
            event.action_creator = request.user
            
            
            event.save()  # Save the event to generate an ID before setting the many-to-many field
            
            # Handle the team participants
            team_participants = request.POST.getlist('team_participants')
            users = User.objects.filter(id__in=team_participants)
            event.team_participants.set(users)  # Now it's safe to set the many-to-many field
            

            # Handle the related files
            files = request.FILES.getlist('related_files')
            for file in files:
                file_instance = File.objects.create(file=file)  # Save the file instance
                event.related_files.add(file_instance)  # Associate the file with the event

            

            event.save()  # Save again to persist the many-to-many relationship with files
            return redirect('events:event_list', project_id=project.id)
        else:
            print("form.errors")  # Debug form errors for more insights
        
    else:
        form = EventForm()

    return render(request, 'events/create_event.html', {'form': form, 'project': project})

@login_required
def modify_event(request, project_id, event_id):
    User = get_user_model()
    project = get_object_or_404(Project, id=project_id)
    event = get_object_or_404(Event, id=event_id, project=project)

    # Check if the user is an admin, project owner, or action creator
    if not request.user.is_superuser and not (project.owner == request.user or event.action_creator == request.user):
        raise PermissionDenied("You do not have permission to modify this event.")

    if request.method == 'POST':
        form = EventForm(request.POST, instance=event)
        
        if form.is_valid():
            event = form.save(commit=False)

            external_participants = request.POST.get('external_participants','') 
            event.external_participants = external_participants
            
            team_participants = request.POST.getlist('team_participants')
            users = User.objects.filter(id__in=team_participants)
            event.team_participants.set(users)

            # Handle the related files
            files = request.FILES.getlist('related_files')
            for file in files:
                print(type(file))
                file_instance = File.objects.create(file=file)
                event.related_files.add(file_instance)  # Associate the file with the event

            
            event.save() 

            return redirect('events:event_list', project_id=project.id)
    else:
        form = EventForm(instance=event)
    
    return render(request, 'events/modify_event.html', {'form': form, 'event': event, 'project': project})

@login_required
def delete_event(request, project_id, event_id):
    project = get_object_or_404(Project, id=project_id)
    event = get_object_or_404(Event, id=event_id, project=project)

    # Check if the user is the action creator, project owner, or an admin
    if not (request.user == event.action_creator or request.user == project.owner or request.user.is_staff):
        messages.error(request, 'You do not have permission to delete this event.')
        raise PermissionDenied  # Optionally raise an exception to prevent further action

    if request.method == 'POST':
        event.delete()
        messages.success(request, 'Event deleted successfully!')
        return redirect('events:event_list', project_id=project.id)

    return render(request, 'events/delete_event.html', {'event': event, 'project': project})