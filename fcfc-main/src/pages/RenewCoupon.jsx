import { TypeAnimation } from 'react-type-animation'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, ChevronRight, ChevronLeft, Check, Loader, CheckCircle, Calendar } from 'lucide-react'
import StepIndicator from '../components/StepIndicator'
import Web3PayStep from '../components/Web3PayStep'
import './RenewCoupon.css'
import CouponTicket from '../components/CouponTicket'

const API = import.meta.env.VITE_API_URL + '/api/general'
const steps = ['Find Coupon', 'Payment', 'Review & Renew']

export default function RenewCoupon() {
  const [step, setStep] = useState(0)
  const [code, setCode] = useState('')
  const [validating, setValidating] = useState(false)
  const [validateError, setValidateError] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [card, setCard] = useState({ nameOnCard: '', number: '' })
  const [email, setEmail] = useState('')
  const [paymentDone, setPaymentDone] = useState(false)
  const [renewing, setRenewing] = useState(false)
  const [renewError, setRenewError] = useState('')
  const [result, setResult] = useState(null)
  const navigate = useNavigate()

  const isValidEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const handleValidate = async () => {
    if (!code.trim()) return
    setValidating(true)
    setValidateError('')
    try {
      const res = await fetch(`${API}/validate-coupon?code=${encodeURIComponent(code.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCoupon(data)
      setStep(1)
    } catch (err) {
      setValidateError(err.message)
    }
    setValidating(false)
  }

  const handleRenew = async () => {
    setRenewing(true)
    setRenewError('')
    try {
      const res = await fetch(`${API}/renew-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (err) {
      setRenewError(err.message)
    }
    setRenewing(false)
  }

  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  // Success screen
  if (result) {
    return (
      <main>
        <section className="section">
          <div className="page-wrapper">
            <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
              
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#27ae60,#2ecc71)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle size={40} color="#fff" />
              </div>
              
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
              <h1 style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 800, color: 'var(--navy)', marginBottom: 10 }}>
                Coupon Renewed!
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32, lineHeight: 1.7 }}>
                Your coupon has been extended for 30 more days.
              </p>

              <div style={{ marginBottom: 32 }}>
                <CouponTicket code={result.code} />
              </div>

              <div className="renew-result-card" style={{ marginBottom: 32, textAlign: 'left', maxWidth: 480, margin: '0 auto 32px' }}>
                <div className="renew-result-row">
                  <span className="renew-result-label">New Expiry</span>
                  <span className="renew-result-value renew-result-green"><Calendar size={14} /> {fmt(result.newExpiry)}</span>
                </div>
                <div className="renew-result-row">
                  <span className="renew-result-label">Status</span>
                  <span className="renew-result-value renew-result-green"><CheckCircle size={14} /> Active</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="neu-btn neu-btn-primary" onClick={() => navigate('/thank-you')} style={{ padding: '13px 28px', fontSize: 16 }}>
                  Finish
                </button>
              </div>

            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <div className="page-header">
        <h1>Renew Coupon</h1>
        <p>Extend the validity of an existing coupon.</p>
      </div>

      <section className="section">
        <div className="page-wrapper">
          <div className="form-card">
            <StepIndicator steps={steps} current={step} />

            {/* Step 0 — Find coupon */}
            {step === 0 && (
              <>
                <div className="form-title">Find Your Coupon</div>
                <div className="form-subtitle">Enter the coupon code you want to renew.</div>
                <div className="form-group">
                  <label className="form-label">Coupon Code</label>
                  <input
                    className="neu-input"
                    placeholder="e.g. FCFC-AEC17D1A"
                    value={code}
                    onChange={e => { setCode(e.target.value.toUpperCase()); setValidateError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleValidate()}
                    style={{ fontFamily: 'monospace', letterSpacing: 3, fontWeight: 700, fontSize: 18, textAlign: 'center' }}
                  />
                  {validateError && <div className="renew-error">{validateError}</div>}
                </div>
              </>
            )}

            {/* Step 1 — Payment */}
            {step === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="neu-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  {email && !isValidEmail(email) && <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 6 }}>Please enter a valid email address.</div>}
                </div>
                {isValidEmail(email) && (
                  <Web3PayStep
                    type="renew"
                    metadata={{ code: code.trim(), email }}
                    onPaid={(result) => { setResult(result); setPaymentDone(true) }}
                  />
                )}
              </>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
              <>
                <div className="form-title">Review & Renew</div>
                <div className="form-subtitle">Confirm details before extending your coupon.</div>
                <div className="renew-review-card">
                  <div className="renew-review-row">
                    <span className="renew-review-label">Coupon Code</span>
                    <span className="renew-review-value mono">{code}</span>
                  </div>
                  <div className="renew-review-row">
                    <span className="renew-review-label">Email</span>
                    <span className="renew-review-value">{email}</span>
                  </div>
                  <div className="renew-review-row">
                    <span className="renew-review-label">Payment</span>
                    <span className="renew-review-paid"><Check size={14} /> $20 Completed</span>
                  </div>
                  <div className="renew-review-row renew-review-highlight">
                    <span className="renew-review-label">Extension</span>
                    <span className="renew-review-badge">+30 Days</span>
                  </div>
                </div>
                <div className="renew-notice">
                  <Calendar size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                  Your coupon will be active for 30 days from today after renewal.
                </div>
                {renewError && <div className="renew-error">{renewError}</div>}
              </>
            )}

            {/* Navigation */}
            <div className="form-nav">
              {step > 0
                ? <button className="neu-btn" onClick={() => setStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ChevronLeft size={16} /> Back
                  </button>
                : <div />
              }
              {step === 0 && (
                <button className="neu-btn neu-btn-primary" onClick={handleValidate} disabled={validating || !code.trim()} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {validating ? <><Loader size={14} className="adm-spin" /> Validating…</> : <>Next <ChevronRight size={16} /></>}
                </button>
              )}
              {step === 1 && (
                <button className="neu-btn neu-btn-primary" onClick={() => setStep(2)} disabled={!paymentDone} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Next <ChevronRight size={16} />
                </button>
              )}
              {step === 2 && (
                <button className="neu-btn neu-btn-primary" onClick={handleRenew} disabled={renewing} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {renewing ? <><Loader size={14} className="adm-spin" /> Renewing…</> : <><RefreshCw size={15} /> Renew Coupon</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
