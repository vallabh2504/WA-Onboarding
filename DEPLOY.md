# WA Gatekeeper - Quick Deploy Guide

## Step 1: Run Webhook Server (on YOUR machine)

Open terminal and run:

```bash
cd ~/Downloads/wa-onboarding
pip install flask
export WEBHOOK_SECRET="super-secret-change-me"
python3 webhook_server.py
```

Keep this terminal open! It must keep running for the app to work.

## Step 2: Deploy Frontend to Vercel

1. Go to: https://vercel.com/new
2. Import from GitHub: `vallabh2504/wa-onboarding`
3. Project name: `wa-onboarding-vallabh`
4. Framework Preset: `Vite`
5. Deploy!

## Step 3: Get Your Vercel URL

After deploy, Vercel will give you something like:
`https://wa-onboarding-vallabh.vercel.app`

## Step 4: Test It

1. Make sure `python3 webhook_server.py` is running
2. Open your Vercel URL
3. Fill out the form and submit
4. You should get a Telegram message!

---

## Important Notes

- The webhook server MUST stay running
- The Vercel app talks to the Cloudflare tunnel (which forwards to your local server)
- Tunnel URL: `https://attending-monica-becoming-motels.trycloudflare.com/webhook`
