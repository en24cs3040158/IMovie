const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
    },
    theater: {
      name: {
        type: String,
        required: [true, 'Theater name is required'],
        default: 'PVR IMAX Metropolis',
      },
      screen: {
        type: String,
        default: 'Audi 1 (Dolby Atmos)',
      },
      city: {
        type: String,
        default: 'Mumbai',
      },
    },
    showDate: {
      type: String, // Stored as YYYY-MM-DD for easy filtering & grouping
      required: [true, 'Show date is required'],
    },
    startTime: {
      type: String, // e.g. "10:30 AM", "02:15 PM", "06:45 PM", "09:30 PM"
      required: [true, 'Start time is required'],
    },
    format: {
      type: String,
      enum: ['2D', '3D', 'IMAX 2D', 'IMAX 3D', '4DX'],
      default: '2D',
    },
    pricing: {
      platinum: {
        type: Number,
        default: 350,
      },
      gold: {
        type: Number,
        default: 250,
      },
      silver: {
        type: Number,
        default: 180,
      },
    },
    totalSeats: {
      type: Number,
      default: 64, // 8 rows (A-H) x 8 seats (1-8)
    },
    bookedSeats: {
      type: [String], // Array of seat numbers like ['A1', 'A2', 'C4']
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for quickly finding shows by movie and date
showtimeSchema.index({ movie: 1, showDate: 1 });

module.exports = mongoose.model('Showtime', showtimeSchema);

