/**
 * Screenshot script for mobile layout review
 * Captures homepage at iPhone 15 dimensions
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// iPhone 15 dimensions (as per Apple specs)
const IPHONE_15_VIEWPORT = {
  width: 393,
  height: 852,
};

async function captureScreenshots() {
  console.log('🚀 Starting screenshot capture...');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: IPHONE_15_VIEWPORT,
    deviceScaleFactor: 3, // iPhone 15 has 3x pixel density
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // Create output directory
  const outputDir = join(__dirname, 'designs', 'review');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log(`📱 Device: iPhone 15 (${IPHONE_15_VIEWPORT.width}x${IPHONE_15_VIEWPORT.height})`);
  console.log(`📂 Output: ${outputDir}`);

  try {
    // Navigate to local dev server (assuming it's running)
    const url = 'http://localhost:4321'; // Astro default port
    console.log(`🌐 Loading ${url}...`);

    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait a bit for animations to settle
    await page.waitForTimeout(2000);

    // Capture full page screenshot
    const fullPagePath = join(outputDir, 'mobile-homepage-full.png');
    await page.screenshot({
      path: fullPagePath,
      fullPage: true
    });
    console.log(`✅ Full page: ${fullPagePath}`);

    // Capture hero section only (above the fold)
    const heroPath = join(outputDir, 'mobile-hero-section.png');
    await page.screenshot({
      path: heroPath,
      clip: {
        x: 0,
        y: 0,
        width: IPHONE_15_VIEWPORT.width,
        height: IPHONE_15_VIEWPORT.height,
      }
    });
    console.log(`✅ Hero section (viewport): ${heroPath}`);

    // Capture hero + stats section (first 1200px)
    const heroStatsPath = join(outputDir, 'mobile-hero-stats.png');
    await page.screenshot({
      path: heroStatsPath,
      clip: {
        x: 0,
        y: 0,
        width: IPHONE_15_VIEWPORT.width,
        height: 1200,
      }
    });
    console.log(`✅ Hero + Stats: ${heroStatsPath}`);

    // Get hero section metrics
    const metrics = await page.evaluate(() => {
      const heroSection = document.querySelector('.hero-section');
      const heroContent = document.querySelector('.hero-content');
      const heroVisual = document.querySelector('.hero-visual');
      const airplane = document.querySelector('.airplane-icon');

      return {
        heroHeight: heroSection?.offsetHeight || 0,
        heroTop: heroSection?.offsetTop || 0,
        contentHeight: heroContent?.offsetHeight || 0,
        visualHeight: heroVisual?.offsetHeight || 0,
        airplaneHeight: airplane?.offsetHeight || 0,
        airplaneWidth: airplane?.offsetWidth || 0,
        viewportHeight: window.innerHeight,
      };
    });

    console.log('\n📊 Hero Section Metrics:');
    console.log(`   Viewport Height: ${metrics.viewportHeight}px`);
    console.log(`   Hero Section Height: ${metrics.heroHeight}px`);
    console.log(`   Hero Content Height: ${metrics.contentHeight}px`);
    console.log(`   Hero Visual Height: ${metrics.visualHeight}px`);
    console.log(`   Airplane Icon: ${metrics.airplaneWidth}x${metrics.airplaneHeight}px`);
    console.log(`   Content visible in viewport: ${metrics.contentHeight < metrics.viewportHeight ? 'YES' : 'NO'}`);

    if (metrics.heroHeight > metrics.viewportHeight) {
      console.log(`   ⚠️  Hero section (${metrics.heroHeight}px) exceeds viewport (${metrics.viewportHeight}px) by ${metrics.heroHeight - metrics.viewportHeight}px`);
    }

    console.log('\n✨ Screenshots captured successfully!');
    console.log(`\n📁 Review screenshots at: designs/review/`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the script
captureScreenshots().catch(console.error);
