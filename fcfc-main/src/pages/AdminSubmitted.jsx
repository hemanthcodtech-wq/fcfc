import { useEffect, useState, useCallback } from 'react'
import { RefreshCcw } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API = import.meta.env.VITE_API_URL + '/api/admin'

export default function AdminSubmitted() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetch(`${API}/submissions`).then(r => r.json())
      setSubmissions(Array.isArray(data) ? data : [])
    } catch {
      setSubmissions(JSON.parse(localStorage.getItem('submissions') || '[]'))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const fmt = d => d ? new Date(d).toLocaleString() : '—'

  const filtered = submissions.filter(s =>
    !search ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    (s.original_code || s.originalCode)?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Submitted Coupons" subtitle="Coupons submitted by users on the platform">
      <div className="adm-page-actions">
        <input className="neu-input adm-search" placeholder="Search by email or code…" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="neu-btn adm-refresh-btn" onClick={fetchData} disabled={loading}>
          <RefreshCcw size={14} className={loading ? 'adm-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-card-title">
          Submitted Coupons
          <span className="adm-count">{filtered.length}</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>#</th><th>Date</th><th>Email</th><th>Original Code</th><th>Generated Codes</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={5} className="adm-empty">No submissions found.</td></tr>
                : filtered.map((s, i) => (
                  <tr key={s.id || i}>
                    <td className="mono adm-muted">{i + 1}</td>
                    <td>{fmt(s.created_at || s.createdAt)}</td>
                    <td>{s.email || '—'}</td>
                    <td className="mono">{s.original_code || s.originalCode || '—'}</td>
                    <td>
                      <div className="adm-tags">
                        {(s.generated_codes || s.generated || []).map(code => (
                          <span key={code} className="adm-tag">{code}</span>
                        ))}
                      </div>
                    </td>
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
