import { test, expect, BrowserContext } from '@playwright/test';

/**
 * Blog End-to-End Tests
 *
 * Tests the complete blog workflow:
 * 1. Login with LinkedIn OAuth
 * 2. Create/save drafts
 * 3. Navigate between editor and manage pages
 *
 * Run with:
 *   npx playwright test tests/blog-e2e.spec.ts --headed --project=chromium
 */

test.describe('Blog E2E Tests', () => {
  // Use a single browser context to maintain login session
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test('1. Login via LinkedIn OAuth', async () => {
    const page = await context.newPage();

    await page.goto('http://localhost:4321/blog/login');

    // Verify login page
    await expect(page.locator('text=Sign in to continue')).toBeVisible();
    await expect(page.locator('text=Continue with LinkedIn')).toBeVisible();

    console.log('\n📝 Starting LinkedIn OAuth flow...');

    // Click LinkedIn login
    await page.click('text=Continue with LinkedIn');

    // Check if we're already logged in to LinkedIn (redirect back quickly)
    // or need to manually login
    try {
      // Wait up to 5 seconds to see if we auto-redirect (already logged in to LinkedIn)
      await page.waitForURL(/localhost:4321\/blog/, { timeout: 5000 });
      console.log('✅ Already authenticated with LinkedIn, redirected automatically');
    } catch {
      // Need manual login
      console.log('\n=== MANUAL LOGIN REQUIRED ===');
      console.log('Please log in with your LinkedIn credentials in the browser');
      console.log('The test will continue after successful authentication\n');

      // Wait for redirect back to our site (longer timeout for manual login)
      await page.waitForURL(/localhost:4321\/blog/, { timeout: 120000 });
    }

    // Check result
    const url = page.url();
    if (url.includes('/blog/editor') || url.includes('/blog/manage')) {
      console.log('✅ Successfully logged in!');
      await page.screenshot({ path: 'tests/screenshots/1-login-success.png' });
    } else if (url.includes('error=')) {
      const errorParam = new URL(url).searchParams.get('error');
      console.log(`❌ Login failed: ${errorParam}`);
      await page.screenshot({ path: 'tests/screenshots/1-login-error.png' });
      throw new Error(`Login failed: ${errorParam}`);
    }

    await page.close();
  });

  test('2. Navigate to Editor and verify interface', async () => {
    const page = await context.newPage();

    await page.goto('http://localhost:4321/blog/editor');

    // Should be on editor page (not redirected to login)
    await expect(page).toHaveURL(/\/blog\/editor/);
    await expect(page.locator('text=Write Article')).toBeVisible();

    // Verify editor elements
    await expect(page.locator('input[placeholder="Title"]')).toBeVisible();
    await expect(page.locator('[contenteditable="true"]')).toBeVisible();
    await expect(page.locator('button:has-text("Publish")')).toBeVisible();
    await expect(page.locator('button:has-text("Save Draft")')).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/2-editor-interface.png' });
    await page.close();
  });

  test('3. Create and save a draft blog post', async () => {
    const page = await context.newPage();
    await page.goto('http://localhost:4321/blog/editor');

    // Clear any existing draft
    await page.evaluate(() => localStorage.removeItem('article-draft'));

    // Fill in title
    const title = `Test Blog Post ${Date.now()}`;
    await page.fill('input[placeholder="Title"]', title);

    // Fill in content
    await page.click('[contenteditable="true"]');
    await page.keyboard.type('This is a test blog post created by Playwright.');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.type('It demonstrates the blog editor functionality.');

    // Click Save Draft
    await page.click('button:has-text("Save Draft")');

    // Wait for save confirmation
    await expect(page.locator('text=Saved!')).toBeVisible({ timeout: 5000 });

    // Verify draft was saved to localStorage
    const draft = await page.evaluate(() => localStorage.getItem('article-draft'));
    expect(draft).toBeTruthy();

    const draftData = JSON.parse(draft!);
    expect(draftData.title).toBe(title);
    expect(draftData.content).toContain('test blog post');

    console.log('✅ Draft saved successfully');
    await page.screenshot({ path: 'tests/screenshots/3-draft-saved.png' });

    await page.close();
  });

  test('4. Preview blog post', async () => {
    const page = await context.newPage();
    await page.goto('http://localhost:4321/blog/editor');

    // Reload the saved draft
    const draft = await page.evaluate(() => localStorage.getItem('article-draft'));
    expect(draft).toBeTruthy();

    // Wait for draft to load
    await page.waitForTimeout(500);

    // Click Preview button
    await page.click('#preview-btn');

    // Verify preview modal appears
    await expect(page.locator('#preview-modal')).toBeVisible();
    await expect(page.locator('#preview-body h1')).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/4-preview-modal.png' });

    // Close preview
    await page.click('#close-preview');
    await expect(page.locator('#preview-modal')).not.toBeVisible();

    console.log('✅ Preview works correctly');
    await page.close();
  });

  test('5. Navigate to Manage page', async () => {
    const page = await context.newPage();
    await page.goto('http://localhost:4321/blog/manage');

    // Verify we're on the manage page
    await expect(page).toHaveURL(/\/blog\/manage/);
    await expect(page.locator('text=Manage Insights')).toBeVisible();
    await expect(page.locator('text=Insights & Articles')).toBeVisible();

    // Verify mock data is displayed
    await expect(page.locator('text=Dynamic offers')).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/5-manage-page.png' });
    console.log('✅ Manage page works correctly');

    await page.close();
  });

  test('6. Clear draft and verify', async () => {
    const page = await context.newPage();
    await page.goto('http://localhost:4321/blog/editor');

    // Clear the draft
    await page.evaluate(() => localStorage.removeItem('article-draft'));

    // Reload page
    await page.reload();

    // Verify title is empty
    const titleValue = await page.inputValue('input[placeholder="Title"]');
    expect(titleValue).toBe('');

    console.log('✅ Draft cleared successfully');
    await page.screenshot({ path: 'tests/screenshots/6-draft-cleared.png' });

    await page.close();
  });

  test('7. Logout', async () => {
    const page = await context.newPage();
    await page.goto('http://localhost:4321/blog/editor');

    // Click user menu
    await page.click('#user-menu-btn');

    // Wait for dropdown
    await expect(page.locator('#user-dropdown')).toBeVisible();

    // Click logout
    await page.click('text=Logout');

    // Should redirect to login
    await expect(page).toHaveURL(/\/blog\/login/);

    console.log('✅ Logout successful');
    await page.screenshot({ path: 'tests/screenshots/7-logged-out.png' });

    await page.close();
  });
});
