const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    synopsis: {
      type: String,
      required: [true, 'Movie synopsis is required'],
      trim: true,
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
    },
    duration: {
      type: Number, // Duration in minutes
      required: [true, 'Movie duration in minutes is required'],
    },
    language: {
      type: [String],
      default: ['Hindi', 'English'],
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0,
    },
    certificate: {
      type: String,
      enum: ['U', 'U/A', 'A', 'PG-13', 'R'],
      default: 'U/A',
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster image URL is required'],
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    director: {
      type: String,
      default: '',
    },
    cast: {
      type: [String],
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

module.exports = mongoose.model('Movie', movieSchema);

