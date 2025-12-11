# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Retailaer Marketing Website** - B2B SaaS marketing site for airline retailing technology platform.

**Tech Stack:**
- **Framework:** Astro 5.x (SSR mode)
- **Adapter:** Cloudflare Pages (@astrojs/cloudflare)
- **Content:** MDX for blog posts
- **Styling:** Vanilla CSS with design system tokens
- **Deployment:** Cloudflare Pages (auto-deploy from main branch)

**Live Sites:**
- **Staging:** https://retailaer.us (auto-deploys from main)
- **Production:** https://retailaer.com

---

## Business Context

**Company:** Retailaer
**Industry:** Airline Technology / Travel Tech B2B SaaS
**Product:** Customer-first Offer and Order Management platform
**Target Audience:** Airlines, airline executives, travel tech partners

**Key Stats:**
- 12 years in business
- **204M+ orders processed** (update from 5M in November 2025)
- 300+ platform capabilities

**Value Proposition:**
"Empowering modern airline retailing with the world's only customer-first Offer and Order Management solution."

---

## Architecture

### Project Structure

```
retailaer/
├── src/
│   ├── pages/              # Astro pages (file-based routing)
│   │   ├── index.astro     # Homepage
│   │   ├── solutions.astro # Solutions page
│   │   ├── company.astro   # About/company page
│   │   ├── insights.astro  # Blog listing
│   │   ├── contact.astro   # Contact page
│   │   ├── api/            # API endpoints (Cloudflare Functions)
│   │   └── blog/           # Blog management pages
│   ├── layouts/
│   │   └── BaseLayout.astro # Main layout with nav/footer
│   ├── components/
│   │   ├── InsightsCarousel.astro
│   │   ├── ExpandableFeatureCards.astro
│   │   ├── FeedbackWidget.astro
│   │   ├── EditMode.astro
│   │   └── CookieConsent.astro
│   ├── content/
│   │   └── blog/           # MDX blog posts
│   └── config/
├── public/
│   ├── css/
│   │   ├── design-system.css  # Design tokens
│   │   ├── figma-styles.css   # Main styles
│   │   └── homepage.css       # Homepage-specific
│   ├── js/
│   └── assets/
├── dist/                   # Build output (Cloudflare Pages)
└── astro.config.mjs        # Astro configuration
```

### Key Architectural Decisions

**1. Astro SSR Mode**
- `output: 'server'` in astro.config.mjs
- Enables server-side rendering on Cloudflare Pages
- Required for API routes and dynamic features

**2. File-Based Routing**
- Pages in `src/pages/` automatically become routes
- `/` → `src/pages/index.astro`
- `/solutions` → `src/pages/solutions.astro`
- `/blog/[slug]` → `src/pages/blog/[slug].astro` (dynamic routes)

**3. API Routes**
- Located in `src/pages/api/`
- Deployed as Cloudflare Functions
- Examples: `/api/feedback.ts`, `/api/commit.ts`, `/api/auth/*`

**4. Content Collections**
- Blog posts stored as MDX in `src/content/blog/`
- Managed through custom CMS at `/blog/manage`
- Deployed via Git commits (see `/api/commit.ts`)

**5. Edit Mode Feature**
- Live editing toolbar on pages (when `filePath` prop provided)
- Allows authenticated users to edit content in-browser
- Commits changes via GitHub API

---

## Development Commands

### Local Development
```bash
npm run dev          # Start dev server at http://localhost:4321
```

### Build & Preview
```bash
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
```

### Testing
```bash
# Playwright visual regression tests
npx playwright install              # Install browsers (first time)
npx playwright test                 # Run all tests
npx playwright test --ui            # Run with UI mode
npx playwright test desktop-screenshots.spec.ts  # Run specific test
```

### Deployment
```bash
# Auto-deploys on push to main
git add .
git commit -m "Description"
git push

# Manual deploy (if needed)
wrangler pages deploy dist
```

---

## Design System

### Color Palette
Defined in [public/css/design-system.css](public/css/design-system.css):
- **Primary:** `#0a5c5c` (Deep teal)
- **Accent:** `#f5b800` (Bright yellow)
- **Background:** White, `#f0f7f7` (Light teal)
- **Text:** `#0a1f1f` (Dark), `#5a7a7a` (Body)

