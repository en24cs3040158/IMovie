import React from 'react';

const TicketModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-white" style={{ background: '#131b2e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px' }}>
          
          <div className="modal-header border-secondary border-opacity-25 pb-2">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill text-success"></i>
              <span>Booking Confirmed!</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>

          <div className="modal-body p-4" id="printableTicket">
            {/* Ticket Card */}
            <div className="p-3 rounded-3 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px dashed rgba(255,255,255,0.2)' }}>
              
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className="badge bg-danger mb-1">IMovies PASS</span>
                  <h4 className="fw-bold text-white mb-0">{booking.movie?.title}</h4>
                  <div className="text-muted small">
                    {booking.showtime?.theater?.name || 'PVR Cinemas'} • {booking.showtime?.theater?.screen || 'Audi 1'}
                  </div>
                </div>
                <div className="text-end">
                  <span className="badge bg-success bg-opacity-75">{booking.status}</span>
                  <div className="small text-secondary mt-1">{booking.bookingId}</div>
                </div>
              </div>

              <div className="row g-2 py-3 border-top border-bottom border-secondary border-opacity-25 my-2">
                <div className="col-4">
                  <div className="text-muted small text-uppercase">Date</div>
                  <div className="fw-semibold text-white">{booking.showtime?.showDate}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small text-uppercase">Time</div>
                  <div className="fw-semibold text-warning">{booking.showtime?.startTime}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small text-uppercase">Seats</div>
                  <div className="fw-bold text-success">
                    {booking.seats?.map((s) => s.seatNumber).join(', ')}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2">
                <div>
                  <div className="text-muted small">Total Paid</div>
                  <div className="fs-5 fw-bold text-white">₹{booking.totalAmount}</div>
                </div>
                <div className="text-end font-monospace text-muted small">
                  <div>Payment: {booking.paymentDetails?.method || 'UPI'}</div>
                  <div style={{ letterSpacing: '2px', fontSize: '0.7rem' }}>||||| | |||| ||| ||||</div>
                </div>
              </div>

            </div>
          </div>

          <div className="modal-footer border-secondary border-opacity-25 pt-2">
            <button type="button" className="btn btn-cinema-outline" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i> Print Ticket
            </button>
            <button type="button" className="btn btn-cinema" onClick={onClose}>
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TicketModal;

