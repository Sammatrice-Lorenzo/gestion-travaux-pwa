import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';

// dotenv.config({ path: './.env.test.local', override: true })
// dotenv.config({ path: './.env.test', override: false })

// Use process.env.PORT by default and fallback to port 3000
// const PORT = process.env.PORT || 5173

const baseURL: string = 'http://localhost:5173'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: process.env.CI ? 60_000 : 120_000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  outputDir: './tests/test-results/',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI ? 'github' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'off' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'off' : 'retain-on-failure',
  },

  webServer: {
    command: 'yarn test-server',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  /* Configure projects for major browsers */
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    ...(process.env.CI
      ? [
          {
            name: 'Mobile Chrome',
            use: {
              ...devices['Pixel 5'],
              storageState: './tests/auth.json',
            },
            dependencies: ['setup'],
          },
        ]
      : [
          {
            name: 'firefox',
            use: {
              ...devices['Desktop Firefox'],
              storageState: './tests/auth.json',
            },
            dependencies: ['setup'],
          },
          {
            name: 'Mobile Chrome',
            use: {
              ...devices['Pixel 5'],
              storageState: './tests/auth.json',
            },
            dependencies: ['setup'],
          },
        ]),
  ],
})
