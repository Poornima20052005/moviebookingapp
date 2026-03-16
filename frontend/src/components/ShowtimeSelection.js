import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService, showtimeService } from '../services/api';
import { useBooking } from '../context/BookingContext';

const ShowtimeSelection = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { setSelectedMovie, setSelectedShowtime } = useBooking();
  
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, showtimesData] = await Promise.all([
          movieService.getMovie(movieId),
          showtimeService.getShowtimes(movieId)
        ]);
        
        setMovie(movieData);
        setShowtimes(showtimesData.results || showtimesData);
        
        // Set default date to first available date
        if (showtimesData.results && showtimesData.results.length > 0) {
          const dates = [...new Set(showtimesData.results.map(s => s.show_date))];
          if (dates.length > 0) {
            setSelectedDate(dates[0]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load showtimes. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  const handleShowtimeClick = (showtime) => {
    if (showtime.available_seats <= 0) return;
    
    setSelectedMovie(movie);
    setSelectedShowtime(showtime);
    navigate(`/seats/${showtime.id}`);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate()
    };
  };

  if (loading) {
    return <div className="loading">Loading showtimes...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Get unique dates
  const uniqueDates = [...new Set(showtimes.map(s => s.show_date))].sort();

  // Filter showtimes by selected date
  const filteredShowtimes = selectedDate
    ? showtimes.filter(s => s.show_date === selectedDate)
    : [];

  return (
    <div className="showtime-selection">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Movies
      </button>

      {movie && (
        <div className="showtime-header">
          <h2>{movie.title}</h2>
          <p>{movie.genre} • {movie.duration} min</p>
        </div>
      )}

      <div className="showtime-header">
        <h3>Select Date</h3>
        <div className="date-list">
          {uniqueDates.map((date) => {
            const { day, date: dateNum } = formatDate(date);
            return (
              <div
                key={date}
                className={`date-card ${selectedDate === date ? 'active' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="day">{day}</div>
                <div className="date">{dateNum}</div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="showtime-header">
          <h3>Select Showtime</h3>
          <div className="showtime-grid">
            {filteredShowtimes.length === 0 ? (
              <p className="no-showtimes">No showtimes available for this date.</p>
            ) : (
              filteredShowtimes.map((showtime) => (
                <div
                  key={showtime.id}
                  className={`showtime-card ${showtime.available_seats <= 0 ? 'disabled' : ''}`}
                  onClick={() => handleShowtimeClick(showtime)}
                >
                  <div className="time">
                    {new Date(`2000-01-01T${showtime.show_time}`).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                  <div className="price">₹{showtime.price}</div>
                  <div className="seats">
                    {showtime.available_seats > 0 
                      ? `${showtime.available_seats} seats left` 
                      : 'Sold Out'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowtimeSelection;
