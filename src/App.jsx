import { useState } from 'react'
import axios from 'axios'

const WEBHOOK_URL = 'https://attending-monica-becoming-motels.trycloudflare.com/webhook'
const WEBHOOK_SECRET = 'super-secret-change-me'

async function generateSignature(payload) {
  const encoder = new TextEncoder()
  const data = encoder.encode(payload)
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, data)
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function App() {
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    number: ''
  })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const payload = JSON.stringify(formData)
      const signature = await generateSignature(payload)

      await axios.post(WEBHOOK_URL, formData, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature
        }
      })

      setStatus({ type: 'success', message: 'Request sent successfully! Vallabh will review it.' })
      setFormData({ name: '', relation: '', number: '' })
    } catch (error) {
      console.error('Error:', error)
      setStatus({ type: 'error', message: error.response?.data?.error || 'Failed to send request. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen">
      <div className="cyber-grid"></div>
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>
      
      <div className="container">
        <div className="cyber-card">
          <div className="card-glow"></div>
          
          <div className="header">
            <div className="logo-container">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="logo-pulse"></div>
            </div>
            <h1 className="title">WA Gatekeeper</h1>
            <p className="subtitle">Request access to message Vallabh</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">◈</span>
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="cyber-input"
                placeholder="Enter your full name"
                required
              />
              <div className="input-line"></div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">◇</span>
                Relationship
              </label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  { id: 'Friend', label: 'Friend', icon: '👑' },
                  { id: 'Family', label: 'Family', icon: '🏠' },
                  { id: 'Professional', label: 'Professional', icon: '👔' },
                  { id: 'Stranger', label: 'Other', icon: '👋' }
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, relation: option.id })}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-300 ${
                      formData.relation === option.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                        : 'bg-[#121214] border-gray-800 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-xl mb-1">{option.icon}</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
              <div className="input-line"></div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">◆</span>
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="cyber-input"
                placeholder="+1 234 567 8900"
                required
              />
              <div className="input-line"></div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cyber-button"
            >
              <span className="button-content">
                {loading ? (
                  <>
                    <span className="loading-dots">
                      <span></span><span></span><span></span>
                    </span>
                    Transmitting...
                  </>
                ) : (
                  <>
                    <span className="button-icon">⬡</span>
                    Submit Request
                  </>
                )}
              </span>
              <span className="button-glow"></span>
            </button>

            {status && (
              <div className={`status ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
                <span className="status-icon">{status.type === 'success' ? '✓' : '✗'}</span>
                {status.message}
              </div>
            )}
          </form>

          <div className="footer">
            <div className="scan-line"></div>
            <span className="footer-text">SECURE CONNECTION // ENCRYPTED</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
