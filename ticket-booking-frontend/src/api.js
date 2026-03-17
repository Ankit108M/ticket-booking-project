import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: BASE_URL });

// --- User APIs ---
export const registerUser = (data) => api.post('/users/register', data);
export const loginUser = (data) => api.post('/users/login', data);

// --- Event APIs ---
export const getEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const getEventsByCategory = (cat) => api.get(`/events/category/${cat}`);

// --- Seat APIs ---
export const getSeats = (eventId) => api.get(`/seats/${eventId}`);

// --- Booking APIs ---
export const bookTicket = (data) => api.post('/bookings/book', data);
export const getBookingHistory = (userId) => api.get(`/bookings/history/${userId}`);
export const getBooking = (bookingId) => api.get(`/bookings/${bookingId}`);
