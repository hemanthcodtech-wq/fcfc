import { Check } from 'lucide-react'
import './StepIndicator.css'
import './StepIndicator.css'

export default function StepIndicator({ steps, current }) {
  return (
    <div className="step-indicator">
      {steps.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : ''
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div className={`step ${state}`} style={{ flexDirection: 'column', alignItems: 'center', gap: 6, flex: 'none' }}>
              <div className="step-circle">
                {i < current ? <Check size={16} /> : i + 1}
              </div>
              <span className="step-label">{label}</span>
            </div>
            {i < steps.length - 1 && <div className="step-line" />}
          </div>
        )
      })}
    </div>
  )
}
