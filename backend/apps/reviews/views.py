from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions

from .models import ClientReview, SupervisorEvaluation
from .serializers import ClientReviewSerializer, SupervisorEvaluationSerializer


class ClientReviewViewSet(viewsets.ModelViewSet):
    """Reseñas de clientes. Cualquiera puede dejar una reseña."""
    queryset = ClientReview.objects.select_related('worker__user').all()
    serializer_class = ClientReviewSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['worker', 'rating']

    def perform_create(self, serializer):
        author = self.request.user if self.request.user.is_authenticated else None
        serializer.save(author=author)


class SupervisorEvaluationViewSet(viewsets.ModelViewSet):
    """
    Evaluaciones de supervisores de Cuadrilla Maestra.
    Solo personal autenticado puede crearlas o editarlas.
    """
    queryset = SupervisorEvaluation.objects.select_related('worker__user').all()
    serializer_class = SupervisorEvaluationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['worker']

    def perform_create(self, serializer):
        serializer.save(supervisor=self.request.user)
