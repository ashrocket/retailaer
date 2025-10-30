# Retailaer Website Content Migration Plan

**Created:** 2025-10-15
**Status:** Step 1 Complete ✅
**Goal:** Migrate content from retailaer.com to the new Figma-based design on retailaer.us

---

## Overview

This document outlines the complete plan to extract content from the production site (retailaer.com) and populate the new Figma-based design files in `designs/figma/` before deploying to retailaer.us.

---

## Step 1: Audit Current Content on retailaer.com ✅ COMPLETE

### 1.1 Homepage Content Extraction ✅
- [x] Fetch retailaer.com homepage
- [x] Extract hero section (headline, subheadline, CTA text)
- [x] Extract key stats/metrics (years in business, orders processed, capabilities)
- [x] Extract all benefit/feature cards (titles, descriptions, icons/images)
- [x] Extract "How It Works" or process steps section
- [x] Extract testimonials or social proof (if any)
- [x] Extract footer content (copyright, links, contact info)
- [x] Document in: `content-audit/homepage-content.md`

### 1.2 Solutions Page Content Extraction ✅
- [x] Fetch retailaer.com/solutions.html
- [x] Extract main solutions/product descriptions
- [x] Extract feature lists and capabilities
- [x] Extract use cases or customer scenarios
- [x] Extract integration information
- [x] Extract comparison table
- [x] Extract any solution-specific CTAs
- [x] Document in: `content-audit/solutions-content.md`

### 1.3 Company/About Page Content Extraction ✅
- [x] Fetch retailaer.com/company.html
- [x] Extract company mission/vision statements
- [x] Extract company history and background
- [x] Extract team information (if displayed)
- [x] Extract core values or principles
- [x] Extract any certifications, partnerships, or credentials
- [x] Document in: `content-audit/company-content.md`

### 1.4 Insights/Blog Content Extraction ✅
- [x] Fetch retailaer.com/insights.html
- [x] Analyze current status (placeholder page)
- [x] Document blog structure needs
- [x] Create recommendations for blog posts
- [x] Document in: `content-audit/insights-content.md`

### 1.5 Contact Information Extraction ✅
- [x] Fetch retailaer.com/getintouch.html
- [x] Extract all email addresses
- [x] Extract phone numbers (if any)
- [x] Extract physical address
- [x] Extract form fields and structure
- [x] Extract privacy statement
- [x] Document technical requirements (Quform → Cloudflare Function)
- [x] Document in: `content-audit/contact-content.md`

### 1.6 Global Elements Extraction ✅
- [x] Extract navigation menu structure and labels
- [x] Extract all CTA button text variations
- [x] Extract any recurring taglines or value props
- [x] Extract meta descriptions and SEO content
- [x] Extract footer elements
- [x] Extract icon system references
- [x] Document in: `content-audit/global-elements.md`

### 1.7 Documentation ✅
- [x] Create structured documentation for all extracted content
- [x] Organize by page and section
- [x] Note character counts for key sections
- [x] Flag any outdated content that needs updating
- [x] Identify content gaps
- [x] Create comprehensive summary
- [x] Document in: `content-audit/COMPLETE-AUDIT-SUMMARY.md`

**Step 1 Status:** ✅ **COMPLETE** (2025-10-15)

---

## Step 2: Map Content to Figma Design Structure

### 2.1 Homepage Content Mapping
- [ ] Map hero section content to `designs/figma/index-figma.html`
- [ ] Map 9 benefit cards to benefits grid
- [ ] Map stats (12 years, 5M+, 300+) to stats bar
- [ ] Map services intro section
- [ ] Map bottom CTA section
- [ ] Identify any missing sections in Figma design
- [ ] Create content placement document

### 2.2 Solutions Page Content Mapping
- [ ] Map platform description to hero
- [ ] Map 4 core features to feature cards
- [ ] Map 9 distribution channels to channel grid
- [ ] Map 10+ platform capabilities to capabilities section
- [ ] Map comparison table to comparison section
- [ ] Map partner information (CTW Travel)
- [ ] Create content placement document

### 2.3 Company Page Content Mapping
- [ ] Map origin story to hero section
- [ ] Map 4 core focus areas to focus section
- [ ] Map team credentials and stats
- [ ] Map 4 core values to values section
- [ ] Create content placement document

### 2.4 Insights Page Content Mapping
- [ ] Create blog post structure (6 articles minimum)
- [ ] Map article titles, excerpts, dates
- [ ] Design category system
- [ ] Plan newsletter signup section
- [ ] Create placeholder blog posts with realistic content
- [ ] Create content placement document

