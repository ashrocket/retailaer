import { test, expect } from '@playwright/test';

/**
 * Simple Blog Test - Sequential tests with persistent context
 *
 * Run with:
 *   npx playwright test tests/blog-simple.spec.ts --headed --project=chromium
 */

// Force tests to run in order
test.describe.configure({ mode: 'serial' });

test.describe('Blog Tests', () => {
  test('Login and test editor', async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:4321/blog/login');
    await expect(page.locator('text=Continue with LinkedIn')).toBeVisible();

    console.log('\n📝 Starting LinkedIn OAuth flow...');

    // Click LinkedIn login
    await page.click('text=Continue with LinkedIn');

    // Wait for LinkedIn page or quick redirect
    try {
      await page.waitForURL(/localhost:4321\/blog/, { timeout: 10000 });
      console.log('✅ Already logged in, redirected automatically');
    } catch {
      console.log('\n=== MANUAL LOGIN REQUIRED ===');
      console.log('Please log in with your LinkedIn credentials');
      await page.waitForURL(/localhost:4321\/blog/, { timeout: 120000 });
    }

    // Check if we're logged in
    const url = page.url();
    if (url.includes('/blog/editor') || url.includes('/blog/manage')) {
      console.log('✅ Login successful!');
    } else {
      console.log('Current URL:', url);
      throw new Error('Login may have failed');
    }

    // Now test the editor
    await page.goto('http://localhost:4321/blog/editor');
    await expect(page.locator('text=Write Article')).toBeVisible();

    // Clear any existing draft
    await page.evaluate(() => localStorage.removeItem('article-draft'));

    // Create a test post
    const testTitle = `Test Post ${Date.now()}`;
    await page.fill('input[placeholder="Title"]', testTitle);

    await page.click('[contenteditable="true"]');
    await page.keyboard.type('This is test content from Playwright.');

    // Save draft
    await page.click('button:has-text("Save Draft")');
    await expect(page.locator('text=Saved!')).toBeVisible({ timeout: 5000 });

    console.log('✅ Draft saved!');

    // Test preview
    await page.click('#preview-btn');
    await expect(page.locator('#preview-modal')).toBeVisible();
    await expect(page.locator('#preview-body')).toContainText(testTitle);
    await page.click('#close-preview');

    console.log('✅ Preview works!');

    // Go to manage page
    await page.click('text=Manage');
    await expect(page.locator('text=Manage Insights')).toBeVisible();

    console.log('✅ Manage page works!');

    // Clean up - clear draft
    await page.goto('http://localhost:4321/blog/editor');
    await page.evaluate(() => localStorage.removeItem('article-draft'));

    // Logout
    await page.click('#user-menu-btn');
    await page.click('text=Logout');
    await expect(page).toHaveURL(/\/blog\/login/);

    console.log('✅ Logout successful!');
    console.log('\n✅ ALL TESTS PASSED!');
  });
});
