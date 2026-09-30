import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, Copy, Check, Ticket, Home, Search, Download, Share2 } from 'lucide-react'
import html2canvas from 'html2canvas'

import CouponTicket from '../components/CouponTicket'

export default function CouponSuccess() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const code = state?.code
  const [copied, setCopied] = useState(false)

  if (!code) {
    navigate('/coupon/generate', { replace: true })
    return null
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCoupon = async () => {
    const element = document.getElementById('coupon-ticket-wrapper');
    if (element) {
      try {
        const canvas = await html2canvas(element, { backgroundColor: null, scale: 2 });
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `FCFC_Coupon_${code}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        console.error("Error generating image", err);
      }
    }
  }

  const shareCoupon = async () => {
    const element = document.getElementById('coupon-ticket-wrapper');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { backgroundColor: null, scale: 2 });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `FCFC_Coupon_${code}.png`, { type: 'image/png' });
        
        const shareData = {
          title: 'FCFC Coupon',
          text: `Here is your FCFC coupon code: ${code}`,
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
              Coupon Generated!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32, lineHeight: 1.7 }}>
              Your unique FCFC coupon code has been created and saved successfully.
            </p>

            <div style={{ marginBottom: 32 }} id="coupon-ticket-wrapper">
              <CouponTicket code={code} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32, gap: 12, flexWrap: 'wrap' }}>
              <button className="neu-btn" onClick={copyCode} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: 16 }}>
                {copied ? <><Check size={16} /> Copied to Clipboard</> : <><Copy size={16} /> Copy Code</>}
              </button>
              <button className="neu-btn" onClick={downloadCoupon} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: 16 }}>
                <Download size={16} /> Download
              </button>
              <button className="neu-btn" onClick={shareCoupon} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: 16 }}>
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Details */}
            <div className="neu-card" style={{ maxWidth: 480, width: '100%', margin: '0 auto 36px', textAlign: 'left' }}>
              {[
                ['Status', <span style={{ color: '#27ae60', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} /> Active</span>],
                ['Coupon Code', <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{code}</span>],
                ['Generated At', new Date().toLocaleString()],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{k}</span>
                  <span style={{ color: 'var(--navy)', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/" className="neu-btn neu-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '13px 28px' }}>
                <Home size={16} /> Back to Home
              </Link>
              <Link to="/coupon/generate" className="neu-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '13px 28px' }}>
                <Ticket size={16} /> New Coupon
              </Link>
              <Link to="/coupon/search" className="neu-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '13px 28px' }}>
                <Search size={16} /> Search Coupons
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
