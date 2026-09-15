import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const url = process.env.PERF_URL || 'http://127.0.0.1:4173';
const output = process.env.PERF_OUTPUT || 'artifacts/performance/current';
const runs = Number(process.env.PERF_RUNS || 5);
await mkdir(output, { recursive: true });
const chrome = await launch({ chromePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });
const browser = await chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);
const page = browser.contexts()[0].pages()[0];
const session = await page.context().newCDPSession(page);
await session.send('Page.addScriptToEvaluateOnNewDocument', { source: 'let perfSeed = 42; Math.random = () => ((perfSeed = (perfSeed * 1664525 + 1013904223) >>> 0) / 4294967296);' });
const summaries = [];
try {
  for (const profile of ['desktop', 'mobile']) {
    for (let run = 1; run <= runs; run++) {
      const result = await lighthouse(url, { port: chrome.port, output: ['json', 'html'], logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, profile === 'desktop' ? desktopConfig : undefined);
      if (!result || result.lhr.runtimeError) throw new Error(JSON.stringify(result?.lhr.runtimeError));
      const name = `${output}/${profile}-${run}`;
      await writeFile(`${name}.json`, result.report[0]);
      await writeFile(`${name}.html`, result.report[1]);
      const trace = result.artifacts.Trace ?? result.artifacts.traces;
      if (trace) await writeFile(`${name}.trace.json`, JSON.stringify(trace));
      const a = result.lhr.audits;
      const summary = { profile, run, performance: result.lhr.categories.performance.score * 100,
        lcp: a['largest-contentful-paint'].numericValue, tbt: a['total-blocking-time'].numericValue,
        cls: a['cumulative-layout-shift'].numericValue, settings: result.lhr.configSettings,
        browser: result.lhr.environment.hostUserAgent, date: result.lhr.fetchTime };
      summaries.push(summary);
      console.log(JSON.stringify({ profile, run, performance: summary.performance, lcp: Math.round(summary.lcp), tbt: Math.round(summary.tbt), cls: summary.cls }));
      await writeFile(`${output}/summary.json`, JSON.stringify(summaries, null, 2));
    }
  }
} finally { await browser.close(); await chrome.kill(); }
