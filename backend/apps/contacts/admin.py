from django.contrib import admin

from .models import ContactRequest


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'worker', 'request_type', 'status',
                    'client_phone', 'created_at')
    list_filter = ('request_type', 'status', 'created_at')
    search_fields = ('client_name', 'client_phone', 'message')
    list_editable = ('status',)
