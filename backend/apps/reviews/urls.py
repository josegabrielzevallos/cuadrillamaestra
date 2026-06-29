from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ClientReviewViewSet, SupervisorEvaluationViewSet

router = DefaultRouter()
router.register(r'reviews', ClientReviewViewSet, basename='review')
router.register(r'supervisor-evaluations', SupervisorEvaluationViewSet,
                basename='supervisor-evaluation')

urlpatterns = [
    path('', include(router.urls)),
]
