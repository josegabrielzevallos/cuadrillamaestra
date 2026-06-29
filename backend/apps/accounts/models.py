from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Usuario base de Cuadrilla Maestra.

    Un mismo modelo de usuario sirve para clientes, trabajadores
    (obreros/maestros), supervisores y administradores. El rol define
    qué puede hacer cada quien dentro de la plataforma.
    """

    class Roles(models.TextChoices):
        CLIENT = 'client', 'Cliente'
        WORKER = 'worker', 'Obrero / Maestro'
        SUPERVISOR = 'supervisor', 'Supervisor'
        ADMIN = 'admin', 'Administrador'

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.CLIENT,
        verbose_name='Rol',
    )
    phone = models.CharField('Teléfono / WhatsApp', max_length=20, blank=True)
    # Dato sensible: solo visible en el panel administrativo.
    document_number = models.CharField('DNI / Documento', max_length=20, blank=True)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        full = f'{self.first_name} {self.last_name}'.strip()
        return full or self.username

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip() or self.username
