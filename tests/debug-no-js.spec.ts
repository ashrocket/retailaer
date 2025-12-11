import { test, expect } from '@playwright/test';

test('Debug theme without JavaScript', async ({ browser }) => {
  // Create context with JavaScript disabled
  const context = await browser.newContext({
    javaScriptEnabled: false
  });
  
  await context.addCookies([{
    name: 'cookie_consent',
    value: 'accepted',
    domain: 'localhost',
    path: '/',
  }]);

  const page = await context.newPage();
  
  console.log('\n=== Navigating to /2/ with JS disabled ===');
  await page.goto('http://localhost:4321/2/');
  
  const html = await page.content();
  const match = html.match(/data-theme="([^"]+)"/);
  console.log('data-theme from HTML source:', match ? match[1] : 'NOT FOUND');
  
  await context.close();
});
