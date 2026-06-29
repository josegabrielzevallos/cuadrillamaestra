from django.contrib import admin

from .models import ClientReview, SupervisorEvaluation


@admin.register(ClientReview)
class ClientReviewAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'worker', 'rating', 'service_hired', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('client_name', 'comment')


@admin.register(SupervisorEvaluation)
class SupervisorEvaluationAdmin(admin.ModelAdmin):
    list_display = ('worker', 'supervisor_name', 'overall_score', 'evaluated_at')
    search_fields = ('worker__user__first_name', 'worker__user__last_name', 'supervisor_name')
