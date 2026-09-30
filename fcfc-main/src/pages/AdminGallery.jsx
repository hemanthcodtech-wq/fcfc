import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ZoomIn, Image, Trash2, RefreshCcw, Plus, Check, Upload } from 'lucide-react'
import AdminLayout from './AdminLayout'
import couponImg    from '../assets/coupon-sample.png'
import heroImg      from '../assets/hero.png'
import ceoImg       from '../assets/ceo.png'
import regImg       from '../assets/reg.png'
import addressImg   from '../assets/address.jpeg'
import locationsImg from '../assets/locations.jpeg'
import imageImg     from '../assets/image.png'

const API = import.meta.env.VITE_API_URL + '/api/admin'

const STATIC_PHOTOS = [
  { id: 's1', src: couponImg,    caption: 'FCFC Coupon Sample',    category: 'Image' },
  { id: 's2', src: heroImg,      caption: 'FCFC Platform',          category: 'Image' },
  { id: 's3', src: ceoImg,       caption: 'Mr. James Knight — CEO', category: 'Image' },
  { id: 's4', src: regImg,       caption: 'Registration',            category: 'Image' },
  { id: 's5', src: addressImg,   caption: 'Our Address',             category: 'Image' },
  { id: 's6', src: locationsImg, caption: 'Global Locations',        category: 'Image' },
  { id: 's7', src: imageImg,     caption: 'FCFC Community',          category: 'Image' },
]

const BLANK_PHOTO = { caption: '', category: 'Image' }

export default function AdminGallery() {
  const [dbPhotos, setDbPhotos] = useState([])
  const [active, setActive] = useState(null)
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newPhoto, setNewPhoto] = useState(BLANK_PHOTO)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetch(`${API}/gallery`).then(r => r.json())
      setDbPhotos(Array.isArray(data) ? data : [])
    } catch {
      setDbPhotos([])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return
    try {
      await fetch(`${API}/gallery/${id}`, { method: 'DELETE' })
      setDbPhotos(prev => prev.filter(p => p.id !== id))
    } catch { /* ignore */ }
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    setFile(f)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  const handleAdd = async () => {
    if (!file || !newPhoto.caption) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('caption', newPhoto.caption)
      fd.append('category', newPhoto.category)
      const created = await fetch(`${API}/gallery`, { method: 'POST', body: fd }).then(r => r.json())
      setDbPhotos(prev => [created, ...prev])
      setNewPhoto(BLANK_PHOTO)
      setFile(null)
      setPreview(null)
      setAdding(false)
    } catch { /* ignore */ }
    setUploading(false)
  }

  // Merge DB photos (with image_url) + static assets
  const allPhotos = [
    ...dbPhotos.map(p => ({ id: p.id, src: p.image_url, caption: p.caption, category: p.category || 'Image', fromDb: true })),
    ...STATIC_PHOTOS,
  ]

  const categories = ['All', 'Image', 'Video']
  const filtered = filter === 'All' ? allPhotos : allPhotos.filter(p => p.category === filter)

  return (
    <AdminLayout title="Gallery" subtitle="Manage and preview platform gallery images">
      <div className="adm-page-actions">
        <div className="adm-filter-tabs">
          {categories.map(cat => (
            <button key={cat} className={`adm-filter-tab ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <button className="neu-btn adm-refresh-btn" onClick={fetchData} disabled={loading}>
          <RefreshCcw size={14} className={loading ? 'adm-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
        <button className="neu-btn neu-btn-primary adm-refresh-btn" onClick={() => setAdding(v => !v)}>
          <Plus size={14} /> Add Photo
        </button>
      </div>

      {adding && (
        <div className="adm-card adm-add-form">
          <div className="adm-card-title">Upload New Photo</div>
          <div className="adm-add-grid">
            <div className="form-group">
              <label className="form-label">Media File</label>
              <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileChange} />
              <button className="neu-btn adm-refresh-btn" onClick={() => fileRef.current.click()}>
                <Upload size={14} /> {file ? file.name : 'Choose Image or Video'}
              </button>
              {preview && newPhoto.category === 'Video' && <video src={preview} style={{ marginTop: 8, maxHeight: 120, borderRadius: 8 }} />}
              {preview && newPhoto.category !== 'Video' && <img src={preview} alt="preview" style={{ marginTop: 8, maxHeight: 120, borderRadius: 8 }} />}
            </div>
            <div className="form-group">
              <label className="form-label">Caption</label>
              <input className="neu-input" placeholder="Image caption" value={newPhoto.caption} onChange={e => setNewPhoto(p => ({ ...p, caption: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="neu-input" value={newPhoto.category} onChange={e => setNewPhoto(p => ({ ...p, category: e.target.value }))}>
                <option value="Image">Image</option>
                <option value="Video">Video</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="neu-btn neu-btn-primary adm-refresh-btn" onClick={handleAdd} disabled={uploading}>
              <Check size={14} /> {uploading ? 'Uploading…' : 'Save'}
            </button>
            <button className="neu-btn adm-refresh-btn" onClick={() => { setAdding(false); setFile(null); setPreview(null); setNewPhoto(BLANK_PHOTO) }}>
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-title">
          <Image size={18} /> Gallery Images
          <span className="adm-count">{filtered.length}</span>
        </div>
        <div className="adm-gallery-grid">
          {filtered.map((p, i) => (
            <div key={`${p.id ?? i}`} className="adm-gallery-item">
              <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setActive(p)}>
                {p.category === 'Video' ? <video src={p.src} preload="metadata" style={{ width: '100%', display: 'block', borderRadius: 12 }} /> : <img src={p.src} alt={p.caption} />}
                <div className="adm-gallery-overlay">
                  <ZoomIn size={20} color="#fff" />
                  <span>{p.caption}</span>
                </div>
              </div>
              <div className="adm-gallery-meta">
                <span className="adm-badge badge-blue">{p.category}</span>
                <span className="adm-gallery-caption">{p.caption}</span>
                {p.fromDb && (
                  <button className="adm-icon-btn adm-icon-btn-red" style={{ marginLeft: 'auto' }} onClick={() => handleDelete(p.id)}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {active && (
        <div className="adm-lightbox" onClick={() => setActive(null)}>
          <button className="adm-lightbox-close" onClick={() => setActive(null)}><X size={20} /></button>
          <div className="adm-lightbox-inner" onClick={e => e.stopPropagation()}>
            {active.category === 'Video' ? <video controls autoPlay src={active.src} style={{ width: '100%', borderRadius: 12 }} /> : <img src={active.src} alt={active.caption} />}
            <div className="adm-lightbox-caption">
              <span className="adm-badge badge-blue">{active.category}</span>
              <span>{active.caption}</span>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
