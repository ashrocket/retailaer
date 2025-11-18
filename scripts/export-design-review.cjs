#!/usr/bin/env node

/**
 * Export Design Review to Figma-ready formats
 *
 * Usage:
 *   node scripts/export-design-review.js
 *
 * Outputs:
 *   - Opens design-review-export.html in browser (can screenshot or print to PDF)
 *   - Creates a zip file with all screenshots for easy Figma import
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const screenshotsDir = path.join(__dirname, '../screenshots');
const outputDir = path.join(__dirname, '../design-review-output');
const htmlFile = path.join(__dirname, '../design-review-export.html');

console.log('📸 Retailaer Design Review Export\n');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copy all screenshots to output directory
console.log('Copying screenshots...');
const screenshots = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
screenshots.forEach(file => {
  fs.copyFileSync(
    path.join(screenshotsDir, file),
    path.join(outputDir, file)
  );
});
console.log(`✓ Copied ${screenshots.length} screenshots\n`);

// Create a manifest file for Figma import
const manifest = {
  title: 'Retailaer - November Requirements Desktop Review',
  date: new Date().toISOString().split('T')[0],
  viewport: '1920x1080',
  screenshots: screenshots.map(file => ({
    filename: file,
    label: file.replace('desktop-', '').replace('.png', '').replace(/-/g, ' '),
  }))
};

fs.writeFileSync(
  path.join(outputDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);
console.log('✓ Created manifest.json\n');

console.log('📋 Import Options:\n');
console.log('Option 1: Direct to Figma');
console.log(`  1. Open Figma`);
console.log(`  2. Create new file: "Retailaer Desktop Review"`);
console.log(`  3. Drag all PNG files from: design-review-output/`);
console.log(`  4. Arrange on artboards with annotations\n`);

console.log('Option 2: HTML Review Document');
console.log(`  1. Opening: ${htmlFile}`);
console.log(`  2. Print to PDF or screenshot sections`);
console.log(`  3. Import PDF/screenshots to Figma\n`);

console.log('Option 3: Zip Archive');
console.log(`  Creating zip file for easy sharing...\n`);

// Create zip if available
exec(`cd ${outputDir} && zip -r ../design-review-screenshots.zip *.png manifest.json`, (error) => {
  if (!error) {
    console.log('✓ Created: design-review-screenshots.zip\n');
  }

  // Open HTML file in default browser
  const openCmd = process.platform === 'darwin' ? 'open' :
                  process.platform === 'win32' ? 'start' : 'xdg-open';

  exec(`${openCmd} ${htmlFile}`, (err) => {
    if (err) {
      console.log(`⚠️  Could not open HTML file automatically`);
      console.log(`   Open manually: ${htmlFile}\n`);
    } else {
      console.log('✓ Opened design review in browser\n');
    }
  });

  console.log('🎨 Ready for Figma import!');
  console.log(`📁 All files in: ${outputDir}`);
});
