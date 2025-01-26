from .models import Project

def user_projects(request):
    if request.user.is_authenticated:
        # Filter projects where the user is either the owner or in the project_workers field
        projects = Project.objects.filter(project_workers=request.user) | Project.objects.filter(owner=request.user)
        print(projects)
        return {'user_projects': projects.distinct()}  # Use distinct() to avoid duplicate results
    return {'user_projects': []}
