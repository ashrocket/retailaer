#!/usr/bin/env node

/**
 * RetailAer Content Scraper
 *
 * Extracts content from retailaer.com for migration to new site
 * Outputs structured content to JSON files for easy integration
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  baseUrl: 'https://retailaer.com',
  outputDir: path.join(__dirname, '..', 'content-extracted'),
  pages: [
    { name: 'home', url: '/' },
    { name: 'solutions', url: '/solutions' },
    { name: 'company', url: '/company' },
    { name: 'insights', url: '/insights' },
    { name: 'contact', url: '/contact' },
  ],
  timeout: 10000,
};

/**
 * Fetch a URL and return the HTML content
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const fullUrl = url.startsWith('http') ? url : `${CONFIG.baseUrl}${url}`;

    console.log(`Fetching: ${fullUrl}`);

    https.get(fullUrl, { timeout: CONFIG.timeout }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${fullUrl}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    }).on('timeout', () => {
      reject(new Error(`Timeout fetching ${fullUrl}`));
    });
  });
}

/**
 * Simple HTML text extraction (strips tags)
 */
function extractText(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract structured content from HTML
 */
function parseContent(html, pageName) {
  const content = {
    page: pageName,
    timestamp: new Date().toISOString(),
    rawText: extractText(html),
    sections: {},
  };

  // Extract title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch) {
    content.title = titleMatch[1].trim();
  }

  // Extract meta description
  const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (metaMatch) {
    content.metaDescription = metaMatch[1];
  }

  // Extract all headings
  content.headings = {
    h1: extractMatches(html, /<h1[^>]*>(.*?)<\/h1>/gi),
    h2: extractMatches(html, /<h2[^>]*>(.*?)<\/h2>/gi),
    h3: extractMatches(html, /<h3[^>]*>(.*?)<\/h3>/gi),
  };

  // Extract all links
  content.links = extractMatches(html, /<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, (match) => ({
    href: match[1],
    text: extractText(match[2]),
  }));

  // Extract all images
  content.images = extractMatches(html, /<img[^>]*src=["']([^"']+)["'][^>]*>/gi, (match) => {
    const src = match[1];
    const altMatch = match[0].match(/alt=["']([^"']+)["']/i);
    return {
      src,
      alt: altMatch ? altMatch[1] : '',
    };
  });

  return content;
}

/**
 * Helper to extract regex matches
 */
function extractMatches(html, regex, transform = null) {
  const matches = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    if (transform) {
      matches.push(transform(match));
    } else {
      matches.push(extractText(match[1]));
    }
  }

  return matches;
}

/**
 * Save content to JSON file
 */
function saveContent(content, filename) {
  const filepath = path.join(CONFIG.outputDir, `${filename}.json`);
  fs.writeFileSync(filepath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`Saved: ${filepath}`);
}

/**
 * Main scraper function
 */
async function scrapeAll() {
  console.log('RetailAer Content Scraper');
  console.log('========================\n');

  // Create output directory
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: CONFIG.baseUrl,
    pages: {},
  };

  // Scrape each page
  for (const page of CONFIG.pages) {
    try {
      const html = await fetchUrl(page.url);
      const content = parseContent(html, page.name);

      // Save individual page
      saveContent(content, page.name);

      // Add to combined results
      results.pages[page.name] = content;

      console.log(`✓ Scraped ${page.name}`);

      // Respectful delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (err) {
      console.error(`✗ Failed to scrape ${page.name}: ${err.message}`);
      results.pages[page.name] = { error: err.message };
    }
  }

  // Save combined results
  saveContent(results, '_all-pages');

  console.log('\n✓ Scraping complete!');
  console.log(`Output directory: ${CONFIG.outputDir}`);
}

// Run if executed directly
if (require.main === module) {
  scrapeAll().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { scrapeAll, fetchUrl, parseContent };
