import { useState, useEffect, useCallback, useRef } from 'react'
import { Monitor, Play, X, Plus, Trash2, Edit2, Check, RefreshCcw, Upload, FileText } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API = import.meta.env.VITE_API_URL + '/api/admin'
const CATEGORIES = ['All', 'Video', 'PPT']
const BLANK = { title: '', description: '', category: 'Video' }

export default function AdminPresentations() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('All')
  const [preview, setPreview] = useState(null)
  const [adding, setAdding] = useState(false)
  const [newVideo, setNewVideo] = useState(BLANK)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const fileRef = useRef()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetch(`${API}/presentations`).then(r => r.json())
      setVideos(Array.isArray(data) ? data : [])
    } catch {
      setVideos([])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAdd = async () => {
    if (!newVideo.title || !file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('title', newVideo.title)
      fd.append('description', newVideo.description)
      fd.append('category', newVideo.category)
      const created = await fetch(`${API}/presentations`, { method: 'POST', body: fd }).then(r => r.json())
      setVideos(prev => [...prev, created])
      setNewVideo(BLANK)
      setFile(null)
      setAdding(false)
    } catch { /* ignore */ }
    setUploading(false)
  }

  const startEdit = (v) => { setEditingId(v.id); setEditData({ title: v.title, description: v.description, video_url: v.video_url, category: v.category }) }

  const saveEdit = async (id) => {
    try {
      const updated = await fetch(`${API}/presentations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editData.title, description: editData.description, category: editData.category }),
      }).then(r => r.json())
      setVideos(prev => prev.map(v => v.id === id ? { ...v, ...updated } : v))
    } catch { /* ignore */ }
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this presentation?')) return
    try {
      await fetch(`${API}/presentations/${id}`, { method: 'DELETE' })
      setVideos(prev => prev.filter(v => v.id !== id))
    } catch { /* ignore */ }
  }

  const filtered = filter === 'All' ? videos : videos.filter(v => v.category === filter)

  return (
    <AdminLayout title="Presentations (PPT & Videos)" subtitle="Upload, manage, and preview all PPT / PDF documents and video presentations">
      <div className="adm-page-actions">
        <div className="adm-filter-tabs">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`adm-filter-tab ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
              {cat === 'PPT' ? 'PPT / PDF' : cat}
            </button>
          ))}
        </div>
        <button className="neu-btn adm-refresh-btn" onClick={fetchData} disabled={loading}>
          <RefreshCcw size={14} className={loading ? 'adm-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
        <button className="neu-btn neu-btn-primary adm-refresh-btn" onClick={() => setAdding(v => !v)}>
          <Plus size={14} /> Add Presentation (PPT / Video)
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="adm-card adm-add-form">
          <div className="adm-card-title">Add New Presentation (PPT / PDF or Video)</div>
          <div className="adm-add-grid">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="neu-input" placeholder="Presentation title" value={newVideo.title} onChange={e => setNewVideo(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">File (Video or PDF)</label>
              <input ref={fileRef} type="file" accept="video/*,application/pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
              <button className="neu-btn adm-refresh-btn" onClick={() => fileRef.current.click()}>
                <Upload size={14} /> {file ? file.name : 'Choose Video or PDF'}
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="neu-input" value={newVideo.category} onChange={e => setNewVideo(p => ({ ...p, category: e.target.value }))}>
                <option value="Video">Video</option>
                <option value="PPT">PPT</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="neu-input" placeholder="Short description" value={newVideo.description} onChange={e => setNewVideo(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="neu-btn neu-btn-primary adm-refresh-btn" onClick={handleAdd} disabled={uploading}>
              <Check size={14} /> {uploading ? 'Uploading…' : 'Save'}
            </button>
            <button className="neu-btn adm-refresh-btn" onClick={() => { setAdding(false); setNewVideo(BLANK); setFile(null) }}><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-title">
          {filter === 'PPT' ? <FileText size={18} /> : <Monitor size={18} />}
          {filter === 'All' ? 'All Presentations (PPT & Videos)' : filter === 'PPT' ? 'PPT / PDF Presentations' : 'Video Presentations'}
          <span className="adm-count">{filtered.length}</span>
        </div>

        {filtered.length === 0
          ? <div className="adm-empty">No presentations found. Add one above.</div>
          : (
            <div className="adm-pres-grid">
              {filtered.map((v, i) => (
                <div key={v.id} className="adm-pres-card">
                  {editingId === v.id
                    ? (
                      <div style={{ padding: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">Title</label>
                          <input className="neu-input" value={editData.title} onChange={e => setEditData(p => ({ ...p, title: e.target.value }))} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">File / URL</label>
                          <input className="neu-input" value={editData.video_url} onChange={e => setEditData(p => ({ ...p, video_url: e.target.value }))} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Category</label>
                          <select className="neu-input" value={editData.category} onChange={e => setEditData(p => ({ ...p, category: e.target.value }))}>
                            <option value="Video">Video</option>
                            <option value="PPT">PPT</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="neu-btn neu-btn-primary adm-refresh-btn" onClick={() => saveEdit(v.id)}><Check size={13} /> Save</button>
                          <button className="neu-btn adm-refresh-btn" onClick={() => setEditingId(null)}><X size={13} /> Cancel</button>
                        </div>
                      </div>
                    )
                    : (
                      <>
                        <div className="adm-pres-thumb" onClick={() => setPreview(v)}>
                          {v.file_type === 'pdf' || v.category === 'PPT'
                            ? (
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                background: 'linear-gradient(135deg, rgba(231,76,60,0.1), rgba(74,144,217,0.1))',
                                gap: 10
                              }}>
                                <FileText size={48} color="#e74c3c" />
                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>PDF Document</span>
                              </div>
                            ) : (
                              <>
                                <video src={v.file_url} preload="metadata" muted />
                                <div className="adm-pres-play">
                                  <div><Play size={22} color="#fff" fill="#fff" /></div>
                                </div>
                              </>
                            )
                          }
                          <span className={`adm-badge ${v.category === 'PPT' || v.file_type === 'pdf' ? 'badge-yellow' : 'badge-blue'} adm-pres-cat`}>
                            {v.category === 'PPT' ? 'PPT / PDF' : v.category}
                          </span>
                        </div>
                        <div className="adm-pres-info">
                          <div className="adm-pres-num">0{i + 1}</div>
                          <div>
                            <div className="adm-pres-title">{v.title}</div>
                            <div className="adm-pres-desc">{v.description || 'No description provided.'}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, padding: '0 16px 16px' }}>
                          <button className="neu-btn adm-pres-preview-btn" onClick={() => setPreview(v)}>
                            {v.file_type === 'pdf' || v.category === 'PPT' ? <FileText size={13} /> : <Play size={13} />}
                            {v.file_type === 'pdf' || v.category === 'PPT' ? 'Open Document' : 'Preview'}
                          </button>
                          <button className="adm-icon-btn" onClick={() => startEdit(v)}><Edit2 size={14} /></button>
                          <button className="adm-icon-btn adm-icon-btn-red" onClick={() => handleDelete(v.id)}><Trash2 size={14} /></button>
                        </div>
                      </>
                    )
                  }
                </div>
              ))}
            </div>
          )
        }
      </div>

      {preview && (
        <div className="adm-lightbox" onClick={() => setPreview(null)}>
          <button className="adm-lightbox-close" onClick={() => setPreview(null)}><X size={20} /></button>
          <div className="adm-lightbox-inner adm-lightbox-video" onClick={e => e.stopPropagation()}>
            {preview.file_type === 'pdf' || preview.category === 'PPT'
              ? <iframe src={`${import.meta.env.VITE_API_URL}/api/general/view-file?url=${encodeURIComponent(preview.file_url)}#toolbar=0&navpanes=0`} title={preview.title} style={{ width: '100%', height: '75vh', borderRadius: 12, border: 'none' }} />
              : <video controls controlsList="nodownload" autoPlay style={{ width: '100%', borderRadius: 12 }}>
                  <source src={preview.file_url} type="video/mp4" />
                </video>
            }
            <div className="adm-lightbox-caption">
              <span className="adm-badge badge-blue">{preview.category}</span>
              <span>{preview.title}</span>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
