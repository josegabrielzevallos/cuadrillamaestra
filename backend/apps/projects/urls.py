from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet, ProjectPhotoViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'project-photos', ProjectPhotoViewSet, basename='project-photo')

urlpatterns = [
    path('', include(router.urls)),
]
