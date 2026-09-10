import { test, expect, type Page } from '@playwright/test';

type GraphicsMode = 'full' | 'unsupported' | 'shader-failure';
async function graphics(page: Page, mode: GraphicsMode) {
  await page.addInitScript((mode) => {
    // Exercise the real shader in software on CI; this override is test-only.
    const original = HTMLCanvasElement.prototype.getContext;
    const contexts: WebGLRenderingContext[] = [];
    const draws: number[] = [];
    Object.assign(window, { testContexts: contexts, testDraws: draws });
    HTMLCanvasElement.prototype.getContext = function (kind: string, options?: object) {
      if (kind !== 'webgl' && kind !== 'experimental-webgl' && kind !== 'webgl2') return original.call(this, kind as '2d', options);
      if (mode === 'unsupported') return null;
      const gl = original.call(this, kind as 'webgl', { ...options, failIfMajorPerformanceCaveat: false }) as WebGLRenderingContext | null;
      if (gl && !contexts.includes(gl)) {
        const index = contexts.push(gl) - 1;
        draws[index] = 0;
        const parameter = gl.getParameter.bind(gl);
        const debug = gl.getExtension('WEBGL_debug_renderer_info');
        gl.getParameter = (name: number) => name === debug?.UNMASKED_RENDERER_WEBGL ? 'Test graphics' : parameter(name);
        const draw = gl.drawArrays.bind(gl);
        gl.drawArrays = (...args) => { draws[index]++; return draw(...args); };
        if (mode === 'shader-failure') {
          const status = gl.getShaderParameter.bind(gl);
          gl.getShaderParameter = (shader, name) => name === gl.COMPILE_STATUS ? false : status(shader, name);
        }
      }
      return gl;
    } as typeof original;
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: 8 });
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: 8 });
  }, mode);
}
async function fallback(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('data-effects', 'reduced');
  await expect(page.locator('.hero .metal-fx-root')).toHaveAttribute('data-render-state', 'fallback');
  await expect(page.locator('.hero .metal-fx-canvas')).toHaveCount(0);
  const button = page.locator('.hero .metal-fx-root a');
  await expect(button).toBeVisible();
  const paint = await page.locator('.hero .metal-fx-root').evaluate(root => getComputedStyle(root, '::before').backgroundImage);
  expect(paint).toContain('linear-gradient');
  await button.focus();
  await expect(button).toBeFocused();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    let seed = 42;
    Math.random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  });
});

for (const dpr of [1, 2, 3]) {
  test(`static metal remains usable without WebGL at DPR ${dpr}`, async ({ browser }, info) => {
    const context = await browser.newContext({ baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173', deviceScaleFactor: dpr, viewport: { width: 1350, height: 940 } });
    const page = await context.newPage();
    await graphics(page, 'unsupported');
    await page.goto('/');
    await fallback(page);
    const before = await page.locator('.hero .metal-fx-root').boundingBox();
    await page.locator('.pokemon-trigger:visible').first().click();
    const after = await page.locator('.hero .metal-fx-root').boundingBox();
    expect(after?.width).toBeCloseTo(before!.width, 0);
    await page.screenshot({ path: info.outputPath(`fallback-${dpr}.png`) });
    await page.locator('.hero .metal-fx-root a').press('Enter');
    await expect(page).toHaveURL(/#projects$/);
    await context.close();
  });
}

test('reduced motion and limited resources do not download decorative engines', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await fallback(page);
  await page.locator('#jobs').scrollIntoViewIfNeeded();
  await page.locator('.experience-gallery__thumbnails button').nth(1).click();
  await expect(page.locator('.experience-gallery__count')).toContainText('02');
  expect(requests.some(url => /metalRuntime-|three-vendor-|PixelTransitionLayer-|tour-vendor-/.test(url))).toBe(false);
  const source = await page.locator('.experience-gallery__thumbnails img').nth(1).evaluate((img: HTMLImageElement) => img.currentSrc);
  expect(source).toContain('-thumb-');
});

test('low memory chooses reduced quality without probing WebGL', async ({ page }) => {
  await graphics(page, 'full');
  await page.addInitScript(() => Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: 2 }));
  await page.goto('/');
  await fallback(page);
  await expect(page.locator('html')).toHaveAttribute('data-effects-reason', 'limited-device');
  expect(await page.evaluate(() => (window as unknown as { testContexts: unknown[] }).testContexts.length)).toBe(0);
});

