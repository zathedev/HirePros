import { useState } from 'react'; // Added useState
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Menu, X } from 'lucide-react'; // Added Menu and X
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="fiverr-navbar">
      <div className="nav-container">
        {/* Mobile Hamburger - Left on mobile */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="nav-left">
          <Link to="/" className="fiverr-logo">
            HirePros<span className="dot">.</span>
          </Link>
          <div className="nav-search-bar">
            <input type="text" placeholder="What service are you looking for today?" />
            <button className="search-btn">
              <Search size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Right */}
        <div className={`nav-right ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/jobs" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Explore</Link>
          <Link to="/services" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
          
          {user ? (
            <>
              <Link to="/chat" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Messages</Link>
              <Link to="/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
              <div className="user-profile-circle hide-mobile">
                {user.name.charAt(0).toUpperCase()}
                <div className="dropdown-content">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
              {/* Mobile Logout Link */}
              <button className="nav-link mobile-only-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn-join" onClick={() => setIsMobileMenuOpen(false)}>Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}