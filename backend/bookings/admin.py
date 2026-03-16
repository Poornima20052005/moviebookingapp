from django.contrib import admin
from .models import Movie, Theater, Showtime, Booking


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['title', 'genre', 'duration', 'release_date', 'created_at']
    list_filter = ['genre', 'release_date']
    search_fields = ['title', 'description']


@admin.register(Theater)
class TheaterAdmin(admin.ModelAdmin):
    list_display = ['name', 'total_seats', 'rows', 'seats_per_row']
    search_fields = ['name']


@admin.register(Showtime)
class ShowtimeAdmin(admin.ModelAdmin):
    list_display = ['movie', 'theater', 'show_date', 'show_time', 'price', 'available_seats']
    list_filter = ['show_date', 'theater']
    search_fields = ['movie__title', 'theater__name']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'showtime', 'customer_name', 'customer_email', 'total_price', 'status', 'booking_date']
    list_filter = ['status', 'booking_date']
    search_fields = ['customer_name', 'customer_email']
    readonly_fields = ['booking_date', 'updated_at']
