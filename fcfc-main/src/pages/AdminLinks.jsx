import { useState, useEffect, useCallback } from 'react'
import { ExternalLink, Globe, BookOpen, FileText, MessageCircle, Share2, Video, GitBranch, Link2, Edit2, Check, X, Trash2, Plus, RefreshCcw } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API = import.meta.env.VITE_API_URL + '/api/admin'

const ICON_MAP = { Globe, BookOpen, FileText, MessageCircle, Share2, Video, GitBranch, Link2 }
const CATEGORIES = ['All', 'Featured', 'Community', 'Developer', 'General']

const BLANK = { title: '', url: '', category: 'General', color: '#4A90D9' }

export default function AdminLinks() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [adding, setAdding] = useState(false)
  const [newLink, setNewLink] = useState(BLANK)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetch(`${API}/links`).then(r => r.json())
      setLinks(Array.isArray(data) ? data : [])
    } catch {
      setLinks([])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const startEdit = (link) => { setEditingId(link.id); setEditData({ url: link.url, title: link.title }) }

  const saveEdit = async (id) => {
    try {
      const updated = await fetch(`${API}/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      }).then(r => r.json())
      setLinks(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l))
    } catch { /* ignore */ }
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this link?')) return
    try {
      await fetch(`${API}/links/${id}`, { method: 'DELETE' })
      setLinks(prev => prev.filter(l => l.id !== id))
    } catch { /* ignore */ }
  }

  const handleAdd = async () => {
    if (!newLink.title || !newLink.url) return
    try {
      const created = await fetch(`${API}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      }).then(r => r.json())
      setLinks(prev => [...prev, created])
      setNewLink(BLANK)
      setAdding(false)
    } catch { /* ignore */ }
  }

  const filtered = filter === 'All' ? links : links.filter(l => l.category === filter)

  return (
    <AdminLayout title="Links" subtitle="Manage all FCFC platform links">
      <div className="adm-page-actions">
        <div className="adm-filter-tabs">
          {CATEGORIES.map(cat => (
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
          <Plus size={14} /> Add Link
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="adm-card adm-add-form">
          <div className="adm-card-title">Add New Link</div>
          <div className="adm-add-grid">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="neu-input" placeholder="e.g. Official Website" value={newLink.title} onChange={e => setNewLink(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">URL</label>
              <input className="neu-input" placeholder="https://…" value={newLink.url} onChange={e => setNewLink(p => ({ ...p, url: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="neu-input" value={newLink.category} onChange={e => setNewLink(p => ({ ...p, category: e.target.value }))}>
                {['Featured', 'Community', 'Developer', 'General'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <input className="neu-input" type="color" value={newLink.color} onChange={e => setNewLink(p => ({ ...p, color: e.target.value }))} style={{ height: 46, padding: '4px 8px', cursor: 'pointer' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="neu-btn neu-btn-primary adm-refresh-btn" onClick={handleAdd}><Check size={14} /> Save</button>
            <button className="neu-btn adm-refresh-btn" onClick={() => { setAdding(false); setNewLink(BLANK) }}><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-title">
          <Link2 size={18} /> Platform Links
          <span className="adm-count">{filtered.length}</span>
        </div>
        <div className="adm-table-wrap">
          {loading
            ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 0' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: 'rgba(13,27,62,0.03)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(13,27,62,0.07)', flexShrink: 0 }} className="adm-skeleton" />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ height: 13, width: '40%', borderRadius: 6, background: 'rgba(13,27,62,0.07)' }} className="adm-skeleton" />
                      <div style={{ height: 11, width: '60%', borderRadius: 6, background: 'rgba(13,27,62,0.05)' }} className="adm-skeleton" />
                    </div>
                    <div style={{ width: 70, height: 24, borderRadius: 20, background: 'rgba(13,27,62,0.06)' }} className="adm-skeleton" />
                    <div style={{ width: 60, height: 28, borderRadius: 8, background: 'rgba(13,27,62,0.05)' }} className="adm-skeleton" />
                  </div>
                ))}
              </div>
            )
            : (
          <table className="adm-table">
            <thead>
              <tr><th>#</th><th>Title</th><th>Category</th><th>URL</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={5} className="adm-empty">No links found. Add one above.</td></tr>
                : filtered.map((l, i) => (
                  <tr key={l.id}>
                    <td className="mono adm-muted">{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="adm-link-icon" style={{ background: `${l.color || '#4A90D9'}18` }}>
                          <Link2 size={14} color={l.color || '#4A90D9'} />
                        </div>
                        {editingId === l.id
                          ? <input className="neu-input adm-url-input" value={editData.title} onChange={e => setEditData(p => ({ ...p, title: e.target.value }))} />
                          : l.title
                        }
                      </div>
                    </td>
                    <td><span className="adm-badge badge-blue">{l.category}</span></td>
                    <td>
                      {editingId === l.id
                        ? <input className="neu-input adm-url-input" value={editData.url} onChange={e => setEditData(p => ({ ...p, url: e.target.value }))} autoFocus />
                        : <a href={l.url} target="_blank" rel="noopener noreferrer" className="adm-link-url">
                            {l.url} <ExternalLink size={11} />
                          </a>
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {editingId === l.id
                          ? <>
                              <button className="adm-icon-btn adm-icon-btn-green" onClick={() => saveEdit(l.id)}><Check size={14} /></button>
                              <button className="adm-icon-btn" onClick={() => setEditingId(null)}><X size={14} /></button>
                            </>
                          : <>
                              <button className="adm-icon-btn" onClick={() => startEdit(l)}><Edit2 size={14} /></button>
                              <button className="adm-icon-btn adm-icon-btn-red" onClick={() => handleDelete(l.id)}><Trash2 size={14} /></button>
                            </>
                        }
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
            )
          }
        </div>
      </div>
    </AdminLayout>
  )
}
