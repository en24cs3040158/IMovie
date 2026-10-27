import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, phone } = formData;

    if (!name || !email || !password) {
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await register(name, email, password, phone);
      if (res.success) {
        navigate('/');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('Registration error. Please check your network and backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg w-100" style={{ maxWidth: '460px' }}>
        
        <div className="text-center mb-4">
          <div className="fs-1 text-danger mb-1">
            <i className="bi bi-person-plus-fill"></i>
          </div>
          <h2 className="fw-bold text-white">Create Account</h2>
          <p className="text-secondary small">Join IMovies to book cinema tickets seamlessly</p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                name="name"
                className="form-control bg-dark text-white border-secondary"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                name="email"
                className="form-control bg-dark text-white border-secondary"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">Phone Number (Optional)</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-telephone"></i>
              </span>
              <input
                type="tel"
                name="phone"
                className="form-control bg-dark text-white border-secondary"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-secondary small fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                name="password"
                className="form-control bg-dark text-white border-secondary"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-cinema w-100 py-2 mb-3 fw-semibold" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-3 text-secondary small">
          Already have an account?{' '}
          <Link to="/login" className="text-danger text-decoration-none fw-semibold">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;

