import { TypeAnimation } from 'react-type-animation'
import { useState } from 'react'
import { ChevronDown, HelpCircle, MessageCircle, Play } from 'lucide-react'
import faqVideo from '../assets/faq-video.mp4'
import heroVideo from '../assets/hero-video.mp4'
import couponArbitrageVideo from '../assets/coupon-arbitrage.mp4'
import './FAQ.css'

const faqs = [
  {
    category: 'General',
    items: [
      { q: "What does 'Self Crowd Fund Through Coupon Based' mean?", a: "It means you can raise support by generating and sharing unique FCFC coupons. People support you by using or purchasing those coupons, which funds your goal while growing your network." },
      { q: 'How do I start on FCFC?', a: 'Generate a coupon with your story and goal, then share the coupon link with your network to begin receiving support.' },
      { q: 'What is the typical coupon flow?', a: 'Generate coupon → Share with network → Supporters use or purchase coupons → Funds aggregate toward your goal.' },
    ]
  },
  {
    category: 'Coupons',
    items: [
      { q: 'What makes an FCFC coupon special?', a: 'FCFC coupons are smart, unique and trackable—each has a distinct code/QR and on-chain verification so support is transparent and tamper-proof.' },
      { q: 'How do I share coupons to get support?', a: 'Generate coupons from your coupon dashboard, then share them via link, social, or direct messaging. Every share increases reach and potential backers.' },
      { q: 'Can one coupon really help many people?', a: 'Yes—FCFC is designed so a single coupon can trigger distribution mechanics that scale community support, amplifying impact across members.' },
    ]
  },
  {
    category: 'Payments gateway',
    items: [
      { q: 'How do supporters pay or contribute?', a: 'Supporters can use the integrated payments gateway or connected wallets. Payments convert into coupon-based support according to the rules you configure.' },
      { q: 'Which payment methods are supported?', a: 'FCFC supports common card payments and major crypto wallets; available options depend on region and coupon settings.' },
      { q: 'Are there fees or currency conversions?', a: 'Fees and conversions depend on the chosen payment provider and blockchain used. We show expected charges during coupon setup so you can plan clearly.' },
    ]
  },
  {
    category: 'Security',
    items: [
      { q: 'How is coupon fraud prevented?', a: 'Each coupon is recorded and signed on-chain, and redemptions are validated cryptographically—this prevents duplication and ensures authenticity.' },
      { q: 'Where is coupon data stored?', a: 'Coupon metadata is stored with verifiable, tamper-evident methods such as IPFS, while sensitive user info follows encryption and privacy best practices.' },
      { q: 'How transparent are funds and redemptions?', a: 'FCFC provides transparent ledgers for coupon issuance and redemption so creators and supporters can audit activity and trust outcomes.' },
    ]
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <ChevronDown size={18} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.25s', color: 'var(--accent)', flexShrink: 0 }} />
      </div>
      {open && <div className="faq-answer">{a}</div>}
    </div>
  )
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', ...faqs.map(f => f.category)]
  const filtered = activeCategory === 'All' ? faqs : faqs.filter(f => f.category === activeCategory)

  return (
    <main>
      {/* ── Hero: full-bleed video background ── */}
      <section className="faq-hero">
        <video className="faq-hero-video" src={couponArbitrageVideo} autoPlay loop muted playsInline />
        <div className="faq-hero-overlay" />
        <div className="faq-hero-content">
          <div className="faq-hero-badge">
            <HelpCircle size={14} /> Help Center
          </div>
          <h1>Frequently Asked Questions</h1>
          <p><TypeAnimation sequence={['Everything you need to know about FCFC and coupon-powered support.', 4000]} speed={55} repeat={Infinity} /></p>
          <div className="faq-hero-stats">
            {[['50+', 'Questions Answered'], ['24/7', 'Support Available'], ['38K+', 'Community Members']].map(([n, l]) => (
              <div key={l} className="faq-hero-stat">
                <div className="faq-hero-stat-num">{n}</div>
                <div className="faq-hero-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Body: accordion left, video right ── */}
      <section className="section">
        <div className="page-wrapper">
          <div className="faq-body">

            {/* Left: accordion */}
            <div className="faq-accordion">
              {/* Category filters */}
              <div className="faq-filters">
                {categories.map(c => (
                  <button key={c} onClick={() => setActiveCategory(c)}
                    className={activeCategory === c ? 'neu-btn neu-btn-primary' : 'neu-btn'}
                    style={{ padding: '8px 20px', fontSize: 13 }}>
                    {c}
                  </button>
                ))}
              </div>

              {filtered.map(section => (
                <div key={section.category} style={{ marginBottom: 36 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <HelpCircle size={17} color="var(--accent)" />
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)' }}>{section.category}</h3>
                  </div>
                  {section.items.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
                </div>
              ))}

              {/* Still have questions */}
              <div className="faq-cta">
                <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Still have questions?</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 20 }}>Our support team is available 24/7 to help you.</p>
                <a href="mailto:fortunecrowdfundcoupon@gmail.com" className="neu-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'none' }}>
                  <MessageCircle size={15} /> Contact Support
                </a>
              </div>
            </div>

            {/* Right-side video panel removed per request */}

          </div>
        </div>
      </section>

      {/* ══ VIDEO GALLERY ══ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="page-wrapper">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="workflow-eyebrow" style={{ marginBottom: 14 }}>
              <Play size={13} /> Tutorial Videos
            </div>
            <h2 className="section-title">Learn With Video Guides</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Step-by-step video walkthroughs covering every aspect of the FCFC platform.
            </p>
          </div>
          <div className="faq-video-grid">
            {[
              { src: faqVideo,          title: 'FCFC Platform Overview',     desc: 'A complete walkthrough of the Fortune Crowd Fund Coupon platform and how it works.' },
              { src: heroVideo,         title: 'How the FCFC Cycle Works', desc: 'See the full Buy → Transfer → Redeem → Multiply cycle in action on-chain.' },
            ].map(v => (
              <div key={v.title} className="faq-video-card">
                <div className="faq-video-wrap">
                  <video src={v.src} controls autoPlay loop muted playsInline preload="metadata" />
                </div>
                <div className="faq-video-info">
                  <div className="faq-video-title">{v.title}</div>
                  <div className="faq-video-desc">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
