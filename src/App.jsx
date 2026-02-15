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
              <select
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                className="cyber-input"
                required
              >
                <option value="" disabled className="bg-[#0a0a0c]">Select Relationship</option>
                <option value="Friend" className="bg-[#0a0a0c]">Friend (Inner Circle)</option>
                <option value="Family" className="bg-[#0a0a0c]">Family</option>
                <option value="Professional" className="bg-[#0a0a0c]">Professional Colleague</option>
                <option value="Stranger" className="bg-[#0a0a0c]">Acquaintance / Other</option>
              </select>
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
