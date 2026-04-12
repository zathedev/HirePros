import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PlusCircle, 
  Info, 
  MapPin, 
  Wallet, 
  Type, 
  AlignLeft,
  ChevronRight
} from 'lucide-react';
import './PostJob.css';

const CATEGORIES = ['Plumbing', 'Electrician', 'Tutoring', 'AC Repair', 'Painting', 'Car Repair', 'Cleaning', 'IT Support', 'Other'];

export default function PostJob() {
  const [form, setForm] = useState({ title: '', description: '', budget: '', location: '', category: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/jobs', form);
      navigate(`/jobs/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="post-job-page">
      <div className="post-job-container">
        <div className="post-job-layout">
          
          {/* Main Form Area */}
          <div className="post-job-content">
            <header className="post-header">
              <h1>Post a <span>Project Brief</span></h1>
              <p>Give as much detail as possible to get the most accurate proposals.</p>
            </header>

            {error && <div className="fiverr-alert error">{error}</div>}

            <form onSubmit={handleSubmit} className="fiverr-post-form">
              {/* Title Section */}
              <div className="form-section">
                <label><Type size={18} /> Project Title</label>
                <input 
                  name="title"
                  placeholder="e.g. Need a professional to fix my bathroom plumbing" 
                  value={form.title}
                  onChange={handleInputChange} 
                  required 
                />
                <span className="input-hint">Your title is the first thing pros will see. Make it clear.</span>
              </div>

              {/* Description Section */}
              <div className="form-section">
                <label><AlignLeft size={18} /> Description</label>
                <textarea 
                  name="description"
                  rows={6} 
                  placeholder="Describe the service you're looking for. Be specific about the problem and any tools required." 
                  value={form.description}
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              {/* Row: Category & Budget */}
              <div className="form-row">
                <div className="form-section flex-1">
                  <label>Category</label>
                  <div className="select-wrapper">
                    <select name="category" value={form.category} onChange={handleInputChange} required>
                      <option value="">Select a category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-section flex-1">
                  <label><Wallet size={16} /> Budget (PKR)</label>
                  <div className="budget-input-group">
                    <span className="currency-prefix">Rs.</span>
                    <input 
                      type="number" 
                      name="budget"
                      placeholder="e.g. 5000" 
                      value={form.budget}
                      onChange={handleInputChange} 
                      required 
                      min={1} 
                    />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="form-section">
                <label><MapPin size={18} /> Service Location</label>
                <input 
                  name="location"
                  placeholder="e.g. Karachi, Gulshan-e-Iqbal" 
                  value={form.location}
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-footer">
                <button className="btn-fiverr-primary btn-large" disabled={loading}>
                  {loading ? 'Publishing...' : 'Review & Post'} 
                  {!loading && <ChevronRight size={18} />}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Tips Area */}
          <aside className="post-job-sidebar">
            <div className="tips-card">
              <h3><Info size={20} /> Tips for Success</h3>
              <ul>
                <li><strong>Be specific:</strong> Detail exactly what needs to be fixed or built.</li>
                <li><strong>Be honest:</strong> Mention if any parts or materials are already available.</li>
                <li><strong>Fair pricing:</strong> Check similar jobs to ensure your budget is competitive.</li>
                <li><strong>Location:</strong> Mention specific landmarks if necessary for easy navigation.</li>
              </ul>
            </div>
            
            <div className="safety-badge">
              <PlusCircle size={20} />
              <p>Your privacy is important. Do not share your phone number until you have hired a pro.</p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}