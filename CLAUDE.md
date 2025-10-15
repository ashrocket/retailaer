# RetailAer Website - Project Guide

**Last Updated:** 2025-10-14
**Status:** Phase 3 - Figma Design Complete, Ready for Production

---

## Project Overview

**Goal:** Redesign and rebuild the RetailAer marketing website with a modern, professional appearance suitable for a B2B SaaS provider in the airline retailing industry.

**Approach:** Figma-based design implemented in vanilla HTML/CSS/JS with Cloudflare Pages deployment.

---

## Sites

- **Production:** https://retailaer.com (content source for reference)
- **Staging:** https://retailaer.us (auto-deploys from main branch)
- **Dev Pages:** https://retailaer.pages.dev

---

## Business Context

### Company Profile
- **Name:** RetailAer
- **Industry:** Airline technology / Travel tech B2B SaaS
- **Product:** Customer-first Offer and Order Management solution for airlines
- **Target Audience:** Airlines, airline executives, travel tech partners

### Key Metrics
- 12 years in business
- 5M+ orders processed
- 300+ capabilities

### Value Proposition
"Empowering modern airline retailing with the world's only customer-first Offer and Order Management solution."

---

## Current Project Structure

### New Figma Design (Ready to Deploy)
Located in `designs/figma/`:
- `index-figma.html` - Homepage
- `solutions-figma.html` - Solutions page
- `company-figma.html` - Company/about page
- `insights-figma.html` - Insights/blog listing
- `contact-figma.html` - Contact page with form

### Assets
- `css/figma-styles.css` - Complete responsive stylesheet
- `css/figma-scripts.js` - Interactive features (mobile menu, animations)
- `assets/` - Images, icons, SVGs
- `functions/api/contact.js` - Cloudflare Function for contact form

### Current Live Pages (Old Design)
Root-level HTML files:
- `index.html`, `solutions.html`, `company.html`, `insights.html`, `contact.html`

### Reference Materials
- `jadoo-design/` - Bootstrap template reference
- `designs/` - Design assets, screenshots, reference images

---

## Design System

### Colors
- **Primary:** `#0a5c5c` (Deep teal - trust, travel tech)
- **Accent:** `#f5b800` (Bright yellow - CTAs, highlights)
- **Backgrounds:** White, `#f0f7f7` (Light teal)
- **Text:** `#0a1f1f` (Dark), `#5a7a7a` (Body text)

### Typography
- **Font:** Inter (Google Fonts)
- **Base Size:** 16px minimum
- **Scale:** 14px - 60px responsive
- **Weights:** Regular (400), Medium (500)

### Layout
- **Spacing:** 8px grid system
- **Breakpoints:**
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Grid:** Responsive (1/2/3 columns based on breakpoint)

---

## Implementation Status

### ✅ Completed (Phase 1-2)
- [x] Discovery and planning
- [x] Design strategy documented
- [x] Figma designs created
- [x] All 5 pages implemented in HTML/CSS/JS
- [x] Responsive design (mobile/tablet/desktop)
- [x] Interactive features (mobile menu, animations)
- [x] Contact form with Cloudflare Function
- [x] Accessibility features (WCAG 2.1 AA)

### 🔄 Current Phase (Phase 3)
- [ ] Test Figma pages on all devices
- [ ] Configure contact form email endpoint
- [ ] Update email addresses
- [ ] Final content review
- [ ] Cross-browser testing
- [ ] Performance optimization

### ⏳ Next Phase (Phase 4 - Production)
- [ ] Deploy Figma design as main site
- [ ] Point retailaer.com to new design
- [ ] Monitor performance
- [ ] Gather feedback

---

## Features

### Responsive Design
- Mobile-first approach
- Hamburger menu on mobile
- Adaptive grid layouts
- Touch-optimized interactions

### Accessibility
- Semantic HTML5
- ARIA labels for interactive elements
- Keyboard navigation
- High contrast colors (WCAG AA)
- Respects `prefers-reduced-motion`

### Performance
- No build process
- Minimal dependencies (Google Fonts only)
- ~50KB total (HTML+CSS+JS)
- Target: Lighthouse 90+ scores

