import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react'; 
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const { data } = await axios.post('/api/auth/login', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign In to Your Account</h2>
        <p className="auth-sub">Enter your details to continue</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Email address" 
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} 
                required 
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>
          
          <button className="btn-fiverr" disabled={loading}>
            {loading ? 'Logging in...' : 'Continue'}
          </button>
        </form>
        
        <p className="auth-footer">
          Not a member yet? <Link to="/register">Join now</Link>
        </p>
      </div>
    </div>
  );
}