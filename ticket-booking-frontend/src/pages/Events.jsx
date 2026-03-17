import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../api';

const CATEGORY_ICONS = {
  MUSIC: '🎵', TECH: '💻', SPORTS: '🏏', COMEDY: '😂', ALL: '🌟'
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('tbUser') || '{}');

  useEffect(() => {
    getEvents()
      .then(res => { setEvents(res.data); setFiltered(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = events;
    if (category !== 'ALL') list = list.filter(e => e.category === category);
    if (search) list = list.filter(e =>
      e.eventName.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [category, search, events]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (t) => {
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  const categories = ['ALL', 'MUSIC', 'TECH', 'SPORTS', 'COMEDY'];

  return (
    <div className="page">
      {/* Hero */}
      <div className="events-hero">
        <h1>
          <span className="gradient-text">Discover Events</span><br />
          Near You 🎭
        </h1>
        <p>Browse concerts, sports, tech talks and more — book your seat instantly.</p>
      </div>

      {/* Search */}
      <div className="search-bar" style={{ maxWidth: 500, marginBottom: 20 }}>
        <span className="search-icon">🔍</span>
        <input className="form-input" placeholder="Search events or locations..."
          value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
      </div>

      {/* Category Filter */}
      <div className="filter-bar">
        {categories.map(cat => (
          <button key={cat} className={`filter-chip ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}>
            {CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎪</div>
          <h3>No events found</h3>
          <p>Try a different category or search term</p>
        </div>
      ) : (
        <div className="events-grid">
          {filtered.map(event => (
            <div key={event.id} className="event-card" onClick={() => navigate(`/events/${event.id}/seats`)}>
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.eventName} className="event-img" />
              ) : (
                <div className="event-img-placeholder">{CATEGORY_ICONS[event.category] || '🎫'}</div>
              )}
              <div className="event-body">
                <div className="event-category">
                  <span className={`badge ${event.category === 'MUSIC' ? 'badge-purple' : event.category === 'TECH' ? 'badge-cyan' : event.category === 'SPORTS' ? 'badge-green' : 'badge-yellow'}`}>
                    {CATEGORY_ICONS[event.category]} {event.category}
                  </span>
                </div>
                <h2 className="event-title">{event.eventName}</h2>
                <div className="event-meta">
                  <div className="event-meta-item">📍 {event.location}</div>
                  <div className="event-meta-item">📅 {formatDate(event.date)}</div>
                  <div className="event-meta-item">⏰ {formatTime(event.time)}</div>
                  {event.description && (
                    <div className="event-meta-item" style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 4 }}>
                      {event.description.slice(0, 80)}...
                    </div>
                  )}
                </div>
                <div className="event-footer">
                  <div className="event-price">₹{event.price?.toLocaleString('en-IN')}</div>
                  <button className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '0.85rem' }}>
                    Book Now →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
