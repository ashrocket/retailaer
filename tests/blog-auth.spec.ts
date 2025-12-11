import { test, expect } from '@playwright/test';

/**
 * Blog Authentication Test
 *
 * This test helps verify the LinkedIn OAuth flow for the blog system.
 * Since OAuth requires manual login, run with --headed and --timeout=0
 *
 * Usage:
 *   npx playwright test tests/blog-auth.spec.ts --headed --timeout=0
 */

test.describe('Blog Authentication', () => {
  test('should navigate to login page and show LinkedIn button', async ({ page }) => {
    await page.goto('http://localhost:4321/blog/login');

    // Check login page elements
    await expect(page.locator('text=Sign in to continue')).toBeVisible();
    await expect(page.locator('text=Continue with LinkedIn')).toBeVisible();
    await expect(page.locator('text=Authorized Authors')).toBeVisible();

    // Verify authorized authors are listed
    await expect(page.locator('text=Ann Cederhall')).toBeVisible();
    await expect(page.locator('text=Anders Löfgren')).toBeVisible();
    await expect(page.locator('text=Ashley Raiteri')).toBeVisible();
  });

  test('LinkedIn OAuth flow - manual login required', async ({ page }) => {
    // This test requires manual intervention
    // Run with: npx playwright test tests/blog-auth.spec.ts --headed --timeout=0

    await page.goto('http://localhost:4321/blog/login');

    // Click LinkedIn login
    await page.click('text=Continue with LinkedIn');

    // Wait for LinkedIn OAuth page
    await page.waitForURL(/linkedin\.com/, { timeout: 10000 });

    console.log('\n=== MANUAL LOGIN REQUIRED ===');
    console.log('Please log in with your LinkedIn credentials in the browser');
    console.log('The test will continue after successful authentication\n');

    // Wait for redirect back to our site (with very long timeout for manual login)
    await page.waitForURL(/localhost:4321\/blog\/(editor|login)/, { timeout: 120000 });

    // Check if we're on the editor (success) or login with error
    const url = page.url();

    if (url.includes('/blog/editor')) {
      console.log('✅ Successfully authenticated!');
      await expect(page.locator('text=Write Article')).toBeVisible();

      // Take a screenshot of the editor
      await page.screenshot({ path: 'tests/screenshots/blog-editor-authenticated.png' });
    } else if (url.includes('error=')) {
      const errorParam = new URL(url).searchParams.get('error');
      console.log(`❌ Authentication failed with error: ${errorParam}`);

      // Take screenshot of error
      await page.screenshot({ path: 'tests/screenshots/blog-login-error.png' });
    }
  });
});

test.describe('Blog Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Skip if not authenticated - this needs a valid session cookie
    await page.goto('http://localhost:4321/blog/editor');

    // Check if we're redirected to login
    if (page.url().includes('/blog/login')) {
      test.skip();
    }
  });

  test('should show editor interface when authenticated', async ({ page }) => {
    await expect(page.locator('text=Write Article')).toBeVisible();
    await expect(page.locator('input[placeholder="Title"]')).toBeVisible();
    await expect(page.locator('[contenteditable="true"]')).toBeVisible();
    await expect(page.locator('text=Publish')).toBeVisible();
  });

  test('should save draft to localStorage', async ({ page }) => {
    // Type a title
    await page.fill('input[placeholder="Title"]', 'Test Blog Post');

    // Type some content
    await page.click('[contenteditable="true"]');
    await page.keyboard.type('This is a test blog post content.');

    // Click save draft
    await page.click('text=Save Draft');

    // Wait for save confirmation
    await expect(page.locator('text=Saved!')).toBeVisible({ timeout: 3000 });

    // Verify localStorage
    const draft = await page.evaluate(() => localStorage.getItem('article-draft'));
    expect(draft).toBeTruthy();

    const draftData = JSON.parse(draft!);
    expect(draftData.title).toBe('Test Blog Post');
    expect(draftData.content).toContain('test blog post content');
  });

  test('should show preview modal', async ({ page }) => {
    // Add content first
    await page.fill('input[placeholder="Title"]', 'Preview Test');
    await page.click('[contenteditable="true"]');
    await page.keyboard.type('Content for preview.');

    // Click preview
    await page.click('#preview-btn');

    // Verify preview modal
    await expect(page.locator('#preview-modal')).toBeVisible();
    await expect(page.locator('#preview-body h1')).toContainText('Preview Test');

    // Close preview
    await page.click('#close-preview');
    await expect(page.locator('#preview-modal')).not.toBeVisible();
  });
});

test.describe('Blog Manage Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4321/blog/manage');

    if (page.url().includes('/blog/login')) {
      test.skip();
    }
  });

  test('should show manage interface', async ({ page }) => {
    await expect(page.locator('text=Manage Insights')).toBeVisible();
    await expect(page.locator('text=Insights & Articles')).toBeVisible();
  });
});
