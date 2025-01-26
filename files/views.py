from django.shortcuts import render, get_object_or_404, redirect
from .models import File
from projects.models import Project
from .forms import FileForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from django.http import FileResponse, Http404



# List all files related to a specific project
def project_files(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    
    # Check if the user is an admin, project owner, or works on the project
    if not (request.user == project.owner or request.user.is_staff or request.user in project.project_workers.all()):
        raise PermissionDenied  # Deny access if the user is not authorized

    files = project.files.all()
    return render(request, 'files/project_files.html', {'project': project, 'files': files})

# Add a new file to a project
def add_file(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    # Check if the user is an admin, project owner, or works on the project
    if not (request.user == project.owner or request.user.is_staff or request.user in project.project_workers.all()):
        raise PermissionDenied  # Deny access if the user is not authorized


    if request.method == 'POST':
        form = FileForm(request.POST, request.FILES)
        print(request.FILES)
        if form.is_valid():
            new_file = form.save(commit=False)
            new_file.project = project
            new_file.uploaded_by = request.user  # Set the current authenticated user
            new_file.uploaded_at = timezone.now() 
            new_file.save()
            return redirect('files:project_files', project_id=project.id)
        else:
            print(form.errors)
            return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    else:
        form = FileForm()
    return render(request, 'files/add_file.html', {'form': form, 'project': project })

# Edit an existing file
def edit_file(request, file_id):
    
    file_instance = get_object_or_404(File, id=file_id)
    project = file_instance.project
    # Check if the user is an admin, project owner, or works on the project
    if not (request.user == project.owner or request.user.is_staff or request.user in project.project_workers.all()):
        raise PermissionDenied  # Deny access if the user is not authorized

    
    if request.method == 'POST':
        form = FileForm(request.POST, request.FILES, instance=file_instance)
        if form.is_valid():
            form.save()
            return redirect('files:project_files', project_id=project.id)
    else:
        form = FileForm(instance=file_instance)
    return render(request, 'files/edit_file.html', {'form': form, 'project': project})

# Delete a file
def delete_file(request, file_id):
    file_instance = get_object_or_404(File, id=file_id)
    project = file_instance.project
    # Check if the user is an admin, project owner, or works on the project
    if not (request.user == project.owner or request.user.is_staff or request.user == file_instance.uploaded_by):
        raise PermissionDenied  # Deny access if the user is not authorized

    if request.method == 'POST':
        file_instance.delete()
        return redirect('files:project_files', project_id=project.id)
    return render(request, 'files/delete_file.html', {'file': file_instance, 'project': project})

def download_file(request, file_id):

    try:
        file = File.objects.get(id=file_id)
        return FileResponse(open(file.file.path, 'rb'), as_attachment=True, filename=file.name)
    except File.DoesNotExist:
        raise Http404("File not found")

@csrf_exempt  # Alternatively, use CSRF middleware with proper token handling
def upload_file(request):
    if request.method == "POST" and request.FILES.get("file"):
        uploaded_file = request.FILES["file"]
        file_path = default_storage.save(f"uploads/{uploaded_file.name}", ContentFile(uploaded_file.read()))
        return JsonResponse({"message": "File uploaded successfully", "file_path": file_path}, status=201)
    return JsonResponse({"error": "Invalid request"}, status=400)




