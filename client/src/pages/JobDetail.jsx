import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, MapPin, User, MessageSquare, 
  CheckCircle, Star, AlertCircle, Briefcase, ExternalLink 
} from 'lucide-react';
import './JobDetail.css';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [showReview, setShowReview] = useState(false);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`/api/jobs/${id}`);
      setJob(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJob(); }, [id]);

  const handleApply = async () => {
    try {
      await axios.post(`/api/jobs/${id}/apply`);
      setMsg('Application sent successfully!');
      fetchJob();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error applying');
    }
  };

  const handleHire = async (providerId) => {
    try {
      await axios.post(`/api/jobs/${id}/hire/${providerId}`);
      setMsg('Provider hired successfully!');
      fetchJob();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error hiring');
    }
  };

  const handleComplete = async () => {
    try {
      await axios.post(`/api/jobs/${id}/complete`);
      setMsg('Job marked as complete!');
      fetchJob();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews', {
        job: id,
        provider: job.hiredProvider._id,
        rating: review.rating,
        comment: review.comment
      });
      setMsg('Thank you for your feedback!');
      setShowReview(false);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) return <div className="loading-state">Loading project details...</div>;
  if (!job) return <div className="error-state">Project not found.</div>;

  const isOwner = user?.id === job.postedBy?._id;
  const hasApplied = job.applicants?.some(a => a._id === user?.id);

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        
        {msg && (
          <div className={`fiverr-alert ${msg.includes('Error') ? 'error' : 'success'}`}>
            {msg.includes('Error') ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            {msg}
          </div>
        )}

        <div className="job-main-layout">
          {/* Left Column: Content */}
          <div className="job-content-area">
            <header className="job-header">
              <div className="breadcrumb">Projects / {job.category}</div>
              <h1>{job.title}</h1>
              <div className="job-meta-row">
                <span className={`status-tag ${job.status}`}>{job.status}</span>
                <span className="posted-time"><Clock size={14} /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </header>

            <section className="job-section">
              <h3>Description</h3>
              <p className="description-text">{job.description}</p>
            </section>

            {isOwner && job.applicants?.length > 0 && (
              <section className="applicants-section">
                <h3>Proposals ({job.applicants.length})</h3>
                <div className="applicants-list">
                  {job.applicants.map(applicant => (
                    <div key={applicant._id} className="applicant-card">
                      <div className="applicant-info">
                        <div className="mini-avatar">{applicant.name[0]}</div>
                        <div>
                          <div className="applicant-name">{applicant.name}</div>
                          <div className="applicant-sub"><MapPin size={12} /> {applicant.city}</div>
                        </div>
                      </div>
                      <div className="applicant-actions">
                        <Link to={`/chat/${applicant._id}`} className="btn-fiverr-outline btn-sm">
                          <MessageSquare size={14} /> Chat
                        </Link>
                        {job.status === 'open' && (
                          <button className="btn-fiverr-primary btn-sm" onClick={() => handleHire(applicant._id)}>
                            Hire Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {showReview && (
              <section className="review-form-section">
                <h3>Rate the Experience</h3>
                <form onSubmit={handleReview} className="fiverr-form">
                  <div className="form-group">
                    <label>How would you rate the service?</label>
                    <div className="star-rating">
                      {[5, 4, 3, 2, 1].map(num => (
                        <button 
                          key={num} 
                          type="button" 
                          className={review.rating >= num ? 'active' : ''}
                          onClick={() => setReview({...review, rating: num})}
                        >
                          <Star size={20} fill={review.rating >= num ? "#ffbe5b" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Describe your experience</label>
                    <textarea 
                      rows={4} 
                      placeholder="Was the provider professional? Was the work quality good?"
                      value={review.comment} 
                      onChange={e => setReview({ ...review, comment: e.target.value })} 
                      required 
                    />
                  </div>
                  <button className="btn-fiverr-primary">Submit Review</button>
                </form>
              </section>
            )}
          </div>

          {/* Right Column: Sidebar Action Box */}
          <aside className="job-sidebar">
            <div className="action-card">
              <div className="price-box">
                <span className="label">Project Budget</span>
                <span className="value">Rs. {job.budget.toLocaleString()}</span>
              </div>
              
              <div className="detail-list">
                <div className="detail-item">
                  <MapPin size={18} />
                  <div>
                    <span className="d-label">Location</span>
                    <span className="d-value">{job.location}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <User size={18} />
                  <div>
                    <span className="d-label">Posted By</span>
                    <span className="d-value">{job.postedBy?.name}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Briefcase size={18} />
                  <div>
                    <span className="d-label">Category</span>
                    <span className="d-value">{job.category}</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-actions">
                {user?.role === 'provider' && job.status === 'open' && !hasApplied && (
                  <button className="btn-fiverr-primary full-width" onClick={handleApply}>
                    Send Proposal
                  </button>
                )}
                {user?.role === 'provider' && hasApplied && (
                  <div className="applied-status">
                    <CheckCircle size={18} /> Application Sent
                  </div>
                )}
                {isOwner && job.status === 'in-progress' && (
                  <button className="btn-fiverr-primary full-width success" onClick={handleComplete}>
                    Mark as Completed
                  </button>
                )}
                {isOwner && job.status === 'completed' && !showReview && (
                  <button className="btn-fiverr-primary full-width" onClick={() => setShowReview(true)}>
                    Leave a Review
                  </button>
                )}
                {user && !isOwner && (
                  <Link to={`/chat/${job.postedBy?._id}`} className="btn-fiverr-outline full-width">
                    <MessageSquare size={18} /> Contact Client
                  </Link>
                )}
              </div>
            </div>

            <div className="safety-card">
              <AlertCircle size={20} />
              <p>For your protection, only communicate and pay through the HirePros platform.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}