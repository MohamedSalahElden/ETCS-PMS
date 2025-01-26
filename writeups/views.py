from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from files.models import File
from projects.models import Project
from tasks.models import Task
from .models import Writeup
from .forms import WriteupForm, UploadWriteupFileForm
from colorama import Fore, Back, Style, init
from django.utils import timezone
from django.views.decorators.http import require_POST

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from files.models import File
from writeups.models import Writeup
from projects.models import Project
from django.utils.timezone import now



init()


def addFilesToWriteup(writeup , files ,  project, uploaded_by):
    for file in files:
        print(Fore.RED + file.name)
        new_file = File(
            name=file.name,  # You may need to get the file's name
            description="Description of the file",  # Set an appropriate description
            file=file,  # The actual file object (assuming 'file' is an instance of InMemoryUploadedFile or File)
            project=project,  # Associate the file with the given project
            uploaded_by=uploaded_by,  # Set the user who uploaded the file
            file_type='writeup',  # Adjust the file type as needed
            file_status='pending',  # Adjust the file status as needed
            confidentiality_level='medium',  # Adjust the confidentiality level as needed
            uploaded_at=timezone.now()
        )
        new_file.save()
        writeup.evidence_files.add(new_file)
    
    return writeup


def addTasksToWriteUp(writeup , tasks):
    tasks  = eval(tasks[0])
    for task in tasks:
        task_id = task['value']
        task_instance = get_object_or_404(Task, id=task_id)
        writeup.tasks.add(task_instance)

@login_required
def writeup_list(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    writeups = Writeup.objects.filter(project=project) 
    return render(request, 'writeups/writeup_list.html', {'writeups': writeups , 'project' : project})

@login_required
def writeup_detail(request, project_id, writeup_id):
    project = get_object_or_404(Project, id=project_id)
    writeup = get_object_or_404(Writeup, project = project ,id=writeup_id)
    return render(request, 'writeups/writeup_Details.html', {'writeup': writeup , 'project' : project})


@login_required
def edit_writeup(request, project_id, writeup_id):
    project = get_object_or_404(Project, id=project_id)
    writeup = get_object_or_404(Writeup, project=project, id=writeup_id)
    if request.method == 'POST':
        form = WriteupForm(request.POST, request.FILES, instance=writeup)
        if form.is_valid():
            form.save()
            return redirect('writeups:writeup', project_id=project_id, writeup_id=writeup_id)
    else:
        form = WriteupForm(instance=writeup, user=request.user , project = project_id , writeup_id=writeup_id)
    return render(request, 'writeups/writeup_Edit.html', {'form': form , 'writeup' : writeup ,  'project' : project , 'related_files' : writeup.evidence_files.all()})

@login_required
def delete_writeup(request, project_id, writeup_id):
    project = get_object_or_404(Project, id=project_id)
    writeup = get_object_or_404(Writeup, project=project, id=writeup_id)
    if request.method == 'POST':
        writeup.delete()
    return redirect('writeups:writeup_list', project_id=project_id)


################### delete writeups ####################################


@require_POST
@login_required
def delete_writeup_file(request, project_id, writeup_id, file_id):
    writeup = get_object_or_404(Writeup, id=writeup_id)
    file_to_remove = get_object_or_404(File, id=file_id)
    writeup.evidence_files.remove(file_to_remove)
    return JsonResponse({'message': 'File deleted successfully', 'status': 'success'})



################### edit writeups ####################################

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import login_required
from colorama import Fore
from .models import Project, Writeup
from .forms import WriteupForm

@login_required
def writeup_editor(request, project_id, writeup_id):
    project = get_object_or_404(Project, id=project_id)
    writeup = get_object_or_404(Writeup, id=writeup_id, project=project)

    if request.method == 'POST':
        print(Fore.BLUE + str(request.POST))  # Debugging purpose

        # Retrieve form data
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        findings = request.POST.get('findings', '').strip()
        tasks = request.POST.get('tasks', '').strip()
        content = request.POST.get('content', '').strip()

        # Remove unwanted text from content
        content = content.replace('<p>PlainBashC++C#CSSDiffHTML/XMLJavaJavaScriptMarkdownPHPPythonRubySQL</p>', '')

        if not content:
            return JsonResponse({'status': 'error', 'message': 'Content cannot be empty!'})

        # Update writeup fields
        writeup.title = title if title else writeup.title
        writeup.description = description if description else writeup.description
        writeup.findings = findings if findings else writeup.findings
        # writeup.tasks = tasks if tasks else writeup.tasks
        writeup.content = content

        # Save updates
        writeup.save()

        return JsonResponse({'status': 'success', 'message': 'Writeup updated successfully!'})

    # Clean up content before rendering
    writeup.content = writeup.content.replace('<p>PlainBashC++C#CSSDiffHTML/XMLJavaJavaScriptMarkdownPHPPythonRubySQL</p>', '')
    
    print(Fore.BLUE + writeup.content)  # Debugging purpose
    form = WriteupForm(instance=writeup, user=request.user, project=project_id, writeup_id=writeup_id)
    files = writeup.evidence_files.all()

    return render(request, 'writeups/writeup_editor.html', {'form': form, 'project': project, 'writeup': writeup, 'files': files})


@login_required
def writeup_Update(request, project_id , writeup_id):
    project = get_object_or_404(Project, id=project_id)
    writeup = get_object_or_404(Writeup, id=writeup_id, project=project)
    return JsonResponse({'status': 'success', 'message': 'Writeup saved successfully!'})
    
################### create writeups ####################################

@login_required
def upload_writeup_files(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    if request.method == 'POST':
        form = WriteupForm(request.POST, request.FILES , user = request.user , project = project_id)
        writeup = form.save(commit=False)
        writeup.creator = request.user
        writeup.project_id = project_id
        writeup.created_by = 'file_upload'
        writeup.save()
        addFilesToWriteup(writeup , request.FILES.getlist('evidence_files') , project , request.user)
        addTasksToWriteUp(writeup , request.POST.getlist('tasks'))
        return JsonResponse({"success": True, "message": "Writeup added successfully!"})
    else:
        form = WriteupForm(user=request.user , project = project)
    return render(request, 'writeups/writeup_UploadFiles.html', {'form': form ,  'project' : project})


@login_required
def create_new_writeup(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    # Fetch the data from the POST request
    title = "untitled"
    description = ""
    findings = ""
    content = ""

    # Create and save the writeup
    writeup = Writeup.objects.create(
        title=title,
        description=description,
        findings=findings,
        content=content,
        creator=request.user,
        project=project,
        created_by = 'editor'
    )
    writeup.title = "Untitled " + str(writeup.id)
    writeup.save()

    return redirect('writeups:writeup_editor', project_id=project_id, writeup_id=writeup.id)

@login_required
def upload_and_link_writeup_files(request, project_id, writeup_id):
    project = get_object_or_404(Project, id=project_id)
    writeup = get_object_or_404(Writeup, id=writeup_id, project=project)
    
    # Check if files are in the request
    if request.FILES:
        for file_name, file in request.FILES.items():
            # Create a new File object for each uploaded file
            new_file = File(
                project=project,
                name=file_name,
                description=request.POST.get(f"{file_name}_description", ""),  # Assuming description is passed in the form
                file=file,
                uploaded_by=request.user,
                uploaded_at=now(),
                file_type='writeup',  # Adjust file type as needed
            )
            new_file.save()
            
            # Link the new file to the writeup
            writeup.evidence_files.add(new_file)

            # Optionally, you can print the file details (for debugging)
            print(f"File name: {file_name}, File content: {file}")

    return JsonResponse({"message": "Success"}, status=200)


