import { test, expect } from '@playwright/test';

test.describe('создание заказа', () => {
  test('заказ создаётся, модалка открывается, конструктор пуст', async ({
    page
  }) => {
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test');
    });

    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/auth/user',
      update: false
    });

    await page.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders',
      update: false
    });

    await page.goto('/');

    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]')
      .getByText('Добавить')
      .click();

    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]')
      .getByText('Добавить')
      .click();

    await page.getByTestId('order-button').click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(
      page.getByTestId('modal').getByTestId('order-number')
    ).toHaveText('110688');

    await page.getByTestId('close-modal').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    await expect(
      page.locator('[data-testid="constructor-ingredients"]')
    ).toContainText('Выберите булки');

    await expect(
      page.locator('[data-testid="constructor-ingredients"]')
    ).toContainText('Выберите начинку');
  });
});

test.describe('добавление ингредиентов в конструктор', () => {
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
    await expect(
      page.locator('[data-testid="constructor-ingredients"]')
    ).toContainText('Выберите булки');

    const addButton = page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]')
      .getByText('Добавить');

    await addButton.click();

    await expect(
      page.locator('[data-testid="constructor-ingredients"]')
    ).toContainText('Краторная булка');
  });

  test('начинка добавляется в конструктор', async ({ page }) => {
    await expect(
      page.locator('[data-testid="constructor-ingredients"]')
    ).toContainText('Выберите начинку');

    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]')
      .getByText('Добавить')
      .click();

    await expect(
      page.locator('[data-testid="constructor-ingredients"]')
    ).toContainText('Биокотлета из марсианской Магнолии');
  });
});

test.describe('модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });
    await page.goto('/');
  });

  test('модалка ингредиента открывается по клику', async ({ page }) => {
    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"] a')
      .click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Краторная булка N-200i');
    await expect(modal).toContainText('Калории, ккал');
    await expect(modal).toContainText('420');
    await expect(modal).toContainText('Белки, г');
    await expect(modal).toContainText('80');
    await expect(modal).toContainText('Жиры, г');
    await expect(modal).toContainText('24');
    await expect(modal).toContainText('Углеводы, г');
    await expect(modal).toContainText('53');
  });

  test('модалка закрывается по клику на крестик', async ({ page }) => {
    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"] a')
      .click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('close-modal').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('модалка закрывается по клику на оверлей', async ({ page }) => {
    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"] a')
      .click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 10, y: 10 }
    });

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});
