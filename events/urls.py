from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    path('<int:project_id>/', views.event_list, name='event_list'),
    path('<int:project_id>/create/', views.create_event, name='create_event'),
    path('<int:project_id>/<int:event_id>/edit/', views.modify_event, name='modify_event'),
    path('<int:project_id>/<int:event_id>/delete/', views.delete_event, name='delete_event'),
]
