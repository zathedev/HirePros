import { Link } from 'react-router-dom';
import { 
  Globe, 
  Coins, 
  Accessibility 
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import './Footer.css';

export default function Footer() {
  // Get the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fiverr-footer">
      <div className="container">
        <div className="footer-top">
          {/* ... Categories, About, Support, Community columns stay the same ... */}
          <div className="footer-column">
            <h5>Categories</h5>
            <ul>
              <li><Link to="/services?category=Plumbing">Plumbing</Link></li>
              <li><Link to="/services?category=Electrician">Electrician</Link></li>
              <li><Link to="/services?category=Tutoring">Tutoring</Link></li>
              <li><Link to="/services?category=AC Repair">AC Repair</Link></li>
              <li><Link to="/services?category=Car Repair">Car Repair</Link></li>
              <li><Link to="/services?category=Cleaning">Cleaning</Link></li>
              <li><Link to="/services?category=IT Support">IT Support</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h5>About</h5>
            <ul>
              <li><Link to="/about">Careers</Link></li>
              <li><Link to="/press">Press & News</Link></li>
              <li><Link to="/partnerships">Partnerships</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h5>Support</h5>
            <ul>
              <li><Link to="/help">Help & Support</Link></li>
              <li><Link to="/trust">Trust & Safety</Link></li>
              <li><Link to="/selling">Selling on HirePros</Link></li>
              <li><Link to="/buying">Buying on HirePros</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h5>Community</h5>
            <ul>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/forum">Forum</Link></li>
              <li><Link to="/podcast">Podcast</Link></li>
              <li><Link to="/affiliates">Affiliates</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span className="footer-logo">HirePros<span>.</span></span>
            {/* Dynamic year injected here */}
            <span className="copyright">© HirePros International Ltd. {currentYear}</span>
          </div>

          <div className="footer-bottom-right">
            <div className="social-links">
              <FaXTwitter size={20} />
              <FaFacebook size={20} />
              <FaLinkedin size={20} />
              <FaInstagram size={20} />
            </div>
            
            <div className="settings">
              <button><Globe size={16} /> English</button>
              <button><Coins size={16} /> PKR</button>
              <button className="accessibility-btn"><Accessibility size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}