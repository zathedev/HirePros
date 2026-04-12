import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PenTool, Zap, BookOpen, Wind, Paintbrush, Car, Trash2, Monitor, CheckCircle } from 'lucide-react';
import './Home.css';
import Footer from './../components/Footer';

const categories = [
  { icon: <Zap size={32} />, name: 'Electrician' },
  { icon: <PenTool size={32} />, name: 'Plumbing' },
  { icon: <BookOpen size={32} />, name: 'Tutoring' },
  { icon: <Wind size={32} />, name: 'AC Repair' },
  { icon: <Paintbrush size={32} />, name: 'Painting' },
  { icon: <Car size={32} />, name: 'Car Repair' },
  { icon: <Trash2 size={32} />, name: 'Cleaning' },
  { icon: <Monitor size={32} />, name: 'IT Support' },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="home-wrapper">
      {/* Fiverr Style Hero */}
      <section className="fiverr-hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Find the perfect <span>local pro</span> services for your home</h1>
            <div className="hero-search">
              <div className="search-input-group">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder='Try "plumber in Karachi"' 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="search-submit" onClick={handleSearch}>Search</button>
            </div>
            <div className="popular-tags">
              <span>Popular:</span>
              <Link to="/services?category=Plumbing">Plumbing</Link>
              <Link to="/services?category=Electrician">Electrician</Link>
              <Link to="/services?category=Painting">Painting</Link>
            </div>
          </div>
          <div className="hero-image hide-mobile">
            <img 
              src="https://gacservices.com/wp-content/uploads/2018/01/electrician-working-on-electrical-panel-circuit-breaker-box.jpg" 
              alt="Professional Service Provider" 
              className="hero-main-img"
            />
            <div className="trust-badge">Verified Professionals 🇵🇰</div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Popular Professional Services</h2>
          <div className="categories-fiverr-grid">
            {categories.map(cat => (
              <Link key={cat.name} to={`/services?category=${cat.name}`} className="cat-tile">
                <div className="tile-icon">{cat.icon}</div>
                <hr />
                <span className="tile-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="value-prop bg-dark">
        <div className="container prop-grid">
          <div className="prop-text">
            <h2>The best part? Everything.</h2>
            <div className="prop-item">
              <h6><CheckCircle size={20} className="check-icon" /> Stick to your budget</h6>
              <p>Find the right service for every price point. No hourly rates, just project-based pricing.</p>
            </div>
            <div className="prop-item">
              <h6><CheckCircle size={20} className="check-icon" /> Get quality work done quickly</h6>
              <p>Hand over your projects to talented freelancers in minutes, get long-lasting results.</p>
            </div>
            <div className="prop-item">
              <h6><CheckCircle size={20} className="check-icon" /> 24/7 support</h6>
              <p>Questions? Our round-the-clock support team is available to help anytime, anywhere.</p>
            </div>
          </div>
          <div className="prop-video-placeholder">
            {/* Visual element like an image of a professional at work */}
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section className="seller-cta">
        <div className="container cta-box">
          <h2>Suddenly, it's all so doable.</h2>
          <p>Become a part of Pakistan's largest local service community.</p>
          <Link to="/register" className="btn-fiverr-light">Join HirePros</Link>
        </div>
      </section>
      <Footer/>
    </div>
  );
}