import { test, expect } from '@playwright/test';

test('Debug CSS variables for each theme', async ({ page, context }) => {
  await context.addCookies([{
    name: 'cookie_consent',
    value: 'accepted',
    domain: 'localhost',
    path: '/',
  }]);

  const themes = [
    { prefix: '0', name: 'current' },
    { prefix: '1', name: 'design-1' },
    { prefix: '2', name: 'design-2' }
  ];

  for (const theme of themes) {
    await page.goto(`http://localhost:4321/${theme.prefix}/`);
    await page.waitForLoadState('networkidle');
    
    const cssValues = await page.evaluate(() => {
      const html = document.documentElement;
      const computedStyle = window.getComputedStyle(html);
      return {
        dataTheme: html.getAttribute('data-theme'),
        themeGradientHero: computedStyle.getPropertyValue('--theme-gradient-hero'),
        themePrimary: computedStyle.getPropertyValue('--theme-primary'),
        gradientHero: computedStyle.getPropertyValue('--gradient-hero'),
      };
    });
    
    console.log(`\n=== Theme: ${theme.name} (/${theme.prefix}/) ===`);
    console.log('data-theme:', cssValues.dataTheme);
    console.log('--theme-gradient-hero:', cssValues.themeGradientHero);
    console.log('--theme-primary:', cssValues.themePrimary);
    console.log('--gradient-hero:', cssValues.gradientHero);
  }
});
