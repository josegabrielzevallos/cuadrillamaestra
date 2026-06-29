from rest_framework import serializers

from .models import Project, ProjectPhoto


class ProjectPhotoSerializer(serializers.ModelSerializer):
    kind_display = serializers.CharField(source='get_kind_display', read_only=True)

    class Meta:
        model = ProjectPhoto
        fields = ['id', 'image', 'kind', 'kind_display', 'caption']


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer de lectura con fotos y datos del trabajador."""
    photos = ProjectPhotoSerializer(many=True, read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True, default='')
    worker_name = serializers.CharField(source='worker.user.full_name', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'worker', 'worker_name', 'service', 'service_name',
            'title', 'description', 'location', 'work_date',
            'cover_image', 'photos', 'created_at',
        ]
        read_only_fields = ['created_at']


class ProjectWriteSerializer(serializers.ModelSerializer):
    """Serializer para crear/actualizar proyectos (incluye carga de fotos)."""
    uploaded_photos = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Project
        fields = [
            'id', 'worker', 'service', 'title', 'description',
            'location', 'work_date', 'cover_image', 'uploaded_photos',
        ]

    def create(self, validated_data):
        photos = validated_data.pop('uploaded_photos', [])
        project = Project.objects.create(**validated_data)
        for img in photos:
            ProjectPhoto.objects.create(project=project, image=img)
        return project
