import { test, expect } from '@playwright/test';

test.describe('Tree Creator', () => {
  test('should load the tree creator page', async ({ page }) => {
    await page.goto('/create');
    
    // Check that the page loads
    await expect(page.locator('h1')).toContainText('Create Your Holiday Tree');
  });

  test('should display 3D canvas', async ({ page }) => {
    await page.goto('/create');
    
    // Check for canvas element
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should display create button', async ({ page }) => {
    await page.goto('/create');
    
    // Check for create tree button
    const createButton = page.locator('button:has-text("Create Tree")');
    await expect(createButton).toBeVisible();
  });

  test('should show instructions', async ({ page }) => {
    await page.goto('/create');
    
    // Check for descriptive text
    await expect(page.locator('text=friends and family can decorate')).toBeVisible();
  });

  test('canvas should render', async ({ page }) => {
    await page.goto('/create');
    
    // Wait for canvas to be visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Check that canvas has dimensions
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/create');
    
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('button:has-text("Create Tree")')).toBeVisible();
  });
});
