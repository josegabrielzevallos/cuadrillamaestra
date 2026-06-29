from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ContactRequestViewSet

router = DefaultRouter()
router.register(r'contact-requests', ContactRequestViewSet, basename='contact-request')

urlpatterns = [
    path('', include(router.urls)),
]
