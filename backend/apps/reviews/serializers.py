from rest_framework import serializers

from .models import ClientReview, SupervisorEvaluation


class ClientReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientReview
        fields = [
            'id', 'worker', 'client_name', 'rating', 'comment',
            'service_hired', 'created_at',
        ]
        read_only_fields = ['created_at']

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError('La calificación debe estar entre 1 y 5.')
        return value


class SupervisorEvaluationSerializer(serializers.ModelSerializer):
    overall_score = serializers.FloatField(read_only=True)
    # Marca para que el frontend lo diferencie visualmente.
    is_supervisor_evaluation = serializers.SerializerMethodField()

    class Meta:
        model = SupervisorEvaluation
        fields = [
            'id', 'worker', 'supervisor_name', 'punctuality', 'work_quality',
            'cleanliness', 'safety', 'customer_treatment', 'comment',
            'overall_score', 'evaluated_at', 'is_supervisor_evaluation',
        ]
        read_only_fields = ['evaluated_at']

    def get_is_supervisor_evaluation(self, obj):
        return True
