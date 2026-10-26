import { useEffect, useState, useCallback } from 'react'
import { RefreshCcw, RefreshCw, X, CheckCircle, Sparkles } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API = import.meta.env.VITE_API_URL + '/api/admin'

export default function AdminRenewed() {
  const [renewed, setRenewed] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  // Free renew modal
  const [showRenew, setShowRenew] = useState(false)
  const [renewing, setRenewing] = useState(false)
  const [renewForm, setRenewForm] = useState({ code: '', days: 30 })
  const [renewError, setRenewError] = useState('')
  const [renewSuccess, setRenewSuccess] = useState(null)

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

  const handleFreeRenew = async (e) => {
    e.preventDefault()
    setRenewing(true)
    setRenewError('')
    try {
      const res = await fetch(`${API}/renewed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(renewForm),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to renew coupon')
      setRenewSuccess(json)
      setRenewForm({ code: '', days: 30 })
      fetchData()
    } catch (err) {
      setRenewError(err.message)
    }
    setRenewing(false)
  }

  const fmt = d => d ? new Date(d).toLocaleString() : '—'

  const filtered = renewed.filter(r =>
    !search ||
    r.code?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Renewed Coupons" subtitle="Coupons that have been renewed by users">
      <div className="adm-page-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="neu-input adm-search"
          placeholder="Search by code or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <button
          className="neu-btn neu-btn-primary"
          onClick={() => { setShowRenew(true); setRenewSuccess(null); setRenewError('') }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
        >
          <RefreshCw size={14} /> Free Renew Coupon
        </button>
        <button className="neu-btn adm-refresh-btn" onClick={fetchData} disabled={loading}>
          <RefreshCcw size={14} className={loading ? 'adm-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {/* Free Renew Modal */}
      {showRenew && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 20, 45, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div className="adm-card" style={{ maxWidth: 500, width: '100%', margin: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 800, color: 'var(--navy)' }}>
                <Sparkles size={20} color="var(--accent)" />
                Renew Coupon (Without Payment)
              </div>
              <button className="neu-btn" style={{ padding: '6px 10px', minHeight: 0 }} onClick={() => setShowRenew(false)}>
                <X size={16} />
              </button>
            </div>

            {renewSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                <CheckCircle size={44} color="#27ae60" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: 19, fontWeight: 800, color: 'var(--navy)', marginBottom: 6 }}>
                  Coupon Renewed Successfully!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
                  Coupon <strong className="mono" style={{ color: 'var(--navy)' }}>{renewSuccess.renewed?.code}</strong> is renewed and active.
                </p>

                <div style={{
                  background: 'rgba(74, 144, 217, 0.08)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  marginBottom: 20,
                  fontSize: 14,
                  color: 'var(--navy)',
                  fontWeight: 600
                }}>
                  New Expiry Date: {new Date(renewSuccess.newExpiry).toLocaleDateString()}
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button className="neu-btn neu-btn-primary" onClick={() => { setRenewSuccess(null); setRenewForm({ code: '', days: 30 }) }}>
                    Renew Another
                  </button>
                  <button className="neu-btn" onClick={() => setShowRenew(false)}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFreeRenew}>
                {renewError && (
                  <div style={{
                    background: 'rgba(231,76,60,0.1)',
                    border: '1px solid rgba(231,76,60,0.3)',
                    color: '#c0392b',
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 16
                  }}>
                    {renewError}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                      Coupon Code To Renew <span style={{ color: '#e74c3c' }}>*</span>
                    </label>
                    <input
                      className="neu-input mono"
                      placeholder="e.g. FCFC-XXXXXXXX"
                      required
                      value={renewForm.code}
                      onChange={e => setRenewForm({ ...renewForm, code: e.target.value.toUpperCase() })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                      Extend Duration (Days)
                    </label>
                    <select
                      className="neu-input"
                      value={renewForm.days}
                      onChange={e => setRenewForm({ ...renewForm, days: Number(e.target.value) })}
                      style={{ width: '100%' }}
                    >
                      <option value={30}>30 Days</option>
                      <option value={60}>60 Days</option>
                      <option value={90}>90 Days</option>
                      <option value={180}>180 Days (6 Months)</option>
                      <option value={365}>365 Days (1 Year)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                  <button type="button" className="neu-btn" onClick={() => setShowRenew(false)} disabled={renewing}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="neu-btn neu-btn-primary"
                    disabled={renewing}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
                  >
                    {renewing ? 'Renewing…' : 'Renew Coupon'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--navy)' }}>{r.code}</td>
                    <td>{r.email || '—'}</td>
                    <td>{r.wallet || '—'}</td>
                    <td className="mono">{r.new_end ? new Date(r.new_end).toLocaleDateString() : '—'}</td>
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
