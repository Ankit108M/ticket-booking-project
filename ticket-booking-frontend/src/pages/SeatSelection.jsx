import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, getSeats } from '../api';

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getEvent(id), getSeats(id)])
      .then(([evRes, seatRes]) => {
        setEvent(evRes.data);
        setSeats(seatRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const rows = ['A', 'B', 'C', 'D'];
  const cols = [1, 2, 3, 4, 5, 6];

  const getSeat = (row, col) => seats.find(s => s.seatNumber === `${row}${col}`);

  const handleSelect = (seat) => {
    if (seat?.status === 'BOOKED') return;
    setSelected(seat?.seatNumber === selected ? null : seat?.seatNumber);
  };

  const handleProceed = () => {
    if (!selected) return;
    navigate('/payment', { state: { event, seatNumber: selected } });
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <button onClick={() => navigate('/events')} className="btn btn-outline"
          style={{ marginBottom: 16, padding: '8px 16px', fontSize: '0.85rem' }}>
          ← Back to Events
        </button>
        <h1>{event?.eventName}</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
          📍 {event?.location} &nbsp;|&nbsp; 📅 {formatDate(event?.date)}
        </p>
      </div>

      <div className="seat-layout">
        {/* Seat Grid */}
        <div className="seat-grid-wrapper">
          <div className="screen-bar">
            <div className="screen-display" />
            <div className="screen-label">Stage / Screen</div>
          </div>

          <div className="seat-rows">
            {rows.map(row => (
              <div key={row} className="seat-row">
                <div className="row-label">{row}</div>
                {cols.map(col => {
                  const seat = getSeat(row, col);
                  const isBooked   = seat?.status === 'BOOKED';
                  const isSelected = seat?.seatNumber === selected;
                  return (
                    <button
                      key={`${row}${col}`}
                      className={`seat-btn ${isBooked ? 'seat-booked' : isSelected ? 'seat-selected' : 'seat-available'}`}
                      onClick={() => handleSelect(seat)}
                      disabled={isBooked}
                      title={`Seat ${row}${col} — ${isBooked ? 'Booked' : 'Available'}`}
                    >
                      {row}{col}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="seat-legend">
            <div className="legend-item"><div className="legend-dot legend-available" /> Available</div>
            <div className="legend-item"><div className="legend-dot legend-booked" /> Booked</div>
            <div className="legend-item"><div className="legend-dot legend-selected" /> Selected</div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="seat-summary">
          <h3>🎟️ Booking Summary</h3>
          <div className="summary-row">
            <span>Event</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right', maxWidth: 160 }}>
              {event?.eventName}
            </span>
          </div>
          <div className="summary-row">
            <span>Date</span>
            <span>{formatDate(event?.date)}</span>
          </div>
          <div className="summary-row">
            <span>Venue</span>
            <span style={{ textAlign: 'right', maxWidth: 160 }}>{event?.location?.split(',')[0]}</span>
          </div>
          <div className="summary-row">
            <span>Seat</span>
            <span style={{ color: selected ? 'var(--purple-light)' : 'var(--text-muted)', fontWeight: 700 }}>
              {selected || '— Not selected'}
            </span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span className="gradient-text">
              {selected ? `₹${event?.price?.toLocaleString('en-IN')}` : '₹0'}
            </span>
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: 24 }}
            disabled={!selected}
            onClick={handleProceed}
          >
            Proceed to Payment →
          </button>

          {!selected && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 10 }}>
              👆 Click a green seat to select
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
