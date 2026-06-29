"""
Configuración de Django para el proyecto Cuadrilla Maestra.

Plataforma para ofrecer, buscar y promocionar servicios de construcción,
mantenimiento y remodelación.
"""
import os
from pathlib import Path
from datetime import timedelta
from decouple import config

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: mantén la clave secreta en producción fuera del repositorio.
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-me-in-production')

# SECURITY WARNING: no ejecutes con DEBUG activado en producción.
DEBUG = config('DEBUG', default=False, cast=bool)

_ALLOWED = config('ALLOWED_HOSTS', default='localhost,127.0.0.1')
ALLOWED_HOSTS = [h.strip() for h in _ALLOWED.split(',')]
if not DEBUG:
    ALLOWED_HOSTS += ['.run.app', '.cuadrillamaestra.com']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Terceros
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',

    # Apps del proyecto
    'apps.accounts',
    'apps.workers',
    'apps.projects',
    'apps.reviews',
    'apps.contacts',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'cuadrillamaestra.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'cuadrillamaestra.wsgi.application'
ASGI_APPLICATION = 'cuadrillamaestra.asgi.application'

# Modelo de usuario personalizado
AUTH_USER_MODEL = 'accounts.User'

# Database
_db_host = config('DB_HOST', default='localhost')
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='cuadrillamaestra'),
        'USER': config('DB_USER', default='postgres'),
        'PASSWORD': config('DB_PASSWORD', default='admin123'),
        'HOST': _db_host,
        # Cloud SQL vía Unix socket no usa PORT
        'PORT': '' if _db_host.startswith('/cloudsql') else config('DB_PORT', default='5432'),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'es-pe'
TIME_ZONE = 'America/Lima'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage'},
}

# Media files (imágenes subidas: fotos de perfil, proyectos, etc.)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# En producción los archivos subidos se guardan en Google Cloud Storage
# (Cloud Run no conserva el sistema de archivos entre instancias).
GS_BUCKET_NAME = config('GS_BUCKET_NAME', default='')
if GS_BUCKET_NAME:
    STORAGES['default'] = {
        'BACKEND': 'storages.backends.gcloud.GoogleCloudStorage',
        'OPTIONS': {
            'bucket_name': GS_BUCKET_NAME,
            'querystring_auth': False,
        },
    }
    MEDIA_URL = f'https://storage.googleapis.com/{GS_BUCKET_NAME}/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': config('THROTTLE_ANON', default='60/min'),
        'user': config('THROTTLE_USER', default='1000/day'),
        'register': config('THROTTLE_REGISTER', default='10/hour'),
    },
}

# JWT (SimpleJWT)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# CORS
_CORS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000,http://localhost:8000')
CORS_ALLOWED_ORIGINS = [o.strip() for o in _CORS.split(',') if o.strip()]
if not DEBUG:
    CORS_ALLOWED_ORIGINS += [
        'https://cuadrillamaestra.com',
        'https://www.cuadrillamaestra.com',
        'https://api.cuadrillamaestra.com',
    ]
    CORS_ALLOWED_ORIGIN_REGEXES = [
        r'^https://.*\.run\.app$',
        r'^https://.*\.cuadrillamaestra\.com$',
    ]

# CSRF
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
]
if not DEBUG:
    CSRF_TRUSTED_ORIGINS += [
        'https://cuadrillamaestra.com',
        'https://www.cuadrillamaestra.com',
        'https://api.cuadrillamaestra.com',
        'https://*.run.app',
    ]

# Seguridad en producción
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=False, cast=bool)
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = 'same-origin'
    X_FRAME_OPTIONS = 'DENY'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {'console': {'class': 'logging.StreamHandler'}},
    'root': {'handlers': ['console'], 'level': 'INFO'},
}

# Email (notificaciones). En desarrollo imprime en consola; en producción usa SMTP.
EMAIL_HOST = config('EMAIL_HOST', default='')
if EMAIL_HOST:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
    EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
    EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
    EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
else:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='Cuadrilla Maestra <noreply@cuadrillamaestra.com>')

# Login con Google (Google Identity Services)
GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID', default='')
