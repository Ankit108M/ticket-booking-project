import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingHistory } from '../api';

const STATUS_BADGE = {
  CONFIRMED: 'badge-green',
  PENDING:   'badge-yellow',
};

const PAYMENT_ICONS = { UPI: '📱', CARD: '💳', WALLET: '👛' };

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('tbUser') || '{}');

  useEffect(() => {
    if (!user.id) return;
    getBookingHistory(user.id)
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>📜 <span className="gradient-text">My Bookings</span></h1>
        <p>All your ticket bookings in one place</p>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎟️</div>
          <h3>No bookings yet</h3>
          <p style={{ marginBottom: 24 }}>You haven't booked any tickets. Start exploring events!</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/events')}>
            🎭 Browse Events
          </button>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Bookings', val: bookings.length, icon: '🎫' },
              { label: 'Confirmed', val: bookings.filter(b => b.paymentStatus === 'CONFIRMED').length, icon: '✅' },
              { label: 'Total Spent', val: `₹${bookings.reduce((a, b) => a + (b.amountPaid || 0), 0).toLocaleString('en-IN')}`, icon: '💰' },
            ].map(s => (
              <div key={s.label} className="card" style={{ flex: '1 1 160px', textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }} className="gradient-text">{s.val}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Event</th>
                    <th>Venue</th>
                    <th>Seat</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--purple-light)', fontWeight: 700 }}>#{b.id}</td>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 600, maxWidth: 180 }}>{b.eventName}</td>
                      <td>{b.eventLocation?.split(',')[0]}</td>
                      <td><span className="badge badge-purple">{b.seatNumber}</span></td>
                      <td>{PAYMENT_ICONS[b.paymentMethod]} {b.paymentMethod}</td>
                      <td>{formatDate(b.bookingDate)}</td>
                      <td style={{ color: 'var(--green)', fontWeight: 700 }}>₹{b.amountPaid?.toLocaleString('en-IN')}</td>
                      <td><span className={`badge ${STATUS_BADGE[b.paymentStatus] || 'badge-yellow'}`}>{b.paymentStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
