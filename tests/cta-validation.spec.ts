import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

test.describe('CTA Button Validation', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('Homepage - Hero CTAs exist and have correct attributes', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Primary CTA: "Get in Touch"
    const primaryCTA = page.locator('.hero-cta a.btn-primary');
    await expect(primaryCTA).toBeVisible();
    await expect(primaryCTA).toHaveText('Get in Touch');
    await expect(primaryCTA).toHaveAttribute('href', '/contact');

    // Secondary CTA: "Need Convincing?"
    const secondaryCTA = page.locator('.hero-cta a.btn-secondary');
    await expect(secondaryCTA).toBeVisible();
    await expect(secondaryCTA).toHaveText('Need Convincing?');
    await expect(secondaryCTA).toHaveAttribute('href', '#why-retailaer');
    await expect(secondaryCTA).toHaveClass(/scroll-link/);
  });

  test('Why Retailaer Section - Navigation buttons work', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to Why Retailaer section
    await page.locator('#why-retailaer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Check "See How It Works" button
    const howItWorksBtn = page.locator('#why-retailaer .section-nav a[href="#how-it-works"]');
    await expect(howItWorksBtn).toBeVisible();
    await expect(howItWorksBtn).toHaveText(/See How It Works/);
    await expect(howItWorksBtn).toHaveClass(/scroll-link/);

    // Check "Get in Touch" button
    const ctaBtn = page.locator('#why-retailaer .section-nav a[href="/contact"]');
    await expect(ctaBtn).toBeVisible();
    await expect(ctaBtn).toHaveText('Get in Touch');
  });

  test('How It Works Section - All three navigation buttons exist', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('#how-it-works').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // "See Our Insights" button
    const insightsBtn = page.locator('#how-it-works .section-nav a[href="#latest-insights"]');
    await expect(insightsBtn).toBeVisible();
    await expect(insightsBtn).toHaveText(/See Our Insights/);

    // "Back to Benefits" button
    const backBtn = page.locator('#how-it-works .section-nav a[href="#why-retailaer"]');
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toHaveText(/Back to Benefits/);

    // "Get in Touch" button
    const ctaBtn = page.locator('#how-it-works .section-nav a[href="/contact"]');
    await expect(ctaBtn).toBeVisible();
    await expect(ctaBtn).toHaveText('Get in Touch');
  });

  test('Final CTA Section - Both buttons present', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to bottom CTA
    await page.locator('.cta-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Primary: "Get in Touch"
    const primaryBtn = page.locator('.cta-section a.btn-primary');
    await expect(primaryBtn).toBeVisible();
    await expect(primaryBtn).toHaveText('Get in Touch');
    await expect(primaryBtn).toHaveAttribute('href', '/contact');

    // Secondary: "Email Us"
    const emailBtn = page.locator('.cta-section a.btn-secondary');
    await expect(emailBtn).toBeVisible();
    await expect(emailBtn).toHaveText('Email Us');
    await expect(emailBtn).toHaveAttribute('href', 'mailto:info@retailaer.com');
  });

  test('Navigation Header - "Get in Touch" button exists', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const navCTA = page.locator('.navbar a.btn-primary');
    await expect(navCTA).toBeVisible();
    await expect(navCTA).toHaveText('Get in Touch');
    await expect(navCTA).toHaveAttribute('href', '/contact');
  });

  test('All "Get in Touch" buttons point to /contact', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Get all "Get in Touch" buttons
    const allCTAs = page.locator('a:has-text("Get in Touch")');
    const count = await allCTAs.count();

    console.log(`Found ${count} "Get in Touch" buttons`);
    expect(count).toBeGreaterThanOrEqual(5); // Nav, Hero, Why Retailaer, How It Works, Final CTA

    // Verify each one points to /contact
    for (let i = 0; i < count; i++) {
      const href = await allCTAs.nth(i).getAttribute('href');
      expect(href).toBe('/contact');
    }
  });

  test('No "Book a Demo" buttons remain (should all be "Get in Touch")', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Check for old "Book a Demo" text (should not exist)
    const bookDemoButtons = page.locator('a:has-text("Book a Demo")');
    const count = await bookDemoButtons.count();

    expect(count).toBe(0); // Should be 0 - all changed to "Get in Touch"
  });
});

test.describe('Scroll Navigation Functionality', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('Click "Need Convincing?" scrolls to Why Retailaer section', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Click the "Need Convincing?" button
    await page.click('text=Need Convincing?');
    await page.waitForTimeout(1000); // Wait for smooth scroll

    // Verify we scrolled to the Why Retailaer section
    const whySection = page.locator('#why-retailaer');
    await expect(whySection).toBeInViewport();
  });

  test('Click "See How It Works" scrolls to How It Works section', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Navigate to Why Retailaer first
    await page.locator('#why-retailaer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Click "See How It Works"
    await page.locator('#why-retailaer .section-nav a[href="#how-it-works"]').click();
    await page.waitForTimeout(1000);

    // Verify we're at How It Works
    const howItWorksSection = page.locator('#how-it-works');
    await expect(howItWorksSection).toBeInViewport();
  });

  test('Click "Back to Benefits" scrolls back to Why Retailaer', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // First scroll to How It Works
    await page.locator('#how-it-works').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Click "Back to Benefits"
    await page.locator('#how-it-works .section-nav a[href="#why-retailaer"]').click();
    await page.waitForTimeout(1000);

    // Verify we're back at Why Retailaer
    const whySection = page.locator('#why-retailaer');
    await expect(whySection).toBeInViewport();
  });

  test('Click "See Our Insights" scrolls to Latest Insights section', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('#how-it-works').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Click "See Our Insights"
    await page.locator('#how-it-works .section-nav a[href="#latest-insights"]').click();
    await page.waitForTimeout(1000);

    // Verify we're at Latest Insights
    const insightsSection = page.locator('#latest-insights');
    await expect(insightsSection).toBeInViewport();
  });

  test('Scroll-to-top button appears after scrolling down', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const scrollBtn = page.locator('#scroll-to-top');

    // Initially should not be visible
    await expect(scrollBtn).not.toHaveClass(/visible/);

    // Scroll down 500px
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // Should now be visible
    await expect(scrollBtn).toHaveClass(/visible/);
  });

  test('Click scroll-to-top button returns to top of page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(300);

    // Click scroll-to-top
    await page.click('#scroll-to-top');
    await page.waitForTimeout(1000);

    // Verify we're at the top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100); // Should be near top (allowing for smooth scroll)
  });
});

test.describe('CTA Email Validation', () => {
  test('All email CTAs use info@retailaer.com (not sales@retailair.com)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Check for old email
    const oldEmail = page.locator('a[href*="sales@retailair.com"]');
    const oldCount = await oldEmail.count();
    expect(oldCount).toBe(0); // Should be 0

    // Check for new email in final CTA
    const emailBtn = page.locator('.cta-section a[href="mailto:info@retailaer.com"]');
    await expect(emailBtn).toBeVisible();
    await expect(emailBtn).toHaveText('Email Us');
  });

  test('Footer email link uses info@retailaer.com', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const footerEmail = page.locator('.footer a[href="mailto:info@retailaer.com"]');
    await expect(footerEmail).toBeVisible();
    await expect(footerEmail).toHaveText('info@retailaer.com');
  });
});
