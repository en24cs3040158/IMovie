const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');

// @desc    Get all active movies with optional filtering & search
// @route   GET /api/movies
// @access  Public
const getAllMovies = async (req, res, next) => {
  try {
    const { search, genre, language } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { cast: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } },
      ];
    }

    if (genre && genre !== 'All') {
      query.genre = { $in: [new RegExp(genre, 'i')] };
    }

    if (language && language !== 'All') {
      query.language = { $in: [new RegExp(language, 'i')] };
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID with its showtimes
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Also fetch available showtimes for this movie
    const showtimes = await Showtime.find({
      movie: movie._id,
      isActive: true,
    }).sort({ showDate: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      movie,
      showtimes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    movie.isActive = false;
    await movie.save();

    res.status(200).json({
      success: true,
      message: 'Movie archived successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};

