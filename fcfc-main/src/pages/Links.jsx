import { TypeAnimation } from 'react-type-animation'
import CountUpModule from 'react-countup'
import { useState, useEffect } from 'react'
import { ExternalLink, GitBranch, Share2, Globe, BookOpen, MessageCircle, Video, FileText, Users, Zap, Star, ArrowRight, Home, Info, HelpCircle, Phone, Image, Monitor, Ticket, RefreshCw, Search, Send, Copy, Check, ShieldCheck, Scale } from 'lucide-react'

const CountUp = CountUpModule.default ?? CountUpModule

const stats = [
  { icon: <Users size={20} />, end: 38, suffix: 'K+', label: 'Community Members', color: '#4A90D9' },
  { icon: <Globe size={20} />, end: 150, suffix: '+',  label: 'Countries',         color: '#6C63FF' },
  { icon: <Star size={20} />,  end: 5,   suffix: 'K+', label: 'Discord Members',   color: '#27ae60' },
  { icon: <Zap size={20} />,   end: 99.9, suffix: '%', decimals: 1, label: 'Uptime', color: '#e67e22' },
]
import { Link } from 'react-router-dom'
import './Links.css'

const community = [
  { icon: <MessageCircle size={24} />, title: 'Discord',   desc: 'Join 5,000+ builders and FCFC community members.',  href: '#', color: '#5865F2' },
  { icon: <Share2 size={24} />,        title: 'Twitter / X', desc: 'Follow for real-time announcements and tips.',      href: '#', color: '#1DA1F2' },
  { icon: <MessageCircle size={24} />, title: 'Telegram',  desc: 'Chat with the community and get instant support.',   href: '#', color: '#0088cc' },
  { icon: <Video size={24} />,         title: 'YouTube',   desc: 'Video tutorials, demos, and product walkthroughs.',  href: '#', color: '#FF0000' },
]

const developer = [
  { icon: <GitBranch size={24} />, title: 'GitHub',         desc: 'Open-source smart contracts, SDKs, and tools.',     href: '#', color: '#24292e' },
  { icon: <BookOpen size={24} />,  title: 'API Reference',  desc: 'Complete REST and Web3 API documentation.',         href: '#', color: '#6C63FF' },
  { icon: <FileText size={24} />,  title: 'Blog',           desc: 'In-depth articles on Web3, coupons, and DeFi.',     href: '#', color: '#e67e22' },
  { icon: <Globe size={24} />,     title: 'Status Page',    desc: 'Real-time platform uptime and incident reports.',   href: '#', color: '#27ae60' },
]
const SITE_BASE = 'fcfc.funds.com'

const siteLinks = [
  { icon: <Home size={18} />,     label: 'Home',              path: '/',                     color: '#4A90D9' },
  { icon: <Info size={18} />,     label: 'About',             path: '/about',                color: '#6C63FF' },
  { icon: <BookOpen size={18} />, label: 'Documentation',     path: '/documentation',        color: '#3b82f6' },
  { icon: <FileText size={18} />, label: 'API Reference',     path: '/api-reference',        color: '#8b5cf6' },
  { icon: <FileText size={18} />, label: 'Whitepaper',        path: '/whitepaper',           color: '#10b981' },
  { icon: <Users size={18} />,    label: 'Community',         path: '/community',            color: '#f59e0b' },
  { icon: <Image size={18} />,    label: 'Gallery (Images)',  path: '/gallery/images',       color: '#27ae60' },
  { icon: <Video size={18} />,    label: 'Gallery (Videos)',  path: '/gallery/videos',       color: '#27ae60' },
  // { icon: <Monitor size={18} />,  label: 'Pres. (Videos)',    path: '/presentations/videos', color: '#e67e22' },
  // { icon: <FileText size={18} />, label: 'Pres. (PPT / PDF)', path: '/presentations/ppts',  color: '#e67e22' },
  { icon: <HelpCircle size={18}/>,label: 'FAQ',              path: '/faq',                  color: '#8e44ad' },
  { icon: <Phone size={18} />,    label: 'Contact',          path: '/contact',              color: '#e74c3c' },
  { icon: <ShieldCheck size={18} />, label: 'Privacy Policy', path: '/privacy-policy',     color: '#22c55e' },
  { icon: <Scale size={18} />,    label: 'Terms of Service', path: '/terms-of-service',  color: '#f97316' },
  { icon: <Info size={18} />,     label: 'About Coupon',      path: '/coupon/about',         color: '#16a085' },
  { icon: <Ticket size={18} />,   label: 'Generate Coupon',   path: '/coupon/generate',      color: '#2980b9' },
  { icon: <Send size={18} />,     label: 'Submit Coupon',     path: '/coupon/submit',        color: '#8e44ad' },
  { icon: <RefreshCw size={18}/>,label: 'Renew Coupon',      path: '/coupon/renew',         color: '#d35400' },
  { icon: <Search size={18} />,   label: 'Search Coupon',     path: '/coupon/search',        color: '#27ae60' },
]


