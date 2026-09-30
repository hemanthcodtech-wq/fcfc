import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Ticket, ClipboardList, RefreshCcw,
  LogOut, Menu, X, Users, DollarSign, TrendingUp, Sparkles
} from 'lucide-react'
import './Admin.css'

const API = import.meta.env.VITE_API_URL + '/api/admin'

const TABS = [
  { key: 'dashboard', label: 'Dashboard',         icon: LayoutDashboard },
  { key: 'coupons',   label: 'Generated Coupons', icon: Ticket },
  { key: 'submitted', label: 'Submitted Coupons', icon: ClipboardList },
  { key: 'renewed',   label: 'Renewed Coupons',   icon: Sparkles },
  { key: 'users',     label: 'Users',             icon: Users },
]

function StatCard({ icon: Icon, label, value, color, prefix = '', suffix = '' }) {
  return (
    <div className="adm-stat-card">
      <div className="adm-stat-icon" style={{ background: `${color}18` }}>
        <Icon size={22} color={color} />
      </div>
      <div className="adm-stat-value">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</div>
      <div className="adm-stat-label">{label}</div>
    </div>
  )
}

function EmptyRow() {
  return <tr><td colSpan={10} className="adm-empty">No records found.</td></tr>
}

export default function AdminPanel() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [stats, setStats] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [renewed, setRenewed] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('adminAuth') !== 'true') navigate('/admin/login')
  }, [navigate])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [s, c, sub, ren, u] = await Promise.all([
        fetch(`${API}/stats`).then(r => r.json()),
        fetch(`${API}/coupons`).then(r => r.json()),
        fetch(`${API}/submissions`).then(r => r.json()),
        fetch(`${API}/renewed`).then(r => r.json()),
        fetch(`${API}/users`).then(r => r.json()),
      ])
      setStats(s)
      setCoupons(Array.isArray(c) ? c : [])
      setSubmissions(Array.isArray(sub) ? sub : [])
      setRenewed(Array.isArray(ren) ? ren : [])
      setUsers(Array.isArray(u) ? u : [])
    } catch {
      // fallback to localStorage demo data
      const lsCoupons = JSON.parse(localStorage.getItem('generatedCoupons') || '[]')
      const lsSubs = JSON.parse(localStorage.getItem('submissions') || '[]')
      const lsRenewed = JSON.parse(localStorage.getItem('renewedCoupons') || '[]')
      const lsTxns = JSON.parse(localStorage.getItem('transactions') || '[]')
      setCoupons(lsCoupons)
      setSubmissions(lsSubs)
      setRenewed(lsRenewed)
      setStats({
        couponsCreated: lsCoupons.length,
        submittedCoupons: lsSubs.length,
        revenueGenerated: lsTxns.reduce((a, t) => a + parseFloat((t.amount || '0').replace(/[^0-9.]/g, '')), 0),
        totalUsers: 0,
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/')
  }

  const fmt = d => d ? new Date(d).toLocaleString() : '—'

  const currentTab = TABS.find(t => t.key === tab)

  return (
    <div className="adm-shell">
      {/* ── Sidebar ── */}
      <aside className={`adm-sidebar ${collapsed ? 'collapsed' : ''} ${sidebarOpen ? 'open' : ''}`}>
        <div className="adm-sidebar-header">
          <div className="adm-brand">
            <div className="adm-brand-mark">FC</div>
            {!collapsed && (
              <div>
                <div className="adm-brand-name">FCFC Admin</div>
                <div className="adm-brand-sub">Dashboard</div>
              </div>
            )}
          </div>
          <button className="adm-collapse-btn" onClick={() => setCollapsed(v => !v)}>
            {collapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>

        {!collapsed && <div className="adm-nav-label">Navigation</div>}

        <nav className="adm-nav">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`adm-nav-btn ${tab === key ? 'active' : ''}`}
              onClick={() => { setTab(key); setSidebarOpen(false) }}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <main className={`adm-main ${collapsed ? 'collapsed' : ''}`}>
        {/* Topbar */}
        <div className="adm-topbar">
          <div className="adm-topbar-left">
            <button className="adm-mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <div>
              <div className="adm-topbar-title">{currentTab?.label}</div>
              <div className="adm-topbar-sub">FCFC live dashboard</div>
            </div>
          </div>
          <button className="neu-btn adm-refresh-btn" onClick={fetchAll} disabled={loading}>
            <RefreshCcw size={15} className={loading ? 'adm-spin' : ''} />
            {!loading ? 'Refresh' : 'Loading…'}
          </button>
        </div>

        <div className="adm-content">

          {/* ── Dashboard Tab ── */}
          {tab === 'dashboard' && (
            <>
              <div className="adm-stats-grid">
                <StatCard icon={Ticket}     label="Coupons Created"    value={stats?.couponsCreated ?? '—'}    color="#4A90D9" />
                <StatCard icon={DollarSign} label="Revenue Generated"  value={stats?.revenueGenerated ?? '—'}  color="#27ae60" prefix="$" />
                <StatCard icon={ClipboardList} label="Submitted Coupons" value={stats?.submittedCoupons ?? '—'} color="#6C63FF" />
                <StatCard icon={Users}      label="Total Users"        value={stats?.totalUsers ?? '—'}        color="#e67e22" />
              </div>

              <div className="adm-card">
                <div className="adm-card-title">Recent Activity</div>
                <table className="adm-table">
                  <thead>
                    <tr><th>Coupon Code</th><th>Email</th><th>Status</th><th>Created</th></tr>
                  </thead>
                  <tbody>
                    {coupons.slice(0, 5).length === 0
                      ? <EmptyRow />
                      : coupons.slice(0, 5).map(c => (
                        <tr key={c.id || c.code}>
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
            </>
          )}

          {/* ── Generated Coupons Tab ── */}
          {tab === 'coupons' && (
            <div className="adm-card">
              <div className="adm-card-title">Generated Coupons <span className="adm-count">{coupons.length}</span></div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr><th>Code</th><th>Email</th><th>Status</th><th>Submitted From</th><th>Verified At</th><th>Created</th></tr>
                  </thead>
                  <tbody>
                    {coupons.length === 0 ? <EmptyRow /> : coupons.map(c => (
                      <tr key={c.id || c.code}>
                        <td className="mono">{c.code}</td>
                        <td>{c.email || '—'}</td>
                        <td><span className={`adm-badge ${c.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{c.status || 'active'}</span></td>
                        <td className="mono">{c.submitted_from || c.submittedFrom || '—'}</td>
                        <td>{fmt(c.verified_at || c.verifiedAt)}</td>
                        <td>{fmt(c.created_at || c.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Submitted Coupons Tab ── */}
          {tab === 'submitted' && (
            <div className="adm-card">
              <div className="adm-card-title">Submitted Coupons <span className="adm-count">{submissions.length}</span></div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr><th>Date</th><th>Email</th><th>Original Code</th><th>Generated Codes</th></tr>
                  </thead>
                  <tbody>
                    {submissions.length === 0 ? <EmptyRow /> : submissions.map((s, i) => (
                      <tr key={s.id || i}>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Renewed Coupons Tab ── */}
          {tab === 'renewed' && (
            <div className="adm-card">
              <div className="adm-card-title">Renewed Coupons <span className="adm-count">{renewed.length}</span></div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr><th>Renewed At</th><th>Code</th><th>Email</th><th>Wallet</th><th>New Expiry</th></tr>
                  </thead>
                  <tbody>
                    {renewed.length === 0 ? <EmptyRow /> : renewed.map((r, i) => (
                      <tr key={r.id || i}>
                        <td>{fmt(r.created_at || r.createdAt)}</td>
                        <td className="mono">{r.code}</td>
                        <td>{r.email || '—'}</td>
                        <td className="mono">{r.wallet || '—'}</td>
                        <td>{r.new_end || r.newEnd || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Users Tab ── */}
          {tab === 'users' && (
            <div className="adm-card">
              <div className="adm-card-title">Users <span className="adm-count">{users.length}</span></div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr><th>#</th><th>Name</th><th>Email</th><th>Joined</th></tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? <EmptyRow /> : users.map((u, i) => (
                      <tr key={u.id || i}>
                        <td className="mono">{u.id}</td>
                        <td>{u.name || '—'}</td>
                        <td>{u.email}</td>
                        <td>{fmt(u.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
