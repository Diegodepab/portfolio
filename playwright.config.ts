import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
const port = process.env.PORT || '4173';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;
const defaultChrome = fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined;
const executablePath = process.env.CHROME_PATH || defaultChrome;
export default defineConfig({
  testDir: './tests/browser', fullyParallel: false, workers: 1, timeout: 30_000,
  expect: { timeout: 10_000 },
  use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: { ...(executablePath ? { executablePath } : {}), args: ['--no-sandbox', '--enable-unsafe-swiftshader'] } } },
  ],
  webServer: { command: `PORT=${port} node scripts/serve.mjs`, url: baseURL, reuseExistingServer: true },
});
