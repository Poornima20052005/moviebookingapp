import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import MovieList from './components/MovieList';
import ShowtimeSelection from './components/ShowtimeSelection';
import SeatBooking from './components/SeatBooking';
import BookingConfirmation from './components/BookingConfirmation';
import './App.css';

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>🎬 Movie Booking</h1>
          </header>
          <main className="app-main">
            <Routes>
              <Route path="/" element={<MovieList />} />
              <Route path="/showtimes/:movieId" element={<ShowtimeSelection />} />
              <Route path="/seats/:showtimeId" element={<SeatBooking />} />
              <Route path="/confirmation/:bookingId" element={<BookingConfirmation />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;
