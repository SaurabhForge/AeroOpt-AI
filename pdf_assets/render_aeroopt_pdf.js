const { chromium } = require('c:/Users/Saurabh Kumar/OneDrive/Desktop/TrustForge/trustforge/node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching Chromium...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, '../AeroOpt_AI_SIH_2026_Deck.html');
  const pdfPath = path.resolve(__dirname, '../AeroOpt_AI_SIH_2026_Submission.pdf');
  const previewDir = path.resolve(__dirname, 'previews');
  if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

  console.log(`Navigating to file://${htmlPath}...`);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  // Wait a moment for all fonts and images to settle
  await page.waitForTimeout(2000);

  // Take screenshot of each .page element
  const pageElements = await page.locator('.page').all();
  console.log(`Found ${pageElements.length} pages. Generating screenshots for verification...`);
  for (let i = 0; i < pageElements.length; i++) {
    const pageEl = pageElements[i];
    const previewFile = path.join(previewDir, `page_${i + 1}_preview.png`);
    await pageEl.screenshot({ path: previewFile });
    console.log(`Saved preview: ${previewFile}`);
  }

  console.log(`Generating PDF to ${pdfPath}...`);
  await page.pdf({
    path: pdfPath,
    width: '1440px',
    height: '810px',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    preferCSSPageSize: true
  });

  await browser.close();
  console.log('PDF generation complete!');
})();
