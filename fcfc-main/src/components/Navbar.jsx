import { useState, useRef, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  ChevronDown,
  Ticket,
  RefreshCw,
  Search,
  Send,
  Menu,
  X,
  Info,
  Image,
  Video,
  FileText,
  Home,
  Mail,
  ExternalLink,
  HelpCircle,
} from 'lucide-react'
import logo from '../assets/logo.png'
import './Navbar.css'

const couponItems = [
  { label: 'About Coupon',    path: '/coupon/about',    icon: <Info size={15} /> },
  { label: 'Generate Coupon', path: '/coupon/generate', icon: <Ticket size={15} /> },
  { label: 'Submit Coupon',   path: '/coupon/submit',   icon: <Send size={15} /> },
  { label: 'Renew Coupon',    path: '/coupon/renew',    icon: <RefreshCw size={15} /> },
  { label: 'Search Coupon',   path: '/coupon/search',   icon: <Search size={15} /> },
]

const galleryItems = [
  { label: 'Images',  path: '/gallery/images', icon: <Image size={15} /> },
  { label: 'Videos',  path: '/gallery/videos', icon: <Video size={15} /> },
]

const presItems = [
  { label: 'Videos',    path: '/presentations/videos', icon: <Video size={15} /> },
  { label: 'PPT / PDF', path: '/presentations/ppts',   icon: <FileText size={15} /> },
]

// Desktop nav links
const desktopLinks = [
  { label: 'Home',    path: '/',             icon: <Home size={15} /> },
  { label: 'About',   path: '/about',        icon: <Info size={15} /> },
  { label: 'Links',   path: '/links',        icon: <ExternalLink size={15} /> },
  { label: 'Gallery', path: '/gallery/images', icon: <Image size={15} /> },
  { label: 'FAQ',     path: '/faq',          icon: <HelpCircle size={15} /> },
  { label: 'Contact', path: '/contact',      icon: <Mail size={15} /> },
  { label: 'PPT',     path: '/presentations', icon: <FileText size={15} /> },
  { label: 'Coupon',  path: '/coupon/generate', icon: <Ticket size={15} /> },
]

const hamburgerLinks = [
  { label: 'Home',               path: '/' },
  { label: 'About',              path: '/about' },
  { label: 'Links',              path: '/links' },
  { label: 'Gallery (Images)',   path: '/gallery/images' },
  { label: 'Gallery (Videos)',   path: '/gallery/videos' },
  { label: 'FAQ',                path: '/faq' },
  { label: 'Contact',            path: '/contact' },
  { label: 'PPT (Presentations)', path: '/presentations' },
  { label: 'Generate Coupon',    path: '/coupon/generate' },
  { label: 'Submit Coupon',      path: '/coupon/submit' },
  { label: 'Renew Coupon',       path: '/coupon/renew' },
  { label: 'Search Coupon',      path: '/coupon/search' },
]

export default function Navbar() {
  const [dropOpen, setDropOpen]   = useState(false)
  const [galOpen, setGalOpen]     = useState(false)
  const [presOpen, setPresOpen]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const dropRef = useRef(null)
  const galRef  = useRef(null)
  const presRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
      if (galRef.current  && !galRef.current.contains(e.target))  setGalOpen(false)
      if (presRef.current && !presRef.current.contains(e.target)) setPresOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img src={logo} alt="FCFC Logo" />
          <span className="nav-logo-text">Fortune Crowd Fund Coupon (FCFC)</span>
          <span className="nav-logo-mobile">Fortune Crowd Fund Coupon (FCFC)</span>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links">
          {desktopLinks.map(l => {
            const isGallery = l.label === 'Gallery'
            const isCoupon = l.label === 'Coupon'
            const isPPT = l.label === 'PPT'

            if (isPPT) {
              return (
                <li key="ppt-dropdown" className="dropdown" ref={presRef}>
                  <div className="dropdown-toggle" onClick={() => setPresOpen(o => !o)}>
                    <FileText size={15} />
                    PPT
                    <ChevronDown size={14} style={{ transform: presOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                  </div>
                  {presOpen && (
                    <div className="dropdown-menu">
                      <Link to="/presentations" onClick={() => setPresOpen(false)}>
                        <FileText size={15} />All Presentations
                      </Link>
                      {presItems.map(item => (
                        <Link key={item.path} to={item.path} onClick={() => setPresOpen(false)}>
                          {item.icon}{item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              )
            }

            if (isGallery) {
              return (
                <li key="gallery-dropdown" className="dropdown" ref={galRef}>
                  <div className="dropdown-toggle" onClick={() => setGalOpen(o => !o)}>
                    <Image size={15} />
                    Gallery
                    <ChevronDown size={14} style={{ transform: galOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                  </div>
                  {galOpen && (
                    <div className="dropdown-menu">
                      {galleryItems.map(item => (
                        <Link key={item.path} to={item.path} onClick={() => setGalOpen(false)}>
                          {item.icon}{item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              )
            }

            if (isCoupon) {
              return (
                <li key="coupon-dropdown" className="dropdown" ref={dropRef}>
                  <div className="dropdown-toggle" onClick={() => setDropOpen(o => !o)}>
                    <Ticket size={15} />
                    Coupon
                    <ChevronDown size={14} style={{ transform: dropOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                  </div>
                  {dropOpen && (
                    <div className="dropdown-menu">
                      {couponItems.map(item => (
                        <Link key={item.path} to={item.path} onClick={() => setDropOpen(false)}>
                          {item.icon}{item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              )
            }

            return (
              <li key={l.path}>
                <NavLink to={l.path} end={l.path === '/'}>
                  <span className="nav-link-icon">{l.icon}</span>
                  <span>{l.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>

        {/* Desktop CTA */}
        <Link to="/coupon/generate" className="neu-btn neu-btn-primary nav-cta">
          <Ticket size={15} /> Generate Coupon
        </Link>

        {/* Mobile hamburger */}
        <div className="nav-hamburger-wrap" ref={menuRef}>
          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {menuOpen && (
            <div className="hamburger-dropdown">
              <div className="hamburger-dropdown-title">More Pages</div>
              {hamburgerLinks.map(l => (
                <NavLink
                  key={l.path}
                  to={l.path}
                  className={({ isActive }) => `mobile-link${isActive ? ' active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </NavLink>
              ))}

            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
