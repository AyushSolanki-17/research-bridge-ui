import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [{
    command: "node tests/fixtures/server.mjs",
    url: "http://127.0.0.1:4010/health",
    reuseExistingServer: false,
  }, {
    command: "npm run start",
    env: { RESEARCH_BRIDGE_API_URL: "http://127.0.0.1:4010" },
    url: "http://127.0.0.1:3000/health",
    reuseExistingServer: false,
    timeout: 60_000,
  }],
});
