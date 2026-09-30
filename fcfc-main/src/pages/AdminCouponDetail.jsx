import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Ticket, RefreshCw, Send, Calendar, Clock, CheckCircle, XCircle, AlertCircle, CreditCard } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API = import.meta.env.VITE_API_URL + '/api/admin'

const StatusBadge = ({ status }) => {
  const map = {
    active:   { icon: <CheckCircle size={12} />, cls: 'badge-green',   label: 'Active' },
    expiring: { icon: <AlertCircle size={12} />, cls: 'badge-yellow',  label: 'Expiring' },
    expired:  { icon: <XCircle size={12} />,     cls: 'badge-red',     label: 'Expired' },
    inactive: { icon: <XCircle size={12} />,     cls: 'badge-gray',    label: 'Inactive' },
  }
  const s = map[status] || map.inactive
  return (
    <span className={`adm-badge ${s.cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {s.icon} {s.label}
    </span>
  )
}

export default function AdminCouponDetail() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/coupon-detail/${code}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setData(d) })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [code])

  const fmt = d => d ? new Date(d).toLocaleString() : '—'
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'

  if (loading) return <AdminLayout title="Coupon Detail"><div className="adm-empty">Loading…</div></AdminLayout>
  if (error)   return <AdminLayout title="Coupon Detail"><div className="adm-empty" style={{ color: '#e74c3c' }}>{error}</div></AdminLayout>

  const { coupon, renewals, submission, isSubmissionGenerated, parentSubmission } = data
  const isRenewed = renewals.length > 0

  return (
    <AdminLayout title="Coupon Detail" subtitle={`Full history for ${coupon.code}`}>
      <button className="neu-btn adm-refresh-btn" onClick={() => navigate('/admin/all-coupons')} style={{ marginBottom: 8 }}>
        <ArrowLeft size={14} /> Back to Coupons
      </button>

      <div className="adm-coupon-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Coupon Info */}
        <div className="adm-card" style={{ gridColumn: '1 / -1' }}>
          <div className="adm-card-title"><Ticket size={18} /> Coupon Overview</div>
          <div className="cd-grid">
            <div className="cd-item">
              <div className="cd-label">Coupon Code</div>
              <div className="cd-value mono">{coupon.code}</div>
            </div>
            <div className="cd-item">
              <div className="cd-label">Status</div>
              <div className="cd-value"><StatusBadge status={coupon.computed_status} /></div>
            </div>
            <div className="cd-item">
              <div className="cd-label">Owner Name</div>
              <div className="cd-value">{coupon.submitted_from || '—'}</div>
            </div>
            <div className="cd-item">
              <div className="cd-label">Email</div>
              <div className="cd-value">{coupon.email || '—'}</div>
            </div>
            <div className="cd-item">
              <div className="cd-label">Created Date</div>
              <div className="cd-value">{fmt(coupon.verified_at)}</div>
            </div>
            <div className="cd-item">
              <div className="cd-label">Expiry Date</div>
              <div className="cd-value" style={{ color: coupon.computed_status === 'expired' ? '#e74c3c' : coupon.computed_status === 'expiring' ? '#f39c12' : '#27ae60', fontWeight: 700 }}>
                {fmtDate(coupon.expiry_date)}
              </div>
            </div>
            <div className="cd-item">
              <div className="cd-label">Times Renewed</div>
              <div className="cd-value">{renewals.length > 0 ? <span style={{ color: '#27ae60', fontWeight: 700 }}>{renewals.length}×</span> : '—'}</div>
            </div>
            <div className="cd-item">
              <div className="cd-label">Submitted</div>
              <div className="cd-value">{submission ? <span style={{ color: '#e74c3c', fontWeight: 700 }}>Yes</span> : 'No'}</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="adm-card" style={{ gridColumn: '1 / -1' }}>
          <div className="adm-card-title"><Clock size={18} /> Full History Timeline</div>
          <div className="cd-timeline">

            {/* Created */}
            <div className="cd-tl-item cd-tl-created">
              <div className="cd-tl-dot"><Ticket size={14} /></div>
              <div className="cd-tl-body">
                <div className="cd-tl-title">Coupon Created</div>
                <div className="cd-tl-meta">{fmt(coupon.verified_at)}</div>
                <div className="cd-tl-detail">
                  <span>Code: <strong>{coupon.code}</strong></span>
                  <span>Owner: <strong>{coupon.submitted_from || '—'}</strong></span>
                  <span>Email: <strong>{coupon.email || '—'}</strong></span>
                </div>
                <div className="cd-tl-payment"><CreditCard size={12} /> Payment: <strong>{isSubmissionGenerated ? '$0 (Generated from Submission)' : '$50 (Generation Fee)'}</strong></div>
                {isSubmissionGenerated && parentSubmission && (
                  <div className="cd-tl-detail" style={{ marginTop: 6 }}>
                    <span>Generated from: <strong
                      style={{ fontFamily: 'monospace', cursor: 'pointer', color: 'var(--accent)', textDecoration: 'underline' }}
                      onClick={() => navigate(`/admin/all-coupons/${parentSubmission.original_code}`)}
                    >{parentSubmission.original_code}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Renewals */}
            {renewals.map((r, i) => (
              <div key={r.id} className="cd-tl-item cd-tl-renewed">
                <div className="cd-tl-dot"><RefreshCw size={14} /></div>
                <div className="cd-tl-body">
                  <div className="cd-tl-title">Renewed #{i + 1}</div>
                  <div className="cd-tl-meta">{fmt(r.created_at)}</div>
                  <div className="cd-tl-detail">
                    <span>New Expiry: <strong>{fmtDate(r.new_end)}</strong></span>
                    <span>Extended by: <strong>+30 days</strong></span>
                  </div>
                  <div className="cd-tl-payment"><CreditCard size={12} /> Payment: <strong>$20 (Renewal Fee)</strong></div>
                </div>
              </div>
            ))}

            {/* Submission */}
            {submission && (
              <div className="cd-tl-item cd-tl-submitted">
                <div className="cd-tl-dot"><Send size={14} /></div>
                <div className="cd-tl-body">
                  <div className="cd-tl-title">Coupon Submitted</div>
                  <div className="cd-tl-meta">{fmt(submission.created_at)}</div>
                  <div className="cd-tl-detail">
                    <span>Email: <strong>{submission.email || '—'}</strong></span>
                    <span>Generated: <strong>{submission.generated_codes?.length || 0} new coupons</strong></span>
                  </div>
                  {submission.generated_codes?.length > 0 && (
                    <div className="cd-tl-codes">
                      {submission.generated_codes.map(c => <span key={c} className="adm-tag">{c}</span>)}
                    </div>
                  )}
                  <div className="cd-tl-payment"><CreditCard size={12} /> Payment: <strong>$10 (Submission Fee)</strong></div>
                </div>
              </div>
            )}

            {/* Current status */}
            <div className={`cd-tl-item ${coupon.computed_status === 'inactive' ? 'cd-tl-inactive' : coupon.computed_status === 'expired' ? 'cd-tl-expired' : 'cd-tl-active'}`}>
              <div className="cd-tl-dot">
                {coupon.computed_status === 'active' || coupon.computed_status === 'expiring'
                  ? <CheckCircle size={14} />
                  : <XCircle size={14} />
                }
              </div>
              <div className="cd-tl-body">
                <div className="cd-tl-title">Current Status</div>
                <div className="cd-tl-meta"><StatusBadge status={coupon.computed_status} /></div>
                {(coupon.computed_status === 'active' || coupon.computed_status === 'expiring') && (
                  <div className="cd-tl-detail">
                    <span>Expires: <strong>{fmtDate(coupon.expiry_date)}</strong></span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
