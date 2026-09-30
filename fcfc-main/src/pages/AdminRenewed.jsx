import { useEffect, useState, useCallback } from 'react'
import { RefreshCcw } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API = import.meta.env.VITE_API_URL + '/api/admin'

export default function AdminRenewed() {
  const [renewed, setRenewed] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetch(`${API}/renewed`).then(r => r.json())
      setRenewed(Array.isArray(data) ? data : [])
    } catch {
      setRenewed(JSON.parse(localStorage.getItem('renewedCoupons') || '[]'))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const fmt = d => d ? new Date(d).toLocaleString() : '—'

  const filtered = renewed.filter(r =>
    !search ||
    r.code?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Renewed Coupons" subtitle="Coupons that have been renewed by users">
      <div className="adm-page-actions">
        <input className="neu-input adm-search" placeholder="Search by code or email…" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="neu-btn adm-refresh-btn" onClick={fetchData} disabled={loading}>
          <RefreshCcw size={14} className={loading ? 'adm-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-card-title">
          Renewed Coupons
          <span className="adm-count">{filtered.length}</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>#</th><th>Renewed At</th><th>Code</th><th>Email</th><th>Wallet</th><th>New Expiry</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={6} className="adm-empty">No renewed coupons found.</td></tr>
                : filtered.map((r, i) => (
                  <tr key={r.id || i}>
                    <td className="mono adm-muted">{i + 1}</td>
                    <td>{fmt(r.created_at || r.createdAt)}</td>
                    <td className="mono">{r.code}</td>
                    <td>{r.email || '—'}</td>
                    <td className="mono">{r.wallet || '—'}</td>
                    <td>{r.new_end || r.newEnd || '—'}</td>
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
