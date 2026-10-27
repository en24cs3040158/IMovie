import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Thriller', 'Adventure', 'Drama', 'Animation', 'Mythology'];

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMovies = async (genre = 'All', search = '') => {
    try {
      setLoading(true);
      setError(null);
      let url = '/movies?';
      if (genre && genre !== 'All') url += `genre=${encodeURIComponent(genre)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const response = await api.get(url);
      if (response.data.success) {
        setMovies(response.data.movies);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load movies. Please ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(selectedGenre, searchQuery);
  }, [selectedGenre]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMovies(selectedGenre, searchQuery);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="position-relative py-5 overflow-hidden" style={{ background: 'radial-gradient(circle at top, #1e293b 0%, #0a0e17 80%)' }}>
        <div className="container py-4 text-center">
          <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 px-3 py-2 rounded-pill fw-semibold mb-3">
            <i className="bi bi-sparkles me-1"></i> Book Your Favorite Cinema Tickets
          </span>
          <h1 className="display-4 fw-extrabold text-white mb-3">
            Experience Movies on the <span style={{ color: 'var(--primary-color)' }}>Big Screen</span>
          </h1>
          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: '650px' }}>
            Browse latest blockbusters, select your preferred auditorium & seats in real time, and enjoy effortless ticket booking with IMovies.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="mx-auto" style={{ maxWidth: '560px' }}>
            <div className="input-group input-group-lg shadow-lg">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Search movies by title, actor or director..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-cinema px-4" type="submit">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container py-5">
        
        {/* Genre Filter Pills */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <div className="d-flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`btn btn-sm rounded-pill px-3 py-2 transition-all ${
                  selectedGenre === g
                    ? 'btn-danger fw-semibold glow-primary'
                    : 'btn-outline-secondary text-light'
                }`}
                style={{ fontSize: '0.85rem' }}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="text-secondary small">
            Showing <span className="text-white fw-bold">{movies.length}</span> movies
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-secondary mt-3">Loading showtimes and cinema listings...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="alert alert-dark border-danger text-light p-4 rounded-3 text-center my-4">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-3 d-block mb-2"></i>
            <h5>Could not load movies</h5>
            <p className="text-secondary small mb-3">{error}</p>
            <button className="btn btn-sm btn-cinema-outline" onClick={() => fetchMovies(selectedGenre, searchQuery)}>
              <i className="bi bi-arrow-clockwise me-1"></i> Try Again
            </button>
          </div>
        )}

        {/* Movie Grid */}
        {!loading && !error && movies.length > 0 && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {movies.map((movie) => (
              <div className="col" key={movie._id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-5 glass-card p-5 rounded-4">
            <i className="bi bi-film text-secondary fs-1 d-block mb-3"></i>
            <h4 className="text-white">No Movies Found</h4>
            <p className="text-secondary small mb-3">
              We couldn't find any movie matching your search criteria. Try choosing another genre or keyword.
            </p>
            <button
              className="btn btn-cinema-outline btn-sm"
              onClick={() => {
                setSelectedGenre('All');
                setSearchQuery('');
                fetchMovies('All', '');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;

