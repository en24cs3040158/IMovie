import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto py-5" style={{ backgroundColor: '#070a10', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-md-5">
            <h5 className="fw-bold d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-film text-danger"></i>
              <span className="text-white">IMovies</span>
            </h5>
            <p className="text-muted small mb-0 pe-md-4">
              Your premier destination for online movie ticket booking. Discover upcoming releases, select prime seats in real-time, and experience cinema like never before.
            </p>
          </div>
          <div className="col-md-3 col-6">
            <h6 className="text-white fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled text-muted small mb-0 d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-muted">Now Playing Movies</Link></li>
              <li><Link to="/dashboard" className="text-decoration-none text-muted">My Reservations</Link></li>
              <li><span className="text-muted">Dolby Atmos & IMAX</span></li>
            </ul>
          </div>
          <div className="col-md-4 col-6 text-md-end">
            <h6 className="text-white fw-semibold mb-3">Cinema Experience</h6>
            <div className="d-flex gap-2 justify-content-md-end mb-3">
              <span className="badge bg-dark border border-secondary text-light px-2 py-1">IMAX 3D</span>
              <span className="badge bg-dark border border-secondary text-light px-2 py-1">4DX</span>
              <span className="badge bg-dark border border-secondary text-light px-2 py-1">Dolby Atmos</span>
            </div>
            <p className="text-secondary small mb-0">
              © {new Date().getFullYear()} IMovies. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

