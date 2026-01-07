import { test, expect } from '@playwright/test'

test('opens e2e playground', async ({ page }) => {
  await page.goto('/e2e/')
  await expect(page.getByTestId('e2e-title')).toHaveText('E2E Playground')
  await expect(page.getByTestId('presentable')).toContainText('Presentable content')
})
