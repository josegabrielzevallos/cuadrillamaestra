from django.db.models import Avg, Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, permissions, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import IsOwnerOrReadOnly
from .models import Category, Service, Worker
from .serializers import (
    CategorySerializer, ServiceSerializer,
    WorkerCardSerializer, WorkerDetailSerializer, WorkerWriteSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.select_related('category').all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description', 'category__name']


class WorkerViewSet(viewsets.ModelViewSet):
    """
    Listado, búsqueda, filtros y detalle de obreros y maestros.

    Búsqueda principal:    /api/workers/?query=gasfitero
    Filtros disponibles:   category, work_zone, min_rating,
                           min_experience, service
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['years_experience', 'created_at', 'avg_rating']
    ordering = ['-is_verified', '-avg_rating']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return WorkerDetailSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return WorkerWriteSerializer
        return WorkerCardSerializer

    def get_queryset(self):
        qs = (
            Worker.objects.filter(is_active=True)
            .select_related('user', 'category')
            .prefetch_related('services')
            .annotate(
                avg_rating=Avg('client_reviews__rating'),
                num_reviews=Count('client_reviews', distinct=True),
            )
        )
        params = self.request.query_params

        # Búsqueda por palabra clave (oficio, servicios, nombre, zona).
        query = params.get('query') or params.get('search')
        if query:
            qs = qs.filter(
                Q(headline__icontains=query)
                | Q(bio__icontains=query)
                | Q(category__name__icontains=query)
                | Q(services__name__icontains=query)
                | Q(work_zone__icontains=query)
                | Q(user__first_name__icontains=query)
                | Q(user__last_name__icontains=query)
            ).distinct()

        # Filtros.
        category = params.get('category')
        if category:
            if category.isdigit():
                qs = qs.filter(category_id=category)
            else:
                qs = qs.filter(category__slug=category)

        zone = params.get('work_zone') or params.get('zone')
        if zone:
            qs = qs.filter(work_zone__icontains=zone)

        service = params.get('service')
        if service:
            if service.isdigit():
                qs = qs.filter(services__id=service)
            else:
                qs = qs.filter(services__name__icontains=service)
            qs = qs.distinct()

        min_rating = params.get('min_rating')
        if min_rating:
            try:
                qs = qs.filter(avg_rating__gte=float(min_rating))
            except ValueError:
                pass

        min_experience = params.get('min_experience')
        if min_experience:
            try:
                qs = qs.filter(years_experience__gte=int(min_experience))
            except ValueError:
                pass

        worker_type = params.get('worker_type')
        if worker_type:
            qs = qs.filter(worker_type=worker_type)

        return qs

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Perfil del trabajador autenticado."""
        try:
            worker = Worker.objects.get(user=request.user)
        except Worker.DoesNotExist:
            return Response({'detail': 'No tienes un perfil de trabajador.'}, status=404)
        return Response(WorkerDetailSerializer(worker, context={'request': request}).data)
