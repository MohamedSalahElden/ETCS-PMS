from django.urls import path
from . import views

app_name = 'tasks'

urlpatterns = [
    path('projects/<int:project_id>/tasks/', views.task_list, name='task_list'),
    path('projects/<int:project_id>/tasks/<int:task_id>/', views.task_detail, name='task_detail'),
    path('projects/<int:project_id>/tasks/add/', views.add_task, name='add_task'),
    path('projects/<int:project_id>/tasks/<int:task_id>/update', views.update_task, name='update_task'),
    path('projects/<int:project_id>/tasks/<int:task_id>/delete', views.delete_task, name='delete_task'),
]
