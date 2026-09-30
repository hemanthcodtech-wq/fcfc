import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCcw, Ticket, ChevronRight, CheckCircle, XCircle, AlertCircle, DollarSign, Send, RefreshCw } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API = import.meta.env.VITE_API_URL + '/api/admin'

const statusMap = {
  active:   { cls: 'badge-green',  icon: <CheckCircle size={12} />,  label: 'Active' },
  expiring: { cls: 'badge-yellow', icon: <AlertCircle size={12} />,  label: 'Expiring' },
  expired:  { cls: 'badge-red',    icon: <XCircle size={12} />,      label: 'Expired' },
  inactive: { cls: 'badge-gray',   icon: <XCircle size={12} />,      label: 'Inactive' },
}

const TYPE_FILTERS = [
  { key: 'All',          label: 'All',                        icon: <Ticket size={13} /> },
  { key: 'Generated',    label: 'Generated Coupons',          icon: <DollarSign size={13} /> },
  { key: 'FromSubmit',   label: 'Submitted & Generated',      icon: <Send size={13} /> },
  { key: 'Renewed',      label: 'Renewed Coupons',            icon: <RefreshCw size={13} /> },
]

function getCouponType(c) {
  if (c.is_submission_generated) return 'FromSubmit'
  if (c.is_renewed) return 'Renewed'
  return 'Generated'
}

export default function AdminAllCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const navigate = useNavigate()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetch(`${API}/coupons`).then(r => r.json())
      setCoupons(Array.isArray(data) ? data : [])
    } catch { setCoupons([]) }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const fmt = d => d ? new Date(d).toLocaleDateString() : '—'
  const fmtExpiry = c => new Date(new Date(c.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()

  const filtered = coupons.filter(c => {
    const matchSearch = !search ||
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.submitted_from?.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || getCouponType(c) === typeFilter
    const matchStatus = statusFilter === 'All' || (c.computed_status || c.status) === statusFilter.toLowerCase()
    return matchSearch && matchType && matchStatus
  })

  // counts per type
  const counts = TYPE_FILTERS.reduce((acc, f) => {
    acc[f.key] = f.key === 'All' ? coupons.length : coupons.filter(c => getCouponType(c) === f.key).length
    return acc
  }, {})

  return (
    <AdminLayout title="All Coupons" subtitle="Click any coupon to view full history">
      {/* Type filter cards */}
      <div className="adm-type-filter-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 8 }}>
        {TYPE_FILTERS.map(f => (
          <div
            key={f.key}
            onClick={() => setTypeFilter(f.key)}
            style={{
              background: typeFilter === f.key ? 'linear-gradient(135deg,var(--navy),var(--accent))' : 'var(--bg)',
              color: typeFilter === f.key ? '#fff' : 'var(--navy)',
              borderRadius: 14, padding: '18px 20px', cursor: 'pointer',
              boxShadow: typeFilter === f.key ? '4px 4px 16px rgba(13,27,62,0.25)' : 'var(--shadow-card)',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <div style={{ opacity: typeFilter === f.key ? 1 : 0.5 }}>{f.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{counts[f.key]}</div>
              <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, marginTop: 3 }}>{f.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-page-actions">
        <input className="neu-input adm-search" placeholder="Search code, email, name…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="adm-filter-tabs">
          {['All', 'Active', 'Expiring', 'Expired', 'Inactive'].map(f => (
            <button key={f} className={`adm-filter-tab ${statusFilter === f ? 'active' : ''}`} onClick={() => setStatusFilter(f)}>{f}</button>
          ))}
        </div>
        <button className="neu-btn adm-refresh-btn" onClick={fetchData} disabled={loading}>
          <RefreshCcw size={14} className={loading ? 'adm-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-card-title">
          <Ticket size={18} />
          {typeFilter === 'All' ? 'All Coupons' : TYPE_FILTERS.find(f => f.key === typeFilter)?.label}
          <span className="adm-count">{filtered.length}</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th><th>Code</th><th>Type</th><th>Owner</th><th>Email</th>
                <th>Status</th><th>Created</th><th>Expires</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={9} className="adm-empty">No coupons found.</td></tr>
                : filtered.map((c, i) => {
                  const s = statusMap[c.computed_status || c.status] || statusMap.inactive
                  const type = getCouponType(c)
                  return (
                    <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/all-coupons/${c.code}`)}>
                      <td className="adm-muted">{filtered.length - i}</td>
                      <td className="mono" style={{ fontWeight: 700, color: 'var(--navy)' }}>{c.code}</td>
                      <td>
                        <span className={`adm-badge ${type === 'FromSubmit' ? 'badge-blue' : type === 'Renewed' ? 'badge-green' : 'badge-gray'}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          {type === 'Generated' && <><DollarSign size={11} /> Generated</>}
                          {type === 'FromSubmit' && <><Send size={11} /> From Submit</>}
                          {type === 'Renewed' && <><RefreshCw size={11} /> Renewed</>}
                        </span>
                      </td>
                      <td>{c.submitted_from || '—'}</td>
                      <td>{c.email || '—'}</td>
                      <td>
                        <span className={`adm-badge ${s.cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          {s.icon} {s.label}
                        </span>
                      </td>
                      <td>{fmt(c.verified_at)}</td>
                      <td style={{ color: (c.computed_status || c.status) === 'expired' ? '#e74c3c' : (c.computed_status || c.status) === 'expiring' ? '#f39c12' : 'inherit' }}>
                        {fmtExpiry(c)}
                      </td>
                      <td><ChevronRight size={16} color="var(--text-muted)" /></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
