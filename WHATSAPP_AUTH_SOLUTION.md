# WhatsApp Cloud API Setup Guide

## Problem: Interactive QR Authentication in Containers

Baileys requires QR code scanning on first run, which is impossible in:
- Docker containers
- Cloud servers (Heroku, Railway, etc.)
- CI/CD pipelines
- Headless environments

**Solution: Use WhatsApp Cloud API instead**

---

## Option 1: WhatsApp Cloud API (Recommended)

### Benefits
✅ No QR code needed
✅ Production-ready
✅ Official WhatsApp support
✅ Better reliability
✅ Built-in rate limiting
✅ Easy to deploy in containers

### Setup Steps

#### 1. Create Meta Business Account

1. Go to https://business.facebook.com
2. Create or use existing business account
3. Create new app → WhatsApp → Cloud API

#### 2. Get WhatsApp Business Account ID

```
Settings → Accounts → WhatsApp Business Account
Copy: Business Account ID (WABA ID)
```

#### 3. Get Phone Number ID

```
API Setup → Phone Numbers → Your Number
Copy: Phone Number ID
```

#### 4. Generate Access Token

```
Settings → System Users → Create System User
Give: Admin access
Generate: Access Token (valid 60 days)
Copy token → Store in .env as WHATSAPP_TOKEN
```

#### 5. Verify Phone Number

```
Settings → Phone Numbers → Your Number
Verify with code WhatsApp sends
```

#### 6. Add Phone Number to Business Account

```
API Setup → Phone Numbers
Click "Add" → Select your verified number
```

### Environment Variables

```env
# WhatsApp Cloud API
WHATSAPP_TOKEN=your_access_token_here
WHATSAPP_PHONE_ID=your_phone_id_here
WHATSAPP_WABA_ID=your_waba_id_here
WHATSAPP_WEBHOOK_TOKEN=your_webhook_verify_token

# Bot Config
OWNER=212625457341
PREFIX=.
CHANNEL=https://whatsapp.com/channel/0029Vb6YJqq0lwgzYNWVN21u
NODE_ENV=production
PORT=3000
```

### Setup Webhook

1. Go to Meta App Dashboard
2. WhatsApp → Configuration
3. Set Webhook URL:
```
https://your-bot-url.com/webhook/whatsapp
```

4. Set Verify Token:
```
Same as WHATSAPP_WEBHOOK_TOKEN in .env
```

5. Subscribe to Webhook Fields:
```
- messages
- message_status
- message_template_status_update
```

---

## Option 2: Session File Pre-Auth (Baileys)

If you want to stay with Baileys, pre-authenticate locally:

### Local Setup

```bash
# 1. Run bot locally
npm install
npm start

# 2. Scan QR code with your phone

# 3. Bot connects successfully

# 4. Zip sessions folder
cd sessions
zip -r ../sessions.zip .
cd ..

# 5. Upload sessions.zip to your repo (in .gitignore)
# OR encode as base64 and store as secret
base64 -i sessions.zip > sessions.b64

# 6. Add to GitHub Secrets
# Go to repo Settings → Secrets
# Create: BAILEYS_SESSION
# Paste base64 content
```

### Modify Startup

```javascript
// Add to index.js before useMultiFileAuthState
const fs = require('fs');
const path = require('path');

const SESSIONS_DIR = path.join(__dirname, 'sessions');

// Restore session from env variable if provided
if (process.env.BAILEYS_SESSION && !fs.existsSync(SESSIONS_DIR)) {
  console.log('🔄 Restoring WhatsApp session from environment...');
  
  const sessionB64 = process.env.BAILEYS_SESSION;
  const sessionZip = Buffer.from(sessionB64, 'base64');
  const AdmZip = require('adm-zip');
  const zip = new AdmZip(sessionZip);
  
  zip.extractAllTo(SESSIONS_DIR, true);
  console.log('✅ Session restored');
}

// Then proceed with normal startup
const { state, saveCreds } = await useMultiFileAuthState(SESSIONS_DIR);
```

---

## Option 3: Run Locally First, Then Deploy

Most practical approach:

### Step 1: Local Authentication

```bash
# On your computer
git clone https://github.com/Ahmedaligue/senku-bott.git
cd senku-bott
npm install
npm start

# Scan QR code with your WhatsApp phone
# Wait for: "✅ Bot connected successfully!"
```

### Step 2: Save Sessions

```bash
# In another terminal
zip -r sessions.backup.zip sessions/

# Store safely (not in git)
```

### Step 3: Create GitHub Secret

```bash
# Encode sessions
base64 -i sessions.backup.zip | pbcopy

# OR on Linux
base64 < sessions.backup.zip | xclip -selection clipboard
```

Go to GitHub repo → Settings → Secrets → New repository secret
- Name: `BAILEYS_SESSION`
- Value: (paste base64 content)

