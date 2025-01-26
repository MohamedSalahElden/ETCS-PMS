from . import views
from django.urls import path
from .views import CustomPasswordChangeView
from django.contrib.auth.views import PasswordChangeView, LogoutView

app_name = 'accounts'
urlpatterns = [
    path('password_change/', PasswordChangeView.as_view(success_url='/accounts/logout/'), name='password_change'),
    path('logout/', views.logout_view, name='logout'),
    path('signup', views.signup, name='signup'),
    path('profile/', views.profile, name='profile'),
    path('profile/edit', views.profile_edit, name='profile_edit'),


    # path('password_change/', CustomPasswordChangeView.as_view(), name='password_change'),
    
    
]
