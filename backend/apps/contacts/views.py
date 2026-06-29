from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions

from .models import ContactRequest
from .serializers import ContactRequestSerializer


class ContactRequestViewSet(viewsets.ModelViewSet):
    """
    Solicitudes de contacto / cotización.

    - Crear: cualquier visitante (AllowAny en create).
    - Listar / editar estado: solo personal autenticado.
    """
    queryset = ContactRequest.objects.select_related('worker__user', 'service').all()
    serializer_class = ContactRequestSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['worker', 'status', 'request_type']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_authenticated and not user.is_staff:
            # Cada trabajador solo ve las solicitudes dirigidas a él.
            qs = qs.filter(worker__user=user)
        return qs

    def perform_create(self, serializer):
        # Las solicitudes nuevas siempre nacen como "nuevas"; el estado solo
        # lo cambia el trabajador/personal mediante PATCH.
        serializer.save(status=ContactRequest.Status.NEW)
