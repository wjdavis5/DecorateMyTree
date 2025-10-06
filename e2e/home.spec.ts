import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Holiday Tree/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check for hero elements
    await expect(page.locator('h1')).toContainText('Holiday Tree Decorator');
    await expect(page.locator('text=Create beautiful 3D holiday trees')).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    await page.goto('/');
    
    // Check for feature cards
    await expect(page.locator('text=3D Interactive Trees')).toBeVisible();
    await expect(page.locator('text=Collaborative Decorating')).toBeVisible();
    await expect(page.locator('text=Multiple Traditions')).toBeVisible();
  });

  test('should have working CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    // Find and click the create button
    const createButton = page.locator('button:has-text("Create Your Tree")').first();
    await expect(createButton).toBeVisible();
    await createButton.click();
    
    // Should navigate to create page
    await expect(page).toHaveURL(/\/create/);
  });

  test('should display "How It Works" section', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=How It Works')).toBeVisible();
    await expect(page.locator('text=Create Your Tree')).toBeVisible();
    await expect(page.locator('text=Share the Link')).toBeVisible();
    await expect(page.locator('text=Watch it Grow')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that content is visible on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button:has-text("Create Your Tree")')).toBeVisible();
  });
});
