import { test } from '@playwright/test';

test('Debug hero text colors', async ({ page, context }) => {
  await context.addCookies([{
    name: 'cookie_consent',
    value: 'accepted',
    domain: 'localhost',
    path: '/',
  }]);

  await page.goto('http://localhost:4321/solutions');
  await page.waitForLoadState('networkidle');

  const styles = await page.evaluate(() => {
    const title = document.querySelector('.page-title');
    const subtitle = document.querySelector('.page-subtitle');
    const hero = document.querySelector('.page-hero');
    
    const getStyles = (el: Element | null) => {
      if (!el) return null;
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        opacity: computed.opacity
      };
    };
    
    return {
      hero: getStyles(hero),
      title: getStyles(title),
      subtitle: getStyles(subtitle)
    };
  });
  
  console.log('\n=== Hero Section Computed Styles ===');
  console.log('Hero:', JSON.stringify(styles.hero, null, 2));
  console.log('Title:', JSON.stringify(styles.title, null, 2));
  console.log('Subtitle:', JSON.stringify(styles.subtitle, null, 2));
});
