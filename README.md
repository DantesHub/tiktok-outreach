# TikTok UGC Creator Outreach Automation

Screenshot a TikTok creator's profile → share it via an Apple Shortcut → an email is sent to them automatically.

## How It Works

1. You screenshot a creator's TikTok profile (that has their email in the bio)
2. Tap the screenshot preview → Share → **Outreach Creator**
3. The shortcut sends the image to your server
4. GPT-4o Vision extracts the creator's **name** and **email** from the screenshot
5. A personalized outreach email is sent via Gmail
6. You get a notification confirming it was sent

## Architecture

```
Apple Shortcut → Bun/Hono Server (Railway) → GPT-4o Vision → Gmail SMTP
```

## Project Structure

```
src/
  index.ts       — Hono server with /health and /outreach endpoints
  extract.ts     — GPT-4o Vision: extracts email + first name from screenshot
  email.ts       — Nodemailer Gmail SMTP transport
  template.ts    — Email subject + body template
```

## Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | GPT-4o API key |
| `GMAIL_USER` | Gmail address to send from |
| `GMAIL_APP_PASSWORD` | Gmail app password ([generate here](https://myaccount.google.com/apppasswords)) |
| `API_AUTH_TOKEN` | Random secret string to secure the endpoint |
| `PORT` | Server port (default: 3000, Railway sets automatically) |

### 3. Run locally

```bash
bun run dev
```

### 4. Test with curl

```bash
base64 -i screenshot.png | tr -d '\n' > /tmp/b64.txt
curl -X POST http://localhost:3000/outreach \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"image\": \"$(cat /tmp/b64.txt)\"}"
```

## Deploy to Railway

1. Push to GitHub
2. Connect the repo on [Railway](https://railway.app)
3. Set the environment variables above
4. Start command: `bun run src/index.ts`

## Apple Shortcut Setup

1. Create a new shortcut called **Outreach Creator**
2. Set it to receive **Images** from the **Share Sheet**
3. Add **Base64 Encode** → encode **Shortcut Input**
4. Add **URL** → your Railway URL with `/outreach` at the end
5. Add **Get Contents of URL**:
   - Method: **POST**
   - Headers: `Authorization: Bearer YOUR_TOKEN`, `Content-Type: application/json`
   - Body (JSON): key `image`, value = the Base64 Encoded result
6. Add **Get Dictionary Value** → key `firstName` from Contents of URL
7. Add **Show Notification** → `Emailed [Dictionary Value]`
