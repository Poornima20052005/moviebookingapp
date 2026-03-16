from django.core.management.base import BaseCommand
from bookings.models import Movie, Theater, Showtime
from datetime import date, time, timedelta
from decimal import Decimal


class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        # Clear existing data
        Showtime.objects.all().delete()
        Theater.objects.all().delete()
        Movie.objects.all().delete()
        
        self.stdout.write('Creating movies...')
        
        # Create movies
        movies = [
            Movie(
                title="The Grand Adventure",
                description="An epic journey across magical lands where heroes rise and destiny awaits.",
                duration=145,
                genre="Adventure",
                release_date=date.today() - timedelta(days=30),
                poster_url="https://via.placeholder.com/300x450/3498db/ffffff?text=Grand+Adventure"
            ),
            Movie(
                title="Midnight Mystery",
                description="A gripping thriller that will keep you on the edge of your seat until the very end.",
                duration=120,
                genre="Thriller",
                release_date=date.today() - timedelta(days=14),
                poster_url="https://via.placeholder.com/300x450/2c3e50/ffffff?text=Midnight+Mystery"
            ),
            Movie(
                title="Laughing Matters",
                description="A hilarious comedy about family, friends, and the chaos that ensues.",
                duration=95,
                genre="Comedy",
                release_date=date.today() - timedelta(days=7),
                poster_url="https://via.placeholder.com/300x450/f39c12/ffffff?text=Laughing+Matters"
            ),
            Movie(
                title="Stars Beyond",
                description="A breathtaking sci-fi adventure exploring the furthest reaches of the universe.",
                duration=165,
                genre="Sci-Fi",
                release_date=date.today() - timedelta(days=3),
                poster_url="https://via.placeholder.com/300x450/8e44ad/ffffff?text=Stars+Beyond"
            ),
            Movie(
                title="Heartfelt Moments",
                description="A touching drama about love, loss, and finding hope in the darkest times.",
                duration=130,
                genre="Drama",
                release_date=date.today(),
                poster_url="https://via.placeholder.com/300x450/e74c3c/ffffff?text=Heartfelt"
            ),
        ]
        
        Movie.objects.bulk_create(movies)
        
        self.stdout.write('Creating theaters...')
        
        # Create theaters
        theaters = [
            Theater(name="Main Hall", total_seats=100, rows=10, seats_per_row=10),
            Theater(name="VIP Screen", total_seats=50, rows=5, seats_per_row=10),
            Theater(name="Family Theater", total_seats=80, rows=8, seats_per_row=10),
        ]
        
        Theater.objects.bulk_create(theaters)
        
        self.stdout.write('Creating showtimes...')
        
        # Create showtimes
        showtimes = []
        times = [time(10, 0), time(13, 0), time(16, 0), time(19, 0), time(22, 0)]
        prices = [Decimal('250.00'), Decimal('300.00'), Decimal('350.00'), Decimal('400.00'), Decimal('350.00')]
        
        for movie in Movie.objects.all():
            for i, theater in enumerate(Theater.objects.all()):
                for j, show_time in enumerate(times[:3]):  # 3 showtimes per day
                    show_date = date.today() + timedelta(days=j)
                    showtimes.append(Showtime(
                        movie=movie,
                        theater=theater,
                        show_date=show_date,
                        show_time=show_time,
                        price=prices[j],
                        available_seats=theater.total_seats
                    ))
        
        Showtime.objects.bulk_create(showtimes)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(movies)} movies, {len(theaters)} theaters, and {len(showtimes)} showtimes'))
