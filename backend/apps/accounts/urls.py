from django.urls import path

from . import views

urlpatterns = [
    path('auth/register/', views.register, name='register'),
    path('auth/me/', views.me, name='me'),
    path('auth/google/', views.google_login, name='google_login'),
]
