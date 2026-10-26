import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Ticket, Info, Mail, ExternalLink, Image, HelpCircle, FileText, Video } from 'lucide-react'
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

const pptItems = [
  { label: 'All Presentations', path: '/presentations' },
  { label: 'Videos',            path: '/presentations/videos' },
  { label: 'PPT / PDF Docs',    path: '/presentations/ppts' },
]

const items = [
  { label: 'Home',    path: '/',               icon: <Home size={18} /> },
  { label: 'About',   path: '/about',          icon: <Info size={18} /> },
  { label: 'Links',   path: '/links',          icon: <ExternalLink size={18} /> },
  { label: 'Gallery', path: null,              icon: <Image size={18} /> },
  { label: 'FAQ',     path: '/faq',            icon: <HelpCircle size={18} /> },
  { label: 'Contact', path: '/contact',        icon: <Mail size={18} /> },
  { label: 'PPT',     path: null,              icon: <FileText size={18} /> },
  { label: 'Coupon',  path: null,              icon: <Ticket size={18} /> },
]

export default function BottomNav() {
  const [couponOpen, setCouponOpen]   = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [pptOpen, setPptOpen]         = useState(false)

  const closeAll = () => {
    setCouponOpen(false)
    setGalleryOpen(false)
    setPptOpen(false)
  }

  return (
    <nav className="bottom-nav">
      {items.map(item => {
        if (item.label === 'PPT') {
          return (
            <button key="ppt" className={`bottom-nav-item${pptOpen ? ' active' : ''}`} onClick={() => {
              setPptOpen(o => !o)
              setCouponOpen(false)
              setGalleryOpen(false)
            }}>
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          )
        }

        if (item.label === 'Gallery') {
          return (
            <button key="gallery" className={`bottom-nav-item${galleryOpen ? ' active' : ''}`} onClick={() => {
              setGalleryOpen(o => !o)
              setCouponOpen(false)
              setPptOpen(false)
            }}>
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          )
        }

        if (item.label === 'Coupon') {
          return (
            <button key="coupon" className={`bottom-nav-item${couponOpen ? ' active' : ''}`} onClick={() => {
              setCouponOpen(o => !o)
              setGalleryOpen(false)
              setPptOpen(false)
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
            onClick={closeAll}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        )
      })}

      {/* PPT Sheet */}
      {pptOpen && (
        <>
          <div className="coupon-backdrop" onClick={() => setPptOpen(false)} />
          <div className="gallery-sheet">
            {pptItems.map(ci => (
              <NavLink key={ci.path} to={ci.path} className="sheet-item" onClick={() => setPptOpen(false)}>
                <span style={{ fontWeight: 700 }}>{ci.label}</span>
              </NavLink>
            ))}
          </div>
        </>
      )}

      {/* Gallery Sheet */}
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

      {/* Coupon Sheet */}
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
