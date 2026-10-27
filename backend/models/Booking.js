const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: [true, 'Showtime reference is required'],
    },
    seats: {
      type: [
        {
          seatNumber: { type: String, required: true },
          tier: { type: String, enum: ['platinum', 'gold', 'silver'], default: 'gold' },
          price: { type: Number, required: true },
        },
      ],
      required: [true, 'At least one seat must be selected'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Seats array cannot be empty',
      },
    },
    subtotal: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentDetails: {
      method: {
        type: String,
        enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'IMovies Wallet'],
        default: 'UPI',
      },
      transactionId: {
        type: String,
        default: () => 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      },
      status: {
        type: String,
        enum: ['Completed', 'Pending', 'Failed', 'Refunded'],
        default: 'Completed',
      },
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index to quickly look up bookings for a user
bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);

