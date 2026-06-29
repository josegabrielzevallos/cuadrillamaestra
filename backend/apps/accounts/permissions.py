from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permite lectura a cualquiera; la escritura solo al dueño del recurso.

    El dueño se resuelve a partir de `obj.user` o `obj.worker.user`,
    de modo que sirve tanto para perfiles de trabajador como para
    recursos asociados (proyectos, fotos, etc.). El staff siempre puede.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_staff:
            return True
        owner = getattr(obj, 'user', None)
        if owner is None:
            worker = getattr(obj, 'worker', None)
            owner = getattr(worker, 'user', None)
        return owner == request.user
