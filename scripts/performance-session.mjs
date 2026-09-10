import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const url = process.env.PERF_URL || 'http://127.0.0.1:4173';
const output = process.env.PERF_OUTPUT || 'artifacts/performance/current';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
try {
  for (const profile of ['desktop', 'mobile']) {
    const context = await browser.newContext({ viewport: profile === 'desktop' ? { width: 1350, height: 940 } : { width: 390, height: 844 }, deviceScaleFactor: profile === 'desktop' ? 1 : 2, isMobile: profile === 'mobile', hasTouch: profile === 'mobile' });
    await context.addInitScript(() => {
      let seed = 42;
      Math.random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      window.__perf = { longTasks: [], interactions: [] };
      for (const [type, key] of [['longtask', 'longTasks'], ['event', 'interactions']]) {
        if (PerformanceObserver.supportedEntryTypes.includes(type)) new PerformanceObserver(list => {
          window.__perf[key].push(...list.getEntries().map(entry => ({ name: entry.name, startTime: entry.startTime, duration: entry.duration, interactionId: entry.interactionId })));
        }).observe({ type, buffered: true, ...(type === 'event' ? { durationThreshold: 16 } : {}) });
      }
    });
    await context.tracing.start({ screenshots: true, snapshots: true });
    const page = await context.newPage();
    const errors = [], actions = [];
    page.on('pageerror', error => errors.push(error.message));
    const started = Date.now();
    const at = async (seconds, name, fn) => {
      await page.waitForTimeout(Math.max(0, seconds * 1000 - (Date.now() - started)));
      try { await fn(); actions.push({ name, ok: true }); }
      catch (error) { actions.push({ name, ok: false, error: error.message }); }
    };
    await page.goto(url);
    await page.locator('.hero-statement').waitFor();
    await page.screenshot({ path: `${output}/${profile}-session-start.png` });
    await at(5, 'about', () => page.locator('#about').scrollIntoViewIfNeeded());
    await at(12, 'gallery', async () => { await page.locator('.experience-gallery__thumbnails button').nth(1).click({ timeout: 4000 }); });
    await at(20, 'palette', async () => { await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await page.locator('.pokemon-trigger:visible').first().click({ timeout: 3000 }); });
    await at(25, 'projects', () => page.locator('.projects-view-all-btn').click({ timeout: 4000 }));
    await at(32, 'home', () => page.locator('.projects-back-btn').click({ timeout: 4000 }));
    await at(38, 'tour', async () => { await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await page.locator('.avatar-guide-trigger').click({ timeout: 4000 }); });
    await at(44, 'close-tour', () => page.locator('.avatar-dialog-close').click({ timeout: 4000 }));
    await at(49, 'chat', async () => { await page.locator('#contact').scrollIntoViewIfNeeded(); await page.locator('.chat-widget-trigger').click({ timeout: 4000 }); });
    await at(55, 'close-chat', () => page.locator('.chat-header-actions button').last().click({ timeout: 4000 }));
    await at(60, 'final', () => page.screenshot({ path: `${output}/${profile}-session-end.png` }));
    const metrics = await page.evaluate(() => ({ ...window.__perf, quality: document.documentElement.dataset.effects, reason: document.documentElement.dataset.effectsReason, canvasCount: document.querySelectorAll('canvas').length }));
    await writeFile(`${output}/${profile}-session.json`, JSON.stringify({ profile, duration: Date.now() - started, browser: browser.version(), actions, errors, ...metrics }, null, 2));
    await context.tracing.stop({ path: `${output}/${profile}-session.zip` });
    await context.close();
    console.log(JSON.stringify({ profile, actions, errors }));
  }
} finally { await browser.close(); }
