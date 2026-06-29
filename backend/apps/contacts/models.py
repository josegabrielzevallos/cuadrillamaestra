from django.db import models

from apps.workers.models import Worker, Service


class ContactRequest(models.Model):
    """Solicitud de contacto o cotización enviada por un cliente."""

    class RequestType(models.TextChoices):
        CONTACT = 'contact', 'Contacto'
        QUOTE = 'quote', 'Cotización'

    class Status(models.TextChoices):
        NEW = 'new', 'Nueva'
        IN_PROGRESS = 'in_progress', 'En proceso'
        CLOSED = 'closed', 'Cerrada'

    worker = models.ForeignKey(
        Worker, on_delete=models.CASCADE, related_name='contact_requests',
        verbose_name='Trabajador / maestro'
    )
    service = models.ForeignKey(
        Service, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='contact_requests', verbose_name='Servicio de interés'
    )
    request_type = models.CharField(
        'Tipo', max_length=10, choices=RequestType.choices, default=RequestType.QUOTE
    )
    client_name = models.CharField('Nombre del cliente', max_length=120)
    client_phone = models.CharField('Teléfono / WhatsApp', max_length=20)
    client_email = models.EmailField('Correo', blank=True)
    zone = models.CharField('Zona / distrito', max_length=150, blank=True)
    message = models.TextField('Mensaje / descripción del trabajo')
    status = models.CharField(
        'Estado', max_length=15, choices=Status.choices, default=Status.NEW
    )
    created_at = models.DateTimeField('Fecha de solicitud', auto_now_add=True)

    class Meta:
        verbose_name = 'Solicitud de contacto / cotización'
        verbose_name_plural = 'Solicitudes de contacto / cotización'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.get_request_type_display()} de {self.client_name} → {self.worker}'
