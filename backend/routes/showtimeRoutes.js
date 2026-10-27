const express = require('express');
const router = express.Router();
const {
  getShowtimesByMovie,
  getShowtimeById,
  createShowtime,
} = require('../controllers/showtimeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/movie/:movieId', getShowtimesByMovie);
router.get('/:id', getShowtimeById);
router.post('/', protect, adminOnly, createShowtime);

module.exports = router;