const socialLinks = [
  {
    label: 'Facebook',
    handle: 'facebook.com/fcfc.funds',
    url: 'https://www.facebook.com/share/1djHVC8M6j/',
    color: '#1877F2',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    label: 'Instagram',
    handle: 'instagram.com/fcfc.funds',
    url: 'https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=jgr0r1c',
    color: '#E4405F',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  },
  {
    label: 'YouTube',
    handle: 'youtube.com/@fcfc.funds',
    url: 'https://youtube.com/@fortunecrowdfundcouponfcfc?si=C8D2FWuTzFvsfjTh',
    color: '#FF0000',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  // {
  //   label: 'X (Twitter)',
  //   handle: 'x.com/fcfc_funds',
  //   url: 'https://x.com/fcfc_funds',
  //   color: '#1DA1F2',
  //   icon: (
  //     <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
  //       <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  //     </svg>
  //   )
  // }
]


function SiteLinkCard({ l, fullUrl, isExternal = false }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        background: 'var(--bg)',
        borderRadius: 14,
        boxShadow: 'var(--shadow-card)',
        border: `1.5px solid ${l.color}18`,
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${l.color}15`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <span style={{ color: l.color }}>{l.icon}</span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 2 }}>{l.label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {l.handle || `${SITE_BASE}${l.path}`}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <button
          onClick={handleCopy}
          title="Copy Link"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid var(--border, #e2e8f0)',
            background: copied ? 'rgba(39, 174, 96, 0.1)' : 'var(--bg-alt, #f8fafc)',
            color: copied ? '#27ae60' : 'var(--text, #475569)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {copied ? <Check size={13} color="#27ae60" /> : <Copy size={13} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>

        {navigator.share && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              navigator.share({ title: l.label, url: fullUrl }).catch(() => {})
            }}
            title="Share Link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid var(--border, #e2e8f0)',
              background: 'var(--bg-alt, #f8fafc)',
              color: 'var(--text, #475569)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>
        )}

        {isExternal ? (
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              background: l.color,
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity 0.2s'
            }}
          >
            <span>Open</span>
            <ExternalLink size={13} />
          </a>
        ) : (
          <Link
            to={l.path}
            title="Open Page"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              background: l.color,
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity 0.2s'
            }}
          >
            <span>Open</span>
            <ExternalLink size={13} />
          </Link>
        )}
      </div>
    </div>
  )
}

export default function Links() {
  const [dbLinks, setDbLinks] = useState([])

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/admin/links')
      .then(r => r.json())
      .then(data => setDbLinks(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])
  return (
    <main>
      <div className="page-header">
        <h1>Useful Links</h1>
        <p><TypeAnimation sequence={['Everything you need to connect with the FCFC ecosystem — all in one place.', 4000]} speed={55} repeat={Infinity} /></p>
      </div>

      {/* Stats */}
      <section className="section" style={{ paddingBottom: '32px' }}>
        <div className="page-wrapper">
          <div className="stats-grid">
            {stats.map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: `${s.color}15` }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                </div>
                <div className="stat-number">
                  <CountUp end={s.end} suffix={s.suffix} decimals={s.decimals ?? 0} duration={2.2} enableScrollSpy scrollSpyOnce />
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation Links */}
      <section className="section" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div className="page-wrapper">
          <div className="links-section-header">
            <div className="workflow-eyebrow" style={{ marginBottom: 12 }}>
              <Globe size={13} /> Quick Navigation
            </div>
            <h2 className="section-title">All Pages</h2>
            <p className="section-subtitle">Browse every section of the FCFC platform directly.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {siteLinks.map(l => {
              const fullUrl = `https://${SITE_BASE}${l.path}`
              return (
                <SiteLinkCard key={l.path} l={l} fullUrl={fullUrl} />
              )
            })}
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="section" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div className="page-wrapper">
          <div className="links-section-header">
            <div className="workflow-eyebrow" style={{ marginBottom: 12 }}>
              <Share2 size={13} /> Social Media
            </div>
            <h2 className="section-title">Official Social Channels</h2>
            <p className="section-subtitle">Follow and connect with FCFC across official social networks.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {socialLinks.map(l => (
              <SiteLinkCard key={l.label} l={l} fullUrl={l.url} isExternal={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Community + Developer side by side */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="page-wrapper">
          <div className="links-two-col">

            {/* Community */}
            {/* <div>
              <div className="links-section-header" style={{ textAlign: 'left' }}>
                <div className="workflow-eyebrow" style={{ marginBottom: 12 }}>
                  <Users size={13} /> Community
                </div>
                <h2 className="section-title" style={{ fontSize: 'clamp(20px,3vw,28px)' }}>Join the Crowd</h2>
                <p className="section-subtitle" style={{ marginBottom: 28 }}>Connect with thousands of FCFC members worldwide.</p>
              </div>
              <div className="links-list">
                {community.map(l => (
                  <a key={l.title} href={l.href} target="_blank" rel="noopener noreferrer" className="link-list-item">
                    <div className="link-list-icon" style={{ background: `${l.color}15` }}>
                      <span style={{ color: l.color }}>{l.icon}</span>
                    </div>
                    <div className="link-list-info">
                      <div className="link-list-title">{l.title}</div>
                      <div className="link-list-desc">{l.desc}</div>
                    </div>
                    <ExternalLink size={15} style={{ color: l.color, flexShrink: 0, opacity: 0.7 }} />
                  </a>
                ))}
              </div>
            </div> */}

            {/* Developer */}
            {/* <div>
              <div className="links-section-header" style={{ textAlign: 'left' }}>
                <div className="workflow-eyebrow" style={{ marginBottom: 12 }}>
                  <Zap size={13} /> Developer
                </div>
                <h2 className="section-title" style={{ fontSize: 'clamp(20px,3vw,28px)' }}>Build on FCFC</h2>
                <p className="section-subtitle" style={{ marginBottom: 28 }}>Tools, docs, and resources for developers.</p>
              </div>
              <div className="links-list">
                {developer.map(l => (
                  <a key={l.title} href={l.href} target="_blank" rel="noopener noreferrer" className="link-list-item">
                    <div className="link-list-icon" style={{ background: `${l.color}15` }}>
                      <span style={{ color: l.color }}>{l.icon}</span>
                    </div>
                    <div className="link-list-info">
                      <div className="link-list-title">{l.title}</div>
                      <div className="link-list-desc">{l.desc}</div>
                    </div>
                    <ExternalLink size={15} style={{ color: l.color, flexShrink: 0, opacity: 0.7 }} />
                  </a>
                ))}
              </div>
            </div> */}

          </div>
        </div>
      </section>

      {/* Admin-added Links */}
      {dbLinks.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="page-wrapper">
            <div className="links-section-header">
              <div className="workflow-eyebrow" style={{ marginBottom: 12 }}>
                <Star size={13} /> More Links
              </div>
              <h2 className="section-title">Additional Resources</h2>
            </div>
            <div className="links-list">
              {dbLinks.map(l => (
                <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="link-list-item">
                  <div className="link-list-icon" style={{ background: `${l.color || '#4A90D9'}15` }}>
                    <Globe size={20} style={{ color: l.color || '#4A90D9' }} />
                  </div>
                  <div className="link-list-info">
                    <div className="link-list-title">{l.title}</div>
                    {l.category && <div className="link-list-desc">{l.category}</div>}
                  </div>
                  <ExternalLink size={15} style={{ color: l.color || '#4A90D9', flexShrink: 0, opacity: 0.7 }} />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="page-wrapper">
          <div className="links-cta-banner">
            <div className="links-cta-glow" />
            <div style={{ position: 'relative' }}>
              <h2 style={{ fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
                Ready to Start Your FCFC Journey?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginBottom: 28, maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.7 }}>
                Generate your first Fortune Crowd Fund Coupon and join the growing crowd today.
              </p>
              <Link to="/coupon/generate" style={{ background: '#fff', color: 'var(--navy)', borderRadius: 12, padding: '13px 28px', fontWeight: 800, textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Generate Coupon <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
