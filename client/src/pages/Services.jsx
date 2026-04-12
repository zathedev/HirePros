import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Star, MessageSquare, SlidersHorizontal, ChevronDown } from 'lucide-react';
import './Services.css';

const CATEGORIES = ['Plumbing', 'Electrician', 'Tutoring', 'AC Repair', 'Painting', 'Car Repair', 'Cleaning', 'IT Support', 'Other'];

export default function Services() {
  const [services, setServices] = useState([]);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: '', category: searchParams.get('category') || '', location: '', minPrice: '', maxPrice: ''
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await axios.get('/api/services', { params });
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="services-browse-page">
      <div className="container">
        {/* Market Header */}
        <header className="market-header">
          <div className="header-content">
            <h1>Expert <span>Services</span> for Your Home</h1>
            <p>Compare prices, portfolios, and reviews from verified local pros.</p>
          </div>
          {user?.role === 'provider' && (
            <Link to="/post-service" className="btn-fiverr-primary">+ Create a Gig</Link>
          )}
        </header>

        {/* Professional Filter Bar */}
        <div className="service-filter-bar">
          <div className="filter-group search">
            <Search size={18} />
            <input 
              name="search"
              placeholder="What service do you need today?" 
              value={filters.search}
              onChange={handleFilterChange} 
            />
          </div>

          <div className="filter-group-row">
            <div className="custom-dropdown">
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} />
            </div>

            <div className="filter-group location">
              <MapPin size={16} />
              <input 
                name="location"
                placeholder="City/Area" 
                value={filters.location}
                onChange={handleFilterChange} 
              />
            </div>

            <div className="price-range-inputs">
              <input type="number" name="minPrice" placeholder="Min Rs." value={filters.minPrice} onChange={handleFilterChange} />
              <span>-</span>
              <input type="number" name="maxPrice" placeholder="Max Rs." value={filters.maxPrice} onChange={handleFilterChange} />
            </div>

            <button className="btn-fiverr-dark" onClick={fetchServices}>
              <SlidersHorizontal size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="market-meta">
          <span>{services.length} services found</span>
        </div>

        {loading ? (
          <div className="fiverr-loader-container">
            <div className="fiverr-spinner"></div>
            <p>Loading expert services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="fiverr-empty-state">
            <h3>No services match your search.</h3>
            <p>Try broadening your filters or searching for something else.</p>
          </div>
        ) : (
          <div className="services-fiverr-grid">
            {services.map(service => (
              <div key={service._id} className="service-gig-card">
                {/* Image Placeholder - Fiverr style */}
                <div className="gig-image-placeholder">
                  <span className="category-label">{service.category}</span>
                </div>

                <div className="gig-card-details">
                  <div className="provider-info-row">
                    <div className="provider-avatar">{service.provider?.name?.[0]}</div>
                    <div className="provider-text">
                      <span className="p-name">{service.provider?.name}</span>
                      <span className="p-level">Level 2 Seller</span>
                    </div>
                  </div>

                  <h3 className="gig-title-text">{service.title}</h3>

                  <div className="gig-rating">
                    <Star size={14} fill="#ffbe5b" color="#ffbe5b" />
                    <span className="rating-score">5.0</span>
                    <span className="review-count">(10+)</span>
                  </div>

                  <div className="gig-location-tag">
                    <MapPin size={12} /> {service.location}
                  </div>
                </div>

                <div className="gig-card-footer">
                  {user && user.id !== service.provider?._id ? (
                    <Link to={`/chat/${service.provider?._id}`} className="contact-icon-btn">
                      <MessageSquare size={18} />
                    </Link>
                  ) : <div></div>}
                  
                  <div className="gig-pricing">
                    <span className="starting-text">STARTING AT</span>
                    <span className="price-val">Rs. {service.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}