import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

test.describe('Desktop Screenshots - November Requirements Review', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('Homepage - Desktop', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Full page screenshot
    await page.screenshot({
      path: 'screenshots/desktop-homepage-full.png',
      fullPage: true
    });

    // Hero section
    await page.screenshot({
      path: 'screenshots/desktop-homepage-hero.png',
      clip: { x: 0, y: 0, width: 1920, height: 800 }
    });
  });

  test('Homepage - Features Section', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to features section
    await page.locator('.features-grid').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'screenshots/desktop-homepage-features.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });

  test('Homepage - How It Works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to How It Works section
    await page.locator('.how-it-works').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'screenshots/desktop-homepage-how-it-works.png',
      clip: { x: 0, y: 0, width: 1920, height: 900 }
    });
  });

  test('Homepage - Insights Carousel', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to insights
    await page.locator('.insights-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Wait for carousel to settle
    await page.screenshot({
      path: 'screenshots/desktop-homepage-insights.png',
      clip: { x: 0, y: 0, width: 1920, height: 900 }
    });
  });

  test('Solutions Page - Desktop', async ({ page }) => {
    await page.goto(`${BASE_URL}/solutions`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/desktop-solutions-full.png',
      fullPage: true
    });

    // Platform Overview section
    await page.locator('.pillars-grid').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'screenshots/desktop-solutions-pillars.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });

  test('Solutions - Distribution Channels', async ({ page }) => {
    await page.goto(`${BASE_URL}/solutions`);
    await page.waitForLoadState('networkidle');

    // Scroll to distribution section
    await page.locator('.distribution-grid').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'screenshots/desktop-solutions-distribution.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });

  test('Company Page - Desktop', async ({ page }) => {
    await page.goto(`${BASE_URL}/company`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/desktop-company-full.png',
      fullPage: true
    });

    // Values section
    await page.locator('.values-grid').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'screenshots/desktop-company-values.png',
      clip: { x: 0, y: 0, width: 1920, height: 800 }
    });
  });

  test('Contact Page - Desktop', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/desktop-contact-full.png',
      fullPage: true
    });
  });

  test('Insights Page - Desktop', async ({ page }) => {
    await page.goto(`${BASE_URL}/insights`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/desktop-insights-full.png',
      fullPage: true
    });
  });

  test('Navigation - White Logo Check', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Check navigation has logo
    const logo = page.locator('.navbar-logo');
    await expect(logo).toBeVisible();

    // Screenshot just the navigation
    await page.screenshot({
      path: 'screenshots/desktop-navigation.png',
      clip: { x: 0, y: 0, width: 1920, height: 100 }
    });
  });

  test('Footer - White Logo Check', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to footer
    await page.locator('.footer').scrollIntoViewIfNeeded();

    // Check footer has logo
    const footerLogo = page.locator('.footer-logo');
    await expect(footerLogo).toBeVisible();

    await page.screenshot({
      path: 'screenshots/desktop-footer.png',
      clip: { x: 0, y: 0, width: 1920, height: 600 }
    });
  });

  test('Homepage - Hero CTA Section', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Capture hero CTA with new nav link
    await page.screenshot({
      path: 'screenshots/desktop-hero-cta.png',
      clip: { x: 0, y: 550, width: 1920, height: 250 }
    });
  });

  test('Homepage - Carousel Controls Detail', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.insights-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Capture carousel controls including new pause button
    await page.screenshot({
      path: 'screenshots/desktop-carousel-controls.png',
      clip: { x: 600, y: 0, width: 720, height: 150 }
    });
  });

  test('Homepage - Carousel Slide 2', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.insights-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click next button
    const nextBtn = page.locator('.carousel-btn.next').first();
    if (await nextBtn.count() > 0) {
      await nextBtn.click();
      await page.waitForTimeout(800);
    }

    await page.screenshot({
      path: 'screenshots/desktop-carousel-slide-2.png',
      clip: { x: 0, y: 0, width: 1920, height: 900 }
    });
  });

  test('Homepage - Carousel Paused State', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.insights-carousel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click pause button
    const pauseBtn = page.locator('.carousel-btn.pause').first();
    if (await pauseBtn.count() > 0) {
      await pauseBtn.click();
      await page.waitForTimeout(500);
    }

    await page.screenshot({
      path: 'screenshots/desktop-carousel-paused.png',
      clip: { x: 0, y: 0, width: 1920, height: 900 }
    });
  });

  test('Homepage - CTA Section', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('.cta-section').scrollIntoViewIfNeeded();

    await page.screenshot({
      path: 'screenshots/desktop-cta-section.png',
      clip: { x: 0, y: 0, width: 1920, height: 600 }
    });
  });

  test('Solutions - Integration Section', async ({ page }) => {
    await page.goto(`${BASE_URL}/solutions`);
    await page.waitForLoadState('networkidle');

    // Scroll past pillars to integration section
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/desktop-solutions-integration.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });

  test('Company - Stats Section', async ({ page }) => {
    await page.goto(`${BASE_URL}/company`);
    await page.waitForLoadState('networkidle');

    // Scroll to stats if exists
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/desktop-company-stats.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });

  test('Contact - Form Close-up', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await page.waitForLoadState('networkidle');

    await page.locator('#contact-form').scrollIntoViewIfNeeded();

    await page.screenshot({
      path: 'screenshots/desktop-contact-form.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });

  test('Insights - Newsletter Section', async ({ page }) => {
    await page.goto(`${BASE_URL}/insights`);
    await page.waitForLoadState('networkidle');

    // Scroll to newsletter if exists
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/desktop-insights-newsletter.png',
      clip: { x: 0, y: 0, width: 1920, height: 600 }
    });
  });

  test('Insights - Click First Article', async ({ page }) => {
    await page.goto(`${BASE_URL}/insights`);
    await page.waitForLoadState('networkidle');

    // Try to click first insight card
    const firstCard = page.locator('.insight-card, article a').first();
    if (await firstCard.count() > 0) {
      const href = await firstCard.getAttribute('href');
      if (href) {
        await page.goto(`${BASE_URL}${href}`);
        await page.waitForLoadState('networkidle');

        await page.screenshot({
          path: 'screenshots/desktop-insight-article.png',
          fullPage: true
        });
      }
    }
  });

  test('Scroll to Top Button - Visible State', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll down to make button visible
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'screenshots/desktop-scroll-button-visible.png',
      clip: { x: 1700, y: 700, width: 200, height: 200 }
    });
  });
});
