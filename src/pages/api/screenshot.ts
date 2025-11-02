/**
 * Screenshot API - Captures webpage screenshots
 * Uses Playwright for browser automation
 */

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Import Playwright dynamically
    const { chromium } = await import('playwright');

    // Launch browser
    const browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext({
      viewport: { width: 1200, height: 800 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    // Navigate to URL with timeout
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait a bit for any lazy-loaded images
    await page.waitForTimeout(2000);

    // Extract article content
    const articleData = await page.evaluate(() => {
      // Try to get article title
      const title =
        document.querySelector('h1')?.textContent?.trim() ||
        document.querySelector('[class*="article-title"]')?.textContent?.trim() ||
        document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        '';

      // Try to get article content - LinkedIn uses various selectors
      const contentSelectors = [
        'article',
        '[class*="article-content"]',
        '[class*="article__content"]',
        '[data-test-id="article-reader-text"]',
        '.reader-article-content',
        '.article-content',
        'main'
      ];

      let content = '';
      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          // Get text content, preserving paragraphs
          const paragraphs = Array.from(element.querySelectorAll('p, h2, h3, ul, ol'));
          if (paragraphs.length > 0) {
            content = paragraphs.map(p => p.textContent?.trim()).filter(Boolean).join('\n\n');
            break;
          }
        }
      }

      // If still no content, try getting all paragraph tags
      if (!content) {
        const allParagraphs = Array.from(document.querySelectorAll('p'));
        content = allParagraphs
          .map(p => p.textContent?.trim())
          .filter(text => text && text.length > 50) // Only substantial paragraphs
          .slice(0, 10) // First 10 paragraphs
          .join('\n\n');
      }

      // Try to get author
      const author =
        document.querySelector('[class*="author"]')?.textContent?.trim() ||
        document.querySelector('meta[property="article:author"]')?.getAttribute('content') ||
        '';

      // Try to get published date
      const publishedDate =
        document.querySelector('time')?.getAttribute('datetime') ||
        document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
        '';

      return {
        title,
        content,
        author,
        publishedDate
      };
    });

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false, // Only visible area
    });

    await browser.close();

    // Convert to base64
    const screenshotBase64 = `data:image/png;base64,${screenshot.toString('base64')}`;

    return new Response(JSON.stringify({
      screenshot: screenshotBase64,
      title: articleData.title,
      content: articleData.content,
      author: articleData.author,
      publishedDate: articleData.publishedDate
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Screenshot error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to capture screenshot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
