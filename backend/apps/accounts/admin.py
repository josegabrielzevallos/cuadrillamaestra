from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'full_name', 'email', 'role', 'phone', 'is_active')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'document_number')
    fieldsets = UserAdmin.fieldsets + (
        ('Cuadrilla Maestra', {'fields': ('role', 'phone', 'document_number')}),
    )
