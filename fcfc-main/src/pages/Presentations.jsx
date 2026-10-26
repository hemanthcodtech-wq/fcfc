import { TypeAnimation } from 'react-type-animation'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Play, FileText, Video, Eye, X, Loader } from 'lucide-react'
import NativePdfViewer from '../components/NativePdfViewer'
import './Presentations.css'

const API_BASE = import.meta.env.VITE_API_URL

export default function Presentations() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeItem, setActiveItem] = useState(null)
  const [docLoading, setDocLoading] = useState(false)
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

  // Fetch presentations from backend
  const fetchPresentations = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/presentations`)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPresentations()
  }, [fetchPresentations])

  // Keyboard navigation hook for viewer modal (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveItem(null)
    }
    if (activeItem) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [activeItem])

  // Open viewer modal directly on page without downloading
  const openViewer = useCallback((item) => {
    setDocLoading(true)
    setActiveItem(item)
  }, [])

  const closeViewer = useCallback(() => {
    setActiveItem(null)
    setDocLoading(false)
  }, [])

  // Memoize categorized items
  const videos = useMemo(
    () => items.filter(v => v.file_type === 'video' || v.category === 'Video'),
    [items]
  )
  const ppts = useMemo(
    () => items.filter(v => v.file_type === 'pdf' || v.category === 'PPT'),
    [items]
  )

  // Construct in-browser stream URL for PDFs (avoids attachment download header)
  const getInlineUrl = useCallback((url) => {
    if (!url) return ''
    return `${API_BASE}/api/general/view-file?url=${encodeURIComponent(url)}#toolbar=0&navpanes=0`
  }, [])

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

            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading presentations…</p>
            ) : videos.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No videos uploaded yet.</p>
            ) : (
              <div className="pres-grid">
                {videos.map((v, i) => (
                  <div key={v.id ?? i} className="pres-card" onClick={() => openViewer(v)} style={{ cursor: 'pointer' }}>
                    <div className="pres-video-wrap">
                      <video preload="metadata" muted>
                        <source src={v.file_url} type="video/mp4" />
                      </video>
                      <div className="pres-play-hint"><Play size={14} /> Click to watch</div>
                    </div>
                    <div className="pres-info">
                      <div className="pres-num">0{i + 1}</div>
                      <div>
                        <div className="pres-title">{v.title}</div>
                        <div className="pres-desc">{v.description || 'Official FCFC video presentation.'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading documents…</p>
            ) : ppts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No documents uploaded yet.</p>
            ) : (
              <div className="pres-ppt-grid">
                {ppts.map((v, i) => (
                  <div
                    key={v.id ?? i}
                    className="pres-ppt-card"
                    onClick={() => openViewer(v)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="pres-ppt-icon-wrap">
                      <FileText size={28} color="#fff" />
                    </div>
                    <div className="pres-ppt-title">{v.title}</div>
                    <div className="pres-ppt-desc">{v.description || 'Official presentation document.'}</div>
                    <button
                      type="button"
                      className="pres-ppt-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        openViewer(v)
                      }}
                    >
                      <Eye size={14} /> View Document
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ── In-Page Modal Viewer for Video & PDF (Prevents Download) ── */}
      {activeItem && (
        <div
          className="pres-modal-overlay"
          onClick={closeViewer}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 20, 45, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div
            className="pres-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0d1b3e',
              borderRadius: 18,
              width: '100%',
              maxWidth: 960,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {/* Header */}
            <div className="pres-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                {activeItem.file_type === 'pdf' || activeItem.category === 'PPT' ? (
                  <FileText size={20} color="#e74c3c" style={{ flexShrink: 0 }} />
                ) : (
                  <Video size={20} color="#4A90D9" style={{ flexShrink: 0 }} />
                )}
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {activeItem.title}
                  </h3>
                  {activeItem.description && (
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {activeItem.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={closeViewer}
                aria-label="Close"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Media Body */}
            <div className="pres-modal-body">
              {activeItem.file_type === 'pdf' || activeItem.category === 'PPT' ? (
                <NativePdfViewer
                  url={`${API_BASE}/api/general/view-file?url=${encodeURIComponent(activeItem.file_url)}`}
                  title={activeItem.title}
                  onLoaded={() => setDocLoading(false)}
                />
              ) : (
                <>
                  {docLoading && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: 14,
                      zIndex: 1
                    }}>
                      <Loader size={20} className="adm-spin" /> Loading video…
                    </div>
                  )}
                  <video
                    controls
                    autoPlay
                    controlsList="nodownload"
                    onLoadedData={() => setDocLoading(false)}
                    style={{
                      width: '100%',
                      maxHeight: '72vh',
                      display: 'block'
                    }}
                  >
                    <source src={activeItem.file_url} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