### Typography
- **Font:** Inter (Google Fonts, weights 300-700)
- **Base:** 16px
- **Scale:** 14px - 60px responsive

### Breakpoints
```css
/* Mobile: default */
/* Tablet: 768px */
/* Desktop: 1024px */
```

### CSS Architecture
1. `design-system.css` - Design tokens (colors, typography, spacing)
2. `figma-styles.css` - Global styles and components
3. `homepage.css` - Homepage-specific styles
4. Component-scoped styles in `.astro` files

---

## Key Features & Components

### 1. Blog System (`/blog/*`)
- **Listing:** `/insights` → [src/pages/insights.astro](src/pages/insights.astro)
- **Single post:** `/blog/[slug]` → [src/pages/blog/[slug].astro](src/pages/blog/[slug].astro)
- **CMS:** `/blog/manage` (authenticated)
- **Editor:** `/blog/editor` (Milkdown WYSIWYG)
- **Publishing:** Commits to `src/content/blog/` via `/api/commit.ts`

### 2. Insights Carousel
- Component: [src/components/InsightsCarousel.astro](src/components/InsightsCarousel.astro)
- Shows latest blog posts on homepage
- Swipeable on mobile, grid on desktop
- Uses brand colors for gradients

### 3. Expandable Feature Cards
- Component: [src/components/ExpandableFeatureCards.astro](src/components/ExpandableFeatureCards.astro)
- Used on Solutions page
- Click to expand/collapse details

### 4. Feedback Widget
- Component: [src/components/FeedbackWidget.astro](src/components/FeedbackWidget.astro)
- Fixed position widget on all pages
- Submits via `/api/feedback.ts`

### 5. Edit Mode
- Component: [src/components/EditMode.astro](src/components/EditMode.astro)
- Live editing toolbar for authenticated users
- Requires `filePath` prop in BaseLayout
- Commits changes via GitHub API

### 6. Authentication
- Session-based auth for blog management
- Routes: `/api/auth/*`
- Protected pages check session in server code

---

## Content Management

### Adding Blog Posts

**Option 1: Via CMS (Recommended)**
1. Go to `/blog/manage`
2. Login if needed
3. Click "Create New Post"
4. Write in Milkdown editor
5. Save → auto-commits to Git

**Option 2: Manual**
1. Create `.mdx` file in `src/content/blog/`
2. Add frontmatter:
```yaml
---
title: "Post Title"
description: "Brief description"
date: 2025-11-19
author: "Author Name"
image: "/images/post-image.jpg"
---
```
3. Commit and push

### Editing Pages

**Option 1: Edit Mode (Live)**
1. Navigate to page
2. Click "Edit" in toolbar (if authenticated)
3. Edit content inline
4. Save → auto-commits

**Option 2: Direct File Edit**
1. Edit `.astro` file in `src/pages/`
2. Save and preview locally
3. Commit and push

---

## Common Development Tasks

### Adding a New Page
```astro
// src/pages/new-page.astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Page Title">
  <!-- Content -->
</BaseLayout>
```

### Creating an API Endpoint
```typescript
// src/pages/api/example.ts
export async function GET({ request }) {
  return new Response(JSON.stringify({ data: 'hello' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Adding Global Styles
1. Edit [public/css/design-system.css](public/css/design-system.css) for tokens
2. Edit [public/css/figma-styles.css](public/css/figma-styles.css) for global styles
3. Or use scoped styles in `.astro` component:
```astro
<style>
  .my-component { ... }
</style>
```

### Screenshot Testing
```bash
# Generate design review screenshots
npx playwright test desktop-screenshots.spec.ts
npx playwright test mobile-screenshots.spec.ts

