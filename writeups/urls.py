# URLs for Writeup App
from django.urls import path
from . import views

app_name = 'writeups'

urlpatterns = [
    # view writeup 
    path('projects/<int:project_id>/writeups/', views.writeup_list, name='writeup_list'),
    path('projects/<int:project_id>/writeups/<int:writeup_id>/', views.writeup_detail, name='writeup'),
    
    
    # delete writeup file
    path('projects/<int:project_id>/writeups/<int:writeup_id>/file/<int:file_id>/delete/', views.delete_writeup_file, name='delete_writeup_file'),
    path('projects/<int:project_id>/writeups/<int:writeup_id>/delete', views.delete_writeup, name='delete_writeup'),
    
    # edit writeup
    path('projects/<int:project_id>/writeups/<int:writeup_id>/editor/', views.writeup_editor, name='writeup_editor'),
    path('projects/<int:project_id>/writeups/<int:writeup_id>/update', views.writeup_Update, name='writeup_Update'),

    # create new writeup
    path('projects/<int:project_id>/writeups/upload/', views.upload_writeup_files, name='upload_writeup_files'),
    path('projects/<int:project_id>/writeups/create/', views.create_new_writeup, name='create_new_writeup'),
    path('projects/<int:project_id>/writeups/<int:writeup_id>/upload/', views.upload_and_link_writeup_files, name='upload_and_link_writeup_files'),
]