### Interactive Features
- Sticky navigation
- Smooth scroll
- Scroll-triggered animations
- Hover effects
- Form validation

---

## Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Fonts:** Google Fonts (Inter)
- **Hosting:** Cloudflare Pages
- **Functions:** Cloudflare Functions (contact form)
- **Deployment:** Auto-deploy from GitHub main branch
- **Version Control:** Git/GitHub

---

## Deployment

### Current Setup
- **Repository:** GitHub (main branch)
- **Hosting:** Cloudflare Pages
- **Domain:** retailaer.us (staging)
- **Auto-deploy:** Push to main = instant deploy
- **Configuration:** `wrangler.toml`

### Deploy New Design

**Test Current Figma Design:**
Visit: https://retailaer.us/designs/figma/index-figma.html

**Replace Current Site:**
```bash
# Copy Figma files to root
cp designs/figma/*.html .

# Rename (remove -figma suffix)
for file in *-figma.html; do mv "$file" "${file/-figma/}"; done

# Commit and push
git add .
git commit -m "Launch new Figma-based website"
git push
```

### Contact Form Setup

1. Edit `functions/api/contact.js`
2. Uncomment MailChannels code (lines 56-80)
3. Update email address to yours
4. Push changes

See [DEPLOY.md](DEPLOY.md) for full details.

---

## File Organization

```
retailaer/
├── designs/
│   └── figma/              # New Figma design pages
│       ├── index-figma.html
│       ├── solutions-figma.html
│       ├── company-figma.html
│       ├── insights-figma.html
│       └── contact-figma.html
├── css/
│   ├── figma-styles.css    # Main stylesheet
│   └── figma-scripts.js    # Interactive JS
├── assets/                 # Images, icons, SVGs
├── functions/
│   └── api/
│       └── contact.js      # Contact form handler
├── jadoo-design/           # Reference template
├── index.html              # Current live homepage
├── solutions.html          # Current live pages
├── company.html
├── insights.html
├── contact.html
├── README.md               # Quick start guide
├── CLAUDE.md               # This file - project context
├── DEPLOY.md               # Deployment instructions
└── wrangler.toml           # Cloudflare config
```

---

## Pages Overview

### 1. Homepage (`index-figma.html`)
- Hero section with value proposition
- Stats bar (12 years, 5M orders, 300 capabilities)
- 9 benefits grid
- How it works (3 steps)
- Insights preview
- CTA section
- Footer

### 2. Solutions (`solutions-figma.html`)
- Platform overview
- Airlines solutions
- Travel brands solutions
- Integration information
- CTA

### 3. Company (`company-figma.html`)
- About RetailAer
- Mission and values
- Key stats
- Team/contact CTA

### 4. Insights (`insights-figma.html`)
- Blog/article listing (6 cards)
- Newsletter signup
- Categories/topics

### 5. Contact (`contact-figma.html`)
- Contact form (Cloudflare Function)
- Email addresses
- Response time info
- CTA

---

## Content Strategy

### Core Features/Benefits (from retailaer.com)
1. Enhance Customer Loyalty
2. Personalized Experiences
3. Drive Repeat Business
4. Higher Conversion Rates
5. Boost Ancillary Sales
6. Streamlined Processes
7. Reduced Dependencies
8. Stay Ahead of Competition
9. Positive Reputation

### CTAs
- "Book a Demo"
- "Get In Touch"
- "Learn More"
- "See How It Works"

### Navigation
- Solutions
- Company
- Insights
- Contact

---

## Development Workflow

### Making Changes

**Edit Figma design pages:**
```bash
code designs/figma/index-figma.html
```

**Edit styles:**
```bash
code css/figma-styles.css
```

**Edit scripts:**
```bash
code css/figma-scripts.js
```

**Test locally:**
```bash
# Option 1: Direct file
open designs/figma/index-figma.html

# Option 2: Local server
python3 -m http.server 8000
# Visit: http://localhost:8000/designs/figma/index-figma.html
```

