import { test } from '@playwright/test';

const themes = [
  {
    name: 'current',
    prefix: '0',
    label: 'Current (Teal/Yellow)',
    description: 'Original RetailAer brand colors - deep teal primary (#0D5C63) with bright yellow accent (#FDB913)'
  },
  {
    name: 'design-1',
    prefix: '1',
    label: 'Design 1 (Blue/Orange)',
    description: 'Corporate professional palette - navy blue primary (#1E3A5F) with vibrant orange accent (#FF6B35)'
  },
  {
    name: 'design-2',
    prefix: '2',
    label: 'Design 2 (Purple/Emerald)',
    description: 'Modern tech palette - royal purple primary (#5B21B6) with emerald green accent (#10B981)'
  },
];

const pages = [
  {
    path: '',
    name: 'homepage',
    description: 'Homepage with hero section, features, and latest insights. Theme affects hero gradient, accent buttons, and all text colors.'
  },
  {
    path: 'solutions',
    name: 'solutions',
    description: 'Solutions page with hero, platform pillars, marketplace, and distribution channels. Theme changes hero gradient and all color accents.'
  },
  {
    path: 'company',
    name: 'company',
    description: 'Company/About page with mission, values, differentiators, and CTA. Theme affects hero, stat numbers, card headings, and accent colors.'
  },
  {
    path: 'contact',
    name: 'contact',
    description: 'Contact page with form and FAQ. Theme affects hero gradient, form focus states, link colors, and card headings.'
  },
];

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

test.describe('Theme Screenshots', () => {
  for (const theme of themes) {
    test.describe(`Theme: ${theme.label}`, () => {
      for (const page of pages) {
        test(`${page.name} - ${theme.name}`, async ({ page: browserPage, context }) => {
          // Set cookie consent before navigating to avoid banner
          await context.addCookies([{
            name: 'cookie_consent',
            value: 'accepted',
            domain: 'localhost',
            path: '/',
          }]);

          // Navigate to the themed page using URL-based routing
          const url = `${BASE_URL}/${theme.prefix}/${page.path}`;
          await browserPage.goto(url);

          // Wait for content to load
          await browserPage.waitForLoadState('networkidle');
          await browserPage.waitForTimeout(500);

          // Hide the theme switcher and cookie banner for cleaner screenshots
          await browserPage.evaluate(() => {
            const switcher = document.getElementById('theme-switcher');
            if (switcher) switcher.style.display = 'none';
            const cookieBanner = document.getElementById('cookie-consent-banner');
            if (cookieBanner) cookieBanner.style.display = 'none';
          });

          // Add annotation banner at top of page
          await browserPage.evaluate(({ themeName, themeDesc, pageName, pageDesc }) => {
            const banner = document.createElement('div');
            banner.id = 'annotation-banner';
            banner.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              background: linear-gradient(to right, #1a1a2e, #16213e);
              color: white;
              padding: 12px 24px;
              z-index: 99999;
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 14px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              justify-content: space-between;
              align-items: center;
            `;
            banner.innerHTML = `
              <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">
                  📄 ${pageName.charAt(0).toUpperCase() + pageName.slice(1)} Page — Theme: ${themeName}
                </div>
                <div style="opacity: 0.85; font-size: 12px;">${pageDesc}</div>
              </div>
              <div style="text-align: right; padding-left: 20px; border-left: 1px solid rgba(255,255,255,0.2); margin-left: 20px;">
                <div style="font-weight: 600; color: #60a5fa; margin-bottom: 2px;">${themeDesc.split(' - ')[0]}</div>
                <div style="font-size: 11px; opacity: 0.8;">${themeDesc.split(' - ')[1] || themeDesc}</div>
              </div>
            `;
            document.body.insertBefore(banner, document.body.firstChild);

            // Shift page content down to make room for banner
            document.body.style.paddingTop = '80px';
          }, {
            themeName: theme.label,
            themeDesc: theme.description,
            pageName: page.name,
            pageDesc: page.description
          });

          // Wait a bit for the banner to render
          await browserPage.waitForTimeout(200);

          // Take full page screenshot
          await browserPage.screenshot({
            path: `theme-screenshots/${theme.name}-${page.name}-full.png`,
            fullPage: true,
          });

          // Take hero/above-fold screenshot
          await browserPage.screenshot({
            path: `theme-screenshots/${theme.name}-${page.name}-hero.png`,
            fullPage: false,
          });
        });
      }
    });
  }
});
