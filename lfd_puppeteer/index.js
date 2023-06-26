const fs = require('fs');
const puppeteer = require('puppeteer');
const URL = 'https://' + process.argv[2];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/snap/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--kiosk',
      '--user-data-dir=DIR',
    ],
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null
  });
  const page = await browser.newPage();
  await page.goto('URL');
  await page.type('#login', 'LOGIN');
  await page.type('#password', 'PASSWORD');
  await page.click("button[type='submit']");
  await page.waitForNavigation();
  await page.goto(URL);
  setInterval(async () => {
    if (page.url() === URL) {
      await page.click('.o_graph');
    } else {
      await page.goto(URL);
    }
  }, 30000);
})();
