import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Automated Blog Login Test
 *
 * Uses credentials from .playwright/.credentials file
 * Run with: npx playwright test tests/blog-auto-login.spec.ts --headed --project=chromium
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

test.describe('Automated Blog Login', () => {
  test('Login with LinkedIn credentials and test blog functionality', async ({ page }) => {
    const { email, password } = getCredentials();

    // Go to login page
    await page.goto('http://localhost:4321/blog/login');
    await expect(page.locator('text=Continue with LinkedIn')).toBeVisible();

    console.log('\n📝 Starting automated LinkedIn OAuth flow...');

    // Click LinkedIn login
    await page.click('text=Continue with LinkedIn');

    // Wait for LinkedIn page
    await page.waitForURL(/linkedin\.com/, { timeout: 15000 });

    console.log('📝 On LinkedIn login page, entering credentials...');

    // Fill in LinkedIn credentials
    // LinkedIn's login page structure can vary, so we try multiple selectors
    try {
      // Try standard login form
      await page.waitForSelector('input[name="session_key"], input#username', { timeout: 5000 });

      // Email field
      const emailInput = page.locator('input[name="session_key"], input#username').first();
      await emailInput.fill(email);

      // Password field
      const passwordInput = page.locator('input[name="session_password"], input#password').first();
      await passwordInput.fill(password);

      // Submit button
      const submitBtn = page.locator('button[type="submit"], button:has-text("Sign in")').first();
      await submitBtn.click();

      console.log('📝 Submitted login form...');

    } catch (e) {
      console.log('⚠️ Could not find standard login form, may already be logged in');
    }

    // Wait for redirect back to our site (or auth challenge)
    try {
      await page.waitForURL(/localhost:4321\/blog/, { timeout: 30000 });
      console.log('✅ Redirected back to site!');
    } catch {
      // Check if we hit a verification/challenge page
      const currentUrl = page.url();
      if (currentUrl.includes('checkpoint') || currentUrl.includes('challenge')) {
        console.log('\n⚠️ LinkedIn security challenge detected');
        console.log('Please complete the verification manually');
        await page.waitForURL(/localhost:4321\/blog/, { timeout: 120000 });
      } else {
        throw new Error(`Unexpected page: ${currentUrl}`);
      }
    }

    // Verify we're authenticated
    const url = page.url();
    if (url.includes('/blog/editor')) {
      console.log('✅ Successfully authenticated and on editor page!');
    } else if (url.includes('error=')) {
      const errorParam = new URL(url).searchParams.get('error');
      throw new Error(`Authentication failed: ${errorParam}`);
    }

    // Test the editor
    await page.goto('http://localhost:4321/blog/editor');
    await expect(page.locator('text=Write Article')).toBeVisible();

    // Clear existing draft
    await page.evaluate(() => localStorage.removeItem('article-draft'));

    // Create a test post
    const testTitle = `Automated Test ${new Date().toISOString()}`;
    await page.fill('input[placeholder="Title"]', testTitle);

    await page.click('[contenteditable="true"]');
    await page.keyboard.type('This post was created by automated Playwright test.');

    // Save draft
    await page.click('button:has-text("Save Draft")');
    await expect(page.locator('text=Saved!')).toBeVisible({ timeout: 5000 });
    console.log('✅ Draft created and saved!');

    // Test preview
    await page.click('#preview-btn');
    await expect(page.locator('#preview-modal')).toBeVisible();
    await page.click('#close-preview');
    console.log('✅ Preview modal works!');

    // Navigate to manage
    await page.click('text=Manage');
    await expect(page.locator('text=Manage Insights')).toBeVisible();
    console.log('✅ Manage page works!');

    // Clean up draft
    await page.goto('http://localhost:4321/blog/editor');
    await page.evaluate(() => localStorage.removeItem('article-draft'));

    // Logout
    await page.click('#user-menu-btn');
    await page.click('text=Logout');
    await expect(page).toHaveURL(/\/blog\/login/);
    console.log('✅ Logged out successfully!');

    console.log('\n🎉 ALL AUTOMATED TESTS PASSED!\n');
  });
});
