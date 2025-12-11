import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Blog Publish Test
 * Tests both Save Draft and Publish functionality
 *
 * Run with: npx playwright test tests/blog-publish.spec.ts --headed --project=chromium
 */

// Read credentials
function getCredentials() {
  const credsPath = path.join(process.cwd(), '.playwright/.credentials');
  if (!fs.existsSync(credsPath)) {
    throw new Error('Credentials file not found. Create .playwright/.credentials with LINKEDIN_EMAIL and LINKEDIN_PASSWORD');
  }

  const content = fs.readFileSync(credsPath, 'utf-8');
  const lines = content.split('\n');

  let email = '';
  let password = '';

  for (const line of lines) {
    if (line.startsWith('LINKEDIN_EMAIL=')) {
      email = line.split('=')[1].trim();
    }
    if (line.startsWith('LINKEDIN_PASSWORD=')) {
      password = line.split('=')[1].trim();
    }
  }

  if (!email || !password) {
    throw new Error('Missing LINKEDIN_EMAIL or LINKEDIN_PASSWORD in credentials file');
  }

  return { email, password };
}

test.describe.configure({ mode: 'serial' });

test.describe('Blog Publish Tests', () => {
  test('Login, create draft, and publish a post', async ({ page }) => {
    const { email, password } = getCredentials();

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
      // Need to log in
      try {
        await page.waitForURL(/linkedin\.com/, { timeout: 15000 });
        console.log('📝 On LinkedIn login page, entering credentials...');

        // Fill in credentials
        await page.waitForSelector('input[name="session_key"], input#username', { timeout: 5000 });
        await page.locator('input[name="session_key"], input#username').first().fill(email);
        await page.locator('input[name="session_password"], input#password').first().fill(password);
        await page.locator('button[type="submit"], button:has-text("Sign in")').first().click();

        console.log('📝 Submitted login form...');
      } catch (e) {
        console.log('⚠️ Could not find standard login form');
      }

      // Wait for redirect back
      try {
        await page.waitForURL(/localhost:4321\/blog/, { timeout: 60000 });
        console.log('✅ Redirected back to site!');
      } catch {
        const currentUrl = page.url();
        if (currentUrl.includes('checkpoint') || currentUrl.includes('challenge')) {
          console.log('\n⚠️ LinkedIn security challenge - please complete manually');
          await page.waitForURL(/localhost:4321\/blog/, { timeout: 120000 });
        } else {
          throw new Error(`Unexpected page: ${currentUrl}`);
        }
      }
    }

    // Verify we're authenticated
    const url = page.url();
    if (url.includes('/blog/editor') || url.includes('/blog/manage')) {
      console.log('✅ Login successful!');
    } else {
      console.log('Current URL:', url);
    }

    // Navigate to editor
    await page.goto('http://localhost:4321/blog/editor');
    await expect(page.locator('text=Write Article')).toBeVisible();
    console.log('✅ On editor page');

    // Clear any existing draft
    await page.evaluate(() => localStorage.removeItem('article-draft'));

    // Create a unique test post
    const testId = Date.now();
    const testTitle = `Test Publish ${testId}`;
    const testContent = `This is a test post created at ${new Date().toISOString()} to verify publish functionality.`;

    // Fill in the title
    await page.fill('input[placeholder="Title"]', testTitle);
    console.log(`✅ Title entered: ${testTitle}`);

    // Fill in content
    await page.click('[contenteditable="true"]');
    await page.keyboard.type(testContent);
    console.log('✅ Content entered');

    // Test 1: Save Draft
    console.log('\n--- Testing Save Draft ---');

    // Listen for the API response
    const draftResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/blog/publish') && response.status() === 200
    );

    // Click Save Draft
    await page.click('#save-draft');
    console.log('📝 Clicked Save Draft...');

    // Wait for the response
    const draftResponse = await draftResponsePromise;
    const draftResult = await draftResponse.json();

    console.log('Draft Response:', JSON.stringify(draftResult, null, 2));

    expect(draftResult.success).toBe(true);
    expect(draftResult.status).toBe('draft');
    expect(draftResult.id).toBeTruthy();
    console.log(`✅ Draft saved with ID: ${draftResult.id}`);

    // Wait for the success indicator
    await expect(page.locator('.save-text:has-text("Saved!")')).toBeVisible({ timeout: 5000 });
    console.log('✅ Save indicator shown');

    // Test 2: Publish
    console.log('\n--- Testing Publish ---');

    // Wait for dialog
    page.on('dialog', async dialog => {
      console.log('Dialog message:', dialog.message());
      await dialog.accept();
    });

    // Listen for the API response
    const publishResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/blog/publish') && response.status() === 200
    );

    // Click Publish
    await page.click('#publish-btn');
    console.log('📝 Clicked Publish...');

    // Wait for the response
    const publishResponse = await publishResponsePromise;
    const publishResult = await publishResponse.json();

    console.log('Publish Response:', JSON.stringify(publishResult, null, 2));

    expect(publishResult.success).toBe(true);
    expect(publishResult.status).toBe('published');
    expect(publishResult.post.url).toContain('retailaer.us/blog/');
    console.log(`✅ Post published at: ${publishResult.post.url}`);

    // Verify the commit info
    expect(publishResult.commit).toBeTruthy();
    expect(publishResult.commit.sha).toBeTruthy();
    console.log(`✅ Commit SHA: ${publishResult.commit.sha}`);

    // Clean up - clear draft
    await page.evaluate(() => localStorage.removeItem('article-draft'));

    // Logout
    await page.click('#user-menu-btn');
    await page.click('text=Logout');
    await expect(page).toHaveURL(/\/blog\/login/);
    console.log('✅ Logged out');

    console.log('\n🎉 ALL PUBLISH TESTS PASSED!\n');
    console.log(`Post URL: ${publishResult.post.url}`);
    console.log(`Note: The post will be live after Cloudflare Pages deploys (1-2 minutes)`);
  });
});
