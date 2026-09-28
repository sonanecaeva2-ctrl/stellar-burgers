import { test, expect } from '@playwright/test';

test('записать HAR для orders', async ({ page }) => {
  page.on('console', (msg) => console.log('BROWSER:', msg.text()));
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));
  page.on('request', (req) => {
    if (req.url().includes('/api/')) {
      console.log('→ REQUEST:', req.method(), req.url());
    }
  });
  page.on('response', (res) => {
    if (res.url().includes('/api/')) {
      console.log('← RESPONSE:', res.status(), res.url());
    }
  });

  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYWFiMzE3NmExNzJkMDAxYjk5NTFkYSIsImlhdCI6MTc5MDU3ODk2MSwiZXhwIjoxNzkwNTgwMTYxfQ.N8Ro6hDjciFM_UzWA0IGGc8E0lGD5dcLr7_9SMW7SPo',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'f2179bdb88c6e6934fc20b92a7b4633206699084b03b62fc18028d2072ddb5a7632121561687775e');
  });

  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/ingredients',
    update: false
  });

  await page.routeFromHAR('./tests/hars/orders.har', {
    url: '**/api/orders',
    update: true
  });

  await page.goto('/');

  await expect(
    page.locator('[data-testid^="ingredient-"]').first()
  ).toBeVisible({ timeout: 10000 });

  await page
    .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]')
    .getByText('Добавить')
    .click();

  await page
    .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]')
    .getByText('Добавить')
    .click();

  console.log('URL перед заказом:', page.url());

  await page.getByTestId('order-button').click();

  await page.waitForTimeout(3000);

  console.log('URL после заказа:', page.url());

  await page.screenshot({ path: 'debug-orders.png', fullPage: true });

  await page.waitForResponse(
    (res) => res.url().includes('/api/orders') && res.status() === 200,
    { timeout: 15000 }
  );

  await page.waitForTimeout(3000);
});

test.describe('загрузка данных для конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });
    await page.goto('/');
  });

  test('ингредиенты загружаются из HAR', async ({ page }) => {
    await expect(
      page.locator('[data-testid^="ingredient-"]').first()
    ).toBeVisible();
  });

  test('булка добавляется в конструктор', async ({ page }) => {
    await expect(page.getByText('Выберите булки').first()).toBeVisible();

    const addButton = page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]')
      .getByText('Добавить');

    await addButton.click();

    await expect(
      page.locator('[data-testid="constructor-ingredients"]')
    ).toContainText('Краторная булка');
  });

  test('начинка добавляется в конструктор', async ({ page }) => {
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]')
      .getByText('Добавить')
      .click();

    await expect(
      page.locator('[data-testid="constructor-ingredients"]')
    ).toContainText('Биокотлета из марсианской Магнолии');
  });

  test('модалка ингредиента открывается по клику', async ({ page }) => {
    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"] a')
      .click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText(
      'Краторная булка N-200i'
    );
  });

  test('модалка закрывается по клику на крестик', async ({ page }) => {
    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"] a')
      .click();

    await page.getByTestId('close-modal').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('модалка закрывается по клику на оверлей', async ({ page }) => {
    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"] a')
      .click();

    await page.getByTestId('modal-overlay').click({
      position: { x: 10, y: 10 }
    });

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});
