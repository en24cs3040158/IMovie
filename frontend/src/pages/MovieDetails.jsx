import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  // Helper to format minutes to "2h 30m"
  const formatDuration = (mins) => {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/movies/${id}`);
        if (res.data.success) {
          setMovie(res.data.movie);
          setShowtimes(res.data.showtimes || []);

          // Default selected date to first available date in showtimes, or today
          if (res.data.showtimes && res.data.showtimes.length > 0) {
            setSelectedDate(res.data.showtimes[0].showDate);
          } else {
            setSelectedDate(new Date().toISOString().split('T')[0]);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Extract unique show dates
  const uniqueDates = Array.from(new Set(showtimes.map((s) => s.showDate))).sort();

  // Filter showtimes by selected date
  const filteredShowtimes = showtimes.filter((s) => s.showDate === selectedDate);

  // Group filtered showtimes by theater
  const showtimesByTheater = filteredShowtimes.reduce((acc, st) => {
    const theaterName = st.theater?.name || 'Main Cinema Multiplex';
    if (!acc[theaterName]) {
      acc[theaterName] = {
        theater: st.theater,
        shows: [],
      };
    }
    acc[theaterName].shows.push(st);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading movie details...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card p-5 rounded-4 mx-auto" style={{ maxWidth: '600px' }}>
          <i className="bi bi-exclamation-circle text-danger fs-1 mb-3 d-block"></i>
          <h4>Movie Not Found</h4>
          <p className="text-secondary">{error || 'The requested movie is not currently available.'}</p>
          <Link to="/" className="btn btn-cinema-outline">
            Back to Now Showing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Movie Banner Backdrop */}
      <div
        className="position-relative py-5"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10, 14, 23, 0.75), rgba(10, 14, 23, 0.98)), url(${movie.bannerUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container py-4">
          <div className="row g-4 align-items-center">
            
            {/* Poster Column */}
            <div className="col-md-4 col-lg-3 text-center text-md-start">
              <div className="shadow-lg rounded-4 overflow-hidden border border-secondary border-opacity-50" style={{ maxHeight: '420px' }}>
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-100 h-100 object-fit-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
                  }}
                />
              </div>
            </div>

            {/* Info Column */}
            <div className="col-md-8 col-lg-9 text-white">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge-rating d-inline-flex align-items-center gap-1">
                  <i className="bi bi-star-fill text-dark"></i>
                  {movie.rating ? movie.rating.toFixed(1) : '8.0'}/10
                </span>
                <span className="badge-cert">{movie.certificate || 'U/A'}</span>
                <span className="badge bg-secondary bg-opacity-50 text-light">
                  {movie.language?.join(', ')}
                </span>
                <span className="text-secondary small">
                  <i className="bi bi-clock me-1"></i>
                  {formatDuration(movie.duration)}
                </span>
              </div>

              <h1 className="display-5 fw-bold mb-2">{movie.title}</h1>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {movie.genre?.map((g, idx) => (
                  <span key={idx} className="badge bg-dark border border-secondary text-light px-2 py-1">
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-light text-opacity-80 lead fs-6 mb-4" style={{ maxWidth: '800px', lineHeight: '1.7' }}>
                {movie.synopsis}
              </p>

              {/* Cast & Crew */}
              <div className="row g-3 small text-secondary mb-4 border-top border-secondary border-opacity-25 pt-3">
                <div className="col-sm-6">
                  <span className="text-white fw-semibold">Director: </span>
                  {movie.director || 'N/A'}
                </div>
                <div className="col-sm-6">
                  <span className="text-white fw-semibold">Starring: </span>
                  {movie.cast?.join(', ') || 'N/A'}
                </div>
              </div>

              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-cinema-outline d-inline-flex align-items-center gap-2"
                >
                  <i className="bi bi-play-circle-fill text-danger fs-5"></i>
                  Watch Trailer
                </a>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Showtimes & Theater Selection Section */}
      <div className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="fw-bold text-white mb-1">
              <i className="bi bi-calendar3 text-danger me-2"></i>Select Date & Showtime
            </h3>
            <p className="text-secondary small mb-0">Choose your preferred screening time to select seats</p>
          </div>
        </div>

        {/* Date Filter Tabs */}
        {uniqueDates.length > 0 ? (
          <div className="d-flex gap-2 overflow-x-auto pb-3 mb-4">
            {uniqueDates.map((d) => {
              const dateObj = new Date(d);
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
              const dayNum = dateObj.getDate();
              const isSelected = selectedDate === d;

              return (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`btn text-center px-4 py-2 rounded-3 border transition-all ${
                    isSelected
                      ? 'btn-danger text-white border-danger shadow glow-primary'
                      : 'btn-dark bg-opacity-50 text-secondary border-secondary'
                  }`}
                  style={{ minWidth: '90px' }}
                >
                  <div className="small text-uppercase fw-semibold">{dayName}</div>
                  <div className="fs-5 fw-bold">{dayNum}</div>
                  <div className="small">{monthName}</div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="alert alert-dark text-secondary border-secondary">
            No upcoming showtimes listed for this movie at the moment.
          </div>
        )}

        {/* Theaters & Showtimes Cards */}
        {Object.keys(showtimesByTheater).length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {Object.entries(showtimesByTheater).map(([theaterName, data]) => (
              <div key={theaterName} className="glass-card p-4 rounded-4">
                <div className="row align-items-center g-3">
                  
                  {/* Theater Info */}
                  <div className="col-lg-4 col-md-5">
                    <h5 className="text-white fw-bold mb-1">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      {theaterName}
                    </h5>
                    <div className="text-secondary small">
                      {data.theater?.screen || 'Audi 1'} • {data.theater?.city || 'Mumbai'}
                    </div>
                    <div className="d-flex gap-2 mt-2">
                      <span className="badge bg-secondary bg-opacity-25 text-light small">
                        M-Ticket Available
                      </span>
                      <span className="badge bg-secondary bg-opacity-25 text-light small">
                        Food & Beverage
                      </span>
                    </div>
                  </div>

                  {/* Showtimes Pills */}
                  <div className="col-lg-8 col-md-7">
                    <div className="d-flex flex-wrap gap-3">
                      {data.shows.map((st) => (
                        <button
                          key={st._id}
                          onClick={() => navigate(`/booking/${st._id}`)}
                          className="btn btn-outline-light px-3 py-2 rounded-3 text-start border-secondary hover-shadow d-flex flex-column"
                          style={{ minWidth: '130px', transition: 'all 0.2s ease' }}
                        >
                          <div className="fw-bold text-warning fs-6">{st.startTime}</div>
                          <div className="small text-muted d-flex justify-content-between mt-1">
                            <span className="badge bg-danger bg-opacity-50 text-white me-2">{st.format || '2D'}</span>
                            <span className="text-light">₹{st.pricing?.silver || 180}+</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : uniqueDates.length > 0 ? (
          <div className="text-center py-4 text-secondary">
            No shows available on the selected date. Please pick another date above.
          </div>
        ) : null}

      </div>
    </div>
  );
};

export default MovieDetails;

