#!/usr/bin/env node
// Simple script to render SVG files to PNG using puppeteer (if installed)
// Usage: npm install puppeteer --save-dev
// Then: node scripts/generate-pngs.js

const fs = require('fs');
const path = require('path');
(async () => {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (err) {
    console.error('puppeteer not installed. Run: npm install puppeteer --save-dev');
    process.exit(1);
  }

  const iconsDir = path.join(__dirname, '..', 'www', 'icons');
  const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'));
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  for (const file of files) {
    const svgPath = path.join(iconsDir, file);
    const outName = file.replace('.svg', '.png');
    const outPath = path.join(iconsDir, outName);
    const svg = fs.readFileSync(svgPath, 'utf8');
    await page.setContent(svg);
    const element = await page.$('svg');
    const boundingBox = await element.boundingBox();
    await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: Math.ceil(boundingBox.width), height: Math.ceil(boundingBox.height) } });
    console.log('Rendered', outName);
  }

  await browser.close();
})();