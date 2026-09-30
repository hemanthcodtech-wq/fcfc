import { TypeAnimation } from 'react-type-animation'
import { useState } from 'react'
import { Search, Ticket, CheckCircle, XCircle, Clock, Loader } from 'lucide-react'
import CouponTicket from '../components/CouponTicket'
import './SearchCoupon.css'

const API = import.meta.env.VITE_API_URL + '/api/general'

export default function SearchCoupon() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setSearched(true)
    try {
      const res = await fetch(`${API}/search-coupon?code=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Not found')
      setResult(data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const statusConfig = {
    active:   { label: 'Active',   icon: <CheckCircle size={13} />, bg: '#d4edda', color: '#155724' },
    expiring: { label: 'Expiring', icon: <Clock size={13} />,       bg: '#fff3cd', color: '#856404' },
    expired:  { label: 'Expired',  icon: <XCircle size={13} />,     bg: '#f8d7da', color: '#721c24' },
  }
  const s = result ? (statusConfig[result.status] || statusConfig.active) : null
  const fmt = d => d ? new Date(d).toLocaleString() : '—'

  return (
    <main>
      <div className="page-header">
        <h1>Search Coupon</h1>
        <p><TypeAnimation sequence={['Find and verify any coupon on the FCFC network.', 4000]} speed={55} repeat={Infinity} /></p>
      </div>

      <section className="section">
        <div className="page-wrapper">
          <div style={{ maxWidth: 720, margin: '0 auto 40px' }}>
            <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', padding: 28 }}>
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="neu-input"
                  placeholder="Enter coupon code e.g. FCFC-AEC17D1A"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  style={{ paddingLeft: 48, fontSize: 15 }}
                />
              </div>
              <button className="neu-btn neu-btn-primary" onClick={handleSearch} disabled={loading || !query.trim()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', fontSize: 13, marginLeft: 'auto' }}>
                {loading ? <><Loader size={14} className="adm-spin" /> Searching…</> : <><Search size={14} /> Search</>}
              </button>
            </div>
          </div>

          {/* Result */}
          {searched && !loading && (
            error
              ? <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)' }}>
                  <Ticket size={48} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.4 }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>No coupon found for <strong>{query}</strong>.</p>
                </div>
              : result && (
                <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                    <CouponTicket code={result.code} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: s.bg, color: s.color, borderRadius: 50, padding: '6px 14px', fontSize: 14, fontWeight: 700 }}>
                      {s.icon} {s.label}
                    </div>
                  </div>
                  
                  <div className="neu-card" style={{ maxWidth: 480, width: '100%', margin: '0 auto 36px', textAlign: 'left' }}>
                    {[
                      ['Email', result.email],
                      ['Owner', result.submitted_from],
                      ['Status', result.status],
                      ['Expires On', fmt(new Date(new Date(result.created_at).getTime() + 30 * 24 * 60 * 60 * 1000))],
                      ['Verified At', fmt(result.verified_at)],
                      ['Created', fmt(result.created_at)],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: 14 }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{k}</span>
                        <span style={{ color: 'var(--navy)', fontWeight: 600 }}>{v || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}

          {!searched && (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg)', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Search size={32} color="var(--text-muted)" />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Enter a coupon code to search.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
