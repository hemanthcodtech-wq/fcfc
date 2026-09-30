import { TypeAnimation } from 'react-type-animation'
import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Play, FileText, Video, ExternalLink } from 'lucide-react'
import './Presentations.css'

const STATIC_VIDEOS = [
  { file_url: '/src/assets/hero-video.mp4',       file_type: 'video', category: 'Video', title: 'FCFC Platform Overview',     description: 'A complete walkthrough of the Fortune Crowd Fund Coupon platform and how it works.' },
  { file_url: '/src/assets/coupon-arbitrage.mp4', file_type: 'video', category: 'Video', title: 'Coupon Arbitrage Explained', description: 'Learn how coupon arbitrage multiplies value across the FCFC community.' },
  { file_url: '/src/assets/no-dollar-coupon.mp4', file_type: 'video', category: 'Video', title: 'No Dollar Coupon Model',     description: 'Understand the no-dollar coupon model and its benefits for every member.' },
  { file_url: '/src/assets/faq-video.mp4',        file_type: 'video', category: 'Video', title: 'Frequently Asked Questions', description: 'Video answers to the most common questions about FCFC coupons.' },
]

const STATIC_PPTS = [
  { file_url: '#', file_type: 'pdf', category: 'PPT', title: 'FCFC Whitepaper', description: 'Detailed platform documentation and coupon rules in PDF format.' },
]

export default function Presentations() {
  const [items, setItems] = useState([])
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
    fetch(import.meta.env.VITE_API_URL + '/api/admin/presentations')
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const allItems = [...items, ...STATIC_VIDEOS, ...STATIC_PPTS]
  const videos = allItems.filter(v => v.file_type === 'video' || v.category === 'Video')
  const ppts   = allItems.filter(v => v.file_type === 'pdf'   || v.category === 'PPT')

  return (
    <main>
      <div className="page-header">
        <h1>Presentations</h1>
        <p><TypeAnimation sequence={['Watch our official FCFC video presentations and review documents.', 4000]} speed={55} repeat={Infinity} /></p>
      </div>

      <section className="section">
        <div className="page-wrapper">

          {/* ── Videos Section ── */}
          <div className="pres-category-block" id="videos">
            <div className="pres-section-header">
              <div className="pres-section-icon videos">
                <Video size={20} color="#fff" />
              </div>
              <span className="pres-section-label">Videos</span>
              <span className="pres-section-count">{videos.length}</span>
              <div className="pres-section-divider" />
            </div>

            {videos.length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No videos uploaded yet.</p>
              : <div className="pres-grid">
                  {videos.map((v, i) => (
                    <div key={v.id ?? i} className="pres-card">
                      <div className="pres-video-wrap">
                        <video controls preload="metadata">
                          <source src={v.file_url} type="video/mp4" />
                        </video>
                        <div className="pres-play-hint"><Play size={14} /> Click to play</div>
                      </div>
                      <div className="pres-info">
                        <div className="pres-num">0{i + 1}</div>
                        <div>
                          <div className="pres-title">{v.title}</div>
                          <div className="pres-desc">{v.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>

          {/* ── PPT / PDF Section ── */}
          <div className="pres-category-block" id="ppts">
            <div className="pres-section-header">
              <div className="pres-section-icon ppts">
                <FileText size={20} color="#fff" />
              </div>
              <span className="pres-section-label">PPT / PDF</span>
              <span className="pres-section-count">{ppts.length}</span>
              <div className="pres-section-divider" />
            </div>

            {ppts.length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No documents uploaded yet.</p>
              : <div className="pres-ppt-grid">
                  {ppts.map((v, i) => (
                    <a
                      key={v.id ?? i}
                      href={v.file_url !== '#' ? v.file_url : undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="pres-ppt-card"
                      onClick={v.file_url === '#' ? e => e.preventDefault() : undefined}
                    >
                      <div className="pres-ppt-icon-wrap">
                        <FileText size={28} color="#fff" />
                      </div>
                      <div className="pres-ppt-title">{v.title}</div>
                      <div className="pres-ppt-desc">{v.description}</div>
                      <span className="pres-ppt-btn">
                        <ExternalLink size={13} /> Open Document
                      </span>
                    </a>
                  ))}
                </div>
            }
          </div>

        </div>
      </section>
    </main>
  )
}
