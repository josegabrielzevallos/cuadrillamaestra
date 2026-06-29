from rest_framework import serializers

from apps.projects.serializers import ProjectSerializer
from apps.reviews.serializers import ClientReviewSerializer, SupervisorEvaluationSerializer

from .models import Category, Service, Worker


class CategorySerializer(serializers.ModelSerializer):
    services_count = serializers.IntegerField(source='services.count', read_only=True)
    workers_count = serializers.IntegerField(source='workers.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon',
                  'services_count', 'workers_count']


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'category', 'category_name', 'name', 'slug', 'description']


class WorkerCardSerializer(serializers.ModelSerializer):
    """Datos públicos y seguros para mostrar en las cards de resultados."""
    name = serializers.CharField(source='user.full_name', read_only=True)
    worker_type_display = serializers.CharField(source='get_worker_type_display', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True, default='')
    services = ServiceSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    reviews_count = serializers.IntegerField(read_only=True)
    projects_count = serializers.IntegerField(read_only=True)
    public_phone = serializers.CharField(read_only=True)

    class Meta:
        model = Worker
        fields = [
            'id', 'name', 'worker_type', 'worker_type_display', 'headline',
            'category', 'category_name', 'services', 'work_zone',
            'years_experience', 'profile_image', 'average_rating',
            'reviews_count', 'projects_count', 'is_verified',
            'show_phone', 'public_phone',
        ]


class WorkerDetailSerializer(WorkerCardSerializer):
    """Detalle completo del trabajador: bio, proyectos, reseñas y evaluación."""
    bio = serializers.CharField(read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    client_reviews = ClientReviewSerializer(many=True, read_only=True)
    supervisor_evaluation = SupervisorEvaluationSerializer(read_only=True)

    class Meta(WorkerCardSerializer.Meta):
        fields = WorkerCardSerializer.Meta.fields + [
            'bio', 'projects', 'client_reviews', 'supervisor_evaluation',
        ]


class WorkerWriteSerializer(serializers.ModelSerializer):
    """Crear/editar el perfil de un trabajador."""

    class Meta:
        model = Worker
        fields = [
            'id', 'user', 'worker_type', 'category', 'services', 'headline',
            'bio', 'work_zone', 'years_experience', 'profile_image', 'show_phone',
        ]
        read_only_fields = ['user']

    def create(self, validated_data):
        user = self.context['request'].user
        services = validated_data.pop('services', None)
        worker, _ = Worker.objects.get_or_create(user=user)
        for attr, value in validated_data.items():
            setattr(worker, attr, value)
        worker.save()
        if services is not None:
            worker.services.set(services)
        return worker
