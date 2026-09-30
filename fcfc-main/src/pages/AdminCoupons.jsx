import { useState, useEffect } from 'react'
import { RefreshCcw } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API = import.meta.env.VITE_API_URL + '/api/admin'

export default function AdminCoupons() {
  const [search, setSearch] = useState('')
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('generatedCoupons') || '[]'))
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/coupons`)
      const json = await res.json()
      if (res.ok && Array.isArray(json)) {
        setData(json)
        localStorage.setItem('generatedCoupons', JSON.stringify(json))
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const coupons = data || []

  const fmt = d => d ? new Date(d).toLocaleString() : '—'
  const filtered = coupons.filter(c =>
    !search || c.code?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Generated Coupons" subtitle="All FCFC coupons created on the platform">
      <div className="adm-page-actions">
        <input className="neu-input adm-search" placeholder="Search by code or email…" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="neu-btn adm-refresh-btn" onClick={fetchData} disabled={loading}>
          <RefreshCcw size={14} className={loading ? 'adm-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-card-title">
          Generated Coupons
          <span className="adm-count">{filtered.length}</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th><th>Code</th><th>Email</th><th>Status</th>
                <th>Submitted From</th><th>Verified At</th><th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} className="adm-empty">No coupons found.</td></tr>
                : filtered.map((c, i) => (
                  <tr key={c.id || i}>
                    <td className="mono adm-muted">{filtered.length - i}</td>
                    <td className="mono">{c.code}</td>
                    <td>{c.email || '—'}</td>
                    <td><span className={`adm-badge ${c.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{c.status || 'active'}</span></td>
                    <td className="mono">{c.submitted_from || c.submittedFrom || '—'}</td>
                    <td>{fmt(c.verified_at || c.verifiedAt)}</td>
                    <td>{fmt(c.created_at || c.createdAt)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
