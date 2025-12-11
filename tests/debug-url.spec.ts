import { test, expect } from '@playwright/test';

test('Debug URL after navigation', async ({ page, context }) => {
  await context.addCookies([{
    name: 'cookie_consent',
    value: 'accepted',
    domain: 'localhost',
    path: '/',
  }]);

  console.log('\n=== Navigating to /2/ ===');
  const response = await page.goto('http://localhost:4321/2/');
  console.log('Response URL:', response?.url());
  console.log('Page URL after goto:', page.url());
  
  await page.waitForLoadState('networkidle');
  console.log('Page URL after networkidle:', page.url());
  
  const dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('data-theme:', dataTheme);
  
  // Check the HTML source
  const html = await page.content();
  const match = html.match(/data-theme="([^"]+)"/);
  console.log('data-theme from HTML source:', match ? match[1] : 'NOT FOUND');
});
