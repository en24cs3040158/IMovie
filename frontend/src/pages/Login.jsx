import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const destination = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await login(email, password);
      if (res.success) {
        navigate(destination, { replace: true });
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('Unexpected login failure. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMessage(null);
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg w-100" style={{ maxWidth: '440px' }}>
        
        <div className="text-center mb-4">
          <div className="fs-1 text-danger mb-1">
            <i className="bi bi-film"></i>
          </div>
          <h2 className="fw-bold text-white">Welcome Back</h2>
          <p className="text-secondary small">Sign in to your IMovies account</p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control bg-dark text-white border-secondary"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                className="form-control bg-dark text-white border-secondary"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-cinema w-100 py-2 mb-3 fw-semibold" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Autofill */}
        <div className="pt-3 border-top border-secondary border-opacity-25 text-center">
          <div className="text-muted small mb-2">Test with demo accounts:</div>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary text-light px-2"
              onClick={() => fillCredentials('demo@imovies.com', 'password123')}
            >
              Demo User
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary text-light px-2"
              onClick={() => fillCredentials('admin@imovies.com', 'admin123')}
            >
              Admin User
            </button>
          </div>
        </div>

        <div className="text-center mt-4 text-secondary small">
          Don't have an account?{' '}
          <Link to="/register" className="text-danger text-decoration-none fw-semibold">
            Create account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;

