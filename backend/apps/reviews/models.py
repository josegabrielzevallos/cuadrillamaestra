from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from apps.workers.models import Worker


RATING_VALIDATORS = [MinValueValidator(1), MaxValueValidator(5)]


class ClientReview(models.Model):
    """Reseña dejada por un cliente luego de recibir un servicio."""
    worker = models.ForeignKey(
        Worker, on_delete=models.CASCADE, related_name='client_reviews',
        verbose_name='Trabajador / maestro'
    )
    # Opcional: si la reseña la deja un usuario registrado.
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='reviews_written', verbose_name='Usuario autor'
    )
    client_name = models.CharField('Nombre del cliente', max_length=120)
    rating = models.PositiveSmallIntegerField(
        'Calificación (1-5)', validators=RATING_VALIDATORS
    )
    comment = models.TextField('Comentario', blank=True)
    service_hired = models.CharField('Servicio contratado', max_length=150, blank=True)
    created_at = models.DateTimeField('Fecha', auto_now_add=True)

    class Meta:
        verbose_name = 'Reseña de cliente'
        verbose_name_plural = 'Reseñas de clientes'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.client_name} → {self.worker} ({self.rating}★)'


class SupervisorEvaluation(models.Model):
    """
    Evaluación verificada hecha por un supervisor de Cuadrilla Maestra.

    Se diferencia visualmente de las reseñas normales en el frontend.
    """
    worker = models.OneToOneField(
        Worker, on_delete=models.CASCADE, related_name='supervisor_evaluation',
        verbose_name='Trabajador / maestro'
    )
    supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='evaluations_made', verbose_name='Supervisor'
    )
    supervisor_name = models.CharField('Nombre del supervisor', max_length=120)

    punctuality = models.PositiveSmallIntegerField('Puntualidad', validators=RATING_VALIDATORS)
    work_quality = models.PositiveSmallIntegerField('Calidad del trabajo', validators=RATING_VALIDATORS)
    cleanliness = models.PositiveSmallIntegerField('Limpieza', validators=RATING_VALIDATORS)
    safety = models.PositiveSmallIntegerField('Seguridad', validators=RATING_VALIDATORS)
    customer_treatment = models.PositiveSmallIntegerField('Trato al cliente', validators=RATING_VALIDATORS)

    comment = models.TextField('Comentario del supervisor', blank=True)
    evaluated_at = models.DateField('Fecha de evaluación', auto_now_add=True)

    class Meta:
        verbose_name = 'Evaluación de supervisor'
        verbose_name_plural = 'Evaluaciones de supervisores'

    def __str__(self):
        return f'Evaluación verificada de {self.worker} por {self.supervisor_name}'

    @property
    def overall_score(self):
        criteria = [
            self.punctuality, self.work_quality, self.cleanliness,
            self.safety, self.customer_treatment,
        ]
        return round(sum(criteria) / len(criteria), 1)
