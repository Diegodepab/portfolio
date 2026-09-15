import { test, expect } from '@playwright/test';

for (const width of [320, 390]) for (const lang of ['es', 'en']) {
  test(`tour actions remain on screen at ${width}px in ${lang}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.addInitScript(lang => localStorage.setItem('portfolio-language', lang), lang);
    await page.goto('/');
    await page.locator('.avatar-guide-trigger').click();
    const close = page.locator('.avatar-dialog-close');
    await expect(close).toBeInViewport();
    await expect(page.locator('.avatar-dialog-next-btn--primary')).toBeInViewport();
    await close.click();
    await expect(page.locator('.driver-overlay')).toHaveCount(0);
  });
}

test('a failed route import retains navigation and a recovery action', async ({ page }) => {
  await page.route('**/assets/ProjectsPage-*.js', route => route.abort());
  await page.goto('/projects');
  await expect(page.locator('.recovery')).toBeVisible();
  await expect(page.locator('.recovery button')).toBeVisible();
  await expect(page.locator('.site-nav')).toBeVisible();
  await expect(page.locator('.recovery a[href^="mailto:"]')).toBeVisible();
});

test('a low-resource device never starts the particle canvas', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'deviceMemory', { value: 2, configurable: true }));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-effects', 'reduced');
  await page.locator('#about').scrollIntoViewIfNeeded();
  await expect(page.locator('#about canvas')).toHaveCount(0);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact canvas')).toHaveCount(0);
});

test('malformed contact success preserves the message, a valid retry clears it', async ({ page }) => {
  let valid = false;
  await page.route('https://formsubmit.co/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: valid ? '{"success":"true"}' : 'not json' }));
  await page.goto('/#contact');
  await page.locator('input[name="name"]').fill('Prueba local');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('input[name="subject"]').fill('Prueba del formulario');
  await page.locator('textarea[name="message"]').fill('Este mensaje no sale del navegador de pruebas.');
  await page.locator('.contact-submit').click();
  await expect(page.locator('.contact-feedback--error')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).not.toHaveValue('');
  valid = true;
  await page.locator('.contact-submit').click();
  await expect(page.locator('.contact-feedback--success')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toHaveValue('');
});

test('closing chat restores focus and cancels pending heuristic navigation', async ({ page }) => {
  await page.goto('/#contact');
  await page.locator('.chat-widget-trigger').click();
  await page.locator('.chat-window textarea').fill('proyectos');
  await page.locator('.chat-window textarea').press('Enter');
  await page.keyboard.press('Escape');
  await expect(page.locator('.chat-window')).toHaveCount(0);
  await expect(page.locator('.chat-widget-trigger')).toBeFocused();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/\/#contact$/);
});

test('palette and the manual effects preference persist on reload', async ({ page }) => {
  await page.goto('/');
  await page.locator('.pokemon-trigger:visible').first().click();
  const palette = await page.evaluate(() => localStorage.getItem('portfolio-palette'));
  await page.locator('.effects-toggle').click();
  await page.reload();
  await expect(page.locator('.site-footer__theme')).toContainText(palette!);
  await expect(page.locator('.effects-toggle')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-effects', 'reduced');
});

test('project content and canonical metadata exist without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173' });
  const page = await context.newPage();
  await page.goto('/projects/kubernetes-platform');
  await expect(page.locator('h1')).toContainText('Kubernetes');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/projects\/kubernetes-platform$/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Kubernetes/);
  await context.close();
});

test('project media loads YouTube only after choosing to play', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/projects/tfg-patient-monitoring');
  await expect(page.locator('.video-preview button')).toBeVisible();
  expect(requests.some(url => /youtube\.com|youtube-nocookie\.com/.test(url))).toBe(false);
  await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({ body: '<html></html>', contentType: 'text/html' }));
  await page.locator('.video-preview button').click();
  await expect(page.locator('.video-preview iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\//);
});
