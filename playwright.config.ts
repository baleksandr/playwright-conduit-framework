import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import { execSync } from 'child_process';

if (!process.env.CI) {
  try { execSync('if exist allure-results rmdir /s /q allure-results'); } catch (e) { }
} else {
  try { execSync('xcopy /E /I /Y allure-report\\history allure-results\\history'); } catch (e) { }
}

export default defineConfig({
  timeout: 40000,
  expect: {
    timeout: 10000,
  },
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    actionTimeout: 10000,     // ТАЙМАУТ ДЛЯ ДІЙ (click, fill, type)
    navigationTimeout: 15000,     // ТАЙМАУТ ДЛЯ НАВІГАЦІЇ (page.goto)
    baseURL: 'https://conduit.bondaracademy.com',
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
