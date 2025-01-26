from django.urls import path
from . import views

app_name = 'files'

urlpatterns = [
    path('project/<int:project_id>/files/', views.project_files, name='project_files'),
    path('project/<int:project_id>/add/', views.add_file, name='add_file'),
    path('file/<int:file_id>/edit/', views.edit_file, name='edit_file'),
    path('file/<int:file_id>/delete/', views.delete_file, name='delete_file'),
    path('files/download/<int:file_id>/', views.download_file, name='download_file'),
    path("upload_file", views.upload_file, name="upload_file"),
]
