from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Movie, Theater, Showtime, Booking
from .serializers import (
    MovieSerializer, TheaterSerializer, ShowtimeSerializer,
    ShowtimeDetailSerializer, BookingSerializer, BookingCreateSerializer
)


class MovieViewSet(viewsets.ModelViewSet):
    """ViewSet for Movie model."""
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        genre = self.request.query_params.get('genre')
        if genre:
            queryset = queryset.filter(genre__iexact=genre)
        return queryset


class TheaterViewSet(viewsets.ModelViewSet):
    """ViewSet for Theater model."""
    queryset = Theater.objects.all()
    serializer_class = TheaterSerializer


class ShowtimeViewSet(viewsets.ModelViewSet):
    """ViewSet for Showtime model."""
    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ShowtimeDetailSerializer
        return ShowtimeSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        movie_id = self.request.query_params.get('movie')
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(show_date=date)
        return queryset


class BookingViewSet(viewsets.ModelViewSet):
    """ViewSet for Booking model."""
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        email = self.request.query_params.get('email')
        if email:
            queryset = queryset.filter(customer_email=email)
        return queryset
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        showtime = serializer.validated_data['showtime']
        seats_booked = serializer.validated_data['seats_booked']
        
        # Check seat availability
        if len(seats_booked) > showtime.available_seats:
            return Response(
                {'error': 'Not enough seats available'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if seats are already booked
        existing_bookings = Booking.objects.filter(
            showtime=showtime,
            status__in=[Booking.PENDING, Booking.CONFIRMED]
        )
        booked_seats = set()
        for booking in existing_bookings:
            booked_seats.update(booking.seats_booked)
        
        for seat in seats_booked:
            if seat in booked_seats:
                return Response(
                    {'error': f'Seat {seat} is already booked'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Create booking
        booking = serializer.save()
        
        # Update available seats
        showtime.available_seats -= len(seats_booked)
        showtime.save()
        
        # Auto-confirm booking
        booking.status = Booking.CONFIRMED
        booking.save()
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking."""
        booking = self.get_object()
        if booking.status == Booking.CANCELLED:
            return Response(
                {'error': 'Booking is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Restore available seats
        showtime = booking.showtime
        showtime.available_seats += len(booking.seats_booked)
        showtime.save()
        
        booking.status = Booking.CANCELLED
        booking.save()
        
        return Response(BookingSerializer(booking).data)
