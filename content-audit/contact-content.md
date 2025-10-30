# Retailaer.com Contact Page Content Audit

**Extracted Date:** 2025-10-15
**Source:** https://retailaer.com/getintouch.html

---

## Meta Information

**Page Title:** Retailaer
**Meta Description:** Retailaer

**Note:** Generic meta tags - should be more specific for SEO

---

## Page Headline

**Main Headline:** Let's Talk Modern Airline Distribution and Retail

**Intro Text:**
If you would like to arrange a meeting with us or have a question about our services, please complete the form or send us an email and we will be in touch with you shortly.

---

## Contact Information

### Address:
12-16 Addiscombe Road
Croydon, CR0 0XT
England

### Email:
info@retailaer.com

---

## Contact Form Fields

1. **Name** (text input)
   - Placeholder: "Name"
   - Required field

2. **Email** (text input)
   - Placeholder: "Email"
   - Required field

3. **Subject** (text input)
   - Placeholder: "Subject"
   - Required field

4. **Message** (textarea)
   - Placeholder: "Message"
   - Required field

5. **CAPTCHA** (text input + image)
   - Placeholder: "Type the word"
   - Image: captcha word verification
   - Required field for spam prevention

**Submit Button:** "Submit" (green button)

---

## Form Backend

**Technology:** Quform (PHP form processing)
- Action: quform/process.php
- Method: POST
- Uses jQuery 3.5.1
- Has loading indicator during submission

---

## Privacy Notice

**Text:** Retailaer is committed to protecting and respecting your privacy, and we'll only use your personal information to connect with you.

---

## Content Notes & Issues

### Observations:
- Simple, clean contact form
- Only one email address provided (info@retailaer.com)
- Physical address in UK (Croydon, England)
- CAPTCHA for spam protection (image-based)
- Privacy statement included
- No phone number provided
- No social media links
- No live chat option
- No response time indication

### Technical Notes:
- Uses Quform (commercial form builder)
- Requires PHP backend (won't work on Cloudflare Pages without modification)
- jQuery dependency for form validation and submission
- Captcha image stored locally (quform/images/captcha/)

---

## Recommendations for Contact-Figma.html

### Keep:
- Main headline and intro text
- Physical address
- Email address
- Privacy statement
- Form fields (Name, Email, Subject, Message)

### Update/Change:
1. **Replace Quform with Cloudflare Function**
   - Use functions/api/contact.js (already created)
   - Modern, serverless approach
   - No PHP dependency

2. **Replace Image CAPTCHA with Modern Solution**
   - Use Cloudflare Turnstile (free, privacy-friendly)
   - Or use honeypot field (invisible spam protection)
   - Better UX than image captcha

3. **Add Response Time Info**
   - "We typically respond within 24 hours"
   - Or "Usually replies within 1 business day"

4. **Consider Adding:**
   - Demo booking option (separate CTA)
   - Sales vs. Support email distinction
   - Social media links (LinkedIn, Twitter)
   - Optional: Phone number or meeting scheduler link

5. **Update Address if Needed**
   - Verify current company address
   - Add multiple offices if applicable

### Suggested New Content:

**Alternative CTAs:**
- "Book a Demo" button (primary CTA)
- "General Inquiry" (standard form)
- "Support Request" (if applicable)

**Contact Methods:**
- Email: info@retailaer.com
- Sales: sales@retailaer.com (optional)
- Support: support@retailaer.com (optional)

**Social Media:**
- LinkedIn: [company profile URL]
- Twitter: [if applicable]

---

## Content Mapping for Figma Design

Map to contact-figma.html:
1. Headline → Use exact text
2. Intro → Use exact text with minor refinements
3. Contact info → Update email(s) and verify address
4. Form fields → Same structure, new backend (Cloudflare Function)
5. CAPTCHA → Replace with Turnstile or honeypot
6. Privacy statement → Keep and possibly expand
7. Add: Response time indication
8. Add: Demo booking CTA option

---

## Form Configuration for Cloudflare Pages

The existing `functions/api/contact.js` needs:
1. Uncomment MailChannels integration code
2. Update recipient email address
3. Configure CORS settings
4. Test submission handling
5. Add success/error message UI

