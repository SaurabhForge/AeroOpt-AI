const { chromium } = require('c:/Users/Saurabh Kumar/OneDrive/Desktop/TrustForge/trustforge/node_modules/playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.resolve(__dirname);

  console.log('Fetching JWT from backend API http://localhost:5000/api/auth/login...');
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@aeroopt.ai', password: 'Admin@1234' })
  });
  const loginData = await loginRes.json();
  console.log('Login status:', loginRes.status, 'User:', loginData.user?.name);
  const token = loginData.token;
  const user = loginData.user;

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  // Inject token into localStorage for http://localhost:5173
  await context.addInitScript(({ token, user }) => {
    localStorage.setItem('aeroopt_token', token);
    localStorage.setItem('aeroopt_user', JSON.stringify(user));
  }, { token, user });

  const page = await context.newPage();

  // 1. Dashboard
  console.log('Capturing Dashboard...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outDir, 'screenshot_dashboard.png') });

  // 2. Optimiser
  console.log('Capturing Optimiser...');
  await page.goto('http://localhost:5173/optimiser', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Click Run Optimiser button if available to show the schedule
  try {
    const optBtn = page.locator('button:has-text("Run Optimizer"), button:has-text("Optimise"), button:has-text("Compute")').first();
    if (await optBtn.count() > 0) {
      await optBtn.click();
      await page.waitForTimeout(1500);
    }
  } catch(e) {}
  await page.screenshot({ path: path.join(outDir, 'screenshot_optimiser.png') });

  // 3. Fleet
  console.log('Capturing Fleet...');
  await page.goto('http://localhost:5173/fleet', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outDir, 'screenshot_fleet.png') });

  // 4. Scenarios
  console.log('Capturing Scenarios...');
  await page.goto('http://localhost:5173/scenarios', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Run a scenario if possible
  try {
    const simBtn = page.locator('button:has-text("Simulate"), button:has-text("Run"), button:has-text("Execute")').first();
    if (await simBtn.count() > 0) {
      await simBtn.click();
      await page.waitForTimeout(1500);
    }
  } catch(e) {}
  await page.screenshot({ path: path.join(outDir, 'screenshot_scenarios.png') });

  // 5. Login Page (separate unauthenticated context)
  const unauthContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const loginPage = await unauthContext.newPage();
  console.log('Capturing Login...');
  await loginPage.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await loginPage.waitForTimeout(1500);
  await loginPage.screenshot({ path: path.join(outDir, 'screenshot_login.png') });

  // Mobile captures for phone mockups
  const mobileContext = await browser.newContext({ viewport: { width: 412, height: 869 } });
  await mobileContext.addInitScript(({ token, user }) => {
    localStorage.setItem('aeroopt_token', token);
    localStorage.setItem('aeroopt_user', JSON.stringify(user));
  }, { token, user });

  const mPage = await mobileContext.newPage();
  console.log('Capturing Mobile Dashboard...');
  await mPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(2000);
  await mPage.screenshot({ path: path.join(outDir, 'mobile_dashboard.png') });

  console.log('Capturing Mobile Optimiser...');
  await mPage.goto('http://localhost:5173/optimiser', { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(2000);
  await mPage.screenshot({ path: path.join(outDir, 'mobile_optimiser.png') });

  console.log('Capturing Mobile Fleet...');
  await mPage.goto('http://localhost:5173/fleet', { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(2000);
  await mPage.screenshot({ path: path.join(outDir, 'mobile_fleet.png') });

  await browser.close();
  console.log('All authentic screenshots captured successfully!');
})();
