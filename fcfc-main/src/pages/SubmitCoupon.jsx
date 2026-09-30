import { TypeAnimation } from 'react-type-animation'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, ChevronRight, ChevronLeft, Check, Loader, Copy, CheckCircle, Download, Share2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import StepIndicator from '../components/StepIndicator'
import Web3PayStep from '../components/Web3PayStep'
import './SubmitCoupon.css'
import CouponTicket from '../components/CouponTicket'

const API = import.meta.env.VITE_API_URL + '/api/general'
const steps = ['Enter Coupon', 'Payment', 'Review & Submit']

export default function SubmitCoupon() {
  const [step, setStep] = useState(0)
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [validating, setValidating] = useState(false)
  const [validateError, setValidateError] = useState('')
  const [paymentDone, setPaymentDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [newCodes, setNewCodes] = useState([])
  const [copied, setCopied] = useState({})
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
      setStep(1)
    } catch (err) {
      setValidateError(err.message)
    }
    setValidating(false)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch(`${API}/submit-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setNewCodes(data.newCodes)
    } catch (err) {
      setSubmitError(err.message)
    }
    setSubmitting(false)
  }

  const copyCode = (c) => {
    navigator.clipboard.writeText(c)
    setCopied(prev => ({ ...prev, [c]: true }))
    setTimeout(() => setCopied(prev => ({ ...prev, [c]: false })), 2000)
  }

  const downloadCoupon = async (c) => {
    const element = document.getElementById(`coupon-ticket-${c}`);
    if (element) {
      try {
        const canvas = await html2canvas(element, { backgroundColor: null, scale: 2 });
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `FCFC_Coupon_${c}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        console.error("Error generating image", err);
      }
    }
  }

  const shareCoupon = async (c) => {
    const element = document.getElementById(`coupon-ticket-${c}`);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { backgroundColor: null, scale: 2 });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `FCFC_Coupon_${c}.png`, { type: 'image/png' });
        
        const shareData = {
          title: 'FCFC Coupon',
          text: `Here is your FCFC coupon code: ${c}`,
        };

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }

        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            console.error('Error sharing', err);
          }
        } else {
          alert("Sharing is not supported on this browser.");
        }
      }, 'image/png');
    } catch (err) {
      console.error("Error generating image for share", err);
    }
  }

  // Show generated codes result
  if (newCodes.length > 0) {
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
                3 New Coupons Generated!
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32, lineHeight: 1.7 }}>
                Your original coupon <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{code}</span> has been marked inactive.
              </p>

              <div style={{ display: 'grid', gap: 48, marginBottom: 40 }}>
                {newCodes.map(c => (
                  <div key={c}>
                    <div style={{ marginBottom: 20 }} id={`coupon-ticket-${c}`}>
                      <CouponTicket code={c} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <button className="neu-btn" onClick={() => copyCode(c)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: 16 }}>
                        {copied[c] ? <><Check size={16} /> Copied to Clipboard</> : <><Copy size={16} /> Copy Code</>}
                      </button>
                      <button className="neu-btn" onClick={() => downloadCoupon(c)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: 16 }}>
                        <Download size={16} /> Download
                      </button>
                      <button className="neu-btn" onClick={() => shareCoupon(c)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: 16 }}>
                        <Share2 size={16} /> Share
                      </button>
                    </div>
                  </div>
                ))}
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
        <h1>Submit Coupon</h1>
        <p><TypeAnimation sequence={['Submit an existing coupon code for verification and redemption.', 4000]} speed={55} repeat={Infinity} /></p>
      </div>

      <section className="section">
        <div className="page-wrapper">
          <div className="form-card">
            <StepIndicator steps={steps} current={step} />

            {/* Step 0 — Enter coupon code */}
            {step === 0 && (
              <>
                <div className="form-title">Enter Coupon Code</div>
                <div className="form-subtitle">Enter your active FCFC coupon code to proceed.</div>
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
                  {validateError && <div style={{ color: '#e74c3c', fontSize: 13, marginTop: 8 }}>{validateError}</div>}
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
                    type="submit"
                    metadata={{ code: code.trim(), email }}
                    onPaid={(result) => { setNewCodes(result.newCodes || []); setPaymentDone(true) }}
                  />
                )}
              </>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
              <>
                <div className="form-title">Review & Submit</div>
                <div className="form-subtitle">Confirm details. Submitting will deactivate your coupon and generate 3 new ones.</div>
                <div className="submit-review-card">
                  <div className="submit-review-row">
                    <span className="submit-review-label">Coupon Code</span>
                    <span className="submit-review-value mono">{code}</span>
                  </div>
                  <div className="submit-review-row">
                    <span className="submit-review-label">Email</span>
                    <span className="submit-review-value">{email || '—'}</span>
                  </div>
                  <div className="submit-review-row">
                    <span className="submit-review-label">Payment</span>
                    <span className="submit-review-value submit-review-paid"><Check size={14} /> $10 Completed</span>
                  </div>
                  <div className="submit-review-row submit-review-highlight">
                    <span className="submit-review-label">New Coupons</span>
                    <span className="submit-review-value submit-review-badge">3 will be generated</span>
                  </div>
                </div>
                <div className="submit-review-warning">
                  ⚠️ Once submitted, <strong>{code}</strong> will be permanently deactivated.
                </div>
                {submitError && <div className="submit-error">{submitError}</div>}
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
                <button className="neu-btn neu-btn-primary" onClick={handleSubmit} disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {submitting ? <><Loader size={14} className="adm-spin" /> Submitting…</> : <><Send size={15} /> Generate Coupons</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