### 2.5 Contact Page Content Mapping
- [ ] Map headline and intro text
- [ ] Map contact information (address, email)
- [ ] Map form fields
- [ ] Map privacy statement
- [ ] Plan Cloudflare Function integration
- [ ] Plan CAPTCHA replacement (Turnstile)
- [ ] Create content placement document

### 2.6 Global Elements Mapping
- [ ] Verify navigation structure matches
- [ ] Map all CTA variations
- [ ] Map footer content
- [ ] Plan SEO metadata for each page
- [ ] Document icon mapping
- [ ] Create global elements checklist

**Step 2 Status:** ⏳ **PENDING**

---

## Step 3: Update Figma Design HTML Files

### 3.1 Homepage Updates (`designs/figma/index-figma.html`)
- [ ] Replace placeholder hero text with actual content
- [ ] Update stats bar (12 years, 5M+ orders, 300+ capabilities)
- [ ] Populate 9 benefit cards with real descriptions
- [ ] Update services/intro section content
- [ ] Update bottom CTA section
- [ ] Fix typos: "customer-fist" → "customer-first"
- [ ] Fix typo: "Competetive" → "Competitive"
- [ ] Update copyright year: 2023 → 2025

### 3.2 Solutions Page Updates (`designs/figma/solutions-figma.html`)
- [ ] Replace hero content with platform description
- [ ] Populate 4 core feature cards
- [ ] Populate 9 distribution channel cards
- [ ] Populate 10+ platform capability cards
- [ ] Add comparison table content
- [ ] Add partner information (CTW Travel footnote)
- [ ] Fix typo: "Messege" → "Message"
- [ ] Fix typo: "cabilities" → "capabilities"
- [ ] Update copyright year: 2023 → 2025

### 3.3 Company Page Updates (`designs/figma/company-figma.html`)
- [ ] Replace hero with origin story
- [ ] Populate 4 core focus areas
- [ ] Add team credentials (10+ years, 25+ airlines)
- [ ] Populate 4 core values
- [ ] Fix grammar: "requires" → "require"
- [ ] Update copyright year: 2023 → 2025

### 3.4 Insights Page Updates (`designs/figma/insights-figma.html`)
- [ ] Create 6 blog post cards with:
  - Realistic titles
  - Excerpts/summaries
  - Dates
  - Categories
  - Read time estimates
- [ ] Add newsletter signup section
- [ ] Add category filter system
- [ ] Remove "under development" placeholder
- [ ] Update copyright year: 2023 → 2025

### 3.5 Contact Page Updates (`designs/figma/contact-figma.html`)
- [ ] Update headline and intro text
- [ ] Update address: 12-16 Addiscombe Road, Croydon, CR0 0XT, England
- [ ] Update email: info@retailaer.com
- [ ] Update form fields (Name, Email, Subject, Message)
- [ ] Update privacy statement
- [ ] Add response time information
- [ ] Plan form submission handling (Cloudflare Function)
- [ ] Update copyright year: 2023 → 2025

### 3.6 Global Elements Updates (All Pages)
- [ ] Update navigation across all pages
- [ ] Standardize CTA button text ("Get In Touch" vs "Get in touch")
- [ ] Update footer on all pages:
  - Copyright year: 2023 → 2025
  - Add contact email
  - Add social media links (when available)
- [ ] Update meta tags for each page:
  - Unique page titles
  - Unique meta descriptions
  - Proper OG tags
- [ ] Verify all internal links work

**Step 3 Status:** ⏳ **PENDING**

---

## Step 4: Verify and Refine

### 4.1 Content Review
- [ ] Proofread all content for typos and grammar
- [ ] Verify brand voice consistency
- [ ] Check all facts and statistics
- [ ] Verify all email addresses are correct
- [ ] Verify physical address is current
- [ ] Ensure all CTAs are clear and functional

### 4.2 Design/Layout Verification
- [ ] Check all content fits design layout properly (no overflow)
- [ ] Test responsive layout with real content:
  - Desktop (1920px, 1440px, 1280px)
  - Tablet (1024px, 768px)
  - Mobile (375px, 414px)
- [ ] Verify all images/icons display correctly
- [ ] Check typography hierarchy
- [ ] Verify color contrast (WCAG AA)

### 4.3 Link Validation
- [ ] Test all navigation links
- [ ] Test all CTA buttons
- [ ] Test all footer links
- [ ] Verify all email links (mailto:)
- [ ] Check for broken links or # placeholders

### 4.4 Functionality Testing
- [ ] Test mobile menu toggle
- [ ] Test contact form (when implemented):
  - Field validation
  - Required fields
  - Email format validation
  - Form submission
  - Success/error messages
