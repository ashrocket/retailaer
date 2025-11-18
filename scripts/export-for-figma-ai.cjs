#!/usr/bin/env node

/**
 * Export Design Review for Figma AI
 *
 * Creates a structured HTML document that Figma AI can analyze.
 * Also generates a PDF version for direct import.
 *
 * Usage:
 *   node scripts/export-for-figma-ai.cjs
 *
 * Outputs:
 *   - design-review-figma.html (opens in browser for PDF export)
 *   - design-review-figma.pdf (if Playwright is used)
 *   - Guidance on importing to Figma
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const htmlFile = path.join(__dirname, '../design-review-figma.html');
const outputDir = path.join(__dirname, '../design-review-output');

console.log('🎨 Figma AI Design Review Export\n');

// Verify HTML file exists
if (!fs.existsSync(htmlFile)) {
  console.error('❌ Error: design-review-figma.html not found');
  process.exit(1);
}

// Verify screenshots directory exists
const screenshotsDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) {
  console.error('❌ Error: screenshots/ directory not found');
  console.error('   Run: npx playwright test tests/desktop-screenshots.spec.ts');
  process.exit(1);
}

// Count screenshots
const screenshots = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
console.log(`✓ Found ${screenshots.length} screenshots\n`);

console.log('📋 Figma AI Import Options:\n');

console.log('OPTION 1: PDF Import (Recommended for Figma AI)');
console.log('─────────────────────────────────────────────────');
console.log('1. Opening design-review-figma.html in browser...');
console.log('2. Use browser Print to PDF:');
console.log('   • Chrome: Cmd+P → Save as PDF');
console.log('   • Margins: None');
console.log('   • Background graphics: Enabled');
console.log('   • Save as: design-review-figma.pdf');
console.log('3. Import PDF to Figma:');
console.log('   • Drag PDF into Figma');
console.log('   • Each page becomes an artboard');
console.log('   • Use Figma AI to analyze the design\n');

console.log('OPTION 2: Screenshot Import');
console.log('─────────────────────────────────────────────────');
console.log('1. Drag all PNG files from screenshots/ to Figma');
console.log('2. Arrange on artboards (1920×1080 each)');
console.log('3. Add annotations manually\n');

console.log('OPTION 3: HTML to Figma Plugin');
console.log('─────────────────────────────────────────────────');
console.log('1. Install "HTML to Figma" plugin in Figma');
console.log('2. Open design-review-figma.html');
console.log('3. Use plugin to convert HTML structure\n');

console.log('🤖 Using Figma AI:');
console.log('─────────────────────────────────────────────────');
console.log('Once imported, ask Figma AI:');
console.log('• "Review this design for consistency"');
console.log('• "Check brand color usage across all screens"');
console.log('• "Identify any accessibility issues"');
console.log('• "Suggest improvements to navigation flow"');
console.log('• "Analyze spacing and typography consistency"\n');

// Open HTML file in browser
const openCmd = process.platform === 'darwin' ? 'open' :
                process.platform === 'win32' ? 'start' : 'xdg-open';

exec(`${openCmd} ${htmlFile}`, (err) => {
  if (err) {
    console.log(`⚠️  Could not open HTML file automatically`);
    console.log(`   Open manually: ${htmlFile}\n`);
  } else {
    console.log('✓ Opened design-review-figma.html in browser\n');
  }

  console.log('📁 Files Ready:');
  console.log(`   HTML: ${htmlFile}`);
  console.log(`   Screenshots: ${screenshotsDir}/`);
  console.log(`   Output: ${outputDir}/\n`);

  console.log('✅ Ready for Figma AI design review!');
  console.log('   Next: Print HTML to PDF, then import to Figma');
});
