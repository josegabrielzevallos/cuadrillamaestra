from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, parsers, filters
from rest_framework.exceptions import PermissionDenied

from apps.accounts.permissions import IsOwnerOrReadOnly
from .models import Project, ProjectPhoto
from .serializers import (
    ProjectSerializer, ProjectWriteSerializer, ProjectPhotoSerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    """CRUD de proyectos realizados. Lectura pública, escritura solo del dueño."""
    queryset = (
        Project.objects.select_related('worker__user', 'service')
        .prefetch_related('photos').all()
    )
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['worker', 'service']
    search_fields = ['title', 'description', 'location']

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return ProjectWriteSerializer
        return ProjectSerializer

    def perform_create(self, serializer):
        worker = serializer.validated_data.get('worker')
        if not self.request.user.is_staff and worker.user_id != self.request.user.id:
            raise PermissionDenied('Solo puedes publicar proyectos en tu propio perfil.')
        serializer.save()


class ProjectPhotoViewSet(viewsets.ModelViewSet):
    queryset = ProjectPhoto.objects.select_related('project').all()
    serializer_class = ProjectPhotoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project', 'kind']
