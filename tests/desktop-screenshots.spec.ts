import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

test.describe('Desktop Screenshots - November Requirements Review', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('Homepage - Desktop', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Full page screenshot
    await page.screenshot({
      path: 'screenshots/desktop-homepage-full.png',
      fullPage: true
    });

    // Hero section
    await page.screenshot({
      path: 'screenshots/desktop-homepage-hero.png',
      clip: { x: 0, y: 0, width: 1920, height: 800 }
    });
  });

  test('Homepage - Features Section', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to features section
    await page.locator('.features-grid').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'screenshots/desktop-homepage-features.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });

  test('Homepage - How It Works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to How It Works section
    await page.locator('.how-it-works').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'screenshots/desktop-homepage-how-it-works.png',
      clip: { x: 0, y: 0, width: 1920, height: 900 }
    });
  });

  test('Homepage - Insights Carousel', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to insights
    await page.locator('.insights-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Wait for carousel to settle
    await page.screenshot({
      path: 'screenshots/desktop-homepage-insights.png',
      clip: { x: 0, y: 0, width: 1920, height: 900 }
    });
  });

  test('Solutions Page - Desktop', async ({ page }) => {
    await page.goto(`${BASE_URL}/solutions`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/desktop-solutions-full.png',
      fullPage: true
    });

    // Platform Overview section
    await page.locator('.pillars-grid').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'screenshots/desktop-solutions-pillars.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });

  test('Solutions - Distribution Channels', async ({ page }) => {
    await page.goto(`${BASE_URL}/solutions`);
    await page.waitForLoadState('networkidle');

    // Scroll to distribution section
    await page.locator('.distribution-grid').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'screenshots/desktop-solutions-distribution.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });

  test('Company Page - Desktop', async ({ page }) => {
    await page.goto(`${BASE_URL}/company`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/desktop-company-full.png',
      fullPage: true
    });

    // Values section
    await page.locator('.values-grid').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'screenshots/desktop-company-values.png',
      clip: { x: 0, y: 0, width: 1920, height: 800 }
    });
  });

  test('Contact Page - Desktop', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/desktop-contact-full.png',
      fullPage: true
    });
  });

  test('Insights Page - Desktop', async ({ page }) => {
    await page.goto(`${BASE_URL}/insights`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/desktop-insights-full.png',
      fullPage: true
    });
  });

  test('Navigation - White Logo Check', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Check navigation has logo
    const logo = page.locator('.navbar-logo');
    await expect(logo).toBeVisible();

    // Screenshot just the navigation
    await page.screenshot({
      path: 'screenshots/desktop-navigation.png',
      clip: { x: 0, y: 0, width: 1920, height: 100 }
    });
  });

  test('Footer - White Logo Check', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to footer
    await page.locator('.footer').scrollIntoViewIfNeeded();

    // Check footer has logo
    const footerLogo = page.locator('.footer-logo');
    await expect(footerLogo).toBeVisible();

    await page.screenshot({
      path: 'screenshots/desktop-footer.png',
      clip: { x: 0, y: 0, width: 1920, height: 600 }
    });
  });
});
