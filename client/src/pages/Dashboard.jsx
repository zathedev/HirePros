import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, MessageSquare, MapPin, Trash2, Briefcase, ExternalLink } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'customer') {
          const { data } = await axios.get('/api/jobs/user/mine');
          setJobs(data);
        } else {
          const svcRes = await axios.get('/api/services/user/mine');
          setServices(svcRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const deleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`/api/services/${id}`);
        setServices(services.filter(s => s._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading-state">Loading your dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* Professional Header */}
        <header className="dashboard-header">
          <div className="header-info">
            <h1>Welcome back, {user.name}</h1>
            <p className="role-tag">Account Type: <span>{user.role}</span></p>
          </div>
          <div className="header-actions">
            {user.role === 'customer' ? (
              <Link to="/post-job" className="btn-fiverr-primary">
                <Plus size={18} /> Post a Job
              </Link>
            ) : (
              <Link to="/post-service" className="btn-fiverr-primary">
                <Plus size={18} /> Create a Service
              </Link>
            )}
            <Link to="/chat" className="btn-fiverr-outline">
              <MessageSquare size={18} /> Inbox
            </Link>
          </div>
        </header>

        <hr className="divider" />

        {/* Content Section */}
        <main className="dashboard-content">
          
          {user.role === 'customer' ? (
            <section>
              <div className="section-title">
                <h2>Manage Posted Jobs</h2>
                <span className="count-badge">{jobs.length}</span>
              </div>

              {jobs.length === 0 ? (
                <div className="empty-state">
                  <Briefcase size={48} />
                  <p>You haven't posted any jobs yet.</p>
                  <Link to="/post-job" className="text-link">Post your first job today</Link>
                </div>
              ) : (
                <div className="dashboard-grid">
                  {jobs.map(job => (
                    <div className="fiverr-card" key={job._id}>
                      <div className="card-top">
                        <span className={`status-pill ${job.status}`}>{job.status}</span>
                        <span className="cat-pill">{job.category}</span>
                      </div>
                      <h3 className="card-title">{job.title}</h3>
                      <div className="card-footer">
                        <div className="budget">Rs. {job.budget.toLocaleString()}</div>
                        <div className="applicants">{job.applicants?.length || 0} proposals</div>
                      </div>
                      <Link to={`/jobs/${job._id}`} className="view-btn">
                        Manage Job <ExternalLink size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section>
              <div className="section-title">
                <h2>Active Services</h2>
                <span className="count-badge">{services.length}</span>
              </div>

              {services.length === 0 ? (
                <div className="empty-state">
                  <Plus size={48} />
                  <p>Ready to start earning? Create a service.</p>
                  <Link to="/post-service" className="text-link">Become a local pro</Link>
                </div>
              ) : (
                <div className="dashboard-grid">
                  {services.map(service => (
                    <div className="fiverr-card" key={service._id}>
                      <div className="card-top">
                        <span className="cat-pill">{service.category}</span>
                        <div className="price-tag">Starting at <span>Rs. {service.price}</span></div>
                      </div>
                      <h3 className="card-title">{service.title}</h3>
                      <div className="location-info">
                        <MapPin size={14} /> {service.location}
                      </div>
                      <div className="card-actions">
                        <button className="delete-btn" onClick={() => deleteService(service._id)}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}