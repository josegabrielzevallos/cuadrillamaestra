from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Representación pública/segura del usuario."""
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'role', 'phone',
        ]
        read_only_fields = ['id', 'role']


class RegisterSerializer(serializers.ModelSerializer):
    """Registro de usuarios (cliente o trabajador)."""
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password',
            'first_name', 'last_name', 'role', 'phone',
        ]

    def validate_role(self, value):
        # No se permite auto-registrarse como admin o supervisor.
        if value in (User.Roles.ADMIN, User.Roles.SUPERVISOR):
            raise serializers.ValidationError(
                'No puedes registrarte con ese rol.'
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        # Crea automáticamente el perfil de trabajador para que pueda
        # publicar proyectos y aparecer en las búsquedas.
        if user.role == User.Roles.WORKER:
            from apps.workers.models import Worker
            Worker.objects.get_or_create(user=user)
        return user
