#!/usr/bin/env node

/**
 * Generate PDF for Figma AI Design Review
 *
 * Uses Playwright to automatically convert the design review HTML to PDF
 * This PDF can be directly imported into Figma for AI analysis
 */

import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const htmlFile = join(__dirname, '../design-review-figma.html');
const pdfFile = join(__dirname, '../design-review-figma.pdf');

console.log('📄 Generating PDF for Figma AI...\n');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Load the HTML file
  await page.goto(`file://${htmlFile}`, { waitUntil: 'networkidle' });

  // Generate PDF with optimal settings for Figma import
  await page.pdf({
    path: pdfFile,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    },
    preferCSSPageSize: false,
  });

  await browser.close();

  console.log('✅ PDF Generated Successfully!\n');
  console.log(`📁 File: ${pdfFile}\n`);
  console.log('🎨 Next Steps:');
  console.log('1. Open Figma');
  console.log('2. Drag design-review-figma.pdf into your Figma file');
  console.log('3. Each page becomes an artboard');
  console.log('4. Ask Figma AI to review the design:\n');
  console.log('   Sample prompts:');
  console.log('   • "Review this design implementation for consistency"');
  console.log('   • "Check if brand colors (#0a5c5c, #f5b800) are used correctly"');
  console.log('   • "Identify any spacing or alignment issues"');
  console.log('   • "Suggest UX improvements for the navigation flow"');
  console.log('   • "Analyze accessibility and contrast ratios"\n');
})();
