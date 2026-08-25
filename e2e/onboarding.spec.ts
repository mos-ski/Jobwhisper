import { test as authedTest, expect } from './fixtures/auth.fixture';
import { URLS, waitForPageReady } from './helpers/test-utils';

authedTest.describe('Onboarding Flow', () => {
  authedTest('loads onboarding page', async ({ authedPage }) => {
    await authedPage.goto(URLS.onboarding);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('h1, h2').first()).toBeVisible({ timeout: 10_000 });
  });

  authedTest('step 1 shows target role selection', async ({ authedPage }) => {
    await authedPage.goto(URLS.onboarding);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('text=Job Function')).toBeVisible({ timeout: 10_000 });
    await expect(authedPage.locator('input[placeholder*="Search roles"]')).toBeVisible();
  });

  authedTest('step 1 has job categories', async ({ authedPage }) => {
    await authedPage.goto(URLS.onboarding);
    await waitForPageReady(authedPage);
    const categories = ['Software / AI', 'Product', 'Design', 'Marketing', 'Sales'];
    for (const cat of categories) {
      await expect(authedPage.locator(`button:has-text("${cat}")`).first()).toBeVisible({ timeout: 10_000 });
    }
  });

  authedTest('step 1 has employment type selector', async ({ authedPage }) => {
    await authedPage.goto(URLS.onboarding);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('text=Employment Type')).toBeVisible({ timeout: 10_000 });
    const types = ['Full-Time', 'Part-Time', 'Contract', 'Temporary'];
    for (const t of types) {
      await expect(authedPage.locator(`button:has-text("${t}")`).first()).toBeVisible();
    }
  });

  authedTest('step 1 has experience level selector', async ({ authedPage }) => {
    await authedPage.goto(URLS.onboarding);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('text=Experience Level')).toBeVisible({ timeout: 10_000 });
    const levels = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive'];
    for (const l of levels) {
      await expect(authedPage.locator(`button:has-text("${l}")`).first()).toBeVisible();
    }
  });

  authedTest('can proceed to step 2', async ({ authedPage }) => {
    await authedPage.goto(URLS.onboarding);
    await waitForPageReady(authedPage);

    // Select a category to show roles
    await authedPage.locator('button:has-text("Software / AI")').first().click();
    await authedPage.waitForTimeout(300);

    // Select a role
    await authedPage.locator('button:has-text("Frontend Engineer")').first().click();
    await authedPage.waitForTimeout(300);

    // Click Continue
    await authedPage.locator('button:has-text("Continue")').click();
    await authedPage.waitForTimeout(500);

    // Verify step 2 is showing
    await expect(authedPage.locator('text=Preferred Location')).toBeVisible({ timeout: 10_000 });
  });

  authedTest('step 2 shows location preferences', async ({ authedPage }) => {
    await authedPage.goto(URLS.onboarding);
    await waitForPageReady(authedPage);

    // Navigate to step 2
    await authedPage.locator('button:has-text("Software / AI")').first().click();
    await authedPage.waitForTimeout(300);
    await authedPage.locator('button:has-text("Frontend Engineer")').first().click();
    await authedPage.waitForTimeout(300);
    await authedPage.locator('button:has-text("Continue")').click();
    await authedPage.waitForTimeout(500);

    // Verify location preferences
    await expect(authedPage.locator('text=Preferred Location')).toBeVisible({ timeout: 10_000 });
    await expect(authedPage.locator('text=Job Location Type')).toBeVisible();
    await expect(authedPage.locator('text=Open to relocating')).toBeVisible();
    await expect(authedPage.locator('text=I require H1B sponsorship')).toBeVisible();
  });

  authedTest('step 3 shows resume upload', async ({ authedPage }) => {
    await authedPage.goto(URLS.onboarding);
    await waitForPageReady(authedPage);

    // Navigate to step 3
    await authedPage.locator('button:has-text("Software / AI")').first().click();
    await authedPage.waitForTimeout(300);
    await authedPage.locator('button:has-text("Frontend Engineer")').first().click();
    await authedPage.waitForTimeout(300);
    await authedPage.locator('button:has-text("Continue")').click();
    await authedPage.waitForTimeout(500);

    // Fill in location
    await authedPage.locator('input[placeholder*="United States"]').fill('New York');
    await authedPage.waitForTimeout(300);
    await authedPage.locator('button:has-text("Continue")').click();
    await authedPage.waitForTimeout(500);

    // Verify resume upload area
    await expect(authedPage.locator('text=Drag & drop your resume here')).toBeVisible({ timeout: 10_000 });
    await expect(authedPage.locator('text=PDF or Word')).toBeVisible();
    await expect(authedPage.locator('text=Skip for now')).toBeVisible();
  });

  authedTest('progress indicator shows current step', async ({ authedPage }) => {
    await authedPage.goto(URLS.onboarding);
    await waitForPageReady(authedPage);

    // Step 1 indicator
    const stepIndicator = authedPage.locator('text=Step 1 of 3');
    await expect(stepIndicator).toBeVisible({ timeout: 10_000 });

    // Step dots are present
    const dots = authedPage.locator('.rounded-full.h-2');
    await expect(dots.first()).toBeVisible();
  });

  authedTest('progress indicator updates on step 2', async ({ authedPage }) => {
    await authedPage.goto(URLS.onboarding);
    await waitForPageReady(authedPage);

    // Navigate to step 2
    await authedPage.locator('button:has-text("Software / AI")').first().click();
    await authedPage.waitForTimeout(300);
    await authedPage.locator('button:has-text("Frontend Engineer")').first().click();
    await authedPage.waitForTimeout(300);
    await authedPage.locator('button:has-text("Continue")').click();
    await authedPage.waitForTimeout(500);

    // Step 2 indicator
    await expect(authedPage.locator('text=Step 2 of 3')).toBeVisible({ timeout: 10_000 });
  });

  authedTest('can go back from step 2 to step 1', async ({ authedPage }) => {
    await authedPage.goto(URLS.onboarding);
    await waitForPageReady(authedPage);

    // Navigate to step 2
    await authedPage.locator('button:has-text("Software / AI")').first().click();
    await authedPage.waitForTimeout(300);
    await authedPage.locator('button:has-text("Frontend Engineer")').first().click();
    await authedPage.waitForTimeout(300);
    await authedPage.locator('button:has-text("Continue")').click();
    await authedPage.waitForTimeout(500);

    // Click Back
    await authedPage.locator('button:has-text("Back")').click();
    await authedPage.waitForTimeout(500);

    // Verify back on step 1
    await expect(authedPage.locator('text=Job Function')).toBeVisible({ timeout: 10_000 });
    await expect(authedPage.locator('text=Step 1 of 3')).toBeVisible();
  });
});
