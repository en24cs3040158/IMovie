import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  // Format duration into hours and mins
  const formatDuration = (mins) => {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="card h-100 glass-card glass-card-hover overflow-hidden border-0">
      <div className="position-relative overflow-hidden" style={{ height: '360px', backgroundColor: '#0f172a' }}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-100 h-100 object-fit-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback image if unsplash link fails
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
          }}
          style={{ transition: 'transform 0.4s ease' }}
        />
        
        {/* Rating overlay */}
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className="badge-rating d-flex align-items-center gap-1 shadow">
            <i className="bi bi-star-fill text-dark small"></i>
            {movie.rating ? movie.rating.toFixed(1) : '8.0'}
          </span>
          {movie.certificate && (
            <span className="badge bg-dark bg-opacity-75 border border-secondary text-light">
              {movie.certificate}
            </span>
          )}
        </div>

        {/* Quick Format Tags */}
        <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient" style={{ background: 'linear-gradient(transparent, rgba(10, 14, 23, 0.95))' }}>
          <div className="d-flex flex-wrap gap-1">
            {movie.language?.slice(0, 2).map((lang, idx) => (
              <span key={idx} className="badge bg-danger bg-opacity-75 small">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="card-body d-flex flex-column p-3">
        <h5 className="card-title text-white fw-bold text-truncate mb-1" title={movie.title}>
          {movie.title}
        </h5>

        <div className="text-muted small mb-2 d-flex justify-content-between align-items-center">
          <span className="text-truncate me-2">
            {movie.genre?.slice(0, 2).join(' • ')}
          </span>
          <span className="text-nowrap">
            <i className="bi bi-clock me-1"></i>
            {formatDuration(movie.duration)}
          </span>
        </div>

        <p className="card-text text-secondary small line-clamp-2 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {movie.synopsis}
        </p>

        <div className="mt-auto pt-2">
          <Link to={`/movie/${movie._id}`} className="btn btn-cinema w-100 d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-ticket-perforated"></i>
            Book Tickets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

