import { test, expect } from '@playwright/test';

const OUTPUT_DIR = 'contrast-audit';

// Test each page for contrast issues
test.describe('Contrast Audit Screenshots', () => {
  test.beforeAll(async () => {
    // Ensure output directory exists
    const fs = await import('fs');
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
  });

  // Simulate visited links by injecting CSS that shows :visited state
  const simulateVisitedLinks = async (page: any) => {
    await page.addStyleTag({
      content: `
        /* Force all links to appear as visited for testing */
        a, a:link {
          /* This won't work directly due to browser security,
             but we can add a class to simulate */
        }
      `
    });
  };

  test('Homepage - Full page', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: `${OUTPUT_DIR}/01-homepage-full.png`,
      fullPage: true
    });
  });

  test('Homepage - Hero section', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    await page.waitForLoadState('networkidle');
    const hero = page.locator('.hero-section, .hero');
    await hero.screenshot({ path: `${OUTPUT_DIR}/02-homepage-hero.png` });
  });

  test('Homepage - Stats section', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    await page.waitForLoadState('networkidle');
    const stats = page.locator('.stats-section, .stats-bar, .stats-container').first();
    if (await stats.isVisible()) {
      await stats.screenshot({ path: `${OUTPUT_DIR}/03-homepage-stats.png` });
    }
  });

  test('Homepage - Benefits/CTA section', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    await page.waitForLoadState('networkidle');
    const benefits = page.locator('.benefits-section, .cta-section').first();
    if (await benefits.isVisible()) {
      await benefits.screenshot({ path: `${OUTPUT_DIR}/04-homepage-benefits.png` });
    }
  });

  test('Homepage - How it Works section', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    await page.waitForLoadState('networkidle');
    const howItWorks = page.locator('#how-it-works, .how-it-works');
    if (await howItWorks.isVisible()) {
      await howItWorks.screenshot({ path: `${OUTPUT_DIR}/05-homepage-how-it-works.png` });
    }
  });

  test('Homepage - Footer', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    await page.waitForLoadState('networkidle');
    const footer = page.locator('footer, .footer');
    await footer.screenshot({ path: `${OUTPUT_DIR}/06-homepage-footer.png` });
  });

  test('Solutions page - Full', async ({ page }) => {
    await page.goto('http://localhost:4321/solutions');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: `${OUTPUT_DIR}/07-solutions-full.png`,
      fullPage: true
    });
  });

  test('Company page - Full', async ({ page }) => {
    await page.goto('http://localhost:4321/company');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: `${OUTPUT_DIR}/08-company-full.png`,
      fullPage: true
    });
  });

  test('Insights page - Full', async ({ page }) => {
    await page.goto('http://localhost:4321/insights');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: `${OUTPUT_DIR}/09-insights-full.png`,
      fullPage: true
    });
  });

  test('Contact page - Full', async ({ page }) => {
    await page.goto('http://localhost:4321/contact');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: `${OUTPUT_DIR}/10-contact-full.png`,
      fullPage: true
    });
  });

  // Test with links marked as "visited" using JavaScript class injection
  test('Homepage - Simulated visited state', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    await page.waitForLoadState('networkidle');

    // Add a class to all links to simulate visited state for visual testing
    await page.evaluate(() => {
      document.querySelectorAll('a').forEach(link => {
        link.classList.add('simulated-visited');
      });
    });

    // Inject CSS to highlight potential problem areas
    await page.addStyleTag({
      content: `
        /* Highlight links that might have contrast issues when visited */
        .simulated-visited {
          outline: 2px dashed red !important;
          outline-offset: 2px;
        }

        /* Show where gray text is used */
        [class*="text-gray"],
        [class*="gray"],
        p,
        .card-text,
        .benefit-description,
        .process-description,
        .insight-excerpt,
        .stat-label,
        .section-subtitle {
          background: rgba(255, 255, 0, 0.2) !important;
        }
      `
    });

    await page.screenshot({
      path: `${OUTPUT_DIR}/11-homepage-contrast-highlights.png`,
      fullPage: true
    });
  });

  // Generate a manifest of all screenshots
  test.afterAll(async () => {
    const fs = await import('fs');
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png')).sort();

    const manifest = {
      generatedAt: new Date().toISOString(),
      screenshots: files.map(f => ({
        filename: f,
        path: `${OUTPUT_DIR}/${f}`
      }))
    };

    fs.writeFileSync(
      `${OUTPUT_DIR}/manifest.json`,
      JSON.stringify(manifest, null, 2)
    );
  });
});
