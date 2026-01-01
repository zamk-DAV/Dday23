import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/auth');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/dear23/);
});

test('onboarding flow check', async ({ page }) => {
    await page.goto('/auth');
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));

    // Check if we see the login form
    await expect(page.getByRole('heading', { name: 'Dear23' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log In', exact: true })).toBeVisible({ timeout: 10000 });
});
