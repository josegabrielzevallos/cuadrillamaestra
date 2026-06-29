"""Configuración ASGI para Cuadrilla Maestra."""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cuadrillamaestra.settings')
application = get_asgi_application()
