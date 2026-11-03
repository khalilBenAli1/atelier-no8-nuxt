import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Page, type Locator } from '@playwright/test';
import { products } from '../data/products';
const hydrationWarnings = new WeakMap<Page, string[]>();
const dialog = (page: Page) =>
  page.getByRole('dialog', { name: 'Your bag', exact: true });
async function tabTo(page: Page, target: Locator) {
  // macOS Safari's native all-controls navigation is Option-Tab unless Full Keyboard Access is enabled.
  const key =
    process.platform === 'darwin' &&
    page.context().browser()?.browserType().name() === 'webkit'
      ? 'Alt+Tab'
      : 'Tab';
  for (let index = 0; index < 50; index++) {
    if (await target.evaluate((element) => element === document.activeElement))
      return;
    await page.keyboard.press(key);
  }
  throw new Error('Control was not reachable with Tab.');
}
const openProduct = async (page: Page, id = 'form-shoulder') => {
  await page.goto('products/' + id + '/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
};
test.beforeEach(async ({ page }) => {
  const warnings: string[] = [];
  hydrationWarnings.set(page, warnings);
  page.on('console', (message) => {
    const text = message.text();
    if (/hydration/i.test(text) && /mismatch/i.test(text)) warnings.push(text);
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
});
test.afterEach(async ({ page }) => {
  expect(hydrationWarnings.get(page) ?? []).toEqual([]);
});
test('collection filters and sort survive a static direct-link refresh', async ({
  page,
}) => {
  await page.goto('collection/');
  await page
    .getByRole('button', { name: 'Small leather', exact: true })
    .click();
  await expect(page).toHaveURL(/category=Small/);
  await expect(page.getByRole('article')).toHaveCount(3);
  await page.getByRole('searchbox', { name: 'Search products' }).fill('wallet');
  await page
    .getByRole('combobox', { name: 'Sort products' })
    .selectOption('price-asc');
  await page.reload();
  await expect(
    page.getByRole('searchbox', { name: 'Search products' }),
  ).toHaveValue('wallet');
  await expect(page.getByRole('article')).toHaveCount(1);
  await page
    .getByRole('searchbox', { name: 'Search products' })
    .fill('no matching piece');
  await expect(page.getByRole('article')).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Explore all pieces', exact: true })
    .click();
  await expect(page.getByRole('article')).toHaveCount(8);
});
test('bag merges identical sizes, keeps sizes separate, persists and respects quantity bounds', async ({
  page,
}) => {
  await openProduct(page);
  const add = page.getByRole('button', { name: 'Add to bag', exact: true });
  await add.click();
  await expect(dialog(page)).toBeVisible();
  await dialog(page).getByRole('button', { name: 'Close Your bag' }).click();
  await add.click();
  await expect(
    dialog(page).getByLabel('Quantity of The Form Shoulder Small'),
  ).toHaveText('2');
  await page.keyboard.press('Escape');
  await page.getByRole('radio', { name: 'Regular', exact: true }).check();
  await add.click();
  await expect(dialog(page).getByRole('article')).toHaveCount(2);
  await page.reload();
  await page.getByRole('button', { name: /Open your bag, 3 items/ }).click();
  await expect(dialog(page).getByRole('article')).toHaveCount(2);
  const plus = dialog(page).getByRole('button', {
    name: 'Increase The Form Shoulder Small',
  });
  await plus.click();
  await plus.click();
  await expect(plus).toBeDisabled();
  await dialog(page)
    .getByRole('button', { name: 'Remove The Form Shoulder Regular' })
    .click();
  await expect(dialog(page).getByRole('article')).toHaveCount(1);
  await dialog(page)
    .getByRole('button', { name: 'Clear bag', exact: true })
    .click();
  await expect(
    dialog(page).getByRole('heading', { name: /A little room/ }),
  ).toBeVisible();
});
test('checkout validates contact and completes an immutable local confirmation without persisting personal data', async ({
  page,
}) => {
  await openProduct(page);
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await dialog(page)
    .getByRole('link', { name: 'Continue to demo checkout' })
    .click();
  await page.getByLabel('Your name', { exact: true }).fill('Temporary Sample');
  await page
    .getByLabel('Email address', { exact: true })
    .fill('temporary@example.com');
  await page.reload();
  await expect(page.getByLabel('Your name', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Email address', { exact: true })).toHaveValue(
    '',
  );
  await expect(
    page
      .getByRole('complementary')
      .getByRole('heading', { name: 'The Form Shoulder', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Review demo order', exact: true })
    .click();
  await expect(page.getByLabel('Your name', { exact: true })).toBeFocused();
  await expect(
    page.getByText('Enter a valid email address.', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Use sample details', exact: true })
    .click();
  await expect(page.getByLabel('Your name', { exact: true })).toHaveValue(
    'Alex Morgan',
  );
  const longName = 'A'.repeat(90);
  const longEmail = 'a'.repeat(60) + '@example.com';
  await page.getByLabel('Your name', { exact: true }).fill(longName);
  await page.getByLabel('Email address', { exact: true }).fill(longEmail);
  await page
    .getByRole('checkbox', { name: /I understand this is a simulated order/ })
    .check();
  await page
    .getByRole('button', { name: 'Review demo order', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'One last look.', exact: true }),
  ).toBeFocused();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await expect(
    page
      .getByRole('complementary')
      .getByRole('definition')
      .filter({ hasText: '€280' }),
  ).toHaveCount(2);
  const stored = await page.evaluate(() =>
    window.localStorage.getItem('atelier-no8:bag:v1'),
  );
  expect(stored).not.toContain('Alex');
  expect(stored).not.toContain('email');
  expect(stored).not.toContain(longName);
  expect(stored).not.toContain(longEmail);
  await page
    .getByRole('button', { name: 'Complete demo order', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { level: 1, name: /Imagine it’s/ }),
  ).toBeFocused();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await expect(
    page.getByText(/No order was placed, no payment was taken/),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Open your bag, 0 items' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Open your bag, 0 items' }).click();
  await expect(
    dialog(page).getByRole('heading', { name: /A little room/ }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('heading', { level: 1, name: /Imagine it’s/ }),
  ).toBeVisible();
});
test('gallery and mobile menu support Escape, restored focus and real navigation; sold-out stock cannot be added', async ({
  page,
}) => {
  await openProduct(page);
  const trigger = page.getByRole('button', {
    name: 'Open product photograph',
    exact: true,
  });
  await trigger.focus();
  await trigger.press('Enter');
  const gallery = page.getByRole('dialog', { name: 'Product photograph' });
  await expect(gallery).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.getByRole('button', { name: 'Open menu', exact: true });
  await menu.focus();
  await menu.press('Enter');
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await menu.press('Enter');
  await page
    .getByRole('navigation', { name: 'Mobile' })
    .getByRole('link', { name: 'The collection', exact: true })
    .click();
  await expect(page).toHaveURL(/collection/);
  await openProduct(page, 'travel-case');
  await expect(
    page.getByRole('button', { name: 'Currently unavailable', exact: true }),
  ).toBeDisabled();
});
test('routes reflow at desktop/tablet/mobile and pass automated WCAG checks', async ({
  page,
}) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '',
      'collection/',
      'products/form-shoulder/',
      'checkout/',
    ]) {
      await page.goto(route || './');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
    }
  }
  for (const route of [
    '',
    'collection/',
    'products/form-shoulder/',
    'checkout/',
  ]) {
    await page.goto(route || './');
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});

test('a keyboard user can complete the shopping journey without a pointer', async ({
  page,
}) => {
  await openProduct(page);
  await tabTo(
    page,
    page.getByRole('button', { name: 'Add to bag', exact: true }),
  );
  await page.keyboard.press('Enter');
  const checkout = dialog(page).getByRole('link', {
    name: 'Continue to demo checkout',
  });
  await expect(checkout).toBeVisible();
  await tabTo(page, checkout);
  await page.keyboard.press('Enter');
  const sample = page.getByRole('button', {
    name: 'Use sample details',
    exact: true,
  });
  await expect(sample).toBeVisible();
  await tabTo(page, sample);
  await page.keyboard.press('Enter');
  await tabTo(
    page,
    page.getByRole('checkbox', {
      name: /I understand this is a simulated order/,
    }),
  );
  await page.keyboard.press('Space');
  await tabTo(
    page,
    page.getByRole('button', { name: 'Review demo order', exact: true }),
  );
  await page.keyboard.press('Enter');
  await tabTo(
    page,
    page.getByRole('button', { name: 'Complete demo order', exact: true }),
  );
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { level: 1, name: /Imagine it’s/ }),
  ).toBeFocused();
});

test('all products have real prerendered HTML and unknown routes have a deliberate 404', async ({
  page,
  request,
}) => {
  for (const product of products) {
    const response = await request.get('products/' + product.slug + '/');
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('<h1>' + product.name + '</h1>');
  }
  const response = await page.goto('not-a-piece/');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { level: 1, name: /A little off the path/ }),
  ).toBeVisible();
});
