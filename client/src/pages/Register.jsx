import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', city: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Join HirePros</h2>
        <p className="auth-sub">Create an account to get started</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Ali Hassan" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Email address" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="At least 6 characters" 
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} 
                required 
                minLength={6} 
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>City</label>
            <input type="text" placeholder="Karachi" value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Account Type</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="customer">I want to hire</option>
              <option value="provider">I want to work</option>
            </select>
          </div>

          <button className="btn-fiverr" disabled={loading}>
            {loading ? 'Creating account...' : 'Join HirePros'}
          </button>
        </form>
        <p className="auth-footer">Already a member? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}