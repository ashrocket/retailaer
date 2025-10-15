# Retailaer Website

Modern, responsive marketing website for Retailaer - the world's first customer-centric Offer and Order Management solution for airlines.

## 🚀 Quick Start

### View Locally
```bash
# Open homepage in your browser
open index.html

# Or use a local server
python3 -m http.server 8000
# Visit: http://localhost:8000/
```

### Deploy
```bash
# Commits to main auto-deploy to Cloudflare Pages
git add .
git commit -m "Update website"
git push
```

**Live Sites:**
- **Staging:** https://retailaer.us
- **Production:** https://retailaer.com

---

## 📁 Project Structure

```
retailaer/
├── index.html              # Homepage
├── solutions.html          # Solutions page
├── company.html            # Company page
├── insights.html           # Insights/blog page
├── contact.html            # Contact page
├── css/
│   ├── design-system.css   # Design tokens
│   ├── homepage.css        # Homepage styles
│   ├── figma-styles.css    # Main stylesheet
│   └── figma-scripts.js    # Interactive features
├── functions/              # Cloudflare Functions (contact form)
├── designs/                # Design references
├── tools/                  # Utility scripts
├── CLAUDE.md               # Project documentation
└── DEPLOY.md               # Deployment guide
```

---

## 🎨 Design System

### Colors
- **Primary:** `#0a5c5c` (Deep teal)
- **Accent:** `#f5b800` (Bright yellow)
- **Background:** White, `#f0f7f7` (Light teal)
- **Text:** `#0a1f1f` (Dark), `#5a7a7a` (Body)

### Typography
- **Font:** Inter (Google Fonts)
- **Sizes:** 14px - 60px responsive scale
- **Weights:** Regular (400), Medium (500)

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🛠️ Tech Stack

- **HTML/CSS/JS** - Pure vanilla, no build process
- **Cloudflare Pages** - Auto-deployment from GitHub
- **Cloudflare Functions** - Contact form backend
- **Google Fonts** - Inter typeface

---

## 📄 Pages

1. **Homepage** (`index.html`) - Hero, stats, benefits, insights
2. **Solutions** (`solutions.html`) - Airlines & travel brands offerings
3. **Company** (`company.html`) - Mission, values, team
4. **Insights** (`insights.html`) - Blog/articles listing
5. **Contact** (`contact.html`) - Form with Cloudflare Function

---

## 🚢 Deployment

### Current Setup
- **Repository:** GitHub (main branch)
- **Hosting:** Cloudflare Pages
- **Domain:** retailaer.us (staging)
- **Auto-deploy:** Push to main = instant deploy

### Deploy Updates

```bash
# Edit files, then commit and push
git add .
git commit -m "Update website"
git push  # Auto-deploys to retailaer.us
```

### Contact Form Setup

Edit `functions/api/contact.js`:
1. Uncomment MailChannels code (lines 56-80)
2. Update email address to yours
3. Push to deploy

See [DEPLOY.md](DEPLOY.md) for details.

---

## ✅ Features

### Responsive Design
- Mobile-first approach
- Hamburger menu on mobile
- Grid layouts adapt to screen size
- Touch-optimized interactions

### Accessibility
- Semantic HTML5
- ARIA labels
- Keyboard navigation
- WCAG 2.1 AA color contrast
- Respects `prefers-reduced-motion`

### Performance
- No dependencies (except Google Fonts)
- ~50KB total (HTML+CSS+JS)
- Fast load times (<2s)
- Optimized for Lighthouse 90+ scores

### Interactive Features
- Smooth scroll navigation
- Scroll-triggered animations
- Hover effects
- Form validation
- Mobile menu toggle

---

## 🔧 Development

### Making Changes

**Edit pages:**
```bash
code index.html
code solutions.html
# etc...
```

**Edit styles:**
```bash
code css/figma-styles.css
code css/design-system.css
```

**Edit scripts:**
```bash
code css/figma-scripts.js
```

**Test locally, then deploy:**
```bash
git add .
git commit -m "Description of changes"
git push  # Auto-deploys to retailaer.us
```

---

## 📊 Business Context

**Company:** Retailaer
**Industry:** Airline Technology / Travel Tech B2B SaaS
**Product:** Customer-first Offer and Order Management for airlines

**Key Metrics:**
- 12 years in business
- 5M+ orders processed
- 300+ capabilities

**Value Proposition:**
"Empowering modern airline retailing with the world's only customer-first Offer and Order Management solution."

---

## 📝 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Complete project context and instructions
- **[DEPLOY.md](DEPLOY.md)** - Deployment and configuration guide
- **[designs/](designs/)** - Design assets and references

---

## 📞 Support

**Staging Site:** https://retailaer.us
**Production Site:** https://retailaer.com
**Contact:** sales@retailaer.com

---

**Last Updated:** 2025-10-14
**Version:** 1.0 (Production)
**Status:** ✅ Live
