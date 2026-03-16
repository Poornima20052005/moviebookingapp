import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showtimeService, bookingService } from '../services/api';
import { useBooking } from '../context/BookingContext';

const SeatBooking = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { selectedMovie, selectedShowtime, selectedSeats, setSelectedSeats, customerInfo, setCustomerInfo } = useBooking();
  
  const [showtime, setShowtime] = useState(selectedShowtime);
  const [loading, setLoading] = useState(!selectedShowtime);
  const [error, setError] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [bookingError, setBookingError] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  const rows = 10;
  const seatsPerRow = 10;
  const rowLabels = 'ABCDEFGHIJ'.split('');

  useEffect(() => {
    const fetchShowtime = async () => {
      if (selectedShowtime) {
        setShowtime(selectedShowtime);
        setLoading(false);
        return;
      }

      try {
        const data = await showtimeService.getShowtime(showtimeId);
        setShowtime(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load showtime details.');
        setLoading(false);
      }
    };

    fetchShowtime();
  }, [showtimeId, selectedShowtime]);

  // Generate some random booked seats for demo
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (showtime) {
      const randomBooked = [];
      const numBooked = Math.floor(Math.random() * 30);
      for (let i = 0; i < numBooked; i++) {
        const row = rowLabels[Math.floor(Math.random() * rows)];
        const seat = Math.floor(Math.random() * seatsPerRow) + 1;
        randomBooked.push(`${row}${seat}`);
      }
      setBookedSeats(randomBooked);
    }
  }, [showtime]);

  const toggleSeat = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingError(null);
    setIsBooking(true);

    try {
      const bookingData = {
        showtime: showtime.id,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        seats_booked: selectedSeats,
        total_price: parseFloat(showtime.price) * selectedSeats.length
      };

      const booking = await bookingService.createBooking(bookingData);
      navigate(`/confirmation/${booking.id}`);
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Failed to create booking. Please try again.');
      setIsBooking(false);
    }
  };

  const isFormValid = () => {
    return (
      selectedSeats.length > 0 &&
      customerInfo.name.trim() !== '' &&
      customerInfo.email.trim() !== '' &&
      customerInfo.phone.trim() !== ''
    );
  };

  if (loading) {
    return <div className="loading">Loading seat selection...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!showtime) {
    return <div className="error">Showtime not found</div>;
  }

  return (
    <div className="seat-booking">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="seat-booking-header">
        <h2>{showtime.movie?.title || selectedMovie?.title}</h2>
        <p>
          {new Date(showtime.show_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} • {' '}
          {new Date(`2000-01-01T${showtime.show_time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </p>
        <p>Theater: {showtime.theater?.name}</p>
      </div>

      <div className="seat-booking-header">
        <h3>Select Your Seats</h3>
        <div className="screen">SCREEN</div>
        
        <div className="seat-grid">
          {rowLabels.map((row, rowIndex) => (
            <div key={row} className="seat-row">
              <span className="seat-row-label">{row}</span>
              {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((seatNum) => {
                const seatNumber = `${row}${seatNum}`;
                const isSelected = selectedSeats.includes(seatNumber);
                const isBooked = bookedSeats.includes(seatNumber);
                
                return (
                  <button
                    key={seatNumber}
                    className={`seat ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                    onClick={() => toggleSeat(seatNumber)}
                    disabled={isBooked}
                  >
                    {seatNum}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 20, height: 20, background: '#e0e0e0', borderRadius: 4 }}></div>
            <span>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 20, height: 20, background: '#667eea', borderRadius: 4 }}></div>
            <span>Selected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 20, height: 20, background: '#ccc', borderRadius: 4, opacity: 0.5 }}></div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        {bookingError && (
          <div className="error" style={{ marginBottom: '1rem', padding: '1rem', background: '#fee', borderRadius: 8 }}>
            {bookingError}
          </div>
        )}

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
          <p>Price per seat: ₹{showtime.price}</p>
          <p><strong>Total: ₹{parseFloat(showtime.price) * selectedSeats.length}</strong></p>
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={customerInfo.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <button
          type="submit"
          className="book-button"
          disabled={!isFormValid() || isBooking}
        >
          {isBooking ? 'Processing...' : `Book ${selectedSeats.length} Seats`}
        </button>
      </form>
    </div>
  );
};

export default SeatBooking;
