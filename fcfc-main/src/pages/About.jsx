import { TypeAnimation } from 'react-type-animation'
import CountUpModule from 'react-countup'
import { Shield, Zap, Globe, Users, Award, Target, MapPin, Briefcase, Star, BadgeCheck } from 'lucide-react'

const CountUp = CountUpModule.default ?? CountUpModule

const stats = [
  { end: 2500, suffix: '+', label: 'Happy Supporters' },
  { end: 18000, suffix: '+', label: 'Coupons Shared' },
  { prefix: '₹', end: 3.25, suffix: ' Cr+', decimals: 2, label: 'Funds Raised' },
  { end: 650, suffix: '+', label: 'Dreams Supported' },
]
import logo from '../assets/logo.png'
import ceoImg from '../assets/ceo.png'
import signImg from '../assets/sign.png'
import couponImg from '../assets/coupon-sample.png'
import regImg from '../assets/reg.png'
import './About.css'

const values = [
  { icon: <Shield size={22} />, title: 'Security First',    desc: 'Every Fortune Crowd Fund Coupon is cryptographically secured on-chain.',          color: '#4A90D9' },
  { icon: <Zap size={22} />,    title: 'Speed & Scale',     desc: 'Process thousands of FCFC coupons per second globally.',                           color: '#6C63FF' },
  { icon: <Globe size={22} />,  title: 'Global Access',     desc: 'Available in 150+ countries with multi-currency FCFC support.',                    color: '#27ae60' },
  { icon: <Users size={22} />,  title: 'Community Driven',  desc: 'Built with and for our growing Fortune Crowd Fund Coupon community.',              color: '#e67e22' },
  { icon: <Award size={22} />,  title: 'Quality Assured',   desc: 'Every FCFC feature is rigorously tested before release.',                          color: '#e74c3c' },
  { icon: <Target size={22} />, title: 'Results Focused',   desc: 'We measure success by the returns we deliver to every FCFC community member.',     color: '#9b59b6' },
]

