const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Base / Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎬 Welcome to IMovies API - Online Movie Ticket Booking Platform',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

app.get(['/api/health', '/imovies/health'], (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes (supports both /api and /imovies prefixes seamlessly)
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use(['/api/auth', '/imovies/auth', '/imovies/api/auth'], authRoutes);
app.use(['/api/movies', '/imovies/movies', '/imovies/api/movies'], movieRoutes);
app.use(['/api/showtimes', '/imovies/showtimes', '/imovies/api/showtimes'], showtimeRoutes);
app.use(['/api/bookings', '/imovies/bookings', '/imovies/api/bookings'], bookingRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 IMovies Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});
