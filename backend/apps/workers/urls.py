from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, ServiceViewSet, WorkerViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'workers', WorkerViewSet, basename='worker')

urlpatterns = [
    path('', include(router.urls)),
]
