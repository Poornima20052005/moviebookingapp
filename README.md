# Movie Booking App

A full-stack movie booking application built with React.js frontend and Django REST API backend.

## Project Structure

```
webapp/
├── backend/                 # Django REST API
│   ├── manage.py
│   ├── moviebooking/        # Django project
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── bookings/            # Django app
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── management/commands/seed_data.py
│
└── frontend/                # React.js frontend
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js
        ├── App.css
        ├── context/
        │   └── BookingContext.js
        ├── components/
        │   ├── MovieList.js
        │   ├── ShowtimeSelection.js
        │   ├── SeatBooking.js
        │   └── BookingConfirmation.js
        └── services/
            └── api.js
```

## Features

- Browse movies with poster, genre, duration, and description
- View available showtimes for each movie
- Select preferred date and time
- Interactive seat selection (10x10 grid)
- Customer information form
- Booking confirmation with details
- RESTful API with Django REST Framework
- CORS support for cross-origin requests

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Seed sample data:
   ```bash
   python manage.py seed_data
   ```

7. Start the Django server:
   ```bash
   python manage.py runserver
   ```

The backend will run at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The frontend will run at `http://localhost:3000`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/movies/` | GET | List all movies |
| `/api/movies/{id}/` | GET | Get movie details |
| `/api/showtimes/` | GET | List showtimes (filter by movie) |
| `/api/showtimes/{id}/` | GET | Get showtime details |
| `/api/bookings/` | GET, POST | List/create bookings |
| `/api/bookings/{id}/` | GET | Get booking details |
| `/api/bookings/{id}/cancel/` | POST | Cancel a booking |

## Technology Stack

### Backend
- Django 4.2+
- Django REST Framework
- SQLite (default database)
- django-cors-headers

### Frontend
- React 18
- React Router 6
- Axios
- CSS3

## Usage

1. Start the backend server first
2. Start the frontend server
3. Open `http://localhost:3000` in your browser
4. Browse movies, select a showtime, choose seats, and book!

## License

MIT
