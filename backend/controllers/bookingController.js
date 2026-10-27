const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');

// Helper to generate human-readable Booking ID
const generateBookingId = () => {
  const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `IM-${dateStr}-${randomStr}`;
};

// @desc    Create a new movie ticket booking with atomic seat reservation
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { showtimeId, seats, paymentMethod } = req.body;

    if (!showtimeId) {
      return res.status(400).json({
        success: false,
        message: 'Showtime ID is required',
      });
    }

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one seat to proceed with booking',
      });
    }

    const showtime = await Showtime.findById(showtimeId).populate('movie');
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
    }

    const seatNumbers = seats.map((s) => s.seatNumber);

    // Concurrency Check & Atomic Reservation:
    // Ensure NONE of the selected seats are already booked
    const updatedShowtime = await Showtime.findOneAndUpdate(
      {
        _id: showtimeId,
        bookedSeats: { $nin: seatNumbers },
      },
      {
        $push: { bookedSeats: { $each: seatNumbers } },
      },
      { new: true }
    );

    if (!updatedShowtime) {
      return res.status(409).json({
        success: false,
        message:
          'One or more of the selected seats have just been reserved by another user. Please choose different seats.',
      });
    }

    // Calculate amounts
    const subtotal = seats.reduce((sum, s) => sum + (Number(s.price) || 200), 0);
    const convenienceFee = Math.round(seats.length * 25); // ₹25 convenience fee per ticket
    const totalAmount = subtotal + convenienceFee;

    const bookingId = generateBookingId();

    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      movie: showtime.movie._id,
      showtime: showtime._id,
      seats: seats.map((s) => ({
        seatNumber: s.seatNumber,
        tier: s.tier || 'gold',
        price: s.price,
      })),
      subtotal,
      convenienceFee,
      totalAmount,
      paymentDetails: {
        method: paymentMethod || 'UPI',
        transactionId: 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        status: 'Completed',
      },
      status: 'Confirmed',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title posterUrl duration language certificate')
      .populate('showtime', 'showDate startTime theater format');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed! Enjoy your movie.',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title posterUrl duration language certificate genre')
      .populate('showtime', 'showDate startTime theater format')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie')
      .populate('showtime')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership or admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this ticket',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking and release seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled',
      });
    }

    // Release seats in showtime atomically
    const seatNumbers = booking.seats.map((s) => s.seatNumber);
    await Showtime.findByIdAndUpdate(booking.showtime, {
      $pull: { bookedSeats: { $in: seatNumbers } },
    });

    // Update booking status
    booking.status = 'Cancelled';
    booking.paymentDetails.status = 'Refunded';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Refund initiated.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};

