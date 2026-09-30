import { TypeAnimation } from 'react-type-animation'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react'
import locationImg from '../assets/locations.jpeg'
import './Contact.css'

const info = [
  { icon: <Mail size={20} />, label: 'Email', value: 'fortunecrowdfundcoupon@gmail.com', color: '#4A90D9' },
  { icon: <Phone size={20} />, label: 'Phone', value: '+1 (800) FCFC-NOW', color: '#6C63FF' },
  { icon: <MapPin size={20} />, label: 'Location', value: 'Global — Blockchain Network', color: '#27ae60' },
  { icon: <Clock size={20} />, label: 'Support Hours', value: '24/7 On-Chain Support', color: '#e67e22' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main>
      <div className="page-header">
        <h1>Contact Us</h1>
        <p><TypeAnimation sequence={["Have a question about FCFC? We're here to help.", 4000]} speed={55} repeat={Infinity} /></p>
      </div>

      <section className="section">
        <div className="page-wrapper">
          <div className="contact-grid">

            {/* Left — info */}
            <div className="contact-info">
              <div className="workflow-eyebrow" style={{ marginBottom: 20 }}>
                <MessageSquare size={13} /> Get In Touch
              </div>
              <h2 className="section-title" style={{ marginBottom: 12 }}>We'd Love to Hear From You</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 36 }}>
                Whether you have questions about the FCFC coupon cycle, need technical support, or want to partner with us — reach out and we'll respond promptly.
              </p>
              <div className="contact-info-cards">
                {info.map(i => (
                  <div key={i.label} className="contact-info-card">
                    <div className="contact-info-icon" style={{ background: `${i.color}15` }}>
                      <span style={{ color: i.color }}>{i.icon}</span>
                    </div>
                    <div>
                      <div className="contact-info-label">{i.label}</div>
                      <div className="contact-info-value">{i.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address & Location images */}
              <div className="contact-img-grid">
                <div className="contact-img-card">
                  <div className="contact-address-text">
                    <span>Fortune Crowd Fund,</span>
                    <span>Near One Mart Super Store,</span>
                    <span>Road Town,</span>
                    <span>Corporate Service Centre, VG 1110, British Virgin</span>
                  </div>
                  <div className="contact-img-label">
                    <MapPin size={13} color="var(--accent)" />
                    <span>Our Address</span>
                  </div>
                </div>
                <div className="contact-img-card">
                  <img src={locationImg} alt="Our Location" />
                  <div className="contact-img-label">
                    <MapPin size={13} color="#27ae60" />
                    <span>Our Location</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="form-card">
              {sent ? (
                <div className="contact-success">
                  <div className="success-icon" style={{ width: 72, height: 72, fontSize: 32, margin: '0 auto 20px' }}>✅</div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy)', marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <h3 className="form-title">Send a Message</h3>
                  <p className="form-subtitle">Fill out the form and our team will respond shortly.</p>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="neu-input" name="name" placeholder="Your name" value={form.name} onChange={handle} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="neu-input" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input className="neu-input" name="subject" placeholder="How can we help?" value={form.subject} onChange={handle} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className="neu-input" name="message" rows={5} placeholder="Tell us more..." value={form.message} onChange={handle} required />
                  </div>

                  <button type="submit" className="neu-btn neu-btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, padding: '14px 24px' }}>
                    <Send size={16} /> Send Message
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
