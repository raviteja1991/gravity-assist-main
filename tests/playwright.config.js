// Playwright config with built-in webServer to run the local http-server
const { devices } = require('@playwright/test');
module.exports = {
  timeout: 30000,
  use: {
    headless: true,
    baseURL: 'http://127.0.0.1:8080'
  },
  webServer: {
    command: 'npm run start',
    port: 8080,
    reuseExistingServer: !process.env.CI
  }
};