from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required ,  user_passes_test
from .models import Project
from .forms import ProjectForm
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import HttpResponseForbidden





def is_admin_or_leader(user):
    return user.is_staff or user.groups.filter(name='leaders').exists()


@login_required
@user_passes_test(is_admin_or_leader)
def create_project(request):
    if request.method == 'POST':
        form = ProjectForm(request.POST)
        if form.is_valid():
            project = form.save(commit=False)
            project.owner = request.user
            
            project.save()  # Save the project after setting the owner
            # Get the selected project workers from the form
            project_workers = form.cleaned_data['project_workers']
            project.project_workers.set(project_workers)  # Set the selected project workers
            
            return redirect('projects:project_dashboard', project_id=project.id)
    else:
        form = ProjectForm()
    return render(request, 'projects/create_project.html', {'form': form})

@login_required
def project_dashboard(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    
    # Check if the user is admin, owner, or a worker in the project
    if not (request.user.is_staff or project.owner == request.user or request.user in project.project_workers.all()):
        return HttpResponseForbidden("You do not have permission to view this project.")
    
    files = project.files.all().order_by('-created_at')
    events = project.events.all().order_by('-event_date')
    return render(request, 'projects/project_dashboard.html', {'project': project , 'events':events , 'files' : files} )

@login_required
def modify_project(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    # Check if the user is an admin or the project owner
    if not (request.user.is_staff or project.owner == request.user):
        return HttpResponseForbidden("You do not have permission to modify this project.")

    if request.method == 'POST':
        form = ProjectForm(request.POST, instance=project)
        if form.is_valid():
            form.save()
            return redirect('projects:project_dashboard', project_id=project.id)
    else:
        form = ProjectForm(instance=project)
    return render(request, 'projects/modify_project.html', {'form': form, 'project': project})

@login_required
def delete_project(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    # Check if the user is an admin or the project owner
    if not (request.user.is_staff or project.owner == request.user):
        return HttpResponseForbidden("You do not have permission to delete this project.")

    if request.method == 'POST':
        project.delete()
        return redirect('projects:project_list')
    return render(request, 'projects/delete_project.html', {'project': project})

@login_required
def project_list(request):
    query = request.GET.get('q')
    
    # Fetch projects where the user is either the owner or a worker
    projects = Project.objects.filter(
        Q(owner=request.user) | Q(project_workers=request.user)
    )
    
    # Apply search filter if a query is provided
    if query:
        projects = projects.filter(name__icontains=query)
    
    # Order by creation date and paginate results
    paginator = Paginator(projects.order_by('-created_at'), 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'projects/project_list.html', {'page_obj': page_obj, 'query': query})