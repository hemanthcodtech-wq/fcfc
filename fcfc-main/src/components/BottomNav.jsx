import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Ticket, Info, Mail, ExternalLink, Image, HelpCircle } from 'lucide-react'
import './BottomNav.css'

const couponItems = [
  { label: 'About Coupon',    path: '/coupon/about' },
  { label: 'Generate Coupon', path: '/coupon/generate' },
  { label: 'Submit Coupon',   path: '/coupon/submit' },
  { label: 'Renew Coupon',    path: '/coupon/renew' },
  { label: 'Search Coupon',   path: '/coupon/search' },
]

const galleryItems = [
  { label: 'Images', path: '/gallery/images' },
  { label: 'Videos', path: '/gallery/videos' },
]

const items = [
  { label: 'Home',    path: '/',               icon: <Home size={18} /> },
  { label: 'About',   path: '/about',          icon: <Info size={18} /> },
  { label: 'Links',   path: '/links',          icon: <ExternalLink size={18} /> },
  { label: 'Gallery', path: null,              icon: <Image size={18} /> },
  { label: 'FAQ',     path: '/faq',            icon: <HelpCircle size={18} /> },
  { label: 'Contact', path: '/contact',        icon: <Mail size={18} /> },
  { label: 'Coupon',  path: null,              icon: <Ticket size={18} /> },
]

export default function BottomNav() {
  const [couponOpen, setCouponOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)

  return (
    <nav className="bottom-nav">
      {items.map(item => {
        if (item.label === 'Gallery') {
          return (
            <button key="gallery" className="bottom-nav-item" onClick={() => {
              setGalleryOpen(o => !o)
              setCouponOpen(false)
            }}>
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          )
        }

        if (item.label === 'Coupon') {
          return (
            <button key="coupon" className="bottom-nav-item" onClick={() => {
              setCouponOpen(o => !o)
              setGalleryOpen(false)
            }}>
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          )
        }

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
            onClick={() => {
              setCouponOpen(false)
              setGalleryOpen(false)
            }}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        )
      })}

      {galleryOpen && (
        <>
          <div className="coupon-backdrop" onClick={() => setGalleryOpen(false)} />
          <div className="gallery-sheet">
            {galleryItems.map(ci => (
              <NavLink key={ci.path} to={ci.path} className="sheet-item" onClick={() => setGalleryOpen(false)}>
                <span style={{ fontWeight: 700 }}>{ci.label}</span>
              </NavLink>
            ))}
          </div>
        </>
      )}

      {couponOpen && (
        <>
          <div className="coupon-backdrop" onClick={() => setCouponOpen(false)} />
          <div className="coupon-sheet">
            {couponItems.map(ci => (
              <NavLink key={ci.path} to={ci.path} className="sheet-item" onClick={() => setCouponOpen(false)}>
                <span style={{ fontWeight: 700 }}>{ci.label}</span>
              </NavLink>
            ))}
          </div>
        </>
      )}
    </nav>
  )
}
