import axios from 'axios';

const API_URL = 'https://moviebookingapp.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieService = {
  getAllMovies: async () => {
    const response = await api.get('/movies/');
    return response.data;
  },
  getMovie: async (id) => {
    const response = await api.get(`/movies/${id}/`);
    return response.data;
  },
};

export const showtimeService = {
  getShowtimes: async (movieId) => {
    const response = await api.get(`/showtimes/?movie=${movieId}`);
    return response.data;
  },
  getShowtime: async (id) => {
    const response = await api.get(`/showtimes/${id}/`);
    return response.data;
  },
};

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  },
  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}/`);
    return response.data;
  },
  getBookingsByEmail: async (email) => {
    const response = await api.get(`/bookings/?email=${email}`);
    return response.data;
  },
  cancelBooking: async (id) => {
    const response = await api.post(`/bookings/${id}/cancel/`);
    return response.data;
  },
};

export default api;
