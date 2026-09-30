import { TypeAnimation } from 'react-type-animation'
import { Ticket, Send, RefreshCw, Search, DollarSign, ShieldCheck, Clock, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import coinImg from '../assets/coin.png'
import couponSample from '../assets/coupon-sample.png'
import './AboutCoupon.css'

const steps = [
  { icon: <Ticket size={22} />, title: 'Generate', desc: 'Pay $50 to generate a blockchain-verified FCFC coupon code.', path: '/coupon/generate', color: '#3b82f6' },
  { icon: <Send size={22} />, title: 'Submit', desc: 'Pay $10 and submit your coupon along with 3 referral coupons to earn rewards.', path: '/coupon/submit', color: '#8b5cf6' },
  { icon: <RefreshCw size={22} />, title: 'Renew', desc: 'Renew an expired coupon for $20 to keep it active for another 30 days.', path: '/coupon/renew', color: '#10b981' },
  { icon: <Search size={22} />, title: 'Search', desc: 'Look up any coupon code to verify its status and details.', path: '/coupon/search', color: '#f59e0b' },
]

const highlights = [
  { icon: <ShieldCheck size={20} />, label: 'Blockchain Verified', desc: 'Every coupon is cryptographically secured and tamper-proof.' },
  { icon: <DollarSign size={20} />, label: 'Earn Rewards', desc: 'Submit with 3 referrals and earn back more than you invested.' },
  { icon: <Clock size={20} />, label: '30-Day Validity', desc: 'Each coupon is valid for 30 days and renewable at a low cost.' },
  { icon: <Users size={20} />, label: 'Crowd Funded', desc: 'Powered by a community of participants growing together.' },
]

export default function AboutCoupon() {
  return (
    <main>
      <div className="page-header">
        <h1>About FCFC Coupon</h1>
        <p><TypeAnimation sequence={['Everything you need to know about Fortune Crowd Fund Coupons.', 4000]} speed={55} repeat={Infinity} /></p>
      </div>

      <section className="section">
        <div className="page-wrapper">

          {/* Intro card */}
          <div className="ac-intro-card">
            <div className="ac-intro-text">
              <h2>What is an FCFC Coupon?</h2>
              <p>
                An FCFC (Fortune Crowd Fund Coupon) is a blockchain-verified digital coupon that enables
                participants to earn rewards through a crowd-funded referral system. Each coupon is uniquely
                generated, time-limited, and traceable on the network.
              </p>
              <div className="ac-price-row">
                <img src={coinImg} alt="coin" className="ac-coin" />
                <span>Generate for <strong>$50</strong></span>
                <span className="ac-dot">·</span>
                <span>Submit for <strong>$10</strong></span>
                <span className="ac-dot">·</span>
                <span>Renew for <strong>$20</strong></span>
              </div>
            </div>
            <img src={couponSample} alt="Coupon Sample" className="ac-coupon-img" />
          </div>

          {/* Highlights */}
          <div className="ac-highlights">
            {highlights.map(h => (
              <div key={h.label} className="ac-highlight-card">
                <div className="ac-highlight-icon">{h.icon}</div>
                <div>
                  <div className="ac-highlight-label">{h.label}</div>
                  <div className="ac-highlight-desc">{h.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Steps */}
          <h2 className="ac-section-title">Coupon Actions</h2>
          <div className="ac-steps">
            {steps.map(s => (
              <Link to={s.path} key={s.title} className="ac-step-card">
                <div className="ac-step-icon" style={{ color: s.color, background: `${s.color}18` }}>{s.icon}</div>
                <div className="ac-step-title">{s.title}</div>
                <div className="ac-step-desc">{s.desc}</div>
                <span className="ac-step-link" style={{ color: s.color }}>Go →</span>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </main>
  )
}