- [ ] Test smooth scroll behavior
- [ ] Test any animations
- [ ] Verify accessibility features

### 4.5 SEO Verification
- [ ] Verify unique title tags on all pages
- [ ] Verify unique meta descriptions on all pages
- [ ] Check heading hierarchy (h1, h2, h3)
- [ ] Verify alt text for images
- [ ] Check canonical URLs
- [ ] Validate structured data (if implemented)

### 4.6 Performance Check
- [ ] Test page load times
- [ ] Check image optimization
- [ ] Verify minimal JavaScript
- [ ] Test on slow connection (3G simulation)
- [ ] Run Lighthouse audit (target: 90+ all categories)

### 4.7 Cross-Browser Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Check for console errors

**Step 4 Status:** ⏳ **PENDING**

---

## Step 5: Deploy to Staging

### 5.1 Pre-Deployment Checklist
- [ ] All content updated and verified
- [ ] All typos fixed
- [ ] All links tested
- [ ] Contact form configured
- [ ] Copyright year updated (2025)
- [ ] Meta tags updated
- [ ] Final proofreading complete

### 5.2 Deployment Process
- [ ] Commit changes to git
- [ ] Push to main branch (auto-deploys to retailaer.us)
- [ ] Monitor deployment logs
- [ ] Verify deployment success

### 5.3 Post-Deployment Testing
- [ ] Test all pages on live staging site (retailaer.us/designs/figma/)
- [ ] Verify contact form works with Cloudflare Function
- [ ] Test on multiple devices
- [ ] Test on multiple browsers
- [ ] Check for any broken links
- [ ] Verify images load correctly
- [ ] Check analytics tracking (if implemented)

**Step 5 Status:** ⏳ **PENDING**

---

## Step 6: Final Production Launch

### 6.1 Pre-Launch Review
- [ ] Client approval received
- [ ] All stakeholder feedback incorporated
- [ ] Final content review complete
- [ ] All testing passed
- [ ] Backup of current site created

### 6.2 Production Deployment
- [ ] Copy Figma files to root:
  ```bash
  cp designs/figma/*.html .
  ```
- [ ] Rename files (remove -figma suffix):
  ```bash
  for file in *-figma.html; do mv "$file" "${file/-figma/}"; done
  ```
- [ ] Update any relative paths if needed
- [ ] Commit and push to main:
  ```bash
  git add .
  git commit -m "Launch new Figma-based website design"
  git push
  ```

### 6.3 Post-Launch Monitoring
- [ ] Verify all pages load on retailaer.us
- [ ] Test contact form submissions
- [ ] Monitor for errors (check logs)
- [ ] Check analytics for traffic/behavior
- [ ] Gather user feedback
- [ ] Monitor performance metrics

### 6.4 Post-Launch Optimization
- [ ] Address any issues found
- [ ] Implement A/B testing (if planned)
- [ ] Add real blog posts over time
- [ ] Update content as needed
- [ ] Optimize based on analytics

**Step 6 Status:** ⏳ **PENDING**

---

## Content Issues to Fix (Priority Order)

