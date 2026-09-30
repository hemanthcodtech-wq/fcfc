import { useEffect, useState, useCallback } from 'react'
import { RefreshCcw } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API = import.meta.env.VITE_API_URL + '/api/admin'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetch(`${API}/users`).then(r => r.json())
      setUsers(Array.isArray(data) ? data : [])
    } catch {
      setUsers([])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const fmt = d => d ? new Date(d).toLocaleString() : '—'

  const filtered = users.filter(u =>
    !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Users" subtitle="All registered FCFC platform users">
      <div className="adm-page-actions">
        <input className="neu-input adm-search" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="neu-btn adm-refresh-btn" onClick={fetchData} disabled={loading}>
          <RefreshCcw size={14} className={loading ? 'adm-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-card-title">
          Users
          <span className="adm-count">{filtered.length}</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>#</th><th>ID</th><th>Name</th><th>Email</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={5} className="adm-empty">No users found.</td></tr>
                : filtered.map((u, i) => (
                  <tr key={u.id || i}>
                    <td className="mono adm-muted">{i + 1}</td>
                    <td className="mono">{u.id}</td>
                    <td>{u.name || '—'}</td>
                    <td>{u.email}</td>
                    <td>{fmt(u.created_at)}</td>
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
