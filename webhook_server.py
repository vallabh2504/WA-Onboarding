#!/usr/bin/env python3
"""
WA Gatekeeper Webhook Server
Run this on your machine to receive onboarding requests.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import hmac
import hashlib
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET", "super-secret-change-me")
BOT_USER_ID = "456109422"  # Boss Garu's Telegram ID

def verify_signature(payload, signature):
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)

def notify_telegram(data):
    """Send notification to Boss Garu via OpenClaw"""
    import subprocess
    import json
    
    message = f"""📝 *New Onboarding Request*

*Name:* {data.get('name')}
*Relation:* {data.get('relation')}
*Number:* {data.get('number')}"""

    buttons = [
        [{"text": "✅ Approve", "callback_data": f"approve:{data.get('number')}:{data.get('name')}:{data.get('relation')}"},
         {"text": "❌ Reject", "callback_data": f"reject:{data.get('number')}:{data.get('name')}:{data.get('relation')}"}]
    ]
    
    cmd = [
        "openclaw", "message", "send",
        "--channel", "telegram",
        "--target", BOT_USER_ID,
        "--message", message,
        "--buttons", json.dumps(buttons)
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        print(f"Telegram notification sent: {result.returncode}")
        import sys
        sys.stdout.flush()
        if result.returncode != 0:
            print(f"STDOUT: {result.stdout}")
            print(f"STDERR: {result.stderr}")
            sys.stdout.flush()
        return result.returncode == 0
    except Exception as e:
        print(f"Error sending telegram: {e}")
        return False

@app.route("/webhook", methods=["POST"])
def handle_webhook():
    signature = request.headers.get("X-Webhook-Signature", "")
    payload = request.get_data()
    
    if not verify_signature(payload, signature):
        print("Invalid signature received!")
        return jsonify({"error": "Invalid signature"}), 401
    
    data = request.json
    print(f"Received request: {data}")
    import sys
    sys.stdout.flush()
    
    required = ["name", "relation", "number"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400
    
    notify_telegram(data)
    
    return jsonify({"status": "received"}), 200

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    print("=" * 50)
    print("WA Gatekeeper Webhook Server")
    print("=" * 50)
    print(f"Secret: {WEBHOOK_SECRET}")
    print("Run this, then keep it running!")
    print("=" * 50)
    app.run(port=3000, debug=False, host="0.0.0.0")
