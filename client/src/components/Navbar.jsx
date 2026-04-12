import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; // Import NavLink
import { useAuth } from '../context/AuthContext';
import { Search, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle UI effects (scroll shadow, resize behavior, scroll lock)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Lock body scroll when mobile menu is open for better UX
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

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
    <nav className={`fiverr-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="nav-overlay" onClick={toggleMobileMenu}></div>
        )}

        <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle Menu">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="nav-left">
          <Link to="/" className="fiverr-logo" onClick={() => setIsMobileMenuOpen(false)}>
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
          <div className="mobile-nav-header mobile-only">Menu</div>
          <NavLink to="/jobs" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Explore</NavLink>
          <NavLink to="/services" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Services</NavLink>
          
          {user ? (
            <>
              <NavLink to="/chat" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Messages</NavLink>
              <NavLink to="/dashboard" className="nav-link mobile-only" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavLink>
              <div className="user-profile-circle hide-mobile">
                {user.name.charAt(0).toUpperCase()}
                <div className="dropdown-content">
                  <div className="dropdown-header">
                    <span className="dropdown-label">Signed in as</span>
                    <strong>{user.name}</strong>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard size={16} /> Dashboard
                  </button>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
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