# Output: design-review-output/
```

---

## Important Context: November 2025 Requirements

See [NOVEMBER-REQUIREMENTS-TODO.md](NOVEMBER-REQUIREMENTS-TODO.md) for detailed implementation checklist.

### Key Changes Required
- **Stats update:** 5M → **204M orders** (critical update)
- **Hero CTA:** "Book a Demo" → "Get in Touch"
- **Features:** 9 → 4 boxes
- **Company values:** 6 → 3
- **Solutions pillars:** Updated content + new "Customer-First" pillar
- **Distribution channels:** 9 specific channels with exact wording
- **Footer:** White logo, new description text
- **Navigation:** White centered logo, hamburger menu
- **Remove:** "certifications" from Enterprise Security text

### Priority Files to Update
1. [src/pages/index.astro](src/pages/index.astro) - Homepage updates
2. [src/pages/company.astro](src/pages/company.astro) - Stats (204M), mission, "What Sets Us Apart"
3. [src/pages/solutions.astro](src/pages/solutions.astro) - Pillars, channels, content refinements
4. [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) - Footer, navigation

---

## Cloudflare Integration

### Pages Configuration
- **Build command:** `npm run build`
- **Build output:** `dist/`
- **Node version:** 18+
- **Environment:** Production

### Functions (API Routes)
- Automatically deployed from `src/pages/api/`
- Serverless functions on Cloudflare Workers runtime
- No environment variables needed (uses Cloudflare bindings)

### Custom Domains
- Staging: retailaer.us (configured)
- Production: retailaer.com (configured)

---

## Testing Strategy

### Visual Regression Tests
Located in `tests/`:
- [desktop-screenshots.spec.ts](tests/desktop-screenshots.spec.ts) - Desktop viewport captures
- [mobile-screenshots.spec.ts](tests/mobile-screenshots.spec.ts) - Mobile viewport captures

**Purpose:**
- Generate screenshots for design review
- Compare implementations against Figma
- Document visual state

**Output:** `design-review-output/` directory

### Manual Testing Checklist
- [ ] All pages load correctly
- [ ] Navigation works between pages
- [ ] Mobile hamburger menu functions
- [ ] Contact form submits
- [ ] Blog posts display correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors

---

## Deployment Workflow

### Standard Flow
```bash
# 1. Make changes locally
# 2. Test locally
npm run dev

# 3. Preview production build
npm run build
npm run preview

# 4. Commit and push
git add .
git commit -m "Description of changes"
git push  # Auto-deploys to retailaer.us
```

### Rollback
```bash
# Revert last commit
git revert HEAD
git push

# Or restore specific commit
git reset --hard <commit-hash>
git push --force  # Use with caution
```

---

## Configuration Files

### astro.config.mjs
```javascript
{
  output: 'server',           // SSR mode
  adapter: cloudflare(),      // Cloudflare Pages adapter
  site: 'https://retailaer.us',
  integrations: [mdx(), icon()]
}
```

### wrangler.toml
```toml
name = "retailaer"
compatibility_date = "2025-08-22"
pages_build_output_dir = "dist"
```

### package.json Scripts
- `dev` - Start Astro dev server
- `build` - Build for production
- `preview` - Preview production build

---

## Troubleshooting

### Build Fails
```bash
# Clear Astro cache
rm -rf .astro dist

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Styles Not Updating
- Check if CSS file is linked in BaseLayout
- Clear browser cache (Cmd+Shift+R)
- Verify file path is correct (`/css/` not `css/`)

### API Route Not Working
- Check route naming: must be `.ts` in `src/pages/api/`
- Verify export: `export async function GET/POST`
- Check Cloudflare Functions logs in dashboard

### Edit Mode Not Showing
- Ensure `filePath` prop passed to BaseLayout
- Check authentication status
- Verify EditMode component imported

---

## Reference Documentation

### External
- Astro Docs: https://docs.astro.build
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- MDX: https://mdxjs.com

### Internal
- [README.md](README.md) - Quick start guide
- [NOVEMBER-REQUIREMENTS-TODO.md](NOVEMBER-REQUIREMENTS-TODO.md) - Current implementation checklist
- [DEPLOY.md](DEPLOY.md) - Deployment guide (legacy, pre-Astro migration)

---

## Notes

- **Migration:** This project migrated from vanilla HTML/CSS/JS to Astro
- **Legacy files:** Old reference files exist in `designs/figma/` directory
- **Auto-deploy:** Main branch auto-deploys to staging (retailaer.us)
- **Blog storage:** Content stored in Git, not database
- **Authentication:** Session-based cookies for blog management

---

**Last Updated:** 2025-11-19
**Framework:** Astro 5.x + Cloudflare Pages
**Status:** Active development - November 2025 requirements implementation in progress
