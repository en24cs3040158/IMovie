import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TicketModal from '../components/TicketModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'CONFIRMED' | 'CANCELLED'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Your seats will be released back to the auditorium.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: 'Cancelled', paymentDetails: { ...b.paymentDetails, status: 'Refunded' } } : b))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'CONFIRMED') return b.status === 'Confirmed';
    if (activeTab === 'CANCELLED') return b.status === 'Cancelled';
    return true;
  });

  return (
    <div className="container py-5 pb-5">
      {/* User Welcome Banner */}
      <div className="glass-card p-4 rounded-4 mb-5 border-secondary border-opacity-50">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-3"
              style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #e50914, #7f1d1d)' }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-white fw-bold mb-1">{user?.name}</h3>
              <div className="text-secondary small">
                <i className="bi bi-envelope me-1"></i> {user?.email} • {user?.phone || 'No phone set'}
              </div>
            </div>
          </div>

          <div className="d-flex gap-3">
            <div className="bg-dark p-3 rounded-3 text-center border border-secondary border-opacity-25" style={{ minWidth: '120px' }}>
              <div className="fs-4 fw-bold text-danger">{bookings.length}</div>
              <div className="text-muted small">Total Bookings</div>
            </div>
            <div className="bg-dark p-3 rounded-3 text-center border border-secondary border-opacity-25" style={{ minWidth: '120px' }}>
              <div className="fs-4 fw-bold text-success">
                {bookings.filter((b) => b.status === 'Confirmed').length}
              </div>
              <div className="text-muted small">Active Tickets</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h4 className="fw-bold text-white mb-1">
            <i className="bi bi-ticket-perforated-fill text-danger me-2"></i>My Movie Tickets
          </h4>
          <p className="text-secondary small mb-0">View, download, or manage your cinema reservations</p>
        </div>

        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'ALL' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
            onClick={() => setActiveTab('ALL')}
          >
            All ({bookings.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'CONFIRMED' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
            onClick={() => setActiveTab('CONFIRMED')}
          >
            Confirmed ({bookings.filter((b) => b.status === 'Confirmed').length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'CANCELLED' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
            onClick={() => setActiveTab('CANCELLED')}
          >
            Cancelled ({bookings.filter((b) => b.status === 'Cancelled').length})
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading tickets...</span>
          </div>
          <p className="text-secondary mt-2">Retrieving your tickets...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="alert alert-danger text-center p-4">
          <p className="mb-2">{error}</p>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchBookings}>
            Try Again
          </button>
        </div>
      )}

      {/* Tickets List */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div className="row g-4">
          {filteredBookings.map((b) => {
            const isConfirmed = b.status === 'Confirmed';

            return (
              <div className="col-lg-6" key={b._id}>
                <div
                  className="glass-card p-4 rounded-4 h-100 position-relative overflow-hidden"
                  style={{
                    borderLeft: `5px solid ${isConfirmed ? '#10b981' : '#ef4444'}`,
                  }}
                >
                  <div className="d-flex gap-3">
                    {/* Movie Poster Thumb */}
                    <div style={{ width: '90px', height: '125px', flexShrink: 0 }}>
                      <img
                        src={b.movie?.posterUrl}
                        alt={b.movie?.title}
                        className="w-100 h-100 object-fit-cover rounded-3 border border-secondary border-opacity-50"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
                        }}
                      />
                    </div>

                    {/* Ticket Details */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="text-white fw-bold mb-1 text-truncate" title={b.movie?.title}>
                          {b.movie?.title}
                        </h5>
                        <span className={`badge ${isConfirmed ? 'bg-success' : 'bg-danger'} bg-opacity-75 small`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="text-secondary small mb-2">
                        {b.showtime?.theater?.name} ({b.showtime?.theater?.screen})
                      </div>

                      <div className="d-flex flex-wrap gap-3 small text-light py-2 border-top border-bottom border-secondary border-opacity-25 my-2">
                        <div>
                          <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>DATE & TIME</span>
                          <span className="fw-semibold text-warning">{b.showtime?.showDate} • {b.showtime?.startTime}</span>
                        </div>
                        <div>
                          <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>SEATS</span>
                          <span className="fw-bold text-success">
                            {b.seats?.map((s) => s.seatNumber).join(', ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>BOOKING ID</span>
                          <span className="font-monospace text-light">{b.bookingId}</span>
                        </div>
                      </div>

                      {/* Bottom action row */}
                      <div className="d-flex justify-content-between align-items-center pt-2">
                        <div>
                          <span className="text-muted small">Total Paid: </span>
                          <span className="fw-bold text-white fs-6">₹{b.totalAmount}</span>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-cinema-outline"
                            onClick={() => setSelectedTicket(b)}
                          >
                            <i className="bi bi-eye me-1"></i> View Ticket
                          </button>

                          {isConfirmed && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleCancelBooking(b._id)}
                              disabled={cancellingId === b._id}
                            >
                              {cancellingId === b._id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBookings.length === 0 && (
        <div className="glass-card text-center py-5 p-4 rounded-4">
          <i className="bi bi-ticket-detailed text-secondary fs-1 d-block mb-3"></i>
          <h4 className="text-white">No Bookings Found</h4>
          <p className="text-secondary small mb-4">
            {activeTab === 'ALL'
              ? "You haven't booked any movie tickets yet. Pick an exciting movie from our lineup!"
              : `No ${activeTab.toLowerCase()} bookings found.`}
          </p>
          <Link to="/" className="btn btn-cinema px-4">
            Browse Movies Now
          </Link>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;

