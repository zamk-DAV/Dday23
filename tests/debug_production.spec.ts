import { test, expect } from '@playwright/test';

test('debug production site', async ({ page }) => {
    // Listen for all console events
    page.on('console', msg => console.log(`BROWSER_LOG [${msg.type()}]: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER_ERROR: ${err.message}`));
    page.on('requestfailed', request => console.log(`FAILED_REQUEST: ${request.url()} - ${request.failure()?.errorText}`));

    console.log('Navigating to / ...');
    await page.goto('/', { waitUntil: 'networkidle' });

    console.log('Page title:', await page.title());

    // Dump body HTML to see if anything rendered
    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    console.log('BODY_HTML_LENGTH:', bodyHtml.length);
    console.log('BODY_HTML_PREVIEW:', bodyHtml.substring(0, 500));

    // Take a screenshot for visual inspection
    await page.screenshot({ path: 'debug_screenshot.png', fullPage: true });

    // Explicitly check for the heading
    const heading = page.getByRole('heading', { name: 'Dear23' });
    const isVisible = await heading.isVisible();
    console.log('Heading "Dear23" visible:', isVisible);

    if (!isVisible) {
        throw new Error('Heading not found, page likely blank or crashed');
    }
});
