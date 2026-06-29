from django.db import models

from apps.workers.models import Worker, Service


class Project(models.Model):
    """Proyecto/trabajo realizado por un obrero o maestro."""
    worker = models.ForeignKey(
        Worker, on_delete=models.CASCADE, related_name='projects',
        verbose_name='Trabajador / maestro'
    )
    service = models.ForeignKey(
        Service, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='projects', verbose_name='Tipo de servicio'
    )
    title = models.CharField('Título del proyecto', max_length=150)
    description = models.TextField('Descripción', blank=True)
    location = models.CharField('Ubicación aproximada', max_length=150, blank=True)
    work_date = models.DateField('Fecha del trabajo', null=True, blank=True)
    cover_image = models.ImageField(
        'Foto de portada', upload_to='projects/covers/', blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'
        ordering = ['-work_date', '-created_at']

    def __str__(self):
        return f'{self.title} — {self.worker.user.full_name}'


class ProjectPhoto(models.Model):
    """Foto del proyecto (antes / después / general)."""

    class PhotoKind(models.TextChoices):
        BEFORE = 'before', 'Antes'
        AFTER = 'after', 'Después'
        GENERAL = 'general', 'General'

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='photos',
        verbose_name='Proyecto'
    )
    image = models.ImageField('Imagen', upload_to='projects/photos/')
    kind = models.CharField(
        'Tipo de foto', max_length=10, choices=PhotoKind.choices,
        default=PhotoKind.GENERAL
    )
    caption = models.CharField('Descripción corta', max_length=150, blank=True)

    class Meta:
        verbose_name = 'Foto de proyecto'
        verbose_name_plural = 'Fotos de proyectos'

    def __str__(self):
        return f'{self.project.title} [{self.get_kind_display()}]'
