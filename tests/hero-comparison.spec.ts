import { test } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

test.describe('Hero Section - Before/After Airplane Size Adjustment', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('Hero - New Layout (220px airplane)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Capture hero section
    await page.screenshot({
      path: 'screenshots/hero-after-adjustment.png',
      clip: { x: 0, y: 0, width: 1920, height: 800 }
    });
  });
});
