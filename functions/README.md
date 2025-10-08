# Cloudflare Pages Functions - Contact Form

## What This Does

The `/api/contact` endpoint handles contact form submissions from your website and sends emails to your sales team.

## Current Status

✅ **Function created** - Ready to deploy
⏳ **Email sending** - Needs configuration (see below)

## How It Works

1. User fills out contact form on `contact-figma.html`
2. Form submits to `/api/contact`
3. Cloudflare Pages Function validates the data
4. Email is sent to your sales team
5. User is redirected back with success message

## Email Setup Options

### Option 1: MailChannels (Recommended - Free)

MailChannels is free for Cloudflare users and requires no additional setup.

**Steps:**
1. The code is already in `functions/api/contact.js` (commented out)
2. Just uncomment the MailChannels section (lines 56-80)
3. Update the email addresses:
   - **TO**: Change `sales@retailaer.com` to your actual email
   - **FROM**: Use `noreply@retailaer.us` (your Cloudflare Pages domain)

**Uncomment this section:**
```javascript
const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
  // ... rest of code
});
```

### Option 2: SendGrid, Postmark, etc.

If you prefer another email service:

1. Sign up for the service
2. Get API key
3. Add API key to Cloudflare Pages environment variables
4. Update the fetch call in `contact.js`

### Option 3: Cloudflare Email Workers

Use Cloudflare's Email Workers (requires paid plan):

1. Set up Email Workers in Cloudflare dashboard
2. Update `contact.js` to use Email Workers API

## Environment Variables

To add environment variables (like API keys):

1. Go to Cloudflare Dashboard
2. Pages → Your Project → Settings → Environment Variables
3. Add variables:
   - `SENDGRID_API_KEY` (if using SendGrid)
   - `POSTMARK_API_KEY` (if using Postmark)
   - etc.

Access in code:
```javascript
const apiKey = context.env.SENDGRID_API_KEY;
```

## Testing

### Local Testing
```bash
# Install Wrangler if needed
npm install -g wrangler

# Run locally
wrangler pages dev .
```

Then visit: `http://localhost:8788/contact-figma.html`

### Production Testing

1. Deploy to Cloudflare Pages
2. Visit your contact page
3. Submit a test form
4. Check your email inbox

## Deployment

The function deploys automatically with your site when you push to Git:

```bash
git add functions/
git commit -m "Add contact form handler"
git push
```

Cloudflare Pages will automatically detect the `functions/` folder and deploy it.

## Customize Email Template

Edit `functions/api/contact.js` to change the email content:

```javascript
const emailContent = `
Your custom email template here...

Name: ${name}
Email: ${email}
...
`;
```

## Security Features

✅ **CSRF Protection** - Form must come from your domain
✅ **Email Validation** - Checks valid email format
✅ **Required Fields** - Validates name, email, company
✅ **Rate Limiting** - Cloudflare automatically rate limits
✅ **Spam Protection** - Cloudflare Bot Management (if enabled)

## Troubleshooting

### Form not submitting
- Check browser console for errors
- Verify `/api/contact` endpoint is accessible
- Check Cloudflare Pages Functions logs

### Emails not arriving
- Check spam folder
- Verify email addresses are correct
- Check MailChannels code is uncommented
- View function logs in Cloudflare dashboard

### Success message not showing
- Check URL has `?success=true` parameter
- Verify JavaScript is loading

## File Structure

```
functions/
├── api/
│   └── contact.js       # Contact form handler
└── README.md            # This file
```

## Next Steps

1. ✅ Function is created
2. ⏳ Choose email option (MailChannels recommended)
3. ⏳ Update email addresses in `contact.js`
4. ⏳ Uncomment email sending code
5. ⏳ Test locally with `wrangler pages dev`
6. ⏳ Deploy and test in production

## Quick Start (MailChannels)

1. Open `functions/api/contact.js`
2. Find line ~56 (the comment `// Uncomment and configure when ready:`)
3. Uncomment lines 56-80
4. Change `sales@retailaer.com` to your email
5. Deploy:
   ```bash
   git add .
   git commit -m "Enable contact form emails"
   git push
   ```

Done! Your contact form will now send emails.

---

**Documentation**: https://developers.cloudflare.com/pages/functions/
**MailChannels**: https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/
