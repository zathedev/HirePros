import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react'; // Import Lucide Search
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fiverr-navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="fiverr-logo">
            HirePros<span className="dot">.</span>
          </Link>
          <div className="nav-search-bar">
            <input type="text" placeholder="What service are you looking for today?" />
            <button className="search-btn">
              <Search size={18} strokeWidth={2.5} /> {/* Lucide Icon */}
            </button>
          </div>
        </div>

        <div className="nav-right">
          <Link to="/jobs" className="nav-link hide-mobile">Explore</Link>
          <Link to="/services" className="nav-link hide-mobile">Services</Link>
          
          {user ? (
            <>
              <Link to="/chat" className="nav-link">Messages</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <div className="user-profile-circle">
                {user.name.charAt(0).toUpperCase()}
                <div className="dropdown-content">
                    <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link sign-in">Sign In</Link>
              <Link to="/register" className="btn-join">Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}