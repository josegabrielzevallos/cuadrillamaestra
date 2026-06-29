from django.conf import settings
from django.db import models
from django.db.models import Avg, Count
from django.utils.text import slugify


class Category(models.Model):
    """
    Categoría de oficio/servicio: Gasfitería, Electricidad, Pintura,
    Albañilería, Mayólica, Remodelaciones, Mano de obra general, etc.
    """
    name = models.CharField('Nombre', max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField('Descripción', blank=True)
    icon = models.CharField(
        'Ícono', max_length=50, blank=True,
        help_text='Nombre del ícono usado en el frontend, ej: "plumbing".'
    )

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Service(models.Model):
    """
    Servicio puntual que se puede ofrecer dentro de una categoría.
    Ej: "Instalación de mayólica", "Detección de fugas", "Pintado de fachadas".
    """
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='services',
        verbose_name='Categoría'
    )
    name = models.CharField('Nombre', max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField('Descripción', blank=True)

    class Meta:
        verbose_name = 'Servicio'
        verbose_name_plural = 'Servicios'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f'{self.category_id}-{self.name}')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Worker(models.Model):
    """
    Perfil público de un obrero o maestro de obra.

    Solo expone datos no sensibles. La información privada (DNI, dirección
    exacta, documentos) vive en el modelo User o en el panel administrativo.
    """

    class WorkerType(models.TextChoices):
        OBRERO = 'obrero', 'Obrero'
        MAESTRO = 'maestro', 'Maestro de obra'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='worker_profile', verbose_name='Usuario'
    )
    worker_type = models.CharField(
        'Tipo', max_length=20, choices=WorkerType.choices,
        default=WorkerType.OBRERO
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='workers', verbose_name='Oficio principal'
    )
    services = models.ManyToManyField(
        Service, blank=True, related_name='workers',
        verbose_name='Servicios que ofrece'
    )
    headline = models.CharField(
        'Oficio / especialidad', max_length=120, blank=True,
        help_text='Ej: "Gasfitero certificado", "Maestro albañil".'
    )
    bio = models.TextField('Descripción profesional', blank=True)
    work_zone = models.CharField('Zona de trabajo', max_length=150, blank=True)
    years_experience = models.PositiveIntegerField('Años de experiencia', default=0)
    profile_image = models.ImageField(
        'Foto de perfil', upload_to='workers/profiles/', blank=True, null=True
    )

    # Privacidad: el teléfono/WhatsApp solo se muestra si el trabajador acepta.
    show_phone = models.BooleanField('Mostrar teléfono/WhatsApp', default=False)

    # Validación interna de Cuadrilla Maestra.
    is_verified = models.BooleanField('Verificado por Cuadrilla Maestra', default=False)
    is_active = models.BooleanField('Perfil activo', default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Obrero / Maestro'
        verbose_name_plural = 'Obreros y maestros'
        ordering = ['-is_verified', '-created_at']

    def __str__(self):
        return f'{self.user.full_name} — {self.headline or self.get_worker_type_display()}'

    # --- Métricas calculadas (reseñas de clientes) ---
    @property
    def average_rating(self):
        agg = self.client_reviews.aggregate(avg=Avg('rating'))
        return round(agg['avg'] or 0, 1)

    @property
    def reviews_count(self):
        return self.client_reviews.count()

    @property
    def projects_count(self):
        return self.projects.count()

    @property
    def public_phone(self):
        """Teléfono solo si el trabajador aceptó mostrarlo."""
        return self.user.phone if self.show_phone else ''
