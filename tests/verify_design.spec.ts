import { test, expect } from '@playwright/test';

test('verify auth page design', async ({ page }) => {
  console.log('Navigating...');
  await page.goto('http://localhost:5173/auth', { waitUntil: 'domcontentloaded' });

  console.log('Waiting for heading...');
  // Increase timeout to account for animations and dev server slowness
  await expect(page.getByRole('heading', { name: 'Dear23' })).toBeVisible({ timeout: 10000 });

  console.log('Taking screenshot...');
  // Take a full page screenshot to verify design
  await page.screenshot({ path: 'auth_design_v1.png', fullPage: true });
});
