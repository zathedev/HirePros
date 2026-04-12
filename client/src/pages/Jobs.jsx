import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Tag, Users, Filter, ChevronDown, SlidersHorizontal } from 'lucide-react';
import './Jobs.css';

const CATEGORIES = ['Plumbing', 'Electrician', 'Tutoring', 'AC Repair', 'Painting', 'Car Repair', 'Cleaning', 'IT Support', 'Other'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', location: '', minBudget: '', maxBudget: '' });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await axios.get('/api/jobs', { params });
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="jobs-browse-wrapper">
      <div className="container">
        {/* Header Section */}
        <header className="browse-header">
          <div className="header-left">
            <h1>Results for <span>Local Services</span></h1>
            <p>{jobs.length} services available in Pakistan</p>
          </div>
          {user?.role === 'customer' && (
            <Link to="/post-job" className="btn-fiverr-primary">+ Post a Job Request</Link>
          )}
        </header>

        {/* Filter Toolbar */}
        <div className="fiverr-filter-bar">
          <div className="filter-item search-box">
            <Search size={18} />
            <input 
              name="search"
              placeholder="Search for any service..." 
              value={filters.search}
              onChange={handleInputChange} 
            />
          </div>

          <div className="filter-actions">
            <div className="custom-select">
              <select name="category" value={filters.category} onChange={handleInputChange}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} />
            </div>

            <div className="filter-item location-box">
              <MapPin size={18} />
              <input 
                name="location"
                placeholder="City/Area" 
                value={filters.location}
                onChange={handleInputChange} 
              />
            </div>

            <div className="budget-inputs">
              <input 
                type="number" 
                name="minBudget"
                placeholder="Min Budget" 
                value={filters.minBudget}
                onChange={handleInputChange} 
              />
              <span className="separator">-</span>
              <input 
                type="number" 
                name="maxBudget"
                placeholder="Max Budget" 
                value={filters.maxBudget}
                onChange={handleInputChange} 
              />
            </div>

            <button className="btn-apply-filters" onClick={fetchJobs}>
              <SlidersHorizontal size={16} /> Apply
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="fiverr-loading">
            <div className="loader"></div>
            <p>Fetching the best local pros...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-results">
            <Filter size={64} color="#e4e5e7" />
            <h3>No jobs found</h3>
            <p>Try adjusting your search filters to find what you're looking for.</p>
            <button onClick={() => setFilters({ search: '', category: '', location: '', minBudget: '', maxBudget: '' })} className="btn-fiverr-outline">Clear All</button>
          </div>
        ) : (
          <div className="gig-grid">
            {jobs.map(job => (
              <Link to={`/jobs/${job._id}`} key={job._id} className="gig-card-link">
                <div className="gig-card">
                  <div className="gig-card-header">
                    <div className="user-profile">
                      <div className="avatar-placeholder">{job.postedBy?.name?.[0]}</div>
                      <div className="user-info">
                        <span className="username">{job.postedBy?.name}</span>
                        <span className="user-type">Client</span>
                      </div>
                    </div>
                    <span className={`status-badge ${job.status}`}>
                      {job.status === 'open' ? 'Open' : job.status}
                    </span>
                  </div>

                  <div className="gig-card-body">
                    <h3 className="gig-title">{job.title}</h3>
                    <p className="gig-desc">{job.description}</p>
                    <div className="gig-meta">
                      <span><MapPin size={14} /> {job.location}</span>
                      <span><Tag size={14} /> {job.category}</span>
                    </div>
                  </div>

                  <div className="gig-card-footer">
                    <div className="proposals">
                      <Users size={16} />
                      <span>{job.applicants?.length || 0} Proposals</span>
                    </div>
                    <div className="price-info">
                      <span className="price-label">BUDGET</span>
                      <span className="price-val">Rs. {job.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}