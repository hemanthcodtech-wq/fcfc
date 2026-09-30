import { TypeAnimation } from 'react-type-animation'
import { Link } from 'react-router-dom'
import { Ticket, Users, TrendingUp, Globe, Zap, Shield, ArrowRight, Star } from 'lucide-react'
import './Projects.css'

const projects = [
  {
    emoji: '🎟️', title: 'FCFC Genesis Coupon',
    tag: 'Active', tagColor: '#27ae60',
    desc: 'The original Fortune Crowd Fund Coupon cycle. Buy a $50 FCFC, transfer to User B, redeem + pay $20, and receive 3 new FCFCs worth $30 each.',
    members: '12,400+', value: '$620K', progress: 82, color: '#4A90D9',
  },
  {
    emoji: '🌐', title: 'Global Crowd Expansion',
    tag: 'Active', tagColor: '#27ae60',
    desc: 'Expanding the FCFC ecosystem to 150+ countries. Every redemption seeds 3 new community members across borders with zero friction.',
    members: '9,800+', value: '$490K', progress: 67, color: '#6C63FF',
  },
  {
    emoji: '🔗', title: 'On-Chain Verification Layer',
    tag: 'In Progress', tagColor: '#e67e22',
    desc: 'Building a fully decentralised FCFC verification layer on BNB Smart Chain (BSC) — tamper-proof coupon minting and instant QR redemption.',
    members: '5,200+', value: '$260K', progress: 45, color: '#27ae60',
  },
  {
    emoji: '💳', title: 'FCFC Merchant Network',
    tag: 'Active', tagColor: '#27ae60',
    desc: 'Onboarding merchants worldwide to accept Fortune Crowd Fund Coupons. Seamless POS integration with real-time blockchain settlement.',
    members: '3,600+', value: '$180K', progress: 58, color: '#e67e22',
  },
  {
    emoji: '🤝', title: 'Community Referral Engine',
    tag: 'New', tagColor: '#4A90D9',
    desc: 'Automated referral tracking for every FCFC transfer. Earn rewards every time someone you referred redeems a Fortune Crowd Fund Coupon.',
    members: '2,100+', value: '$105K', progress: 30, color: '#9b59b6',
  },
  {
    emoji: '📊', title: 'FCFC Analytics Dashboard',
    tag: 'Coming Soon', tagColor: '#7f8c9a',
    desc: 'Real-time analytics for every FCFC coupon cycle. Track coupon flow, crowd growth, redemption rates, and net value cycled across the network.',
    members: '—', value: '—', progress: 15, color: '#e74c3c',
  },
]

const stats = [
  { icon: <Ticket size={20} />, number: '6', label: 'Active Projects', color: '#4A90D9' },
  { icon: <Users size={20} />, number: '38K+', label: 'Total Members', color: '#6C63FF' },
  { icon: <TrendingUp size={20} />, number: '$2.4M', label: 'Value Cycled', color: '#27ae60' },
  { icon: <Globe size={20} />, number: '150+', label: 'Countries', color: '#e67e22' },
]

export default function Projects() {
  return (
    <main>
      <div className="page-header">
        <h1>Explore Projects</h1>
        <p><TypeAnimation sequence={['Discover active Fortune Crowd Fund Coupon cycles and join the growing FCFC ecosystem.', 4000]} speed={55} repeat={Infinity} /></p>
      </div>

      {/* Stats */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="page-wrapper">
          <div className="stats-grid">
            {stats.map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: `${s.color}15` }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                </div>
                <div className="stat-number">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="section">
        <div className="page-wrapper">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="workflow-eyebrow" style={{ marginBottom: 16 }}>
              <Star size={13} /> FCFC Coupons
            </div>
            <h2 className="section-title">All Active Coupons</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Each project is a self-sustaining Fortune Crowd Fund Coupon cycle. Join any coupon flow and start multiplying your coupons.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map(p => (
              <div key={p.title} className="project-card">
                <div className="project-card-top" style={{ background: `${p.color}12` }}>
                  <span className="project-emoji">{p.emoji}</span>
                  <span className="project-tag" style={{ background: `${p.tagColor}18`, color: p.tagColor }}>
                    {p.tag}
                  </span>
                </div>
                <div className="project-card-body">
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.desc}</p>

                  <div className="project-meta">
                    <div className="project-meta-item">
                      <Users size={13} />
                      <span>{p.members} members</span>
                    </div>
                    <div className="project-meta-item">
                      <TrendingUp size={13} />
                      <span>{p.value} cycled</span>
                    </div>
                  </div>

                  <div className="project-progress-label">
                    <span>Coupon Progress</span>
                    <span style={{ color: p.color, fontWeight: 700 }}>{p.progress}%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${p.progress}%`, background: `linear-gradient(90deg, ${p.color}, ${p.color}99)` }} />
                  </div>

                  <Link to="/coupon/generate" className="project-cta" style={{ borderColor: `${p.color}40`, color: p.color }}>
                    Join Coupon <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="page-wrapper">
          <div className="projects-cta-banner">
            <div className="projects-cta-glow" />
            <div style={{ position: 'relative' }}>
              <div className="workflow-eyebrow" style={{ marginBottom: 16, background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}>
                <Zap size={13} /> Start Today
              </div>
              <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
                Launch Your Own FCFC Coupon
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.7 }}>
                Generate your Fortune Crowd Fund Coupon, share it with the crowd, and watch your community grow 3× with every redemption.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/coupon/generate" style={{ background: '#fff', color: 'var(--navy)', borderRadius: 12, padding: '13px 28px', fontWeight: 800, textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Ticket size={16} /> Get Your FCFC
                </Link>
                <Link to="/about" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 12, padding: '13px 28px', fontWeight: 600, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Shield size={16} /> Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
