import { Link } from 'react-router-dom'
import { CheckCircle, Ticket, Home, Search, ArrowRight } from 'lucide-react'
import './ThankYou.css'

export default function ThankYou() {
  return (
    <main>
      <section className="section">
        <div className="page-wrapper">
          <div className="success-container">
            <div className="success-icon">
              <CheckCircle size={48} color="#fff" />
            </div>

            <div className="hero-badge" style={{ marginBottom: 20 }}>
              <Ticket size={14} /> Transaction Confirmed
            </div>

            <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 800, color: 'var(--navy)', marginBottom: 16, letterSpacing: -1 }}>
              You're All Set! 🎉
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 480, lineHeight: 1.7, marginBottom: 40 }}>
              Your coupon has been successfully processed and recorded on-chain. Check your wallet or email for confirmation details.
            </p>

            {/* Confirmation Card */}
            <div className="neu-card" style={{ maxWidth: 480, width: '100%', marginBottom: 40 }}>
              {[
                ['Status', <span style={{ color: '#27ae60', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} /> Confirmed</span>],
                ['Transaction ID', <span style={{ fontFamily: 'monospace', fontSize: 13 }}>0xfc2a...8d91</span>],
                ['Network', 'BNB Smart Chain (BSC)'],
                ['Timestamp', new Date().toLocaleString()],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{k}</span>
                  <span style={{ color: 'var(--navy)', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/" className="neu-btn neu-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '13px 28px', fontSize: 15 }}>
                <Home size={16} /> Back to Home
              </Link>
              <Link to="/coupon/generate" className="neu-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '13px 28px', fontSize: 15 }}>
                <Ticket size={16} /> New Coupon
              </Link>
              <Link to="/coupon/search" className="neu-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '13px 28px', fontSize: 15 }}>
                <Search size={16} /> Search Coupons <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
