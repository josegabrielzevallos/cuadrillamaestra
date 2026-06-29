from django.urls import path

from . import views

urlpatterns = [
    path('auth/register/', views.register, name='register'),
    path('auth/me/', views.me, name='me'),
]
