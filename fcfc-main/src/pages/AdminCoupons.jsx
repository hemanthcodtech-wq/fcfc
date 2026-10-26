import { useState, useEffect } from 'react'
import { RefreshCcw, Plus, Check, X, Copy, CheckCircle, Sparkles } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API = import.meta.env.VITE_API_URL + '/api/admin'

export default function AdminCoupons() {
  const [search, setSearch] = useState('')
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('generatedCoupons') || '[]'))
  const [loading, setLoading] = useState(false)

  // Modal / Form state for creating free coupon
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState({ code: '', email: '', submitted_from: 'Admin' })
  const [createError, setCreateError] = useState('')
  const [createdCoupon, setCreatedCoupon] = useState(null)
  const [copied, setCopied] = useState(false)

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

  const handleCreateCoupon = async (e) => {
    e.preventDefault()
    setCreating(true)
    setCreateError('')
    try {
      const res = await fetch(`${API}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to create coupon')
      setCreatedCoupon(json.coupon)
      setCreateForm({ code: '', email: '', submitted_from: 'Admin' })
      fetchData()
    } catch (err) {
      setCreateError(err.message)
    }
    setCreating(false)
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const coupons = data || []
  const fmt = d => d ? new Date(d).toLocaleString() : '—'
  const filtered = coupons.filter(c =>
    !search || c.code?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Generated Coupons" subtitle="All FCFC coupons created on the platform">
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
          onClick={() => { setShowCreate(true); setCreatedCoupon(null); setCreateError('') }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
        >
          <Plus size={16} /> Create Free Coupon
        </button>
        <button className="neu-btn adm-refresh-btn" onClick={fetchData} disabled={loading}>
          <RefreshCcw size={14} className={loading ? 'adm-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {/* Create Coupon Modal */}
      {showCreate && (
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
          <div className="adm-card" style={{ maxWidth: 520, width: '100%', margin: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 800, color: 'var(--navy)' }}>
                <Sparkles size={20} color="var(--accent)" />
                Create Coupon (Without Payment)
              </div>
              <button
                className="neu-btn"
                style={{ padding: '6px 10px', minHeight: 0 }}
                onClick={() => setShowCreate(false)}
              >
                <X size={16} />
              </button>
            </div>

            {createdCoupon ? (
              <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                <CheckCircle size={48} color="#27ae60" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy)', marginBottom: 6 }}>
                  Coupon Created Successfully!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
                  Active and ready to use without any transaction or fees.
                </p>

                <div style={{
                  background: 'rgba(74, 144, 217, 0.08)',
                  border: '2px dashed var(--accent)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginBottom: 24
                }}>
                  <span className="mono" style={{ fontSize: 22, fontWeight: 900, color: 'var(--navy)', letterSpacing: 1.5 }}>
                    {createdCoupon.code}
                  </span>
                  <button
                    className="neu-btn neu-btn-primary"
                    onClick={() => copyCode(createdCoupon.code)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 36, padding: '6px 14px' }}
                  >
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    className="neu-btn neu-btn-primary"
                    onClick={() => { setCreatedCoupon(null); setCreateForm({ code: '', email: '', submitted_from: 'Admin' }) }}
                  >
                    <Plus size={14} /> Create Another
                  </button>
                  <button className="neu-btn" onClick={() => setShowCreate(false)}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateCoupon}>
                {createError && (
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
                    {createError}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                      Coupon Code <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional - leave blank to auto-generate)</span>
                    </label>
                    <input
                      className="neu-input mono"
                      placeholder="e.g. FCFC-SPECIAL2026"
                      value={createForm.code}
                      onChange={e => setCreateForm({ ...createForm, code: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                      Recipient Email <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <input
                      type="email"
                      className="neu-input"
                      placeholder="user@example.com"
                      value={createForm.email}
                      onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                      Issuer / Reference Note
                    </label>
                    <input
                      className="neu-input"
                      placeholder="Admin / Promo / Reward"
                      value={createForm.submitted_from}
                      onChange={e => setCreateForm({ ...createForm, submitted_from: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                  <button
                    type="button"
                    className="neu-btn"
                    onClick={() => setShowCreate(false)}
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="neu-btn neu-btn-primary"
                    disabled={creating}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
                  >
                    {creating ? 'Creating…' : 'Generate Free Coupon'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--navy)' }}>{c.code}</td>
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
