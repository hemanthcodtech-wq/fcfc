import { useEffect, useState, useCallback } from 'react'
import { RefreshCcw, Plus, X, Check, Copy, CheckCircle, Sparkles, Send } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API = import.meta.env.VITE_API_URL + '/api/admin'

export default function AdminSubmitted() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  // Free submit modal
  const [showSubmit, setShowSubmit] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitForm, setSubmitForm] = useState({ code: '', email: '' })
  const [submitError, setSubmitError] = useState('')
  const [generatedCodes, setGeneratedCodes] = useState([])
  const [copiedIndex, setCopiedIndex] = useState(null)

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

  const handleFreeSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch(`${API}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitForm),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to submit coupon')
      setGeneratedCodes(json.newCodes || [])
      setSubmitForm({ code: '', email: '' })
      fetchData()
    } catch (err) {
      setSubmitError(err.message)
    }
    setSubmitting(false)
  }

  const copyCode = (code, idx) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const fmt = d => d ? new Date(d).toLocaleString() : '—'

  const filtered = submissions.filter(s =>
    !search ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    (s.original_code || s.originalCode)?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Submitted Coupons" subtitle="Coupons submitted by users on the platform">
      <div className="adm-page-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="neu-input adm-search"
          placeholder="Search by email or code…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <button
          className="neu-btn neu-btn-primary"
          onClick={() => { setShowSubmit(true); setGeneratedCodes([]); setSubmitError('') }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
        >
          <Send size={15} /> Free Submit Coupon
        </button>
        <button className="neu-btn adm-refresh-btn" onClick={fetchData} disabled={loading}>
          <RefreshCcw size={14} className={loading ? 'adm-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {/* Free Submit Modal */}
      {showSubmit && (
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
          <div className="adm-card" style={{ maxWidth: 540, width: '100%', margin: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 800, color: 'var(--navy)' }}>
                <Sparkles size={20} color="var(--accent)" />
                Submit Coupon (Without Payment)
              </div>
              <button className="neu-btn" style={{ padding: '6px 10px', minHeight: 0 }} onClick={() => setShowSubmit(false)}>
                <X size={16} />
              </button>
            </div>

            {generatedCodes.length > 0 ? (
              <div style={{ textAlign: 'center', padding: '12px 8px' }}>
                <CheckCircle size={44} color="#27ae60" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: 19, fontWeight: 800, color: 'var(--navy)', marginBottom: 6 }}>
                  Submission Complete!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
                  Original coupon marked inactive and 3 new child coupons generated:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {generatedCodes.map((code, idx) => (
                    <div
                      key={code}
                      style={{
                        background: 'rgba(74, 144, 217, 0.08)',
                        border: '1.5px dashed var(--accent)',
                        borderRadius: 10,
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span className="mono" style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)' }}>
                        {code}
                      </span>
                      <button
                        className="neu-btn neu-btn-primary"
                        onClick={() => copyCode(code, idx)}
                        style={{ padding: '4px 10px', minHeight: 30, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        {copiedIndex === idx ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button className="neu-btn neu-btn-primary" onClick={() => { setGeneratedCodes([]); setSubmitForm({ code: '', email: '' }) }}>
                    <Plus size={14} /> Submit Another
                  </button>
                  <button className="neu-btn" onClick={() => setShowSubmit(false)}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFreeSubmit}>
                {submitError && (
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
                    {submitError}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                      Coupon Code To Submit <span style={{ color: '#e74c3c' }}>*</span>
                    </label>
                    <input
                      className="neu-input mono"
                      placeholder="e.g. FCFC-XXXXXXXX"
                      required
                      value={submitForm.code}
                      onChange={e => setSubmitForm({ ...submitForm, code: e.target.value.toUpperCase() })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                      Email <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional - will inherit original if empty)</span>
                    </label>
                    <input
                      type="email"
                      className="neu-input"
                      placeholder="user@example.com"
                      value={submitForm.email}
                      onChange={e => setSubmitForm({ ...submitForm, email: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                  <button type="button" className="neu-btn" onClick={() => setShowSubmit(false)} disabled={submitting}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="neu-btn neu-btn-primary"
                    disabled={submitting}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
                  >
                    {submitting ? 'Submitting…' : 'Submit & Generate 3 Codes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--navy)' }}>{s.original_code || s.originalCode}</td>
                    <td>
                      <div className="adm-tags">
                        {((s.generated_codes || s.generatedCodes) || []).map((c, j) => (
                          <span key={j} className="adm-tag mono">{c}</span>
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
