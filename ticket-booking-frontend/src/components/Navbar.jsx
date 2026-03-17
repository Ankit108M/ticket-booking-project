import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRaw = localStorage.getItem('tbUser');
  const user = userRaw ? JSON.parse(userRaw) : null;

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  if (isAuthPage) return null;

  const logout = () => {
    localStorage.removeItem('tbUser');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/events" className="nav-logo">
          🎫 TicketZone
        </Link>

        {user && (
          <div className="nav-links">
            <Link to="/events" className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}>
              🎭 Events
            </Link>
            <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>
              📜 My Bookings
            </Link>
          </div>
        )}

        {user ? (
          <div className="nav-user">
            <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user.name}</span>
            <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={logout}>
              Sign Out
            </button>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/login" className="btn btn-outline" style={{ padding: '8px 18px' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px' }}>Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
