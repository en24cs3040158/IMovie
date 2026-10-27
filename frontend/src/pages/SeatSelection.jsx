import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TicketModal from '../components/TicketModal';

const SeatSelection = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [seatMatrix, setSeatMatrix] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Checkout & Booking State
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const fetchShowtimeAndSeats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/showtimes/${showtimeId}`);
      if (res.data.success) {
        setShowtime(res.data.showtime);
        setSeatMatrix(res.data.seatMatrix);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch seating arrangement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowtimeAndSeats();
  }, [showtimeId]);

  // Handle seat click toggle
  const toggleSeat = (seat) => {
    if (seat.isBooked) return;

    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);

    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      // Limit max 10 seats per booking
      if (selectedSeats.length >= 10) {
        alert('You can select a maximum of 10 seats per booking.');
        return;
      }
      setSelectedSeats([
        ...selectedSeats,
        {
          id: seat.id,
          seatNumber: seat.id,
          row: seat.row,
          number: seat.number,
          tier: seat.tier,
          price: seat.price,
        },
      ]);
    }
  };

  // Pricing calculations
  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? Math.round(selectedSeats.length * 25) : 0;
  const grandTotal = subtotal + convenienceFee;

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      // Prompt user to login, preserving target path
      navigate('/login', { state: { from: { pathname: `/booking/${showtimeId}` } } });
      return;
    }
    if (selectedSeats.length === 0) {
      alert('Please select at least 1 seat to proceed.');
      return;
    }
    setBookingError(null);
    setShowCheckout(true);
  };

  const handleConfirmReservation = async () => {
    try {
      setBookingLoading(true);
      setBookingError(null);

      const payload = {
        showtimeId,
        seats: selectedSeats.map((s) => ({
          seatNumber: s.seatNumber,
          tier: s.tier,
          price: s.price,
        })),
        paymentMethod,
      };

      const res = await api.post('/bookings', payload);

      if (res.data.success) {
        setConfirmedBooking(res.data.booking);
        setShowCheckout(false);
        // Refresh seats in the background
        fetchShowtimeAndSeats();
        setSelectedSeats([]);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking reservation failed. Please try again.';
      setBookingError(msg);
      // If conflict, refresh seat matrix to show newly booked seats
      if (err.response?.status === 409) {
        fetchShowtimeAndSeats();
        setSelectedSeats([]);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '65vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading seating layout...</span>
        </div>
      </div>
    );
  }

  if (error || !showtime) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card p-5 rounded-4 mx-auto" style={{ maxWidth: '600px' }}>
          <i className="bi bi-exclamation-triangle text-danger fs-1 mb-3 d-block"></i>
          <h4>Unable to Load Showtime</h4>
          <p className="text-secondary">{error || 'This screening is currently unavailable.'}</p>
          <Link to="/" className="btn btn-cinema-outline">
            Return to Movies
          </Link>
        </div>
      </div>
    );
  }

  const movie = showtime.movie;

  return (
    <div className="container py-4 pb-5">
      {/* Top Breadcrumb & Showtime Info */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25 gap-3">
        <div>
          <Link to={`/movie/${movie._id}`} className="text-secondary text-decoration-none small d-inline-flex align-items-center mb-1">
            <i className="bi bi-chevron-left me-1"></i> Back to Movie
          </Link>
          <h3 className="text-white fw-bold mb-0 d-flex align-items-center gap-2">
            <span>{movie.title}</span>
            <span className="badge bg-danger bg-opacity-75 fs-6">{showtime.format || '2D'}</span>
          </h3>
          <div className="text-muted small mt-1">
            <i className="bi bi-building me-1"></i>
            {showtime.theater?.name} ({showtime.theater?.screen}) • {showtime.showDate} at <span className="text-warning fw-semibold">{showtime.startTime}</span>
          </div>
        </div>

        {/* Real-time Availability Stats */}
        <div className="d-flex gap-3 align-items-center bg-dark p-2 px-3 rounded-3 border border-secondary border-opacity-25">
          <div className="text-center">
            <div className="text-success fw-bold fs-5">{seatMatrix?.availableSeatsCount}</div>
            <div className="text-muted" style={{ fontSize: '0.7rem' }}>AVAILABLE</div>
          </div>
          <div className="border-end border-secondary border-opacity-50" style={{ height: '24px' }}></div>
          <div className="text-center">
            <div className="text-secondary fw-bold fs-5">{seatMatrix?.bookedSeatsCount}</div>
            <div className="text-muted" style={{ fontSize: '0.7rem' }}>BOOKED</div>
          </div>
        </div>
      </div>

      {/* Cinema Screen Curve Visual */}
      <div className="cinema-screen-container mt-2">
        <div className="cinema-screen"></div>
        <div className="screen-label">
          <i className="bi bi-tv me-1"></i> Cinema Screen This Way
        </div>
      </div>

      {/* Seat Layout Matrix */}
      <div className="d-flex justify-content-center overflow-x-auto py-3">
        <div className="seating-wrapper d-inline-block p-4 rounded-4" style={{ backgroundColor: '#0d1322', border: '1px solid rgba(255,255,255,0.06)' }}>
          {seatMatrix?.rows?.map((rowInfo) => {
            const rowSeats = seatMatrix.seats.filter((s) => s.row === rowInfo.row);

            return (
              <div key={rowInfo.row} className="d-flex align-items-center justify-content-center mb-2 gap-2">
                {/* Row Letter */}
                <div className="fw-bold text-secondary text-center" style={{ width: '28px' }}>
                  {rowInfo.row}
                </div>

                {/* Left Side (Seats 1-4) */}
                <div className="d-flex gap-2">
                  {rowSeats.slice(0, 4).map((seat) => {
                    const isSelected = selectedSeats.some((s) => s.id === seat.id);
                    let seatClass = 'seat';
                    if (seat.isBooked) seatClass += ' booked';
                    else if (isSelected) seatClass += ' selected';
                    else seatClass += ` available tier-${seat.tier}`;

                    return (
                      <div
                        key={seat.id}
                        className={seatClass}
                        onClick={() => toggleSeat(seat)}
                        title={`${seat.id} • ${seat.tier.toUpperCase()} • ₹${seat.price} ${seat.isBooked ? '(Booked)' : ''}`}
                      >
                        {seat.number}
                      </div>
                    );
                  })}
                </div>

                {/* Center Aisle Spacer */}
                <div style={{ width: '32px' }}></div>

                {/* Right Side (Seats 5-8) */}
                <div className="d-flex gap-2">
                  {rowSeats.slice(4, 8).map((seat) => {
                    const isSelected = selectedSeats.some((s) => s.id === seat.id);
                    let seatClass = 'seat';
                    if (seat.isBooked) seatClass += ' booked';
                    else if (isSelected) seatClass += ' selected';
                    else seatClass += ` available tier-${seat.tier}`;

                    return (
                      <div
                        key={seat.id}
                        className={seatClass}
                        onClick={() => toggleSeat(seat)}
                        title={`${seat.id} • ${seat.tier.toUpperCase()} • ₹${seat.price} ${seat.isBooked ? '(Booked)' : ''}`}
                      >
                        {seat.number}
                      </div>
                    );
                  })}
                </div>

                {/* Row Price Pill */}
                <div className="text-secondary small ms-2 text-nowrap" style={{ width: '48px', fontSize: '0.72rem' }}>
                  ₹{rowInfo.price}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Status Legend */}
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 my-4 py-3 border-top border-bottom border-secondary border-opacity-25 small text-secondary">
        <div className="d-flex align-items-center gap-2">
          <div className="seat available" style={{ width: '22px', height: '22px', cursor: 'default' }}></div>
          <span>Available</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat selected" style={{ width: '22px', height: '22px', cursor: 'default' }}></div>
          <span className="text-success fw-semibold">Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat booked" style={{ width: '22px', height: '22px', cursor: 'default' }}></div>
          <span>Sold Out</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge rounded-pill bg-purple" style={{ backgroundColor: '#a855f7' }}>A-B</span>
          <span>Platinum (₹{showtime.pricing?.platinum})</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge rounded-pill bg-warning text-dark">C-E</span>
          <span>Gold (₹{showtime.pricing?.gold})</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge rounded-pill bg-info text-dark">F-H</span>
          <span>Silver (₹{showtime.pricing?.silver})</span>
        </div>
      </div>

      {/* Floating Sticky Bottom Bar for Selection Summary */}
      {selectedSeats.length > 0 && (
        <div className="fixed-bottom p-3" style={{ background: 'rgba(10, 14, 23, 0.96)', borderTop: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', zIndex: 1020 }}>
          <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <div className="text-muted small">
                Selected Seats (<span className="text-white fw-bold">{selectedSeats.length}</span>):
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                {selectedSeats.map((s) => (
                  <span key={s.id} className="badge bg-success bg-opacity-75 text-white">
                    {s.seatNumber}
                  </span>
                ))}
              </div>
            </div>

            <div className="d-flex align-items-center gap-4">
              <div className="text-end">
                <div className="text-secondary small">Total Payable</div>
                <div className="fs-4 fw-bold text-white">
                  ₹{grandTotal}{' '}
                  <span className="text-muted small fw-normal" style={{ fontSize: '0.75rem' }}>(incl. ₹{convenienceFee} fee)</span>
                </div>
              </div>
              <button className="btn btn-cinema px-4 py-2 fs-6 shadow-lg glow-primary" onClick={handleProceedToCheckout}>
                Proceed to Pay <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-white" style={{ background: '#131b2e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px' }}>
              
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-shield-check text-danger me-2"></i>Checkout & Payment
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCheckout(false)} disabled={bookingLoading}></button>
              </div>

              <div className="modal-body p-4">
                {bookingError && (
                  <div className="alert alert-danger small py-2">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i> {bookingError}
                  </div>
                )}

                {/* Booking Summary */}
                <div className="bg-dark p-3 rounded-3 mb-3 border border-secondary border-opacity-25">
                  <div className="fw-bold text-white fs-5 mb-1">{movie.title}</div>
                  <div className="text-muted small mb-2">
                    {showtime.theater?.name} • {showtime.theater?.screen}
                  </div>
                  <div className="d-flex justify-content-between small text-light">
                    <span>Date & Time:</span>
                    <span className="fw-semibold text-warning">{showtime.showDate} @ {showtime.startTime}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-light mt-1">
                    <span>Seats Selected:</span>
                    <span className="fw-semibold text-success">{selectedSeats.map((s) => s.seatNumber).join(', ')}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-4 small">
                  <div className="d-flex justify-content-between text-secondary mb-1">
                    <span>Tickets Subtotal ({selectedSeats.length} seats):</span>
                    <span className="text-white">₹{subtotal}</span>
                  </div>
                  <div className="d-flex justify-content-between text-secondary mb-1">
                    <span>Convenience Fee (incl. GST):</span>
                    <span className="text-white">₹{convenienceFee}</span>
                  </div>
                  <div className="border-top border-secondary border-opacity-25 pt-2 mt-2 d-flex justify-content-between fs-6 fw-bold text-white">
                    <span>Final Amount:</span>
                    <span className="text-danger fs-5">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="mb-3">
                  <label className="form-label small text-secondary fw-semibold">SELECT PAYMENT METHOD</label>
                  <div className="d-flex flex-column gap-2">
                    {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'IMovies Wallet'].map((method) => (
                      <label
                        key={method}
                        className={`d-flex align-items-center justify-content-between p-3 rounded-3 border cursor-pointer transition-all ${
                          paymentMethod === method
                            ? 'border-danger bg-danger bg-opacity-10 text-white'
                            : 'border-secondary border-opacity-50 text-secondary'
                        }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="paymentOption"
                            value={method}
                            checked={paymentMethod === method}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="form-check-input"
                          />
                          <span className="fw-medium text-white">{method}</span>
                        </div>
                        {method === 'UPI' && <span className="badge bg-success bg-opacity-50">Fastest</span>}
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              <div className="modal-footer border-secondary border-opacity-25">
                <button type="button" className="btn btn-cinema-outline" onClick={() => setShowCheckout(false)} disabled={bookingLoading}>
                  Cancel
                </button>
                <button type="button" className="btn btn-cinema px-4" onClick={handleConfirmReservation} disabled={bookingLoading}>
                  {bookingLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Reserving Seats...
                    </>
                  ) : (
                    `Pay ₹${grandTotal} & Confirm`
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal upon Successful Booking */}
      {confirmedBooking && (
        <TicketModal
          booking={confirmedBooking}
          onClose={() => {
            setConfirmedBooking(null);
            navigate('/dashboard');
          }}
        />
      )}
    </div>
  );
};

export default SeatSelection;

