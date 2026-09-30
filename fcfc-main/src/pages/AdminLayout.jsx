import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard, Ticket, ClipboardList, Sparkles,
  Users, DollarSign, Image, Link2, Monitor,
  LogOut, Menu, X, ChevronRight
} from 'lucide-react'
import './Admin.css'

const NAV = [
  { path: '/admin',              label: 'Dashboard',          icon: LayoutDashboard },
  { path: '/admin/all-coupons',  label: 'Coupons',            icon: Ticket },
  { path: '/admin/coupons',      label: 'Generated Coupons',  icon: Ticket },
  { path: '/admin/submitted',  label: 'Submitted Coupons',  icon: ClipboardList },
  { path: '/admin/renewed',    label: 'Renewed Coupons',    icon: Sparkles },
  { path: '/admin/revenue',    label: 'Revenue',            icon: DollarSign },
  // { path: '/admin/users',      label: 'Users',              icon: Users },
  { path: '/admin/gallery',    label: 'Gallery',            icon: Image },
  // { path: '/admin/links',      label: 'Links',              icon: Link2 },
  // { path: '/admin/presentations', label: 'Presentations',   icon: Monitor },
]

export default function AdminLayout({ children, title, subtitle }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('adminAuth') !== 'true') navigate('/admin/login')
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/')
  }

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname === path || (location.pathname.startsWith(path) && path !== '/admin/coupons')

  return (
    <div className="adm-shell">
      {/* Sidebar */}
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
          {NAV.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`adm-nav-btn ${isActive(path) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && isActive(path) && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </Link>
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

      {/* Main */}
      <main className={`adm-main ${collapsed ? 'collapsed' : ''}`}>
        <div className="adm-topbar">
          <div className="adm-topbar-left">
            <button className="adm-mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <div>
              <div className="adm-topbar-title">{title}</div>
              <div className="adm-topbar-sub">{subtitle || 'FCFC Admin Panel'}</div>
            </div>
          </div>
          <button className="adm-logout-topbar-btn" onClick={handleLogout}>
            <LogOut size={15} /> <span>Logout</span>
          </button>
        </div>

        <div className="adm-content">
          {children}
        </div>
      </main>
    </div>
  )
}
