import { test, expect } from '@playwright/test';

test('Debug theme CSS variables', async ({ page, context }) => {
  // Set cookie consent before navigating
  await context.addCookies([{
    name: 'cookie_consent',
    value: 'accepted',
    domain: 'localhost',
    path: '/',
  }]);

  // Test design-2 theme
  await page.goto('http://localhost:4321/2/solutions');
  await page.waitForLoadState('networkidle');

  // Log the actual URL we ended up at
  console.log('Current URL:', page.url());

  // Check the data-theme attribute
  const dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('data-theme:', dataTheme);

  // Check the computed --theme-gradient-hero variable
  const gradient = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue('--theme-gradient-hero');
  });
  console.log('--theme-gradient-hero:', gradient);

  // Check --theme-primary
  const primary = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue('--theme-primary');
  });
  console.log('--theme-primary:', primary);

  // Check the computed background on .page-hero
  const heroBg = await page.evaluate(() => {
    const hero = document.querySelector('.page-hero');
    if (hero) {
      return getComputedStyle(hero).background;
    }
    return 'not found';
  });
  console.log('.page-hero background:', heroBg);

  // Verify the theme is applied
  expect(dataTheme).toBe('design-2');
  // For design-2, primary should be purple #5B21B6
  expect(primary.trim()).toBe('#5B21B6');
});
