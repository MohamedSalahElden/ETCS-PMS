# editor/urls.py
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


app_name = 'md_writeups'

urlpatterns = [
    path('projects/<int:project_id>/writeups/create/', views.create_content, name='create_new_writeup'),
    path('upload-image/<int:project_id>/', views.upload_image, name='upload_image'),
    path('upload-file/', views.upload_file, name='upload_file'),
    path('projects/<int:project_id>/writeups/', views.writeup_list, name='writeup_list'),
    path('projects/<int:project_id>/autocomplete/items/', views.autocomplete_items, name='autocomplete_items'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)