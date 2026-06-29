"""
URLs principales de Cuadrilla Maestra.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),

    # Autenticación JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # APIs del proyecto
    path('api/', include('apps.accounts.urls')),
    path('api/', include('apps.workers.urls')),
    path('api/', include('apps.projects.urls')),
    path('api/', include('apps.reviews.urls')),
    path('api/', include('apps.contacts.urls')),
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
