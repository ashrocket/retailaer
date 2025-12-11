import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

test.describe('Mobile Screenshots - iPhone 15 Pro (393x852)', () => {
  test.use({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
  });

  test('Homepage - Mobile Full', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/mobile-homepage-full.png',
      fullPage: true
    });
  });

  test('Homepage - Hero Section Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/mobile-homepage-hero.png',
      clip: { x: 0, y: 0, width: 393, height: 852 }
    });
  });

  test('Homepage - Mobile Menu Closed', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/mobile-navigation-closed.png',
      clip: { x: 0, y: 0, width: 393, height: 100 }
    });
  });

  test('Homepage - Mobile Menu Open', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Click hamburger menu - try different selectors
    const menuButton = page.locator('button.mobile-menu-btn, .hamburger, [aria-label*="menu" i]').first();
    if (await menuButton.count() > 0) {
      await menuButton.click();
      await page.waitForTimeout(500); // Wait for animation
    }

    await page.screenshot({
      path: 'screenshots/mobile/mobile-navigation-open.png',
      clip: { x: 0, y: 0, width: 393, height: 600 }
    });
  });

  test('Homepage - Features Section Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.features-grid').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-homepage-features.png',
      clip: { x: 0, y: 0, width: 393, height: 1200 }
    });
  });

  test('Homepage - How It Works Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.how-it-works').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-homepage-how-it-works.png',
      clip: { x: 0, y: 0, width: 393, height: 1200 }
    });
  });

  test('Homepage - Insights Carousel Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.insights-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-homepage-insights.png',
      clip: { x: 0, y: 0, width: 393, height: 1000 }
    });
  });

  test('Homepage - Carousel with Pause Button', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.insights-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Highlight the pause button area
    await page.screenshot({
      path: 'screenshots/mobile/mobile-carousel-controls.png',
      clip: { x: 0, y: 0, width: 393, height: 700 }
    });
  });

  test('Homepage - Scroll to Top Button Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll down to trigger scroll-to-top button
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-scroll-to-top.png',
      clip: { x: 0, y: 0, width: 393, height: 852 }
    });
  });

  test('Solutions Page - Mobile Full', async ({ page }) => {
    await page.goto(`${BASE_URL}/solutions`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/mobile-solutions-full.png',
      fullPage: true
    });
  });

  test('Solutions - Pillars Mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}/solutions`);
    await page.waitForLoadState('networkidle');

    await page.locator('.pillars-grid').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-solutions-pillars.png',
      clip: { x: 0, y: 0, width: 393, height: 1200 }
    });
  });

  test('Company Page - Mobile Full', async ({ page }) => {
    await page.goto(`${BASE_URL}/company`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/mobile-company-full.png',
      fullPage: true
    });
  });

  test('Contact Page - Mobile Full', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/mobile-contact-full.png',
      fullPage: true
    });
  });

  test('Contact - Form Mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await page.waitForLoadState('networkidle');

    await page.locator('#contact-form').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-contact-form.png',
      clip: { x: 0, y: 0, width: 393, height: 1200 }
    });
  });

  test('Insights Page - Mobile Full', async ({ page }) => {
    await page.goto(`${BASE_URL}/insights`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/mobile-insights-full.png',
      fullPage: true
    });
  });

  test('Footer - Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-footer.png',
      clip: { x: 0, y: 0, width: 393, height: 800 }
    });
  });

  test('Homepage - CTA Buttons Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Capture hero CTA section with new nav link
    await page.screenshot({
      path: 'screenshots/mobile/mobile-hero-cta-buttons.png',
      clip: { x: 0, y: 450, width: 393, height: 300 }
    });
  });

  test('Homepage - Why Retailaer Section Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('#why-retailaer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-why-retailaer.png',
      clip: { x: 0, y: 0, width: 393, height: 1200 }
    });
  });

  test('Homepage - Feature Card Expanded', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.features-grid').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Try to click/expand first feature card
    const firstCard = page.locator('.feature-card, .expandable-card').first();
    if (await firstCard.count() > 0) {
      await firstCard.click();
      await page.waitForTimeout(500);
    }

    await page.screenshot({
      path: 'screenshots/mobile/mobile-feature-card-expanded.png',
      clip: { x: 0, y: 0, width: 393, height: 1200 }
    });
  });

  test('Carousel - First Slide Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.insights-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-carousel-slide-1.png',
      clip: { x: 0, y: 0, width: 393, height: 800 }
    });
  });

  test('Carousel - Navigation Interaction Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.insights-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click next button
    const nextBtn = page.locator('.carousel-btn.next, button[aria-label*="next" i]').first();
    if (await nextBtn.count() > 0) {
      await nextBtn.click();
      await page.waitForTimeout(800);
    }

    await page.screenshot({
      path: 'screenshots/mobile/mobile-carousel-slide-2.png',
      clip: { x: 0, y: 0, width: 393, height: 800 }
    });
  });

  test('Carousel - Paused State Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.insights-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click pause button
    const pauseBtn = page.locator('.carousel-btn.pause, button[aria-label*="pause" i]').first();
    if (await pauseBtn.count() > 0) {
      await pauseBtn.click();
      await page.waitForTimeout(500);
    }

    await page.screenshot({
      path: 'screenshots/mobile/mobile-carousel-paused.png',
      clip: { x: 0, y: 0, width: 393, height: 800 }
    });
  });

  test('Solutions - Hero Mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}/solutions`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/mobile-solutions-hero.png',
      clip: { x: 0, y: 0, width: 393, height: 852 }
    });
  });

  test('Solutions - Distribution Section Mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}/solutions`);
    await page.waitForLoadState('networkidle');

    await page.locator('.distribution-grid').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-solutions-distribution.png',
      clip: { x: 0, y: 0, width: 393, height: 1200 }
    });
  });

  test('Company - Hero Mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}/company`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/mobile-company-hero.png',
      clip: { x: 0, y: 0, width: 393, height: 852 }
    });
  });

  test('Company - Values Section Mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}/company`);
    await page.waitForLoadState('networkidle');

    await page.locator('.values-grid').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-company-values.png',
      clip: { x: 0, y: 0, width: 393, height: 1200 }
    });
  });

  test('Contact - Hero Mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/mobile-contact-hero.png',
      clip: { x: 0, y: 0, width: 393, height: 852 }
    });
  });

  test('Contact - Form Fields Focus Mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await page.waitForLoadState('networkidle');

    await page.locator('#contact-form').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Focus first input to show mobile keyboard state
    const firstInput = page.locator('#contact-form input').first();
    if (await firstInput.count() > 0) {
      await firstInput.click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: 'screenshots/mobile/mobile-contact-form-focused.png',
      clip: { x: 0, y: 0, width: 393, height: 1200 }
    });
  });

  test('Insights - Hero Mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}/insights`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/mobile-insights-hero.png',
      clip: { x: 0, y: 0, width: 393, height: 852 }
    });
  });

  test('Insights - Article Cards Mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}/insights`);
    await page.waitForLoadState('networkidle');

    // Scroll to article cards
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-insights-articles.png',
      clip: { x: 0, y: 0, width: 393, height: 1200 }
    });
  });

  test('CTA Section Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.cta-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-cta-section.png',
      clip: { x: 0, y: 0, width: 393, height: 600 }
    });
  });

  test('Scroll Progress - Mid Page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to middle of page
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-scroll-mid-page.png',
      clip: { x: 0, y: 0, width: 393, height: 852 }
    });
  });

  test('Navigation - Section Links Mobile', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to section navigation
    await page.locator('.section-nav').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/mobile/mobile-section-navigation.png',
      clip: { x: 0, y: 0, width: 393, height: 600 }
    });
  });
});

// Additional test suite for landscape mode
test.describe('Mobile Screenshots - Landscape Mode (852x393)', () => {
  test.use({
    viewport: { width: 852, height: 393 },
    deviceScaleFactor: 3,
  });

  test('Homepage - Landscape Hero', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/landscape-homepage-hero.png',
      fullPage: false
    });
  });

  test('Carousel - Landscape View', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.insights-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'screenshots/mobile/landscape-carousel.png',
      clip: { x: 0, y: 0, width: 852, height: 393 }
    });
  });

  test('Solutions - Landscape View', async ({ page }) => {
    await page.goto(`${BASE_URL}/solutions`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/mobile/landscape-solutions.png',
      clip: { x: 0, y: 0, width: 852, height: 393 }
    });
  });
});