### Step 4: Update Deploy Script

```bash
# Add to deploy.sh before Docker build
if [ -n "$BAILEYS_SESSION" ]; then
  echo "Restoring WhatsApp session..."
  echo "$BAILEYS_SESSION" | base64 -d > /tmp/sessions.zip
  unzip /tmp/sessions.zip -d sessions/
fi
```

---

## Recommended Solution Flowchart

```
┌─ Production Deployment Needed?
│
├─ YES → Use WhatsApp Cloud API
│        (Official, reliable, no QR needed)
│
└─ NO (Testing/Development) → Use Baileys
                              
                              ├─ Local Only?
                              │  └─ Just run: npm start
                              │
                              └─ Need Container?
                                 ├─ Authenticate Locally
                                 ├─ Save sessions.zip
                                 ├─ Encode as base64
                                 ├─ Add to GitHub Secrets
                                 └─ Update Dockerfile
```

---

## Implementation: WhatsApp Cloud API Version

### Step 1: Install Dependencies

```bash
npm install axios express body-parser
```

### Step 2: Create Cloud API Service

Create `src/services/whatsappCloudAPI.js`:

```javascript
const axios = require('axios');

class WhatsAppCloudAPI {
  constructor() {
    this.token = process.env.WHATSAPP_TOKEN;
    this.phoneId = process.env.WHATSAPP_PHONE_ID;
    this.wabaId = process.env.WHATSAPP_WABA_ID;
    this.version = 'v18.0';
    this.baseURL = `https://graph.instagram.com/${this.version}`;
  }

  async sendMessage(to, text) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { body: text },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendImage(to, imageUrl, caption = '') {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'image',
          image: {
            link: imageUrl,
          },
          caption,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  parseWebhook(req) {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const contact = req.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

    if (!message) return null;

    return {
      from: message.from,
      id: message.id,
      timestamp: message.timestamp,
      type: message.type,
      text: message.text?.body || '',
      contact: {
        name: contact?.profile?.name || 'Unknown',
        phone: contact?.wa_id || message.from,
      },
    };
  }
}

module.exports = new WhatsAppCloudAPI();
```

### Step 3: Update Server

Update `index.js` to use Cloud API:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const whatsapp = require('./src/services/whatsappCloudAPI');

const app = express();
app.use(bodyParser.json());

// Webhook verification
app.get('/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_TOKEN) {
    res.status(200).send(challenge);
    console.log('✅ Webhook verified');
  } else {
    res.status(403).send('Forbidden');
  }
});

// Receive messages
app.post('/webhook/whatsapp', (req, res) => {
  const parsedMessage = whatsapp.parseWebhook(req);

  if (parsedMessage) {
    console.log(`📨 From: ${parsedMessage.contact.name}`);
    console.log(`📝 Message: ${parsedMessage.text}`);

    // Handle message (same as Baileys)
    handleMessage(parsedMessage);

    // Send response
    whatsapp.sendMessage(
      parsedMessage.from,
      `✅ مرحبا ${parsedMessage.contact.name}\n\nتم استقبال رسالتك!`
    );
  }

  res.status(200).send({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 WhatsApp Bot running on port ${PORT}`);
  console.log(`✅ No QR needed - Using Cloud API`);
});
```

---

## Deployment Checklist

### For Baileys + Sessions File

- [ ] Authenticate bot locally
- [ ] Save sessions folder
- [ ] Encode as base64
- [ ] Add to GitHub Secrets
- [ ] Update Dockerfile to restore
- [ ] Test in container
- [ ] Deploy

### For WhatsApp Cloud API

- [ ] Create Meta Business Account
- [ ] Get WhatsApp Business Account ID
- [ ] Create system user & access token
- [ ] Verify phone number
- [ ] Add phone to business account
- [ ] Update code to use Cloud API
- [ ] Set webhook URL
- [ ] Set webhook token
- [ ] Deploy to cloud
- [ ] Test message receipt

---

## Testing Before Deployment

### Local Test

```bash
# Run bot
npm start

# Send message from phone
# Bot should respond
```

### Container Test

```bash
# With sessions restored
docker-compose up

# Should NOT show QR code
# Should show: "✅ Bot connected"
```

### Cloud Test

```bash
# Test webhook
curl -X POST http://localhost:3000/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "1234567890",
            "text": { "body": "test" }
          }],
          "contacts": [{
            "profile": { "name": "Test" }
          }]
        }
      }]
    }]
  }'
```

---

## Final Decision

**For Production (Cloud Deployment):**
→ Use **WhatsApp Cloud API**

**For Development/Testing:**
→ Use **Baileys + Pre-saved Sessions**

**For Quick Setup:**
→ Run locally, save sessions, deploy with base64 encoding

---

**Choose one approach and implement it. Do NOT deploy without solving the QR auth problem!**
