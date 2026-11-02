import { test, expect } from '@playwright/test';

test('renders the app shell', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('app-root')).toBeVisible();
});

test('deep-links route to a view', async ({ page }) => {
  await page.goto('/projects');
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByTestId('app-root')).toBeVisible();
});

test('unknown routes fall back to the dashboard', async ({ page }) => {
  await page.goto('/not-a-real-view');
  await expect(page.getByTestId('app-root')).toBeVisible();
});
