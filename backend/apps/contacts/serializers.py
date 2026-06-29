from rest_framework import serializers

from .models import ContactRequest


class ContactRequestSerializer(serializers.ModelSerializer):
    worker_name = serializers.CharField(source='worker.user.full_name', read_only=True)
    request_type_display = serializers.CharField(
        source='get_request_type_display', read_only=True
    )

    class Meta:
        model = ContactRequest
        fields = [
            'id', 'worker', 'worker_name', 'service', 'request_type',
            'request_type_display', 'client_name', 'client_phone',
            'client_email', 'zone', 'message', 'status', 'created_at',
        ]
        read_only_fields = ['created_at']