test('valid shader paints, pauses outside the viewport and falls back after context loss', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Software WebGL availability depends on the WebKit host; Chromium exercises the real GPU lifecycle.');
  await graphics(page, 'full');
  await page.goto('/');
  await expect(page.locator('.hero .metal-fx-root')).toHaveAttribute('data-render-state', 'ready');
  const painted = await page.locator('.hero canvas').evaluate((canvas: HTMLCanvasElement) => {
    const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
    return pixels.some((value, index) => index % 4 === 3 && value > 0);
  });
  expect(painted).toBe(true);
  await page.locator('#jobs').scrollIntoViewIfNeeded();
  await expect(page.locator('.hero .metal-fx-root')).toHaveAttribute('data-paused', 'true');
  const count = await page.evaluate(() => (window as unknown as { testDraws: number[] }).testDraws.reduce((a, b) => a + b, 0));
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => (window as unknown as { testDraws: number[] }).testDraws.reduce((a, b) => a + b, 0))).toBe(count);
  await page.evaluate(() => {
    const contexts = (window as unknown as { testContexts: WebGLRenderingContext[] }).testContexts;
    contexts.find(gl => !gl.isContextLost())?.getExtension('WEBGL_lose_context')?.loseContext();
  });
  await fallback(page);
  await expect(page.locator('html')).toHaveAttribute('data-effects-reason', 'graphics-failure');
  const contexts = await page.evaluate(() => (window as unknown as { testContexts: unknown[] }).testContexts.length);
  await page.locator('.projects-view-all-btn').click();
  await expect(page.locator('.projects-page-hero')).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { testContexts: unknown[] }).testContexts.length)).toBe(contexts);
});

test('shader compilation failure preserves the CSS button', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit');
  await graphics(page, 'shader-failure');
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-effects-reason', 'graphics-failure');
  await fallback(page);
});

test('changing motion preference tears down the renderer without reactivation', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit');
  await graphics(page, 'full');
  await page.goto('/');
  await expect(page.locator('.hero .metal-fx-root')).toHaveAttribute('data-render-state', 'ready');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await fallback(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveAttribute('data-effects', 'reduced');
});

test('tour and chat portals retain functional metallic buttons and load on demand', async ({ page }) => {
  const errors: string[] = [], requests: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.avatar-guide-trigger')).toBeVisible();
  expect(requests.some(url => /tour-vendor-|ChatWindow-/.test(url))).toBe(false);
  await page.locator('.avatar-guide-trigger').click();
  await expect(page.locator('.avatar-dialog-wrapper')).toBeVisible();
  await expect(page.locator('.avatar-dialog-wrapper .metal-fx-root')).toHaveAttribute('data-render-state', 'fallback');
  await expect(page.locator('.driver-overlay')).toHaveCount(1);
  await page.locator('.avatar-dialog-next-btn--primary').click();
  await page.locator('.avatar-dialog-close').click();
  await expect(page.locator('.driver-overlay')).toHaveCount(0);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('.chat-widget-trigger').click();
  await expect(page.locator('.chat-window')).toBeVisible();
  await expect(page.locator('.chat-window .metal-fx-root:not([data-render-state="fallback"])')).toHaveCount(0);
  await page.locator('.chat-header-actions button').last().click();
  await expect(page.locator('.chat-window')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('hidden tabs stop GPU work and visible tabs resume it', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit');
  await graphics(page, 'full');
  await page.goto('/');
  await expect(page.locator('.hero .metal-fx-root')).toHaveAttribute('data-render-state', 'ready');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('html')).toHaveAttribute('data-page-visible', 'false');
  const count = await page.evaluate(() => (window as unknown as { testDraws: number[] }).testDraws.reduce((a, b) => a + b, 0));
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => (window as unknown as { testDraws: number[] }).testDraws.reduce((a, b) => a + b, 0))).toBe(count);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(() => page.evaluate(() => (window as unknown as { testDraws: number[] }).testDraws.reduce((a, b) => a + b, 0))).toBeGreaterThan(count);
});

test('sustained slow browser frames permanently downgrade quality', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit');
  await graphics(page, 'full');
  await page.goto('/');
  await expect(page.locator('.hero .metal-fx-root')).toHaveAttribute('data-render-state', 'ready');
  await page.evaluate(() => {
    const original = window.requestAnimationFrame;
    const started = performance.now();
    window.requestAnimationFrame = callback => original(now => callback(started + (now - started) * 5));
  });
  await expect(page.locator('html')).toHaveAttribute('data-effects-reason', 'slow-frames');
  await fallback(page);
});
