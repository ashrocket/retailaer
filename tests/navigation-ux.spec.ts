import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

test.describe('Section Navigation UX', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('Hero - Dual CTA buttons', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Check both buttons exist
    await expect(page.locator('text=Get in Touch')).toBeVisible();
    await expect(page.locator('text=Need Convincing?')).toBeVisible();

    // Screenshot hero with both CTAs
    await page.screenshot({
      path: 'screenshots/hero-dual-cta.png',
      clip: { x: 0, y: 0, width: 1920, height: 800 }
    });
  });

  test('Why Retailaer - Section Navigation', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to Why Retailaer section
    await page.locator('#why-retailaer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Check navigation buttons
    await expect(page.locator('text=See How It Works →')).toBeVisible();

    await page.screenshot({
      path: 'screenshots/why-retailaer-navigation.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });

  test('How It Works - Multi-button Navigation', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to How It Works
    await page.locator('#how-it-works').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Check all three buttons
    await expect(page.locator('text=See Our Insights →')).toBeVisible();
    await expect(page.locator('text=← Back to Benefits')).toBeVisible();

    await page.screenshot({
      path: 'screenshots/how-it-works-navigation.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });

  test('Scroll to Top Button - Appears on scroll', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Initially hidden
    const scrollBtn = page.locator('#scroll-to-top');
    await expect(scrollBtn).not.toHaveClass(/visible/);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // Should be visible now
    await expect(scrollBtn).toHaveClass(/visible/);

    await page.screenshot({
      path: 'screenshots/scroll-to-top-visible.png',
      fullPage: false
    });
  });

  test('Smooth Scroll - Click "Need Convincing?"', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Click "Need Convincing?" button
    await page.click('text=Need Convincing?');
    await page.waitForTimeout(1000); // Wait for smooth scroll

    // Check we're at Why Retailaer section
    const whySection = page.locator('#why-retailaer');
    await expect(whySection).toBeInViewport();

    await page.screenshot({
      path: 'screenshots/after-scroll-to-why-retailaer.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });
});
