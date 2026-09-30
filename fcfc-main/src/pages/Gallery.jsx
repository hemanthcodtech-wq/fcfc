import { TypeAnimation } from 'react-type-animation'
import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { X, ZoomIn, Image, Video, Play } from 'lucide-react'
import couponImg from '../assets/coupon-sample.png'
import heroImg from '../assets/hero.png'
import ceoImg from '../assets/ceo.png'
import regImg from '../assets/reg.png'
import addressImg from '../assets/address.jpeg'
import locationsImg from '../assets/locations.jpeg'
import imageImg from '../assets/image.png'
import './Gallery.css'

const STATIC_IMAGES = [
  { src: couponImg,    caption: 'FCFC Coupon Sample',    category: 'Image' },
  { src: heroImg,      caption: 'FCFC Platform',          category: 'Image' },
  { src: ceoImg,       caption: 'Mr. James Knight — CEO', category: 'Image' },
  { src: regImg,       caption: 'Registration',            category: 'Image' },
  { src: addressImg,   caption: 'Our Address',             category: 'Image' },
  { src: locationsImg, caption: 'Global Locations',        category: 'Image' },
  { src: imageImg,     caption: 'FCFC Community',          category: 'Image' },
]

const STATIC_VIDEOS = [
  { src: '/src/assets/hero-video.mp4', caption: 'FCFC Intro Video', category: 'Video' },
]

export default function Gallery() {
  const [active, setActive] = useState(null)
  const [dbPhotos, setDbPhotos] = useState([])
  const { hash } = useLocation()
  const { tab } = useParams()

  // Scroll to section when hash or tab is present
  useEffect(() => {
    const targetId = tab ? `#${tab}` : hash
    if (targetId) {
      setTimeout(() => {
        const el = document.querySelector(targetId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [hash, tab])

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/admin/gallery')
      .then(r => r.json())
      .then(data => setDbPhotos(Array.isArray(data) ? data.map(p => ({ src: p.image_url, caption: p.caption, category: p.category || 'Image' })) : []))
      .catch(() => {})
  }, [])

  const allPhotos = [...dbPhotos, ...STATIC_IMAGES, ...STATIC_VIDEOS]
  const images = allPhotos.filter(p => p.category === 'Image')
  const videos = allPhotos.filter(p => p.category === 'Video')

  const GalleryItem = ({ p }) => (
    <div className="gallery-item" onClick={() => setActive(p)}>
      {p.category === 'Video'
        ? <>
            <video src={p.src} preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div className="gal-video-badge"><Play size={10} fill="#fff" /> VIDEO</div>
          </>
        : <img src={p.src} alt={p.caption} />
      }
      <div className="gallery-overlay">
        <ZoomIn size={22} color="#fff" />
        <span>{p.caption}</span>
      </div>
    </div>
  )

  return (
    <main>
      <div className="page-header">
        <h1>Gallery</h1>
        <p><TypeAnimation sequence={['A visual journey through the Fortune Crowd Fund Coupon ecosystem.', 4000]} speed={55} repeat={Infinity} /></p>
      </div>

      <section className="section">
        <div className="page-wrapper">

          {/* ── Images Section ── */}
          <div className="gal-category-block" id="images">
            <div className="gal-section-header">
              <div className="gal-section-icon images">
                <Image size={20} color="#fff" />
              </div>
              <span className="gal-section-label">Images</span>
              <span className="gal-section-count">{images.length}</span>
              <div className="gal-section-divider" />
            </div>
            {images.length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No images uploaded yet.</p>
              : <div className="gallery-grid">
                  {images.map((p, i) => <GalleryItem key={i} p={p} />)}
                </div>
            }
          </div>

          {/* ── Videos Section ── */}
          <div className="gal-category-block" id="videos">
            <div className="gal-section-header">
              <div className="gal-section-icon videos">
                <Video size={20} color="#fff" />
              </div>
              <span className="gal-section-label">Videos</span>
              <span className="gal-section-count">{videos.length}</span>
              <div className="gal-section-divider" />
            </div>
            {videos.length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No videos uploaded yet.</p>
              : <div className="gallery-grid">
                  {videos.map((p, i) => <GalleryItem key={i} p={p} />)}
                </div>
            }
          </div>

        </div>
      </section>

      {/* Lightbox */}
      {active && (
        <div className="gallery-lightbox" onClick={() => setActive(null)}>
          <button className="lightbox-close" onClick={() => setActive(null)}><X size={22} /></button>
          {active.category === 'Video'
            ? <video controls autoPlay src={active.src} onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: '16px' }} />
            : <img src={active.src} alt={active.caption} onClick={e => e.stopPropagation()} />
          }
          <p>{active.caption}</p>
        </div>
      )}
    </main>
  )
}
