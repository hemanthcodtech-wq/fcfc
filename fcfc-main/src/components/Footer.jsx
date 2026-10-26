import { Link } from 'react-router-dom'
import { Ticket, Share2, GitBranch, Globe, Mail } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub, FaYoutube } from 'react-icons/fa'
import logo from '../assets/logo.png'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <img src={logo} alt="FCFC" style={{ height: 56, filter: 'brightness(0) invert(1)' }} />
            <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>FCFC</span>
          </div>
          <p>The next-generation coupon platform. Create, manage, and track coupons with blockchain-powered transparency.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
  {[
    { Icon: FaFacebookF, link: 'https://facebook.com' },
    { Icon: FaInstagram, link: 'https://instagram.com' },
    // { Icon: FaLinkedinIn, link: 'https://linkedin.com' },
    // { Icon: FaGithub, link: 'https://github.com' },
    { Icon: FaYoutube, link: 'https://youtube.com' }
  ].map(({ Icon, link }, i) => (
    <a
      key={i}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: 'rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.7)',
        transition: 'all 0.2s',
        textDecoration: 'none',
      }}
      onMouseEnter={e =>
        e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
      }
      onMouseLeave={e =>
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
      }
    >
      <Icon size={16} />
    </a>
  ))}
</div>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <Link to="/coupon/generate">Generate Coupon</Link>
          <Link to="/coupon/submit">Submit Coupon</Link>
          <Link to="/coupon/renew">Renew Coupon</Link>
          {/* <Link to="/admin/login">Admin Panel</Link> */}
          <Link to="/coupon/search">Search Coupon</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/thank-you">Success</Link>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <Link to="/documentation">Documentation</Link>
          <Link to="/api-reference">API Reference</Link>
          <Link to="/whitepaper">Whitepaper</Link>
          <Link to="/community">Community</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 FCFC. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </div>
      
    </footer>
  )
}
