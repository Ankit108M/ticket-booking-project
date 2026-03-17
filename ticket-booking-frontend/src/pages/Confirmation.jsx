import { useLocation, useNavigate } from 'react-router-dom';

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { booking, event } = state || {};

  if (!booking) { navigate('/events'); return null; }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const PAYMENT_ICONS = { UPI: '📱', CARD: '💳', WALLET: '👛' };

  return (
    <div className="page">
      <div className="confirm-wrapper">
        <div className="confirm-icon">✅</div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>
          <span className="gradient-text">Booking Confirmed!</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: '1.05rem' }}>
          Your ticket has been booked successfully. Enjoy the event! 🎉
        </p>

        {/* Ticket Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: 28,
          textAlign: 'left',
        }}>
          {/* Ticket Header */}
          <div style={{
            background: 'var(--gradient)',
            padding: '20px 28px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.8, marginBottom: 4 }}>BOOKING ID</div>
              <div style={{ fontWeight: 800, fontSize: '1.3rem' }}>#{booking.id}</div>
            </div>
            <div style={{ fontSize: '2.5rem' }}>🎫</div>
          </div>

          {/* Ticket Body */}
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['🎭 Event',   booking.eventName],
              ['📍 Venue',   booking.eventLocation],
              ['💺 Seat',    booking.seatNumber],
              [PAYMENT_ICONS[booking.paymentMethod] + ' Payment', booking.paymentMethod],
              ['📅 Booked',  formatDate(booking.bookingDate)],
              ['✅ Status',  booking.paymentStatus],
              ['💰 Amount',  `₹${booking.amountPaid?.toLocaleString('en-IN')}`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontWeight: 600, color: val === 'CONFIRMED' ? 'var(--green)' : 'var(--text-primary)', textAlign: 'right', maxWidth: 220 }}>
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Dashed separator */}
          <div style={{ margin: '0 24px', borderTop: '2px dashed var(--border)' }} />
          <div style={{ padding: '16px 28px', display: 'flex', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.08em' }}>
              🎟️ VALID FOR ONE ENTRY ONLY
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/history')}>
            📜 View All Bookings
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/events')}>
            🎭 Browse More Events
          </button>
        </div>
      </div>
    </div>
  );
}
