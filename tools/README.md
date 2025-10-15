# Retailaer Tools

Utilities for website development and content migration.

## Available Tools

### 1. Content Scraper (`content-scraper.js`)

Extracts content from the existing retailaer.com site for migration.

**Usage:**
```bash
# Run with Node.js (requires Node.js installed)
node tools/content-scraper.js
```

**Output:**
- Creates `content-extracted/` directory
- Generates JSON files for each page (home.json, solutions.json, etc.)
- Saves combined results to `_all-pages.json`

**What it extracts:**
- Page titles and meta descriptions
- All headings (H1, H2, H3)
- All links with text
- All images with alt text
- Raw text content

**Files created:**
```
content-extracted/
  ├── home.json
  ├── solutions.json
  ├── company.json
  ├── insights.json
  ├── contact.json
  └── _all-pages.json
```

---

### 2. Content Scraper (Python version) - `content-scraper.py`

Alternative implementation using Python (requires Python 3.6+).

**Installation:**
```bash
pip install requests beautifulsoup4
```

**Usage:**
```bash
python tools/content-scraper.py
```

Provides same functionality as Node.js version with better HTML parsing via BeautifulSoup.

---

### 3. Screenshot Tool (`screenshot-sites.py`) ✓

Captures screenshots of both production (retailaer.us) and local sites for Figma AI reference.

**Installation:**
```bash
pip install playwright
python3 -m playwright install chromium
```

**Usage:**
```bash
python3 tools/screenshot-sites.py
```

**Output:**
- Creates `designs/screenshots/` directory
- Captures 8 screenshots:
  - retailaer-us-home.png (desktop)
  - retailaer-us-home-mobile.png (mobile)
  - local-home.png (desktop)
  - local-home-mobile.png (mobile)
  - local-solutions.png
  - local-company.png
  - local-insights.png
  - local-contact.png

**What it captures:**
- Full page screenshots (not just viewport)
- Both desktop (1920x1080) and mobile (375x812) views
- All current pages from local development server
- Production site for comparison

**Use case:**
Upload these screenshots to Figma AI to provide visual context when generating designs.

---

## Future Tools

### Image Optimizer (Planned)

Will optimize images for web use:
- Convert to WebP
- Generate responsive sizes
- Compress without quality loss

### Component Library (Planned)

Living style guide showing all UI components.

### Sitemap Generator (Planned)

Generate sitemap.xml for SEO.

---

## Requirements

- **Node.js version**: Node.js 12+ (for content-scraper.js)
- **Python version**: Python 3.6+ (for content-scraper.py)
- **Internet connection**: Required to fetch content from retailaer.com

---

## Notes

- Content scrapers respect the site with 1-second delays between requests
- Scraped content is saved as JSON for easy programmatic access
- All tools are non-destructive (only read from source, write to local files)
- Output files are gitignored by default (in `content-extracted/`)

---

## Troubleshooting

**Error: "Cannot find module"**
- Make sure Node.js is installed: `node --version`
- Run from repository root: `node tools/content-scraper.js`

**Error: "Connection timeout"**
- Check internet connection
- Verify retailaer.com is accessible
- Try increasing timeout in script config

**No content extracted**
- Check if retailaer.com structure has changed
- May need to update selectors in scraper
- Verify pages exist at expected URLs

---

*Last updated: 2025-10-07*
