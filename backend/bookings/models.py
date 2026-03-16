from django.db import models
from django.utils import timezone


class Movie(models.Model):
    """Model representing a movie."""
    title = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.IntegerField(help_text="Duration in minutes")
    poster_url = models.URLField(blank=True, null=True)
    genre = models.CharField(max_length=100)
    release_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-release_date']

    def __str__(self):
        return self.title


class Theater(models.Model):
    """Model representing a theater screen."""
    name = models.CharField(max_length=100)
    total_seats = models.IntegerField(default=100)
    rows = models.IntegerField(default=10)
    seats_per_row = models.IntegerField(default=10)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Showtime(models.Model):
    """Model representing a movie showtime."""
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='showtimes')
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, related_name='showtimes')
    show_date = models.DateField()
    show_time = models.TimeField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    available_seats = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['show_date', 'show_time']
        unique_together = ['movie', 'theater', 'show_date', 'show_time']

    def __str__(self):
        return f"{self.movie.title} - {self.show_date} {self.show_time}"

    def save(self, *args, **kwargs):
        if self.available_seats is None:
            self.available_seats = self.theater.total_seats
        super().save(*args, **kwargs)


class Booking(models.Model):
    """Model representing a movie booking."""
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    CANCELLED = 'cancelled'

    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (CONFIRMED, 'Confirmed'),
        (CANCELLED, 'Cancelled'),
    ]

    showtime = models.ForeignKey(Showtime, on_delete=models.CASCADE, related_name='bookings')
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    seats_booked = models.JSONField(help_text="List of seat numbers, e.g., ['A1', 'A2']")
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    booking_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-booking_date']

    def __str__(self):
        return f"Booking {self.id} - {self.customer_name} - {self.showtime.movie.title}"
