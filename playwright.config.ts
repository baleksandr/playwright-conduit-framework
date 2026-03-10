import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config'; // Це магічна команда, яка каже: "Візьми все з .env і поклади в пам'ять процесу"
import { execSync } from 'child_process';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

// Перед кожним запуском просто видаляємо папку з результатами
if (!process.env.CI) {
  // локально чистимо результати
  try { execSync('if exist allure-results rmdir /s /q allure-results'); } catch (e) { }
} else {
  // на CI переносимо history
  try { execSync('xcopy /E /I /Y allure-report\\history allure-results\\history'); } catch (e) { }
}

export default defineConfig({
  timeout: 40000, // Timeout for each test in milliseconds. Defaults to 30 seconds
  // globalTimeout: 60000,
  expect: {
    timeout: 10000,
    // toMatchSnapshot: {maxDiffPixels: 50}
  },
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    actionTimeout: 10000,     // ТАЙМАУТ ДЛЯ ДІЙ (click, fill, type)
    navigationTimeout: 15000,     // ТАЙМАУТ ДЛЯ НАВІГАЦІЇ (page.goto)
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://conduit.bondaracademy.com',
    // screenshot: 'only-on-failure',
    // video: 'retain-on-failure',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'on-first-retry', // или 'on'
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
