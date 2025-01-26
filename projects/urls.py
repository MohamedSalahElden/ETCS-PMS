from django.urls import include, path
from . import views

app_name = 'projects'

urlpatterns = [
    path('create/', views.create_project, name='create_project'),
    path('<int:project_id>/', views.project_dashboard, name='project_dashboard'),
    path('<int:project_id>/modify/', views.modify_project, name='modify_project'),
    path('<int:project_id>/delete/', views.delete_project, name='delete_project'),
    path('list/', views.project_list, name='project_list'),  # Add this line
    path('files/', include('files.urls')),
    path('tasks/', include('tasks.urls')),  # Ensure this is correct
    # path('writeups/', include('writeups.urls')),  # Ensure this is correct
]
