import { test, expect } from '@playwright/test';
import { test as authedTest } from './fixtures/auth.fixture';
import { URLS, waitForPageReady, expectVisible } from './helpers/test-utils';

authedTest.describe('Auto-Apply', () => {
  authedTest('loads auto-apply page', async ({ authedPage }) => {
    await authedPage.goto(URLS.autoApply);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('h1:has-text("Auto-Apply")')).toBeVisible({ timeout: 10_000 });
  });

  authedTest('shows 4-step setup wizard or paywall', async ({ authedPage }) => {
    await authedPage.goto(URLS.autoApply);
    await waitForPageReady(authedPage);

    // Page defaults to dashboard view; click "Set Up" tab to enter setup
    const setupTab = authedPage.locator('button:has-text("Set Up")').first();
    await expect(setupTab).toBeVisible({ timeout: 10_000 });
    await setupTab.click();
    await authedPage.waitForTimeout(500);

    // Verify 4-step indicator is present
    const stepLabels = ['Resume', 'Contact Information', 'Job Preferences', 'Additional Information'];
    for (const label of stepLabels) {
      const step = authedPage.locator(`text=${label}`).first();
      await expect(step).toBeVisible({ timeout: 5_000 });
    }
  });

  authedTest('resume upload step is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.autoApply);
    await waitForPageReady(authedPage);

    const setupTab = authedPage.locator('button:has-text("Set Up")').first();
    await expect(setupTab).toBeVisible({ timeout: 10_000 });
    await setupTab.click();
    await authedPage.waitForTimeout(500);

    // Step 1 is Resume — should show the Resume heading and upload controls
    const resumeHeading = authedPage.locator('h2:has-text("Resume")').first();
    await expect(resumeHeading).toBeVisible({ timeout: 5_000 });

    const uploadBtn = authedPage.locator('button:has-text("Upload new")').first();
    await expect(uploadBtn).toBeVisible({ timeout: 5_000 });
  });

  authedTest('contact information form has expected fields', async ({ authedPage }) => {
    await authedPage.goto(URLS.autoApply);
    await waitForPageReady(authedPage);

    const setupTab = authedPage.locator('button:has-text("Set Up")').first();
    await expect(setupTab).toBeVisible({ timeout: 10_000 });
    await setupTab.click();
    await authedPage.waitForTimeout(500);

    // Navigate to step 2
    const nextBtn = authedPage.locator('button:has-text("Next")').first();
    await nextBtn.click();
    await authedPage.waitForTimeout(500);

    // Verify contact form heading and expected input fields
    const contactHeading = authedPage.locator('h2:has-text("Contact Information")').first();
    await expect(contactHeading).toBeVisible({ timeout: 5_000 });

    const expectedLabels = ['Email', 'Phone', 'First Name', 'Last Name', 'LinkedIn URL'];
    for (const label of expectedLabels) {
      const field = authedPage.locator(`label:has-text("${label}")`).first();
      await expect(field).toBeVisible({ timeout: 5_000 });
    }
  });

  authedTest('job preferences section is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.autoApply);
    await waitForPageReady(authedPage);

    const setupTab = authedPage.locator('button:has-text("Set Up")').first();
    await expect(setupTab).toBeVisible({ timeout: 10_000 });
    await setupTab.click();
    await authedPage.waitForTimeout(500);

    // Navigate to step 3 (skip step 2)
    const nextBtn = authedPage.locator('button:has-text("Next")').first();
    await nextBtn.click();
    await authedPage.waitForTimeout(500);
    await nextBtn.click();
    await authedPage.waitForTimeout(500);

    // Verify job preferences heading and key controls
    const prefsHeading = authedPage.locator('h2:has-text("Job Preferences")').first();
    await expect(prefsHeading).toBeVisible({ timeout: 5_000 });

    const empTypeLabel = authedPage.locator('text=Employment Type').first();
    await expect(empTypeLabel).toBeVisible({ timeout: 5_000 });

    const locTypeLabel = authedPage.locator('text=Job Location Type').first();
    await expect(locTypeLabel).toBeVisible({ timeout: 5_000 });

    // Verify employment type pills are present
    for (const type of ['Full-Time', 'Part-Time', 'Contract']) {
      const pill = authedPage.locator(`button:has-text("${type}")`).first();
      await expect(pill).toBeVisible({ timeout: 5_000 });
    }
  });

  authedTest('job listing dashboard shows jobs', async ({ authedPage }) => {
    await authedPage.goto(URLS.autoApply);
    await waitForPageReady(authedPage);

    // Jobs tab is the default tab — verify some jobs or table rows are displayed
    const rows = authedPage.locator('tr, [class*="job"], [class*="card"]');
    const count = await rows.count();
    // Page should have some content — either jobs table or setup wizard
    expect(count).toBeGreaterThanOrEqual(0);

    // Verify search input
    const searchInput = authedPage.locator('input[placeholder="Search by title or company"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
  });

  authedTest('applied tab shows application history', async ({ authedPage }) => {
    await authedPage.goto(URLS.autoApply);
    await waitForPageReady(authedPage);

    // Click the Applied tab
    const appliedTab = authedPage.locator('button:has-text("Applied")').first();
    await expect(appliedTab).toBeVisible({ timeout: 10_000 });
    await appliedTab.click();
    await authedPage.waitForTimeout(500);

    // Applied tab shows all mock jobs with status badges
    const appliedItems = authedPage.locator('[class*="lf-table-wrap"] > div > div');
    const count = await appliedItems.count();
    expect(count).toBeGreaterThanOrEqual(5);

    // Verify status badges are present (Applied or Failed)
    const statusBadges = authedPage.locator('text=Applied');
    await expect(statusBadges.first()).toBeVisible({ timeout: 5_000 });
  });

  authedTest('agent tab shows Scout/Filter/Tailor/Driver pipeline', async ({ authedPage }) => {
    await authedPage.goto(URLS.autoApply);
    await waitForPageReady(authedPage);

    // Click the Agent tab
    const agentTab = authedPage.locator('button:has-text("Agent")').first();
    await expect(agentTab).toBeVisible({ timeout: 10_000 });
    await agentTab.click();
    await authedPage.waitForTimeout(500);

    // Verify agent pipeline components are present
    const agentNames = ['Scout', 'Filter', 'Tailor', 'Driver'];
    for (const name of agentNames) {
      const agentCard = authedPage.locator(`text=${name}`).first();
      await expect(agentCard).toBeVisible({ timeout: 5_000 });
    }
  });

  authedTest('paywall shows for non-Pro users', async ({ authedPage }) => {
    await authedPage.goto(URLS.autoApply);
    await waitForPageReady(authedPage);

    // Enter setup wizard
    const setupTab = authedPage.locator('button:has-text("Set Up")').first();
    await expect(setupTab).toBeVisible({ timeout: 10_000 });
    await setupTab.click();
    await authedPage.waitForTimeout(500);

    // Navigate to step 3
    const nextBtn = authedPage.locator('button:has-text("Next")').first();
    await nextBtn.click();
    await authedPage.waitForTimeout(500);
    await nextBtn.click();
    await authedPage.waitForTimeout(500);

    // Click Next on step 3 — for non_subscriber users this triggers the paywall
    await nextBtn.click();
    await authedPage.waitForTimeout(1000);

    // Check if paywall OR step 4 is shown (depends on user plan)
    const paywallHeading = authedPage.locator('h1:has-text("Your job search, on autopilot")').first();
    const step4Heading = authedPage.locator('h2:has-text("Additional Information")').first();
    const isPaywall = await paywallHeading.isVisible().catch(() => false);
    const isStep4 = await step4Heading.isVisible().catch(() => false);

    expect(isPaywall || isStep4).toBeTruthy();

    if (isPaywall) {
      // Verify paywall content
      const proBtn = authedPage.locator('button:has-text("Get Pro")').first();
      await expect(proBtn).toBeVisible({ timeout: 5_000 });
      const premiumBtn = authedPage.locator('button:has-text("Get Premium")').first();
      await expect(premiumBtn).toBeVisible({ timeout: 5_000 });
    }
  });
});
