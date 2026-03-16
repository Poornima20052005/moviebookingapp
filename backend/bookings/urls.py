from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MovieViewSet, TheaterViewSet, ShowtimeViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'movies', MovieViewSet)
router.register(r'theaters', TheaterViewSet)
router.register(r'showtimes', ShowtimeViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
