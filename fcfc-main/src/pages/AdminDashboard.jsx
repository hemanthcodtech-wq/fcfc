import { useEffect, useState, useCallback } from 'react'
import { Ticket, DollarSign, ClipboardList, Users, RefreshCcw } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API = import.meta.env.VITE_API_URL + '/api/admin'

function StatCard({ icon: Icon, label, value, color, prefix = '' }) {
  return (
    <div className="adm-stat-card">
      <div className="adm-stat-icon" style={{ background: `${color}18` }}>
        <Icon size={22} color={color} />
      </div>
      <div className="adm-stat-value">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="adm-stat-label">{label}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [s, c] = await Promise.all([
        fetch(`${API}/stats`).then(r => r.json()),
        fetch(`${API}/coupons`).then(r => r.json()),
      ])
      setStats(s)
      setRecent(Array.isArray(c) ? c.slice(0, 6) : [])
    } catch {
      const lsCoupons = JSON.parse(localStorage.getItem('generatedCoupons') || '[]')
      const lsSubs = JSON.parse(localStorage.getItem('submissions') || '[]')
      const lsTxns = JSON.parse(localStorage.getItem('transactions') || '[]')
      setStats({
        couponsCreated: lsCoupons.length,
        submittedCoupons: lsSubs.length,
        revenueGenerated: lsTxns.reduce((a, t) => a + parseFloat((t.amount || '0').replace(/[^0-9.]/g, '')), 0),
        totalUsers: 0,
      })
      setRecent(lsCoupons.slice(0, 6))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const fmt = d => d ? new Date(d).toLocaleString() : '—'

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of all FCFC activity">
      <div className="adm-page-actions">
        <button className="neu-btn adm-refresh-btn" onClick={fetchData} disabled={loading}>
          <RefreshCcw size={14} className={loading ? 'adm-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div className="adm-stats-grid">
        <StatCard icon={Ticket}       label="Coupons Created"   value={stats?.couponsCreated ?? '—'}   color="#4A90D9" />
        <StatCard icon={DollarSign}   label="Revenue Generated" value={stats?.revenueGenerated ?? '—'} color="#27ae60" prefix="$" />
        <StatCard icon={ClipboardList} label="Submitted Coupons" value={stats?.submittedCoupons ?? '—'} color="#6C63FF" />
        <StatCard icon={Users}        label="Total Users"       value={stats?.totalUsers ?? '—'}       color="#e67e22" />
      </div>

      <div className="adm-card">
        <div className="adm-card-title">Recent Coupons</div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Code</th><th>Email</th><th>Status</th><th>Created</th></tr>
            </thead>
            <tbody>
              {recent.length === 0
                ? <tr><td colSpan={4} className="adm-empty">No records yet.</td></tr>
                : recent.map((c, i) => (
                  <tr key={c.id || i}>
                    <td className="mono">{c.code}</td>
                    <td>{c.email || '—'}</td>
                    <td><span className={`adm-badge ${c.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{c.status || 'active'}</span></td>
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
