from django.contrib.auth.views import PasswordChangeView
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from .forms import CustomPasswordChangeForm
from .models import Profile
from .forms import SignUoForm , UserForm , ProfileForm
from django.contrib.auth import authenticate , login , logout
from django.contrib import messages




def signup(request):
    if request.method == 'POST':
        form = SignUoForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password1"]
            user = authenticate(username=username , password=password)
            login(request , user)
            return redirect('/accounts/profile')
    else:
        form = SignUoForm()

    return render(request , 'registration/signup.html' , {'form' : form})

def profile(request):
    profile = Profile.objects.get(user = request.user)
    return render(request, 'profile/profile.html' , {"profile":profile})

def profile_edit(request):
    profile = Profile.objects.get(user=request.user)
    
    if request.method == "POST":
        userform = UserForm(request.POST, instance=request.user)
        profileform = ProfileForm(request.POST, instance=profile)
        
        if userform.is_valid() and profileform.is_valid():
            userform.save()
            myform = profileform.save(commit=False)
            myform.user = request.user
            myform.save()
            return redirect("/accounts/profile")
        else:
            messages.error(request, "There was an error updating your profile. Please check the form and try again.")
    
    else:
        userform = UserForm(instance=request.user)
        profileform = ProfileForm(instance=profile)
    
    return render(request, 'profile/profile_edit.html', 
                  {
                      'userform': userform,
                      'profileform': profileform,
                  })

def logout_view(request):
    logout(request)
    return redirect('login')  # Change 'login' to the name of your login URL
    
class CustomPasswordChangeView(PasswordChangeView):
    form_class = CustomPasswordChangeForm
    success_url = reverse_lazy('password_change_done')  # Redirect after success