**Deploy:**
```bash
git add .
git commit -m "Description of changes"
git push  # Auto-deploys to retailaer.us
```

---

## Cloudflare Integration

### Pages Configuration
- Auto-deploy on push to main
- No build command needed
- Output directory: root

### Functions
- Contact form: `functions/api/contact.js`
- Uses MailChannels for email (free for Cloudflare)
- Environment variables not needed (for MailChannels)

### Custom Domains
Current: retailaer.us
To add: retailaer.com (via Cloudflare Dashboard)

---

## Pre-Launch Checklist

### Testing
- [ ] All pages load on desktop
- [ ] All pages load on tablet
- [ ] All pages load on mobile
- [ ] Navigation works between pages
- [ ] Mobile menu toggles correctly
- [ ] Contact form submits (when configured)
- [ ] All links work
- [ ] Images load
- [ ] Animations smooth
- [ ] No console errors

### Configuration
- [ ] Contact form email endpoint set up
- [ ] Email addresses updated in contact page
- [ ] Google Analytics added (optional)
- [ ] Social media links updated
- [ ] Meta tags for SEO/social sharing

### Performance
- [ ] Lighthouse audit run (target: 90+)
- [ ] Mobile performance tested
- [ ] Images optimized
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Content
- [ ] All copy proofread
- [ ] All placeholder content replaced
- [ ] Legal pages added if needed (Privacy, Terms)

---

## Success Metrics

### Design Quality
- Modern, professional appearance
- Consistent branding
- High contrast and accessibility (WCAG AA)
- Clear visual hierarchy

### Performance
- Lighthouse score: 90+ (all categories)
- Page load time: <2 seconds
- Optimized images
- Minimal JavaScript

### User Experience
- Clear navigation
- Mobile-friendly
- Fast interactions
- Working forms
- No broken links

### Business Goals
- Clear value proposition
- Strong CTAs
- Trust signals (metrics, testimonials)
- Easy path to demo booking

---

## Next Steps

### Immediate
1. Test all Figma pages at https://retailaer.us/designs/figma/
2. Configure contact form email (see DEPLOY.md)
3. Update email addresses in contact page
4. Review all content
5. Run performance tests

### Before Production Launch
1. Cross-browser testing
2. Mobile device testing
3. Lighthouse audit
4. Final content review
5. Set up analytics (optional)
6. Replace current site with Figma design

### After Launch
1. Monitor analytics
2. Gather user feedback
3. Add real blog posts to Insights
4. Consider A/B testing CTAs
5. Iterate based on performance

---

## Tools & Utilities

### Available Commands (via .claude.access)
- Git operations (status, diff, log, add, commit, push)
- File operations (ls, cat, grep)
- Wrangler commands (deploy, status, logs)
- npm/build commands
- Python server for local testing

### Wrangler CLI
```bash
# List projects
wrangler pages project list

# List deployments
wrangler pages deployment list

# View logs
wrangler pages deployment tail
```

---

## Reference Materials

### External Resources
- Production site: https://retailaer.com
- Staging site: https://retailaer.us
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

### Internal Docs
- [README.md](README.md) - Quick start guide
- [DEPLOY.md](DEPLOY.md) - Deployment instructions
- `designs/` - Design assets and references

---

## Notes

- No build process required (vanilla HTML/CSS/JS)
- Google Fonts loaded from CDN (can self-host for performance)
- Icons are inline SVG (can replace with icon font or sprite)
- All animations respect `prefers-reduced-motion`
- Contact form uses Cloudflare Functions (free tier)
- MailChannels email service free for Cloudflare users

---

## Questions for Client

1. **Contact form**: Confirm email address for submissions
2. **Analytics**: Should we add Google Analytics?
3. **Social media**: Provide LinkedIn/Twitter URLs for footer
4. **Blog**: How often will Insights be updated? Need CMS?
5. **Legal pages**: Need Privacy Policy, Terms of Service?
6. **Domain**: When to switch retailaer.com to new design?

---

**Version:** 2.0 (Figma Design)
**Last Updated:** 2025-10-14
**Status:** Ready for production deployment
