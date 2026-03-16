from rest_framework import serializers
from .models import Movie, Theater, Showtime, Booking


class MovieSerializer(serializers.ModelSerializer):
    """Serializer for Movie model."""
    class Meta:
        model = Movie
        fields = ['id', 'title', 'description', 'duration', 'poster_url', 'genre', 'release_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TheaterSerializer(serializers.ModelSerializer):
    """Serializer for Theater model."""
    class Meta:
        model = Theater
        fields = ['id', 'name', 'total_seats', 'rows', 'seats_per_row']
        read_only_fields = ['id']


class ShowtimeSerializer(serializers.ModelSerializer):
    """Serializer for Showtime model."""
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    theater_name = serializers.CharField(source='theater.name', read_only=True)
    
    class Meta:
        model = Showtime
        fields = ['id', 'movie', 'movie_title', 'theater', 'theater_name', 
                  'show_date', 'show_time', 'price', 'available_seats', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'available_seats', 'created_at', 'updated_at']


class ShowtimeDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Showtime model with nested objects."""
    movie = MovieSerializer(read_only=True)
    theater = TheaterSerializer(read_only=True)
    
    class Meta:
        model = Showtime
        fields = ['id', 'movie', 'theater', 'show_date', 'show_time', 'price', 
                  'available_seats', 'created_at', 'updated_at']
        read_only_fields = ['id', 'available_seats', 'created_at', 'updated_at']


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for Booking model."""
    showtime_details = ShowtimeSerializer(source='showtime', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'showtime', 'showtime_details', 'customer_name', 'customer_email',
                  'customer_phone', 'seats_booked', 'total_price', 'status', 
                  'booking_date', 'updated_at']
        read_only_fields = ['id', 'status', 'booking_date', 'updated_at']


class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a booking."""
    class Meta:
        model = Booking
        fields = ['showtime', 'customer_name', 'customer_email', 
                  'customer_phone', 'seats_booked', 'total_price']
    
    def validate_seats_booked(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError("At least one seat must be selected.")
        return value
