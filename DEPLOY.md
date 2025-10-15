# Deployment Guide - Retailaer Website

## Quick Deploy ⚡

Your website is ready to deploy! Here's how:

### Step 1: Enable Contact Form Emails

**Option A: Use MailChannels (Recommended - Free)**

1. Open `functions/api/contact.js`
2. Find line 56 (comment: `// Uncomment and configure when ready:`)
3. Uncomment lines 56-80 (remove `/*` and `*/`)
4. Change `sales@retailaer.com` to your actual email address
5. Save the file

**Option B: Skip for now**
- Contact form will work but won't send emails
- You can add this later

### Step 2: Commit and Deploy

```bash
# Add all files
git add .

# Commit
git commit -m "Launch new Retailaer website with contact form"

# Push to deploy (Cloudflare Pages auto-deploys)
git push
```

That's it! Your site will deploy automatically to `retailaer.us`

## What Gets Deployed

✅ **5 Pages**: Homepage, Solutions, Company, Insights, Contact
✅ **Contact Form**: Working form with Cloudflare Function
✅ **Responsive Design**: Mobile, tablet, desktop
✅ **Fast Performance**: No build step, pure HTML/CSS/JS

## After Deployment

### Test Your Site

1. Visit: `https://retailaer.us/index-figma.html`
2. Test navigation between pages
3. Try the contact form
4. Check mobile responsive (resize browser)

### Monitor Deployment

Check status:
```bash
# View recent deployments
git log --oneline -5

# Or check Cloudflare Dashboard
# → Pages → retailaer → Deployments
```

### View Function Logs

1. Go to Cloudflare Dashboard
2. Pages → retailaer
3. Functions → Logs
4. See contact form submissions

## Replace Current Site (Optional)

When ready to make this your main site:

```bash
# Backup old files
mv index.html index-old.html
mv solutions.html solutions-old.html
mv company.html company-old.html
mv insights.html insights-old.html
mv contact.html contact-old.html

# Rename new files
mv index-figma.html index.html
mv solutions-figma.html solutions.html
mv company-figma.html company.html
mv insights-figma.html insights.html
mv contact-figma.html contact.html

# Commit and deploy
git add .
git commit -m "Switch to new website as primary"
git push
```

Now your site will be at: `https://retailaer.us/index.html`

## Custom Domain Setup

To use `retailaer.com` instead of `retailaer.us`:

1. Cloudflare Dashboard → Pages → retailaer
2. Custom Domains → Set up a custom domain
3. Add `retailaer.com`
4. Update DNS (Cloudflare will guide you)

## Email Configuration Details

### Using MailChannels (Free)

**Pros:**
- ✅ Free for Cloudflare users
- ✅ No signup required
- ✅ Already integrated in code

**Cons:**
- ⚠️ Must use Cloudflare Pages domain as sender
- ⚠️ Limited to 1000 emails/day (more than enough)

**Code to uncomment in `functions/api/contact.js`:**
```javascript
const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    personalizations: [{
      to: [{ email: 'YOUR-EMAIL@retailaer.com', name: 'Retailaer Sales' }],
      reply_to: { email: email, name: name }
    }],
    from: {
      email: 'noreply@retailaer.us',
      name: 'Retailaer Contact Form'
    },
    subject: `New Contact Form: ${name} from ${company}`,
    content: [{
      type: 'text/plain',
      value: emailContent
    }]
  })
});
```

### Using SendGrid (Alternative)

1. Sign up at sendgrid.com
2. Get API key
3. Add to Cloudflare Pages environment variables
4. Update `contact.js` with SendGrid API

## Troubleshooting

### Site not updating after push?

**Clear Cloudflare cache:**
```bash
# In Cloudflare Dashboard:
# Caching → Configuration → Purge Everything
```

### Contact form not working?

**Check:**
1. Functions folder deployed? (check Cloudflare Pages logs)
2. Email code uncommented in `contact.js`?
3. Email address updated?
4. Check browser console for errors

### Mobile menu not working?

**Verify:**
1. `css/figma-scripts.js` is loading
2. No JavaScript errors in console
3. Clear browser cache

## Performance Checklist

After deployment, test:

- [ ] Lighthouse score (should be 90+)
- [ ] Mobile responsiveness
- [ ] Contact form submission
- [ ] All navigation links work
- [ ] Images load correctly
- [ ] No broken links

## Support

### Cloudflare Pages Docs
https://developers.cloudflare.com/pages/

### Contact Form Function
See `functions/README.md`

### Website Build Details
See `FIGMA-BUILD.md` and `SITE-COMPLETE.md`

---

## Summary

**To Deploy:**
```bash
git add .
git commit -m "Launch new website"
git push
```

**To Enable Emails:**
1. Edit `functions/api/contact.js`
2. Uncomment MailChannels code (lines 56-80)
3. Update email address
4. Push changes

**Your site will be live at:**
- https://retailaer.us/index-figma.html (new design)
- https://retailaer.us/index.html (old design - until renamed)

🚀 **Ready to deploy!**
