import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1200 });
  await page.goto('http://localhost:5173');
  // Wait for load
  await page.waitForTimeout(2000);
  
  // Click Experiencia
  const navs = await page.$$('nav a');
  for (let nav of navs) {
    const text = await page.evaluate(el => el.textContent, nav);
    if (text.includes('Experiencia') || text.includes('Experience')) {
      await nav.click();
      break;
    }
  }
  await page.waitForTimeout(1000);
  
  // Click Msurgery
  const tabs = await page.$$('.experience-tabs button');
  for (let tab of tabs) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text.includes('Msurgery')) {
      await tab.click();
      break;
    }
  }
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: '/home/diegodepab/.gemini/antigravity/brain/7d61f517-5096-43fd-becc-bb1ec698ea8b/artifacts/msurgery_debug.png', fullPage: true });
  await browser.close();
})();
