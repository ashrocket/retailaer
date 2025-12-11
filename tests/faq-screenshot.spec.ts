import { test } from '@playwright/test';

test('FAQ page screenshot', async ({ page }) => {
  await page.goto('http://localhost:4321/faq');
  await page.waitForLoadState('networkidle');
  await page.screenshot({
    path: 'contrast-audit/12-faq-page.png',
    fullPage: true
  });
});
