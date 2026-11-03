import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
const report = [];
await mkdir('docs/screenshots', { recursive: true });
for (const [name, width, height, path, bag] of [
  ['home-desktop', 1440, 1000, '', false],
  ['home-mobile', 390, 844, '', false],
  ['collection-desktop', 1440, 1000, 'collection/', false],
  ['product-desktop', 1440, 1000, 'products/form-shoulder/', false],
  ['product-mobile', 390, 844, 'products/form-shoulder/', false],
  ['bag-mobile', 390, 844, 'products/form-shoulder/', true],
  ['checkout-desktop', 1440, 1000, 'checkout/', false],
  ['checkout-mobile', 390, 844, 'checkout/', false],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors = [];
  const hydrationWarnings = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
    if (/hydration/i.test(m.text()) && /mismatch/i.test(m.text()))
      hydrationWarnings.push(m.text());
  });
  const base =
    process.env.DEMO_URL || 'http://127.0.0.1:4182/atelier-no8-nuxt/';
  if (path === 'checkout/') {
    await page.goto(base + 'products/form-shoulder/');
    await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
    await page
      .getByRole('dialog', { name: 'Your bag', exact: true })
      .getByRole('link', { name: 'Continue to demo checkout' })
      .click();
  } else await page.goto(base + path);
  await page.getByRole('heading', { level: 1 }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  if (bag)
    await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.screenshot({
    path: 'docs/screenshots/' + name + '.jpg',
    type: 'jpeg',
    quality: 85,
    fullPage: false,
  });
  report.push({
    name,
    width,
    height,
    errors,
    hydrationWarnings,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
    imageFailures: await page
      .locator('img')
      .evaluateAll((imgs) =>
        imgs
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.src),
      ),
  });
  await context.close();
}
await browser.close();
await writeFile(
  'docs/screenshots/capture-report.json',
  JSON.stringify(report, null, 2) + '\n',
);
console.log(report);
