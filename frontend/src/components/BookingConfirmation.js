import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useBooking } from '../context/BookingContext';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const { clearBooking, selectedMovie, selectedShowtime, selectedSeats } = useBooking();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingService.getBooking(bookingId);
        setBooking(data);
        clearBooking();
        setLoading(false);
      } catch (err) {
        setError('Failed to load booking details.');
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, clearBooking]);

  if (loading) {
    return <div className="loading">Loading booking confirmation...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="booking-confirmation">
      <div className="confirmation-card">
        <div className="success-icon">✅</div>
        <h2>Booking Confirmed!</h2>
        <p>Your movie tickets have been booked successfully.</p>
        
        <div className="booking-details">
          <h3>Booking Details</h3>
          <p><strong>Booking ID:</strong> #{booking.id}</p>
          <p><strong>Movie:</strong> {booking.showtime_details?.movie?.title}</p>
          <p><strong>Date:</strong> {new Date(booking.showtime_details?.show_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>Time:</strong> {new Date(`2000-01-01T${booking.showtime_details?.show_time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}</p>
          <p><strong>Theater:</strong> {booking.showtime_details?.theater?.name}</p>
          <p><strong>Seats:</strong> {booking.seats_booked?.join(', ')}</p>
          <p><strong>Total Price:</strong> ₹{booking.total_price}</p>
          <p><strong>Status:</strong> {booking.status?.toUpperCase()}</p>
        </div>

        <div className="booking-details">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> {booking.customer_name}</p>
          <p><strong>Email:</strong> {booking.customer_email}</p>
          <p><strong>Phone:</strong> {booking.customer_phone}</p>
        </div>

        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          A confirmation email has been sent to {booking.customer_email}
        </p>

        <Link to="/" className="home-button">
          Book More Tickets
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
