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
      setStatus({ type: 'error', message: error.response?.data?.error || 'Failed to send request.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="form-container">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          WA Gatekeeper
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Request access to message Vallabh
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Your full name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Relationship to Vallabh
            </label>
            <input
              type="text"
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Friend, Colleague, Client"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              WhatsApp Number
            </label>
            <input
              type="tel"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="input-field"
              placeholder="+1 234 567 8900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Sending...' : 'Submit Request'}
          </button>

          {status && (
            <div className={`status-message ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
              {status.message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default App