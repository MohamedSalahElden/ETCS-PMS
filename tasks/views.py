from django.shortcuts import render, redirect
from django.http import HttpResponseForbidden, JsonResponse
from flask_login import login_required
from .models import Task
from .forms import TaskForm

from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from .models import Task
from .forms import TaskForm
from projects.models import Project 
import json
from .models import File, Task
from colorama import init, Fore, Back, Style

init(autoreset=True)  # Initialize colorama


def assign_files_to_task(request, task_instance, project_id):
    from django.http import JsonResponse
    import json
    # Retrieve the string from the form data
    files_field = request.POST.get('hiddenFieldForFiles')
    project = get_object_or_404(Project, id=project_id)
    if files_field:
        files_field = files_field.strip()
        print(Fore.RED + files_field)
        try:
            try:
                parsed_files = eval(json.loads(files_field))  # Parse JSON string into a Python object
            except:
                task_instance.files.clear()
                return task_instance
            print(Fore.RED + str(parsed_files))
            # Check if parsed_files is a list
            if isinstance(parsed_files, list):
                for file_data in parsed_files:
                    print(Fore.RED + str(file_data))
                    if 'value' in file_data:
                        file_info = file_data['value'].strip()
                        print(Fore.RED + f"File info received: {file_info}")

                        # Check if file_info starts with 'file:'
                        if file_info.startswith('file:'):
                            
                            file_id = file_info.split('/')[0].split(':')[1]
                            file_id = file_id.strip()
                            print(Fore.RED + str(file_id))
                            try:
                                file_id = int(file_id)
                                print(Fore.RED + str(file_id))
                                file_instance = get_object_or_404(File, id=file_id)
                                
                                print(Fore.RED + f"File instance: {file_instance}")

                                # Add the file to the task
                                task_instance.files.add(file_instance)
                                print(Fore.RED +f"Added file {file_instance} to task {task_instance}")
                            except ValueError:
                                print(Fore.RED +f"Invalid file ID: {file_id}")
                        else:
                            print(Fore.RED +f"Invalid file info format: {file_info}")
            else:
                print(Fore.RED +"Parsed files is not a list.")

        except json.JSONDecodeError:
            print("Error decoding JSON from 'hiddenFieldForFiles'. The input might not be in valid JSON format.")

    return task_instance

def task_list(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    
    # Check if the user is the project owner, a coworker, or an admin
    if request.user != project.owner and request.user not in project.project_workers.all() and not request.user.is_staff:
        return HttpResponseForbidden("You do not have permission to view this project.")
    
    tasks = Task.objects.filter(project=project)  # Filter tasks by project
    return render(request, 'tasks/task_list.html', {'tasks': tasks, 'project': project})

def task_detail(request, project_id, task_id):
    project = get_object_or_404(Project, id=project_id)
    task = get_object_or_404(Task, id=task_id, project=project)  # Make sure task belongs to the project
    
    # Check if the user is the project owner, a coworker, or an admin
    if request.user != project.owner and request.user not in project.project_workers.all() and not request.user.is_staff:
        return HttpResponseForbidden("You do not have permission to view this project.")
    
    return render(request, 'tasks/task_detail.html', {'task': task, 'project': project})

def add_task(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    # Check if the user is the project owner, a coworker, or an admin
    if request.user != project.owner and request.user not in project.project_workers.all() and not request.user.is_staff:
        return HttpResponseForbidden("You do not have permission to view this project.")
    
    if request.method == 'POST':
        form = TaskForm(request.POST)
        form.fields['files'].required = False
        if form.is_valid():
            task = form.save(commit=False)
            task.project = project
            task.created_by = request.user
            task.save()
            task = assign_files_to_task(request, task , project_id)
            task.save()
            return redirect('tasks:task_list', project_id=project.id)
    else:
        form = TaskForm()
    files = ','.join([f' file:{file.id}/{file.name} ' for file in project.files.all()])
    return render(request, 'tasks/add_task.html', {'form': form, 'project': project , 'files' : files})

def update_task(request, project_id, task_id):
    project = get_object_or_404(Project, id=project_id)  # Get the project
    task = get_object_or_404(Task, id=task_id, project=project)  

    # Check if the user is the project owner, a coworker, or an admin
    if  request.user != project.owner and  \
        not request.user.is_staff and \
        request.user != task.assigned_to and \
        request.user != task.created_by:
        return HttpResponseForbidden("You do not have permission to view this project.")

    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        form.fields['files'].required = False
        if form.is_valid():
            task = form.save(commit=False)
            task.project = project

            if request.user.is_staff or request.user == task.project.owner:
                if task.assigned_to != task.created_by:
                    task.created_by = request.user

            
            task.save()
            task = assign_files_to_task(request, task , project_id)
            task.save()
            return redirect('tasks:task_list', project_id=project.id)
    else:
        form = TaskForm(instance=task)
    files = ','.join([f' file:{file.id}/{file.name} ' for file in project.files.all()])
    return render(request, 'tasks/update_task.html', {'form': form, 'task': task, 'project': project ,  'files' : files})

def delete_task(request, project_id, task_id):
    project = get_object_or_404(Project, id=project_id)  # Get the project
    task = get_object_or_404(Task, id=task_id, project=project)  # Get the task for the project
    
    
    if  request.user != project.owner and  \
        not request.user.is_staff and \
        request.user != task.created_by:
        return HttpResponseForbidden("You do not have permission to view this project.")
    
    task.delete()
    return redirect('tasks:task_list', project_id=project.id)
