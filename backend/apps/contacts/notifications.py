"""Envío de correos de notificación para solicitudes de contacto/cotización."""
import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def notify_worker_new_request(contact_request):
    """
    Avisa por correo al trabajador que tiene una nueva solicitud.

    Falla en silencio (solo registra) para no romper la respuesta al cliente
    si el servidor de correo no está disponible.
    """
    worker = contact_request.worker
    recipient = getattr(worker.user, 'email', '') or ''
    if not recipient:
        return

    tipo = contact_request.get_request_type_display()
    asunto = f'Nueva {tipo.lower()} de {contact_request.client_name}'
    cuerpo = (
        f'Hola {worker.user.full_name},\n\n'
        f'Has recibido una nueva {tipo.lower()} en Cuadrilla Maestra.\n\n'
        f'Cliente: {contact_request.client_name}\n'
        f'Teléfono: {contact_request.client_phone}\n'
        f'Correo: {contact_request.client_email or "—"}\n'
        f'Zona: {contact_request.zone or "—"}\n'
        f'Mensaje: {contact_request.message}\n\n'
        f'Ingresa a tu panel para responder.\n'
    )
    try:
        send_mail(
            asunto, cuerpo, settings.DEFAULT_FROM_EMAIL, [recipient],
            fail_silently=True,
        )
    except Exception:
        logger.exception('No se pudo enviar la notificación de solicitud.')
