import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Eye, EyeOff } from 'lucide-react'
import './Admin.css'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    setError('')
    if (!username || !password) { setError('Please enter both fields.'); return }
    if (username === 'admin' && password === '123') {
      localStorage.setItem('adminAuth', 'true')
      navigate('/admin')
    } else {
      setError('Invalid credentials. Try admin / 123')
    }
  }

  return (
    <div className="al-shell">
      <div className="al-bg-orb al-orb1" />
      <div className="al-bg-orb al-orb2" />

      <div className="al-card">
        <div className="al-brand">
          <div className="al-brand-mark"><ShieldCheck size={22} color="#fff" /></div>
          <div>
            <div className="al-brand-title">FCFC Admin</div>
            <div className="al-brand-sub">Secure dashboard access</div>
          </div>
        </div>

        <h1 className="al-heading">Welcome back</h1>
        <p className="al-sub">Sign in to manage coupons, revenue and users.</p>

        {error && <div className="al-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="neu-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="admin"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="al-pw-wrap">
            <input
              className="neu-input"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button className="al-eye" onClick={() => setShowPw(v => !v)} type="button">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button className="neu-btn neu-btn-primary al-submit" onClick={handleLogin}>
          Sign In to Dashboard
        </button>
      </div>
    </div>
  )
}
