"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from flask import redirect
from django.views.generic.base import RedirectView


urlpatterns = [
    path("", RedirectView.as_view(url="/projects/list/")),  # Redirect root URL to /tasks/
    path("accounts/", include('accounts.urls' , namespace='accounts')),
    path('events/', include('events.urls')),
    path("accounts/", include("django.contrib.auth.urls")),
    path('projects/', include('projects.urls')),
    path('files/', include('files.urls')),
    path('', include('tasks.urls')),
    # path('', include('writeups.urls')),
    path('', include('md_writeup.urls' , namespace='writeups')  ),
    path("admin/", admin.site.urls),
    
]


if settings.DEBUG:  # This serves media files only in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