### High Priority (Fix Before Launch):
1. ✅ "customer-fist" → "customer-first" (meta description)
2. ✅ "Competetive" → "Competitive" (homepage)
3. ✅ "Messege" → "Message" (solutions)
4. ✅ "cabilities" → "capabilities" (solutions)
5. ✅ "requires" → "require" (company - grammar)
6. [ ] Copyright year: 2023 → 2025 (all pages)
7. [ ] Privacy Policy: Create actual page (currently # link)

### Medium Priority (Fix During Population):
8. [ ] Page titles: Create unique titles for each page
9. [ ] Meta descriptions: Write unique descriptions for each page
10. [ ] CTA consistency: Standardize button text casing
11. [ ] Footer: Add contact email
12. [ ] Footer: Add social media links (when available)

### Low Priority (Post-Launch):
13. [ ] Add newsletter signup functionality
14. [ ] Add customer testimonials/case studies
15. [ ] Add team photos/profiles
16. [ ] Add customer logo bar
17. [ ] Implement structured data for SEO
18. [ ] Add real blog posts (6+ articles)

---

## Key Statistics to Use

### Company Metrics:
- **12 years** - Years in business / Years of creating
- **5M+** - Orders processed
- **300+** - Capabilities
- **20,000+** - Features
- **14+** - Product categories
- **10+ years** - Team experience
- **25+ airlines** - Worked with worldwide

### Use Consistently Across:
- Homepage hero stats bar
- Solutions page intro
- Company page credentials
- About sections

---

## Brand Messaging Guidelines

### Primary Tagline:
"The Customer-First Distribution Platform"

### Value Proposition:
"Empowering modern airline retailing with the world's only Customer-First Offer and Order Management solution."

### Key Differentiators:
1. Customer-first vs PNR-centric approach
2. Reduce PSS dependencies
3. NDC capable
4. Fast implementation (months, not years)
5. Flexible, adaptable, scalable

### Tone of Voice:
- Professional yet approachable
- Confident but not aggressive
- Customer-centric language
- Industry-specific terminology
- Benefits-focused
- Solution-oriented

### Common Phrases to Use:
- "Customer-First Approach"
- "Offer and Order Management"
- "Modern airline retailing"
- "Distribution platform"
- "Reduce PSS dependencies"
- "Dynamic bundling"
- "Personalized experiences"
- "Relevant offers"

---

## Technical Requirements

### Contact Form Migration:
- **Current:** Quform (PHP-based)
- **New:** Cloudflare Function (`functions/api/contact.js`)
- **Action Required:**
  1. Uncomment MailChannels code in contact.js
  2. Update recipient email address
  3. Configure CORS settings
  4. Test submission handling
  5. Add success/error message UI

### CAPTCHA Replacement:
- **Current:** Image-based CAPTCHA (Quform)
- **New:** Cloudflare Turnstile or honeypot field
- **Benefits:** Better UX, privacy-friendly, modern

### Dependencies:
- Google Fonts (Inter) - Already implemented
- No build process needed
- Minimal JavaScript
- Cloudflare Pages deployment

---

## Success Metrics

### Content Quality:
- [ ] All typos fixed
- [ ] Consistent brand voice
- [ ] Clear value propositions
- [ ] Strong CTAs

### Performance:
- [ ] Lighthouse score: 90+ (all categories)
- [ ] Page load time: < 2 seconds
- [ ] Mobile-friendly
- [ ] No console errors

### Functionality:
- [ ] All links work
- [ ] Navigation smooth
- [ ] Contact form functional
- [ ] Responsive on all devices

### SEO:
- [ ] Unique meta tags
- [ ] Proper heading hierarchy
- [ ] Image alt text
- [ ] Fast page speed

---

## Resources & References

### Documentation:
- **Content Audit:** `content-audit/` directory
- **Project Guide:** `CLAUDE.md`
- **Deployment Guide:** `DEPLOY.md`
- **This Plan:** `MIGRATION-PLAN.md`

### Design Files:
- **Figma Pages:** `designs/figma/` directory
- **Styles:** `css/figma-styles.css`
- **Scripts:** `css/figma-scripts.js`

### External Links:
- **Production:** https://retailaer.com (reference only)
- **Staging:** https://retailaer.us
- **Dev:** https://retailaer.pages.dev

---

## Timeline Estimate

### Step 1: Content Audit ✅
**Time:** 2-3 hours
**Status:** COMPLETE (2025-10-15)

### Step 2: Content Mapping
**Time:** 1-2 hours
**Status:** Pending

### Step 3: Update HTML Files
**Time:** 3-4 hours
**Status:** Pending

### Step 4: Verify & Refine
**Time:** 2-3 hours
**Status:** Pending

### Step 5: Deploy to Staging
**Time:** 1 hour
**Status:** Pending

### Step 6: Production Launch
**Time:** 1-2 hours
**Status:** Pending

**Total Estimated Time:** 10-15 hours

---

## Current Status Summary

✅ **Completed:**
- Step 1: Content audit from retailaer.com
- All content documented and organized
- Issues identified and catalogued
- Content mapping strategy defined

⏳ **Next Steps:**
1. Review content audit with stakeholders
2. Get approval to proceed with population
3. Begin Step 2: Content mapping
4. Start updating Figma HTML files

📊 **Progress:** ~15% complete (Step 1 of 6)

---

## Questions for Stakeholders

Before proceeding to Step 2, please confirm:

1. **Content Approval:** Are all extracted content items approved for use?
2. **Typo Fixes:** Confirm all identified typos should be fixed
3. **Contact Email:** Is info@retailaer.com the correct contact email?
4. **Address:** Is the Croydon address current and correct?
5. **Copyright:** Update copyright to 2025?
6. **Blog Content:** Should we create placeholder blog posts or wait for real content?
7. **Social Media:** Do you have LinkedIn/Twitter URLs for footer?
8. **Analytics:** Should Google Analytics be added?
9. **Demo Booking:** Should we add "Book a Demo" CTA option?
10. **Launch Timeline:** Target date for production launch?

---

**Plan Version:** 1.0
**Last Updated:** 2025-10-15
**Status:** Step 1 Complete, Ready for Step 2

