const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('.experiments').scrollIntoView());
  await page.waitForTimeout(1200);
  await page.screenshot({ path: process.argv[2] + '/orb-idle.png' });

  const box = await page.$eval('.experiments-canvas', (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  await page.mouse.move(cx - 100, cy);
  for (let i = 0; i < 10; i++) {
    await page.mouse.move(cx - 100 + i * 20, cy, { steps: 3 });
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(100);
  await page.screenshot({ path: process.argv[2] + '/orb-hover.png' });

  await page.waitForTimeout(600);
  await page.screenshot({ path: process.argv[2] + '/orb-hover-still.png' });

  await page.mouse.move(0, 0);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: process.argv[2] + '/orb-returned.png' });

  await page.waitForTimeout(4300);
  await page.screenshot({ path: process.argv[2] + '/orb-wave.png' });

  console.log('CONSOLE_ERRORS:', JSON.stringify(errors));
  await browser.close();
})();
