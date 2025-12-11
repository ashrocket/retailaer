# RetailAer Contrast Issues Audit Report

**Generated:** December 9, 2025
**Site:** retailaer.us

---

## Executive Summary

After reviewing the CSS files and taking screenshots across all pages, I've identified several contrast issues that affect readability. The main problems fall into these categories:

1. **Gray body text on white backgrounds** - Using `--color-gray-400` (#4a5568 or #6C757D) for body text
2. **Visited link states** - Browser default purple visited links appearing in unexpected places
3. **Section subtitles** - Low contrast gray text used for supporting copy
4. **Footer link hierarchy** - Some footer elements have inconsistent contrast

---

## Issue #1: Gray Body Text (`--color-gray-400`)

### Problem
Body text, card descriptions, and subtitles use `--color-gray-400` which resolves to `#4a5568` or `#6C757D`. While technically passing WCAG AA for large text, this creates a "washed out" appearance that's hard to read, especially on lower-quality screens.

### Affected Elements

| Element | CSS Class/Selector | Current Color | Location |
|---------|-------------------|---------------|----------|
| Paragraphs | `p` | `--color-gray-400` | All pages |
| Card text | `.card-text` | `--color-gray-400` | Homepage "How it Works" cards |
| Benefit descriptions | `.benefit-description` | `--color-text-body` (#3d5c5c) | Solutions page |
| Section subtitles | `.section-subtitle`, `.section-header p` | `--color-gray-400` | All section headers |
| Stat labels | `.stat-label` | `--color-gray-400` | Homepage stats bar |
| Insight excerpts | `.insight-excerpt` | `--color-gray-400` | Insights carousel |
| Process descriptions | `.process-description` | `--color-text-body` | How it Works section |

### CSS Locations
- `public/css/design-system.css:131` - `p { color: var(--color-gray-400) }`
- `public/css/design-system.css:255` - `.card-text { color: var(--color-gray-400) }`
- `public/css/homepage.css:102` - `.stat-label { color: var(--color-gray-400) }`
- `public/css/homepage.css:121` - `.section-header p { color: var(--color-gray-400) }`
- `public/css/homepage.css:203` - `.insight-excerpt { color: var(--color-gray-400) }`

### Screenshots
- `contrast-audit/01-homepage-full.png` - See card descriptions in "Why Retailaer?" section
- `contrast-audit/08-company-full.png` - See "Our Values" card descriptions

---

## Issue #2: Footer Text Contrast

### Problem
Footer column headings use `--color-accent` (yellow #FDB913) which has poor contrast against the teal background. Footer body text is semi-transparent white which reduces readability.

### Affected Elements

| Element | Current Style | Issue |
|---------|--------------|-------|
| Footer column headings (h5) | Yellow `--color-accent` on teal | Yellow on teal = poor contrast |
| Footer description text | White with opacity 0.95 | Acceptable but could be better |
| Footer copyright | White with opacity 0.9 | Slightly faded |

### CSS Location
- `public/css/figma-styles.css:897` - `.footer-links h4 { color: var(--color-accent) }`

### Screenshots
- `contrast-audit/06-homepage-footer.png` - Yellow headings visible

---

## Issue #3: Visited Link States

### Problem
Although `themes.css` has visited link overrides, they use `!important` which is a code smell and may not cover all edge cases. The selectors are specific but could miss dynamically added links.

### Current Fix in themes.css
```css
/* Navigation links - keep white */
.navbar a:visited { color: rgba(255, 255, 255, 0.9) !important; }

/* Footer links - keep white/light */
.footer a:visited { color: rgba(255, 255, 255, 0.9) !important; }

/* General content links - use primary color */
main a:not(.btn):visited { color: var(--theme-primary); }
```

### Potential Gaps
- Links added via JavaScript after page load
- Links in components that don't match the selectors
- Edge cases where specificity battles occur

---

## Issue #4: "Why Leading Airlines Choose Us" Section

### Problem
The teal-on-teal gradient background with white text is fine, but the subtitle text could have better contrast.

### Affected Elements
- Subtitle: "Tangible benefits of choosing Retailaer..."
- Currently white but at full opacity which is good

### Screenshot
- `contrast-audit/04-homepage-benefits.png`

---

## Issue #5: Form Labels and Placeholder Text

### Problem
On the Contact page, form field labels and placeholder text may have insufficient contrast.

### Affected Elements
- Form labels
- Placeholder text in inputs
- Helper text below fields

### Screenshot
- `contrast-audit/10-contact-full.png`

---

## Issue #6: "Topics We Cover" Section (Insights Page)

### Problem
The icon descriptions under each topic category use gray text that's hard to read.

### Screenshot
- `contrast-audit/09-insights-full.png`

---

## Recommended Fixes

### Fix 1: Increase Body Text Contrast

**Current:** `--color-gray-400: #4a5568` (contrast ratio ~7:1 on white - passes AA)
**Recommended:** `--color-gray-600: #374151` (contrast ratio ~10:1 on white - passes AAA)

```css
/* In design-system.css - update the default */
--color-gray-400: var(--theme-text-secondary, #374151);

/* Or create a new variable for body text */
--color-text-body: #374151;
```

### Fix 2: Standardize Text Colors

Create a simpler, more consistent text color system:

```css
:root {
  /* Text Colors - High Contrast */
  --text-primary: #1a202c;      /* Headings, important text */
  --text-secondary: #374151;    /* Body text, descriptions */
  --text-tertiary: #6b7280;     /* Captions, metadata only */
  --text-on-dark: #ffffff;      /* Text on dark backgrounds */
  --text-on-dark-muted: rgba(255, 255, 255, 0.85);
}
```

### Fix 3: Fix Footer Headings

Change footer headings from yellow to white or a lighter teal:

```css
.footer-links h4,
.footer-col h5 {
  color: var(--color-white);  /* Instead of --color-accent */
  font-weight: 600;
}
```

### Fix 4: Global Visited Link Reset

Add a more robust visited link reset at the top of the stylesheet:

```css
/* Global visited link reset - prevent purple visited links */
a, a:visited {
  color: inherit;
}

/* Then set specific colors where needed */
.content-area a { color: var(--theme-primary); }
.content-area a:visited { color: var(--theme-primary); }
.content-area a:hover { color: var(--theme-primary-light); }
```

### Fix 5: Update Card Descriptions

```css
.card-text,
.benefit-description,
.process-description,
.insight-excerpt {
  color: var(--text-secondary);  /* #374151 instead of #4a5568 */
}
```

---

## Implementation Priority

| Priority | Issue | Impact | Effort |
|----------|-------|--------|--------|
| HIGH | Gray body text (#1) | Affects entire site | Low - CSS variable change |
| HIGH | Card descriptions (#1) | Affects key content | Low - CSS update |
| MEDIUM | Footer headings (#2) | Affects footer readability | Low - one line change |
| MEDIUM | Visited links (#3) | Edge cases only | Medium - testing needed |
| LOW | Form labels (#5) | Contact page only | Low - CSS update |

---

## Files to Modify

1. `public/css/design-system.css` - Update `--color-gray-400` or add new text variables
2. `public/css/figma-styles.css` - Update footer heading colors
3. `public/css/themes.css` - Strengthen visited link overrides
4. `public/css/homepage.css` - Update card and description colors

---

## Testing Checklist

After implementing fixes:

- [ ] Run Lighthouse accessibility audit
- [ ] Test with browser dev tools color contrast checker
- [ ] Verify on mobile devices
- [ ] Check all visited link states by visiting pages
- [ ] Test with browser extensions like WAVE or axe

---

## Screenshots Index

| File | Description |
|------|-------------|
| `01-homepage-full.png` | Full homepage |
| `02-homepage-hero.png` | Hero section |
| `03-homepage-stats.png` | Stats bar |
| `04-homepage-benefits.png` | Benefits section |
| `05-homepage-how-it-works.png` | How it Works |
| `06-homepage-footer.png` | Footer |
| `07-solutions-full.png` | Solutions page |
| `08-company-full.png` | Company page |
| `09-insights-full.png` | Insights page |
| `10-contact-full.png` | Contact page |
| `11-homepage-contrast-highlights.png` | Highlighted problem areas |
