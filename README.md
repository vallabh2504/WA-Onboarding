# WA Gatekeeper Onboarding App

A minimalist React app for requesting WhatsApp access to Vallabh.

## Setup

1. Clone this repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Deploy to Vercel (recommended) or Netlify

## Webhook Configuration

The app sends requests to:
- **URL:** `https://attending-monica-becoming-motels.trycloudflare.com/webhook`
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Webhook-Signature`: HMAC-SHA256 of JSON body

## Security

Update `WEBHOOK_SECRET` in `src/App.jsx` to match your webhook server's secret:
```javascript
const WEBHOOK_SECRET = 'change-me-in-production'
```

## Testing

```bash
# Generate signature
SIGNATURE=$(python3 -c "
import hmac, hashlib, json
secret = 'change-me-in-production'
data = json.dumps({'name': 'John', 'relation': 'Friend', 'number': '+123456'}).encode()
print(hmac.new(secret.encode(), data, hashlib.sha256).hexdigest())")

# Send request
curl -X POST https://attending-monica-becoming-motels.trycloudflare.com/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -d '{"name": "John", "relation": "Friend", "number": "+1234567890"}'
```

## Tech Stack
- React + Vite
- Tailwind CSS
- Axios