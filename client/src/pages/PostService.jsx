import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Zap, 
  MapPin, 
  DollarSign, 
  Layers, 
  FileText, 
  Sparkles,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import './PostService.css';

const CATEGORIES = ['Plumbing', 'Electrician', 'Tutoring', 'AC Repair', 'Painting', 'Car Repair', 'Cleaning', 'IT Support', 'Other'];

export default function PostService() {
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', location: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/services', form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gig-creation-page">
      <div className="gig-container">
        <div className="gig-layout">
          
          {/* Main Form Body */}
          <div className="gig-main-card">
            <header className="gig-header">
              <div className="step-indicator">Step 1 of 1: Overview</div>
              <h1>Create a <span>New Gig</span></h1>
              <p>Offer your skills to the local community and start earning.</p>
            </header>

            {error && (
              <div className="fiverr-alert error">
                <Zap size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="fiverr-form">
              {/* Title Section */}
              <div className="form-section">
                <div className="label-row">
                  <label><Sparkles size={18} color="#1dbf73" /> Gig Title</label>
                  <span className="char-count">{form.title.length}/80</span>
                </div>
                <div className="input-with-prefix">
                  <span className="prefix">I will</span>
                  <input 
                    placeholder="e.g. fix your AC unit with a 30-day warranty" 
                    value={form.title}
                    maxLength={80}
                    onChange={e => setForm({ ...form, title: e.target.value })} 
                    required 
                  />
                </div>
                <small className="field-hint">Start with "I will" to make it catchy and professional.</small>
              </div>

              {/* Description Section */}
              <div className="form-section">
                <label><FileText size={18} /> Description</label>
                <textarea 
                  rows={6} 
                  placeholder="Tell your customers exactly what you offer. Mention your experience, what tools you bring, and why you're the best choice." 
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                  required 
                />
              </div>

              {/* Row: Category & Location */}
              <div className="form-row">
                <div className="form-section flex-1">
                  <label><Layers size={18} /> Category</label>
                  <div className="select-wrapper">
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                      <option value="">Select a category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-section flex-1">
                  <label><MapPin size={18} /> Work Location</label>
                  <input 
                    placeholder="e.g. Lahore, Gulberg" 
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              {/* Price Section */}
              <div className="form-section price-section">
                <label><DollarSign size={18} /> Basic Service Price</label>
                <div className="price-input-wrapper">
                  <span className="currency-unit">Rs.</span>
                  <input 
                    type="number" 
                    placeholder="1500" 
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })} 
                    required 
                    min={1} 
                  />
                </div>
                <small className="field-hint">You can always negotiate details later in the chat.</small>
              </div>

              <div className="gig-form-footer">
                <button className="btn-fiverr-primary btn-publish" disabled={loading}>
                  {loading ? 'Publishing...' : 'Save & Continue'}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Guidelines */}
          <aside className="gig-sidebar">
            <div className="guideline-card">
              <h3><Lightbulb size={20} color="#ffbe5b" /> Gig Checklist</h3>
              <ul>
                <li><CheckCircle2 size={14} /> Use a clear, concise title.</li>
                <li><CheckCircle2 size={14} /> Choose the correct category.</li>
                <li><CheckCircle2 size={14} /> Describe your service in detail.</li>
                <li><CheckCircle2 size={14} /> Set a competitive starting price.</li>
              </ul>
            </div>

            <div className="pro-tip">
              <p><strong>Pro Tip:</strong> Gigs with detailed descriptions are 40% more likely to get hired!</p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}