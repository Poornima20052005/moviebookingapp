"""
URL configuration for moviebooking project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "Movie Booking API",
        "version": "1.0",
        "endpoints": {
            "movies": "/api/movies/",
            "showtimes": "/api/showtimes/",
            "bookings": "/api/bookings/"
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('bookings.urls')),
    path('', api_root),
]
