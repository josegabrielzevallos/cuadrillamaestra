from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


def _tokens_for(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserSerializer(user).data,
    }


class RegisterThrottle(ScopedRateThrottle):
    scope = 'register'


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([RegisterThrottle])
def register(request):
    """Registra un nuevo usuario y devuelve sus tokens JWT."""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(_tokens_for(user), status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def me(request):
    """Devuelve o actualiza el perfil del usuario autenticado."""
    if request.method == 'PATCH':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([RegisterThrottle])
def google_login(request):
    """
    Inicia sesión / registra con Google. Recibe el credential (ID token) de
    Google Identity, lo verifica y devuelve tokens JWT de la plataforma.
    """
    from django.conf import settings
    from google.oauth2 import id_token
    from google.auth.transport import requests as g_requests

    credential = request.data.get('credential')
    if not credential:
        return Response({'detail': 'Falta el credential de Google.'}, status=400)
    if not settings.GOOGLE_CLIENT_ID:
        return Response({'detail': 'Login con Google no está configurado.'}, status=503)
    try:
        info = id_token.verify_oauth2_token(
            credential, g_requests.Request(), settings.GOOGLE_CLIENT_ID
        )
    except ValueError:
        return Response({'detail': 'Token de Google inválido.'}, status=400)

    email = (info.get('email') or '').lower()
    if not email:
        return Response({'detail': 'No se obtuvo el correo de Google.'}, status=400)

    role = request.data.get('role')
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'username': email,
            'first_name': info.get('given_name', ''),
            'last_name': info.get('family_name', ''),
            'role': role if role in (User.Roles.CLIENT, User.Roles.WORKER) else User.Roles.CLIENT,
        },
    )
    if created and user.role == User.Roles.WORKER:
        from apps.workers.models import Worker
        Worker.objects.get_or_create(user=user)
    return Response(_tokens_for(user), status=200)
