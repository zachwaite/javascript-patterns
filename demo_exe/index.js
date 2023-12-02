const puppeteer = require('puppeteer-core');

(async () => {
  console.log("hello world");
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "/snap/bin/chromium",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--kiosk",
      `--user-data-dir=/tmp/testDataDir`,
    ],
    ignoreDefaultArgs: ["--enable-automation"],
    defaultViewport: null,
  });
})();
