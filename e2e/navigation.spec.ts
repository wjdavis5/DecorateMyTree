import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate from home to create', async ({ page }) => {
    await page.goto('/');
    
    // Click create button
    await page.locator('button:has-text("Create Your Tree")').first().click();
    
    // Should be on create page
    await expect(page).toHaveURL(/\/create/);
    await expect(page.locator('h1')).toContainText('Create Your Holiday Tree');
  });

  test('should handle direct navigation to create page', async ({ page }) => {
    await page.goto('/create');
    
    await expect(page.locator('h1')).toContainText('Create Your Holiday Tree');
  });

  test('should handle browser back button', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Create Your Tree")').first().click();
    await expect(page).toHaveURL(/\/create/);
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Holiday Tree Decorator');
  });
});
