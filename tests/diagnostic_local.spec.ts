import { test, expect } from '@playwright/test';

test('diagnostic local ui', async ({ page }) => {
    page.on('console', msg => console.log(`BROWSER_LOG [${msg.type()}]: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER_ERROR: ${err.message}`));
    page.on('requestfailed', request => console.log(`FAILED_REQUEST: ${request.url()} - ${request.failure()?.errorText}`));

    console.log('Navigating to http://localhost:5173/auth...');
    await page.goto('http://localhost:5173/auth', { waitUntil: 'domcontentloaded' });

    // Wait a bit for React to mount
    await page.waitForTimeout(3000);

    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    console.log('BODY_HTML_PREVIEW:', bodyHtml.substring(0, 500));

    await page.screenshot({ path: 'diagnostic_auth.png', fullPage: true });
});
