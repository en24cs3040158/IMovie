const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');

// @desc    Get all showtimes for a specific movie
// @route   GET /api/showtimes/movie/:movieId
// @access  Public
const getShowtimesByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    let filter = { movie: movieId, isActive: true };
    if (date) {
      filter.showDate = date;
    }

    const showtimes = await Showtime.find(filter)
      .populate('movie', 'title duration rating posterUrl certificate language')
      .sort({ showDate: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: showtimes.length,
      showtimes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single showtime with real-time seat availability
// @route   GET /api/showtimes/:id
// @access  Public
const getShowtimeById = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate(
      'movie',
      'title duration rating posterUrl bannerUrl certificate language genre'
    );

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
    }

    // Generate full seat map definition for frontend
    // 8 rows: A, B (Platinum), C, D, E (Gold), F, G, H (Silver)
    // 8 seats per row: 1 to 8
    const rows = [
      { row: 'A', tier: 'platinum', price: showtime.pricing.platinum },
      { row: 'B', tier: 'platinum', price: showtime.pricing.platinum },
      { row: 'C', tier: 'gold', price: showtime.pricing.gold },
      { row: 'D', tier: 'gold', price: showtime.pricing.gold },
      { row: 'E', tier: 'gold', price: showtime.pricing.gold },
      { row: 'F', tier: 'silver', price: showtime.pricing.silver },
      { row: 'G', tier: 'silver', price: showtime.pricing.silver },
      { row: 'H', tier: 'silver', price: showtime.pricing.silver },
    ];

    const seats = [];
    rows.forEach((r) => {
      for (let col = 1; col <= 8; col++) {
        const seatId = `${r.row}${col}`;
        const isBooked = showtime.bookedSeats.includes(seatId);
        seats.push({
          id: seatId,
          row: r.row,
          number: col,
          tier: r.tier,
          price: r.price,
          isBooked,
        });
      }
    });

    const availableCount = seats.length - showtime.bookedSeats.length;

    res.status(200).json({
      success: true,
      showtime,
      seatMatrix: {
        totalSeats: seats.length,
        availableSeatsCount: availableCount,
        bookedSeatsCount: showtime.bookedSeats.length,
        rows,
        seats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new showtime
// @route   POST /api/showtimes
// @access  Private/Admin
const createShowtime = async (req, res, next) => {
  try {
    const { movie, theater, showDate, startTime, format, pricing } = req.body;

    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
      return res.status(404).json({
        success: false,
        message: 'Cannot create showtime. Movie does not exist.',
      });
    }

    const showtime = await Showtime.create({
      movie,
      theater,
      showDate,
      startTime,
      format,
      pricing,
    });

    res.status(201).json({
      success: true,
      message: 'Showtime created successfully',
      showtime,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShowtimesByMovie,
  getShowtimeById,
  createShowtime,
};