export default function About() {
  return (
    <main>
      <div className="page-header">
        <div className="about-header-inner">
          <div className="about-header-content">
            <h1>About FCFC</h1>
            <p><TypeAnimation sequence={['Self Crowd-Fund through coupon-based support — raise your dream with your network.', 4000]} speed={55} repeat={Infinity} /></p>
            <div className="about-header-stats">
              {stats.map(s => (
                <div key={s.label} className="about-header-stat">
                  <div className="about-header-stat-num">
                    <CountUp prefix={s.prefix ?? ''} end={s.end} suffix={s.suffix} decimals={s.decimals ?? 0} duration={2.2} enableScrollSpy scrollSpyOnce />
                  </div>
                  <div className="about-header-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="about-header-coupon">
            <img src={couponImg} alt="FCFC Coupon Sample" />
          </div>
        </div>
      </div>

      {/* ── Story ── */}
      <section className="section">
        <div className="page-wrapper">
          <div className="about-grid">
            <div>
              <div className="hero-badge" style={{ marginBottom: 20 }}>
                <Award size={14} /> Our Story
              </div>
              <h2 className="section-title">Building the Future of Community Support</h2>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 20 }}>
                FCFC empowers creators and communities to fund goals using unique, trackable coupons. Share your story, generate coupons, and let your network show support transparently and securely.
              </p>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 32 }}>
                Our ecosystem focuses on impact: one coupon can multiply support across a community, turning individual contributions into measurable, collective progress.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {stats.map(s => (
                  <div key={s.label} className="neu-card" style={{ padding: '20px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>
                      <CountUp prefix={s.prefix ?? ''} end={s.end} suffix={s.suffix} decimals={s.decimals ?? 0} duration={2.2} enableScrollSpy scrollSpyOnce />
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="neu-card" style={{ background: 'linear-gradient(135deg, var(--navy), #1a2d5a)', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <img src={logo} alt="FCFC" style={{ height: 40, filter: 'brightness(0) invert(1)' }} />
                  <span style={{ fontSize: 22, fontWeight: 800 }}>FCFC</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, fontSize: 15 }}>
                  "Every community member deserves access to a Fortune Crowd Fund Coupon — a system that multiplies value with every redemption and grows the crowd with every transfer."
                </p>
                <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>— Mr. James Knight, CEO</div>
              </div>

              <div className="neu-card">
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>Our Mission</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  To democratize coupon-powered support through the Fortune Crowd Fund Coupon model, making fraud a thing of the past and helping communities run effective, verifiable, self-multiplying promotions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CEO Spotlight ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="page-wrapper">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Leadership</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>The visionary behind Fortune Crowd Fund Coupon.</p>
          </div>

          <div className="ceo-card">
            <div className="ceo-left">
              <div className="ceo-avatar">
                <img src={ceoImg} alt="Mr. James Knight" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 28 }} />
              </div>
              <div className="ceo-signature">
                <img src={signImg} alt="James Knight Signature" />
                <span>Mr. James Knight</span>
              </div>
            </div>
            <div className="ceo-info">
              <div className="ceo-name">Mr. James Knight</div>
              <div className="ceo-title">Chief Executive Officer &amp; Founder</div>

              <div className="ceo-meta">
                <div className="ceo-meta-item">
                  <MapPin size={15} color="var(--accent)" />
                  <span>Born in the United Kingdom · Now settled in British Virgin Islands (BVI)</span>
                </div>
                <div className="ceo-meta-item">
                  <Briefcase size={15} color="var(--accent)" />
                  <span>20+ Years of Experience in Financial Management</span>
                </div>
                <div className="ceo-meta-item">
                  <Star size={15} color="#e67e22" />
                  <span>Founder of FCFC — Fortune Crowd Fund Coupon</span>
                </div>
              </div>

              <p className="ceo-desc">
                Mr. James Knight is a seasoned financial management expert with over two decades of experience spanning investment strategy, crowd funding, and digital asset ecosystems. Born in the United Kingdom and now based in the British Virgin Islands, James brings a truly global perspective to the Fortune Crowd Fund Coupon platform. His vision of a self-sustaining, community-powered coupon economy is the foundation upon which FCFC was built — a system where every member of the crowd benefits from every transaction.
              </p>

              <div className="ceo-stats">
                {[['20+', 'Years Experience'], ['150+', 'Countries Reached'], ['$2.4M+', 'Value Cycled'], ['38K+', 'Community Members']].map(([n, l]) => (
                  <div key={l} className="ceo-stat">
                    <div className="ceo-stat-num">{n}</div>
                    <div className="ceo-stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Registration Certificate ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="page-wrapper">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="section-title">Company Registration</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>Officially registered and certified by the Government of the British Virgin Islands.</p>
          </div>
          <div className="reg-cert-card">
            <div className="reg-cert-img-wrap">
              <img src={regImg} alt="FCFC Company Registration Certificate — British Virgin Islands" />
            </div>
            <div className="reg-cert-details">
              <div className="reg-cert-badge">
                <BadgeCheck size={16} color="#27ae60" />
                Government Certified · British Virgin Islands
              </div>
              <div className="reg-cert-title">Official Company Registration Certificate</div>
              <div className="reg-cert-desc">
                Fortune Crowd Fund Coupon (FCFC) is a fully registered and legally recognised company under the jurisdiction of the British Virgin Islands. This certificate is issued by the BVI Financial Services Commission and confirms our compliance with all applicable regulations.
              </div>
              <div className="reg-cert-footer">
                <div className="reg-cert-item"><span>Issuing Authority</span><strong>Government of the British Virgin Islands</strong></div>
                <div className="reg-cert-item"><span>Company Name</span><strong>Fortune Crowd Fund Coupon (FCFC)</strong></div>
                <div className="reg-cert-item"><span>Jurisdiction</span><strong>British Virgin Islands (BVI)</strong></div>
                <div className="reg-cert-item"><span>Status</span><strong style={{ color: '#27ae60' }}>✓ Active &amp; Verified</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="page-wrapper">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>The principles that guide every Fortune Crowd Fund Coupon we issue.</p>
          </div>
          <div className="feature-grid">
            {values.map(v => (
              <div key={v.title} className="feature-card">
                <div className="feature-icon" style={{ background: `${v.color}18` }}>
                  <span style={{ color: v.color }}>{v.icon}</span>
                </div>
                <div className="feature-title">{v.title}</div>
                <div className="feature-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
