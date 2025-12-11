import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:4321';
const OUTPUT_DIR = 'november-comparison';

test.describe('November 2025 Update Comparison Screenshots', () => {
  test.beforeAll(async () => {
    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
  });

  test('Homepage Screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 1. Hero Section
    await page.screenshot({
      path: `${OUTPUT_DIR}/01-homepage-hero.png`,
      clip: { x: 0, y: 0, width: 1440, height: 700 }
    });

    // 2. Benefits Section ("Why Leading Airlines Choose Us")
    const benefitsSection = page.locator('#benefits');
    await benefitsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await benefitsSection.screenshot({
      path: `${OUTPUT_DIR}/02-homepage-benefits.png`
    });

    // 3. Why Retailaer Section
    const whyRetailaer = page.locator('#why-retailaer');
    await whyRetailaer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await whyRetailaer.screenshot({
      path: `${OUTPUT_DIR}/03-homepage-why-retailaer.png`
    });

    // 4. How It Works Section
    const howItWorks = page.locator('#how-it-works');
    await howItWorks.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await howItWorks.screenshot({
      path: `${OUTPUT_DIR}/04-homepage-how-it-works.png`
    });
  });

  test('Solutions Page Screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/solutions`);
    await page.waitForLoadState('networkidle');

    // 5. Solutions Hero
    await page.screenshot({
      path: `${OUTPUT_DIR}/05-solutions-hero.png`,
      clip: { x: 0, y: 0, width: 1440, height: 500 }
    });

    // 6. Platform Overview (Four Pillars)
    const platformSection = page.locator('.pillars-grid').first();
    await platformSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Get the section header too
    const platformOverview = page.locator('section').filter({ has: page.locator('.pillars-grid') }).first();
    await platformOverview.screenshot({
      path: `${OUTPUT_DIR}/06-solutions-pillars.png`
    });

    // 7. Marketplace Section
    const marketplaceSection = page.locator('section').filter({ has: page.locator('.marketplace-grid') }).first();
    await marketplaceSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await marketplaceSection.screenshot({
      path: `${OUTPUT_DIR}/07-solutions-marketplace.png`
    });

    // 8. Connect Retail Distribution Section
    const distributionSection = page.locator('#distribution');
    await distributionSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await distributionSection.screenshot({
      path: `${OUTPUT_DIR}/08-solutions-distribution.png`
    });
  });

  test('Company Page Screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/company`);
    await page.waitForLoadState('networkidle');

    // 9. Company Hero
    await page.screenshot({
      path: `${OUTPUT_DIR}/09-company-hero.png`,
      clip: { x: 0, y: 0, width: 1440, height: 500 }
    });

    // 10. Mission Section
    const missionSection = page.locator('.mission-layout').first();
    await missionSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const missionParent = page.locator('section').filter({ has: page.locator('.mission-layout') }).first();
    await missionParent.screenshot({
      path: `${OUTPUT_DIR}/10-company-mission.png`
    });

    // 11. Commitment Section
    const commitmentSection = page.locator('.commitment-grid-2x2').first();
    await commitmentSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const commitmentParent = page.locator('section').filter({ has: page.locator('.commitment-grid-2x2') }).first();
    await commitmentParent.screenshot({
      path: `${OUTPUT_DIR}/11-company-commitments.png`
    });

    // 12. CTA Section
    const ctaSection = page.locator('.cta-box-bright').first();
    await ctaSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await ctaSection.screenshot({
      path: `${OUTPUT_DIR}/12-company-cta.png`
    });
  });

  test('Generate HTML Comparison Report', async () => {
    const screenshots = [
      { file: '01-homepage-hero.png', title: 'Homepage Hero', pdfPage: 1, notes: 'Hero with "Get in Touch" button and "Why Leading Airlines Choose Us" link' },
      { file: '02-homepage-benefits.png', title: 'Benefits Section', pdfPage: 1-2, notes: 'Moved to 2nd position. New stats: 3-5%+ conversion, 20%+ AOV, 60% retention, etc.' },
      { file: '03-homepage-why-retailaer.png', title: 'Why Retailaer?', pdfPage: 2, notes: 'Built for IATA NDC and ONE Order standards' },
      { file: '04-homepage-how-it-works.png', title: 'How It Works', pdfPage: 3, notes: 'Key Retail Fundamentals: Frictionless Payments, Unified Customer View, Order Optimisation, Dynamic Offers. Gold centered button.' },
      { file: '05-solutions-hero.png', title: 'Solutions Hero', pdfPage: 4, notes: 'Next-gen airline retailing with Offers and Orders and Marketplace' },
      { file: '06-solutions-pillars.png', title: 'Platform Overview - Four Pillars', pdfPage: 4-5, notes: '2x2 grid: Dynamic Offers (no "frictionless"), Order Simplification, Payments, Customer-First' },
      { file: '07-solutions-marketplace.png', title: 'Marketplace', pdfPage: 6, notes: '2x2 grid. Removed "Simplified Integration". Renamed to "Revenue Uplift"' },
      { file: '08-solutions-distribution.png', title: 'Connect Retail Distribution', pdfPage: 7-8, notes: 'Removed "Retailaer" prefix. "For Travellers" (was Consumers), "For Aggregators" (was NDC)' },
      { file: '09-company-hero.png', title: 'Company Hero', pdfPage: 9, notes: 'Brightened text. New subtitle about former airline executive.' },
      { file: '10-company-mission.png', title: 'Mission Section', pdfPage: 9-10, notes: 'New structure with "What we do" and "Why it works" subsections' },
      { file: '11-company-commitments.png', title: 'Our Commitment', pdfPage: 10, notes: '2x2 grid with 4 items including "To Passengers"' },
      { file: '12-company-cta.png', title: 'Company CTA', pdfPage: 11, notes: 'Brightened text. Removed "Email Us" button. Gold "Get in Touch"' },
    ];

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>November 2025 Website Update - Screenshot Comparison</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, sans-serif; background: #f5f5f5; padding: 2rem; }
    h1 { text-align: center; margin-bottom: 0.5rem; color: #0a5c5c; }
    .subtitle { text-align: center; color: #666; margin-bottom: 2rem; }
    .comparison-grid { max-width: 1400px; margin: 0 auto; }
    .comparison-item {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      overflow: hidden;
    }
    .comparison-header {
      background: linear-gradient(135deg, #0a5c5c, #084a4f);
      color: white;
      padding: 1rem 1.5rem;
    }
    .comparison-header h2 { font-size: 1.25rem; margin-bottom: 0.25rem; }
    .comparison-header .meta { font-size: 0.875rem; opacity: 0.9; }
    .comparison-content { padding: 1.5rem; }
    .notes {
      background: #f0f7f7;
      border-left: 4px solid #0a5c5c;
      padding: 1rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #333;
    }
    .notes strong { color: #0a5c5c; }
    .screenshot {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .status {
      display: inline-block;
      background: #22c55e;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-left: 1rem;
    }
    footer { text-align: center; margin-top: 2rem; color: #666; font-size: 0.875rem; }
  </style>
</head>
<body>
  <h1>November 2025 Website Update</h1>
  <p class="subtitle">Screenshot Comparison Report - Generated ${new Date().toLocaleString()}</p>

  <div class="comparison-grid">
    ${screenshots.map((s, i) => `
    <div class="comparison-item">
      <div class="comparison-header">
        <h2>${i + 1}. ${s.title} <span class="status">✓ Implemented</span></h2>
        <div class="meta">PDF Reference: Page ${s.pdfPage}</div>
      </div>
      <div class="comparison-content">
        <div class="notes">
          <strong>Requirements from PDF:</strong> ${s.notes}
        </div>
        <img src="${s.file}" alt="${s.title}" class="screenshot" loading="lazy">
      </div>
    </div>
    `).join('')}
  </div>

  <footer>
    <p>Source Document: Web site updates 11.25.pdf | Framework: Astro 5.x + Cloudflare Pages</p>
  </footer>
</body>
</html>`;

    fs.writeFileSync(`${OUTPUT_DIR}/comparison-report.html`, html);
    console.log(`\n✅ Comparison report generated: ${OUTPUT_DIR}/comparison-report.html`);
  });
});
