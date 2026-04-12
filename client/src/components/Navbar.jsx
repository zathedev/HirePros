import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; // Import NavLink
import { useAuth } from '../context/AuthContext';
import { Search, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && searchTerm.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Clear after search
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="fiverr-navbar">
      <div className="nav-container">
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="nav-left">
          <Link to="/" className="fiverr-logo">
            HirePros<span className="dot">.</span>
          </Link>
          <div className="nav-search-bar">
            <input 
              type="text" 
              placeholder="What service are you looking for today?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button className="search-btn" onClick={handleSearch}>
              <Search size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className={`nav-right ${isMobileMenuOpen ? 'active' : ''}`}>
          {/* Use NavLink instead of Link for automatic 'active' class */}
          <NavLink to="/jobs" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Explore</NavLink>
          <NavLink to="/services" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Services</NavLink>
          
          {user ? (
            <>
              <NavLink to="/chat" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Messages</NavLink>
              <NavLink to="/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavLink>
              <div className="user-profile-circle hide-mobile">
                {user.name.charAt(0).toUpperCase()}
                <div className="dropdown-content">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
              <button className="nav-link mobile-only-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Sign In</NavLink>
              <Link to="/register" className="btn-join" onClick={() => setIsMobileMenuOpen(false)}>Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}