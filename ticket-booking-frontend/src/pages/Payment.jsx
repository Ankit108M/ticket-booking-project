import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookTicket } from '../api';

const PAYMENT_OPTIONS = [
  { id: 'UPI', icon: '📱', label: 'UPI Payment', sub: 'Google Pay, PhonePe, Paytm' },
  { id: 'CARD', icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Rupay' },
  { id: 'WALLET', icon: '👛', label: 'Wallet', sub: 'Paytm Wallet, Amazon Pay' },
];

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('tbUser') || '{}');
  const { event, seatNumber } = state || {};

  if (!event || !seatNumber) {
    navigate('/events');
    return null;
  }

  const handlePay = async () => {
    setLoading(true); setError('');
    try {
      const res = await bookTicket({
        userId: user.id,
        eventId: event.id,
        seatNumber,
        paymentMethod: method,
      });
      if (res.data.success) {
        navigate('/confirmation', { state: { booking: res.data.booking, event } });
      } else {
        setError(res.data.message);
      }
    } catch {
      setError('Payment failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="btn btn-outline"
            style={{ marginBottom: 16, padding: '8px 16px', fontSize: '0.85rem' }}>
            ← Go Back
          </button>
          <h1>💳 Complete Payment</h1>
          <p>Choose your payment method to confirm the booking</p>
        </div>

        {/* Order Summary */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 700 }}>📋 Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Event', event.eventName],
              ['Venue', event.location],
              ['Seat No.', seatNumber],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>Total Amount</span>
              <span className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 900 }}>
                ₹{event.price?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <h3 style={{ marginBottom: 14, fontWeight: 700 }}>💰 Select Payment Method</h3>
        <div className="payment-options">
          {PAYMENT_OPTIONS.map(opt => (
            <button key={opt.id} className={`payment-option ${method === opt.id ? 'selected' : ''}`}
              onClick={() => setMethod(opt.id)}>
              <span className="payment-icon">{opt.icon}</span>
              <div>
                <div className="payment-label">{opt.label}</div>
                <div className="payment-sub">{opt.sub}</div>
              </div>
              <div className="radio-check">{method === opt.id && <div className="radio-inner" />}</div>
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>⚠️ {error}</div>}

        <button className="btn btn-primary btn-lg btn-full" onClick={handlePay} disabled={loading}>
          {loading ? '⏳ Processing payment...' : `Pay ₹${event.price?.toLocaleString('en-IN')} via ${method}`}
        </button>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 12 }}>
          🔒 This is a simulated payment. No real money is charged.
        </p>
      </div>
    </div>
  );
}
