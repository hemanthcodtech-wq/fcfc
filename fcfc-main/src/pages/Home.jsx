import { useEffect, useRef, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import CountUpModule from 'react-countup'
import { TypeAnimation } from 'react-type-animation'
import {
  Ticket, Users, TrendingUp, Shield, Zap, Globe,
  ArrowRight, Star, CheckCircle,
  ArrowRightCircle, DollarSign, RefreshCw, GitMerge,
  Wallet, QrCode, Network, BookOpen, FileText, ExternalLink
} from 'lucide-react'
import coinImg from '../assets/coin.png'
import heroImage from '../assets/image.png'
import './Home.css'

const CountUp = CountUpModule.default ?? CountUpModule

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stats = [
  { icon: <Ticket size={22} />,     number: '124K+', label: 'Coupons Generated',  color: '#4A90D9' },
  { icon: <Users size={22} />,      number: '38K+',  label: 'Active Members',      color: '#6C63FF' },
  { icon: <TrendingUp size={22} />, number: '$2.4M', label: 'Total Value Cycled',  color: '#27ae60' },
  { icon: <Shield size={22} />,     number: '99.9%', label: 'Fraud-Free Uptime',   color: '#e67e22' },
]

const flowSteps = [
  {
    num: 1,
    emoji: <img src={coinImg} alt="FCFC coin" style={{ width: 36, height: 36, objectFit: 'contain' }} />,
    title: 'Generate Coupon',
    desc: 'Purchase a $50 Fortune Crowd Fund Coupon, verified on-chain with a unique coupon code.',
    amount: '$50', color: '#4A90D9', bg: 'rgba(74,144,217,0.12)'
  },
  {
    num: 2, emoji: '📤', title: 'Submit Coupon',
    desc: 'Submit the coupon via the FCFC platform to unlock the reward bundle.',
    amount: 'FCFC', color: '#6C63FF', bg: 'rgba(108,99,255,0.12)'
  },
  {
    num: 3, emoji: '🎟️', title: '3 New Coupons',
    desc: '3 new Fortune Crowd Fund Coupons worth $30 each are instantly generated.',
    amount: '×3', color: '#27ae60', bg: 'rgba(39,174,96,0.12)'
  },
]

// const detailCards = [
//   {
//     cls: 'card-a', emoji: '🧑‍💼', title: 'User A — The Backer',
//     role: 'FCFC Originator', roleColor: '#4A90D9',
//     desc: 'User A funds the Fortune Crowd Fund Coupon ecosystem by purchasing the initial $50 FCFC coupon. This seeds the community and starts the cycle.',
//     ledger: [
//       { label: 'FCFC Purchase',   val: '-$50.00', type: 'negative' },
//       { label: 'Coupon Value',    val: '$50.00',  type: 'positive' },
//       { label: 'Community Reward', val: '+$8.00', type: 'positive' },
//       { label: 'Net Position',    val: '-$42.00', type: '' },
//     ]
//   },
//   {
//     cls: 'card-b', emoji: '🤝', title: 'User B — The Redeemer',
//     role: 'FCFC Redeemer', roleColor: '#6C63FF',
//     desc: 'User B receives the $50 Fortune Crowd Fund Coupon, redeems it on the FCFC platform, and pays an extra $20 to unlock 3 new FCFC coupons worth $30 each.',
//     ledger: [
//       { label: 'FCFC Received',   val: '$50.00',  type: 'positive' },
//       { label: 'Extra Payment',   val: '-$20.00', type: 'negative' },
//       { label: '3 New FCFCs',     val: '$90.00',  type: 'positive' },
//       { label: 'Net Profit',      val: '+$70.00', type: 'positive' },
//     ]
//   },
//   {
//     cls: 'card-c', emoji: '🌐', title: 'Community Expansion',
//     role: 'FCFC Growth Engine', roleColor: '#27ae60',
//     desc: 'The 3 new Fortune Crowd Fund Coupons are split to 3 new community members, each seeding a new FCFC cycle — the crowd grows 3× with every redemption.',
//     ledger: [
//       { label: 'FCFCs Issued',    val: '×3',   type: 'positive' },
//       { label: 'New FCFC Cycles', val: '×3',   type: 'positive' },
//       { label: 'Cost Recovery',   val: '100%', type: 'positive' },
//       { label: 'Crowd Growth',    val: '3×',   type: 'positive' },
//     ]
//   },
// ]

const timelineSteps = [
  {
    emoji: <img src={coinImg} alt="FCFC coin" style={{ width: 22, height: 22, objectFit: 'contain' }} />, step: 'Step 01', title: 'Generate Coupon',
    desc: 'A $50 FCFC — Fortune Crowd Fund Coupon — is generated and verified on-chain instantly with a unique coupon code and wallet signature.',
    color: '#4A90D9'
  },
  {
    emoji: '📤', step: 'Step 02', title: 'Submit Coupon',
    desc: 'The Fortune Crowd Fund Coupon is submitted via the FCFC platform. No intermediaries, no fees — fully trustless on-chain delivery.',
    color: '#6C63FF'
  },
  {
    emoji: '🎁', step: 'Step 03', title: 'Generate 3 Coupons',
    desc: '3 new Fortune Crowd Fund Coupons worth $30 each are instantly generated. Total value: $90 — a $70 net gain on a $20 investment.',
    color: '#27ae60'
  },
]

const features = [
  { icon: <Zap size={24} />,     title: 'Instant FCFC Minting',        desc: 'Every Fortune Crowd Fund Coupon is minted as a blockchain asset in seconds — tamper-proof and instantly transferable to any wallet.',  color: '#4A90D9' },
  { icon: <Shield size={24} />,  title: 'Zero Fraud Guarantee',         desc: 'Cryptographic signatures make FCFC duplication impossible. Every Fortune Crowd Fund Coupon redemption is verified on-chain.',           color: '#6C63FF' },
  { icon: <Network size={24} />, title: 'FCFC Crowd Distribution',      desc: 'Each FCFC redemption spawns 3 new Fortune Crowd Fund Coupons, creating an exponential crowd effect that rewards every member.',          color: '#27ae60' },
  { icon: <Wallet size={24} />,  title: 'Multiple Payment Options',       desc: 'Connect MetaMask, WalletConnect, Coinbase Wallet or pay by card through multiple payment gateways. Full flexibility for every FCFC community member.',                    color: '#e67e22' },
  { icon: <QrCode size={24} />,  title: 'Instant Coupon Code',        desc: 'Every Fortune Crowd Fund Coupon gets a unique coupon code for fast redemption at any participating merchant.',                   color: '#9b59b6' },
  { icon: <Globe size={24} />,   title: 'Global 150+ Countries',        desc: 'Deploy FCFC coupons worldwide with multi-currency support and localised Fortune Crowd Fund Coupon redemption infrastructure.',          color: '#e74c3c' },
]

const featuredResources = [
  { icon: <Globe size={28} />, title: 'Official Website', desc: 'The main FCFC hub — news, updates, and platform announcements.', href: '/', color: '#4A90D9' },
  { icon: <BookOpen size={28} />, title: 'Documentation', desc: 'Full API reference, integration guides, and developer tutorials.', href: '/documentation', color: '#6C63FF' },
  { icon: <FileText size={28} />, title: 'Whitepaper', desc: 'The technical whitepaper behind the FCFC protocol and tokenomics.', href: '/whitepaper', color: '#27ae60' },
]

function AnimatedNumber({ target }) {
  const value = Number(target.replace(/[^0-9.]/g, ''))
  const prefix = target.startsWith('$') ? '$' : ''
  const suffix = target.replace(/^\$?[\d.]+/, '')

  return (
    <>
      {prefix}
      <CountUp end={value} duration={2.2} decimals={target.includes('.') ? 1 : 0} enableScrollSpy scrollSpyOnce />
      {suffix}
    </>
  )
}

export default function Home() {
  const timelineVisualRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.tv-coupon', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
      gsap.to('.tv-arrow-line', {
        scaleX: 0.35,
        transformOrigin: 'center',
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'sine.inOut',
        stagger: 0.15,
      })
      gsap.fromTo('.tv-split-coupon', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, delay: 0.25, ease: 'back.out(1.6)' })
    }, timelineVisualRef)

    return () => ctx.revert()
  }, [])

  return (
    <main>

      {/* ══ HERO ══ */}
      <section className="hero-col-section" style={{ '--hero-img': `url(${heroImage})` }}>
        <div className="hero-col-inner page-wrapper">

          {/* Left — content */}
          <motion.div
            className="hero-col-content"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="hero-badge-glass" style={{ color: '#38bdf8' }}>
              <Star size={13} fill="currentColor" />
              <span>FCFC (Fortune Crowd Fund Coupon)</span>
            </div>

            <h1 className="hero-col-title">
              <TypeAnimation
                sequence={[
                  'Self Crowd-Fund With Coupon Support.',
                  1800,
                  'Share Coupons. Grow Support. Fund Dreams.',
                  1800,
                ]}
                speed={52}
                repeat={Infinity}
              />
            </h1>

            <p className="hero-col-sub">
              Raise your dreams with the power of your network.
              <br />
              Share coupons, earn support and make it happen — together.
            </p>

            <div className="hero-actions">
              <Link to="/coupon/generate" className="hero-btn-primary">
                Generate Your Coupon <ArrowRight size={15} />
              </Link>
              <Link to="/how-it-works" className="hero-btn-ghost-dark">
                How It Works ▶
              </Link>
            </div>

            <div className="hero-chips">
              {['SUPPORT · SHARE · SUCCEED', 'One Coupon. Many Dreams.', 'Fortune COUPON'].map(t => (
                <div key={t} className="chip-dark">
                  <CheckCircle size={12} color="#4ade80" /> {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — image */}
          <motion.div
            className="hero-col-image"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          >
            <div className="hero-img-wrap">
              <img src={heroImage} alt="FCFC Hero" className="hero-img" />
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="section" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="page-wrapper">
          <div className="stats-grid">
            {stats.map((s, index) => (
              <motion.div
                key={s.label}
                className="stat-card"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="stat-icon" style={{ background: `${s.color}15` }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                </div>
                <div className="stat-number"><AnimatedNumber target={s.number} /></div>
                <div className="stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FCFC WORKFLOW ══ */}
      <section className="workflow-section">
        <div className="page-wrapper">
          <div className="workflow-header" style={{ textAlign: 'center' }}>
            <div className="workflow-eyebrow">
              <GitMerge size={13} /> How FCFC Works
            </div>
            <h2 className="section-title">The Fortune Crowd Fund Coupon Cycle</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 48px' }}>
              FCFC — Fortune Crowd Fund Coupon. A self-sustaining ecosystem where every redemption funds 3 new free coupons, growing the crowd exponentially while rewarding every participant.
            </p>
          </div>

          {/* Flow diagram */}
          <div className="workflow-flow">
            {flowSteps.map((s, i) => (
              <Fragment key={s.num}>
                <motion.div
                  className="flow-step"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <div className="flow-step-num">{s.num}</div>
                  <div className="flow-step-icon" style={{ background: s.bg }}>
                    {typeof s.emoji === 'string' ? <span style={{ fontSize: 28 }}>{s.emoji}</span> : s.emoji}
                  </div>
                  <div className="flow-step-title">{s.title}</div>
                  <div className="flow-step-desc">{s.desc}</div>
                  <span className="flow-step-amount">{s.amount}</span>
                </motion.div>
                {i < flowSteps.length - 1 && (
                  <div className="flow-arrow">
                    <ArrowRightCircle size={28} />
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          
          {/* <div className="workflow-detail-grid">
            {detailCards.map(c => (
              <div key={c.title} className={`workflow-detail-card ${c.cls}`}>
                <div className="wdc-avatar" style={{ background: `${c.roleColor}15` }}>
                  <span>{c.emoji}</span>
                </div>
                <div className="wdc-title">{c.title}</div>
                <div className="wdc-role" style={{ color: c.roleColor }}>{c.role}</div>
                <div className="wdc-desc">{c.desc}</div>
                <div className="wdc-ledger">
                  {c.ledger.map(row => (
                    <div key={row.label} className={`wdc-ledger-row ${row.type}`}>
                      <span>{row.label}</span>
                      <span>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ══ HOW IT WORKS TIMELINE ══ */}
      <section className="timeline-section">
        <div className="page-wrapper">
          <div className="timeline-grid">

            {/* Left: steps */}
            <div>
              <div className="workflow-eyebrow" style={{ marginBottom: 20 }}>
                <RefreshCw size={13} /> Step-by-Step
              </div>
              <h2 className="section-title" style={{ marginBottom: 12 }}>How FCFC Works</h2>
              <p className="section-subtitle" style={{ marginBottom: 48 }}>
                Three simple steps that power the Fortune Crowd Fund Coupon cycle.
              </p>
              <div className="timeline-list">
                {timelineSteps.map(t => (
                  <div key={t.step} className="timeline-item" data-aos="fade-right">
                    <div className="timeline-dot" style={{ background: `${t.color}18` }}>
                      {typeof t.emoji === 'string' ? <span style={{ fontSize: 18 }}>{t.emoji}</span> : t.emoji}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-step" style={{ color: t.color }}>{t.step}</div>
                      <div className="timeline-title">{t.title}</div>
                      <div className="timeline-desc">{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual card */}
            <div className="timeline-visual" ref={timelineVisualRef} data-aos="zoom-in">
              <div className="tv-label">FCFC Pricing Breakdown</div>

              <div className="tv-step-row tv-step-blue">
                <div className="tv-step-icon"><img src={coinImg} alt="coin" style={{ width: 28, height: 28, objectFit: 'contain' }} /></div>
                <div className="tv-step-body">
                  <div className="tv-step-title">Generate · Buy FCFC Coupon</div>
                  <div className="tv-step-desc">Purchase your Fortune Crowd Fund Coupon to get started.</div>
                </div>
                <div className="tv-step-price tv-price-blue">$50</div>
              </div>

              <div className="tv-step-row tv-step-purple" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="tv-step-icon"><img src={coinImg} alt="coin" style={{ width: 28, height: 28, objectFit: 'contain' }} /></div>
                  <div className="tv-step-body">
                    <div className="tv-step-title">Submit Coupon</div>
                    <div className="tv-step-desc">Submit your coupon to unlock the reward cycle.</div>
                  </div>
                  <div className="tv-step-price tv-price-purple">$10</div>
                </div>
                <div className="tv-split" style={{ margin: 0 }}>
                  {[['🎟️', '$30', 'FCFC #1'], ['🎟️', '$30', 'FCFC #2'], ['🎟️', '$30', 'FCFC #3']].map(([e, v, l]) => (
                    <div key={l} className="tv-split-coupon">
                      <div className="emoji">{e}</div>
                      <div className="val">{v}</div>
                      <div className="lbl">{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validity + Renewal merged */}
              <div className="tv-step-row tv-step-green">
                <div className="tv-step-icon"><img src={coinImg} alt="coin" style={{ width: 28, height: 28, objectFit: 'contain' }} /></div>
                <div className="tv-step-body">
                  <div className="tv-step-title">Valid 30 Days · Renew $20</div>
                  <div className="tv-step-desc">Active for 30 days after submission. Pay $20 to extend validity.</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span className="tv-step-price tv-price-green" style={{ fontSize: 17 }}>30d</span>
                  <span className="tv-step-price" style={{ fontSize: 17, color: '#fbbf24' }}>$20</span>
                </div>
              </div>


            </div>

          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="page-wrapper">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="workflow-eyebrow" style={{ marginBottom: 16 }}>
              <Zap size={13} /> Platform Features
            </div>
            <h2 className="section-title">Built for the FCFC Economy</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Every feature is designed to make Fortune Crowd Fund Coupon distribution seamless, secure, and infinitely scalable.
            </p>
          </div>
          <div className="feature-grid">
            {features.map((f, index) => (
              <motion.div
                key={f.title}
                className="feature-card"
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 80}
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon" style={{ background: `${f.color}15` }}>
                  <span style={{ color: f.color }}>{f.icon}</span>
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED RESOURCES ══ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="page-wrapper">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="workflow-eyebrow" style={{ marginBottom: 12 }}>
              <Star size={13} /> Featured
            </div>
            <h2 className="section-title">Essential Resources</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              The most important FCFC links to get you started.
            </p>
          </div>

          <div className="links-featured-grid">
            {featuredResources.map(l => (
              <Link key={l.title} to={l.href} className="link-featured-card">
                <div className="link-featured-top" style={{ background: `${l.color}12` }}>
                  <div className="link-icon" style={{ background: `${l.color}18`, margin: '0 0 0 0' }}>
                    <span style={{ color: l.color }}>{l.icon}</span>
                  </div>
                  <ExternalLink size={16} style={{ color: l.color, opacity: 0.6 }} />
                </div>
                <div className="link-featured-body">
                  <div className="link-featured-title">{l.title}</div>
                  <div className="link-featured-desc">{l.desc}</div>
                  <div className="link-featured-cta" style={{ color: l.color }}>
                    Visit <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="page-wrapper">
          <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1a2d5a 60%, #0a2e1a 100%)', borderRadius: 'var(--radius-lg)', padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 50%, rgba(74,144,217,0.18), transparent 55%), radial-gradient(circle at 80% 50%, rgba(39,174,96,0.15), transparent 55%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div className="workflow-eyebrow" style={{ marginBottom: 20, background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                <DollarSign size={13} /> Join FCFC Today
              </div>
              <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: -0.5 }}>
                Ready to Join the<br />Fortune Crowd Fund Coupon?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
                FCFC — Fortune Crowd Fund Coupon. Buy a $50 FCFC, transfer it to the crowd, and watch your coupons multiply. Every redemption creates 3 new Fortune Crowd Fund Coupons for 3 new members.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/coupon/generate" style={{ background: '#fff', color: 'var(--navy)', borderRadius: 12, padding: '15px 32px', fontWeight: 800, textDecoration: 'none', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                  <img src={coinImg} alt="coin" style={{ width: 20, height: 20, objectFit: 'contain' }} /> Buy $50 FCFC
                </Link>
                <Link to="/coupon/submit" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 12, padding: '15px 32px', fontWeight: 700, textDecoration: 'none', fontSize: 15, border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <ArrowRightCircle size={17} /> Redeem FCFC
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
