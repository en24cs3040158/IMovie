import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: 'rgba(10, 14, 23, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-3" to="/">
          <span style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-film"></i> I<span className="text-white">Movies</span>
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link
                className={`nav-link px-3 ${location.pathname === '/' ? 'active text-danger fw-semibold' : 'text-light'}`}
                to="/"
              >
                <i className="bi bi-play-circle me-1"></i> Now Showing
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link
                  className={`nav-link px-3 ${location.pathname === '/dashboard' ? 'active text-danger fw-semibold' : 'text-light'}`}
                  to="/dashboard"
                >
                  <i className="bi bi-ticket-perforated me-1"></i> My Bookings
                </Link>
              </li>
            )}
          </ul>

          {/* User Actions */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-cinema-outline dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5 text-warning"></i>
                  <span className="fw-medium">{user?.name?.split(' ')[0] || 'User'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg" aria-labelledby="userMenuButton" style={{ background: '#131b2e', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <li className="px-3 py-2 border-bottom border-secondary border-opacity-25">
                    <div className="fw-semibold text-white">{user?.name}</div>
                    <div className="small text-muted">{user?.email}</div>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/dashboard">
                      <i className="bi bi-ticket-perforated me-2 text-danger"></i> My Tickets
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider border-secondary border-opacity-25" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-cinema-outline btn-sm px-3">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-cinema btn-sm px-3">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

