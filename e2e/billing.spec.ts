import { test, expect } from '@playwright/test';
import { test as authedTest } from './fixtures/auth.fixture';
import { URLS, waitForPageReady } from './helpers/test-utils';

// ──────────────────────────────────────────────
// Billing Page Tests
// ──────────────────────────────────────────────

authedTest.describe('Billing & Subscription', () => {
  authedTest('loads billing page', async ({ authedPage }) => {
    await authedPage.goto(URLS.billing);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('h1:has-text("Billing")')).toBeVisible({ timeout: 10_000 });
  });

  authedTest('shows 3 plan tiers (Starter, Pro, Premium)', async ({ authedPage }) => {
    await authedPage.goto(URLS.billing);
    await waitForPageReady(authedPage);
    const starter = authedPage.locator('h3:has-text("STARTER")');
    const pro = authedPage.locator('h3:has-text("PRO")');
    const premium = authedPage.locator('h3:has-text("PREMIUM")');
    await expect(starter).toBeVisible({ timeout: 10_000 });
    await expect(pro).toBeVisible();
    await expect(premium).toBeVisible();
  });

  authedTest('plan prices are displayed', async ({ authedPage }) => {
    await authedPage.goto(URLS.billing);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('text=₦5,000')).toBeVisible({ timeout: 10_000 });
    await expect(authedPage.locator('text=₦20,000')).toBeVisible();
    await expect(authedPage.locator('text=₦50,000')).toBeVisible();
  });

  authedTest('annual/monthly toggle is visible', async ({ authedPage }) => {
    await authedPage.goto(URLS.billing);
    await waitForPageReady(authedPage);
    const annualToggle = authedPage.locator('text=Annual').first();
    await expect(annualToggle).toBeVisible({ timeout: 10_000 });
    const saveText = authedPage.locator('text=save 20%').first();
    await expect(saveText).toBeVisible();
  });

  authedTest('credit usage summary is shown', async ({ authedPage }) => {
    await authedPage.goto(URLS.billing);
    await waitForPageReady(authedPage);
    const creditHeading = authedPage.locator('h2.font-bold:has-text("Credits")');
    await expect(creditHeading).toBeVisible({ timeout: 10_000 });
    const remaining = authedPage.locator('text=Left');
    await expect(remaining).toBeVisible();
  });

  authedTest('manage plan button is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.billing);
    await waitForPageReady(authedPage);
    const manageBtn = authedPage.locator('button:has-text("Manage Plan")');
    await expect(manageBtn).toBeVisible({ timeout: 10_000 });
  });
});

// ──────────────────────────────────────────────
// Usage Details Tests
// ──────────────────────────────────────────────

authedTest.describe('Usage Details', () => {
  authedTest('navigates to usage details page', async ({ authedPage }) => {
    await authedPage.goto(URLS.usage);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('h1:has-text("Usage")')).toBeVisible({ timeout: 10_000 });
  });

  authedTest('usage page shows credit transaction history', async ({ authedPage }) => {
    await authedPage.goto(URLS.usage);
    await waitForPageReady(authedPage);
    const historyHeading = authedPage.locator('h2:has-text("Credit History")');
    await expect(historyHeading).toBeVisible({ timeout: 10_000 });
    const transactions = authedPage.locator('[class*="divide"] > div');
    await expect(transactions.first()).toBeVisible({ timeout: 10_000 });
  });

  authedTest('usage page has date range filter', async ({ authedPage }) => {
    await authedPage.goto(URLS.usage);
    await waitForPageReady(authedPage);
    const rangeSelect = authedPage.locator('select').filter({ hasText: 'Last' });
    await expect(rangeSelect).toBeVisible({ timeout: 10_000 });
    const options = await rangeSelect.locator('option').allTextContents();
    expect(options).toContainEqual('Last 7 days');
    expect(options).toContainEqual('Last 30 days');
    expect(options).toContainEqual('Last 90 days');
  });

  authedTest('usage page has feature filter', async ({ authedPage }) => {
    await authedPage.goto(URLS.usage);
    await waitForPageReady(authedPage);
    const featureSelect = authedPage.locator('select').filter({ hasText: 'All features' });
    await expect(featureSelect).toBeVisible({ timeout: 10_000 });
    const options = await featureSelect.locator('option').allTextContents();
    expect(options.some(o => o.includes('All features'))).toBeTruthy();
    expect(options.some(o => o.includes('Resume Builder'))).toBeTruthy();
    expect(options.some(o => o.includes('Interview Prep'))).toBeTruthy();
  });

  authedTest('usage page shows credit bar chart', async ({ authedPage }) => {
    await authedPage.goto(URLS.usage);
    await waitForPageReady(authedPage);
    const chartContainer = authedPage.locator('.flex.items-end.gap-2, [class*="flex"][class*="items-end"]');
    await expect(chartContainer).toBeVisible({ timeout: 10_000 });
  });

  authedTest('changing date range filter updates displayed data', async ({ authedPage }) => {
    await authedPage.goto(URLS.usage);
    await waitForPageReady(authedPage);
    const rangeSelect = authedPage.locator('select').filter({ hasText: 'Last' });
    await rangeSelect.selectOption('7');
    await authedPage.waitForTimeout(500);
    const usedText = authedPage.locator('text=/\\d+ credits/').first();
    await expect(usedText).toBeVisible({ timeout: 5_000 });
  });

  authedTest('changing feature filter updates displayed data', async ({ authedPage }) => {
    await authedPage.goto(URLS.usage);
    await waitForPageReady(authedPage);
    const featureSelect = authedPage.locator('select').filter({ hasText: 'All features' });
    await featureSelect.selectOption('resume-builder');
    await authedPage.waitForTimeout(500);
    const usedText = authedPage.locator('text=/\\d+ credits/').first();
    await expect(usedText).toBeVisible({ timeout: 5_000 });
  });

  authedTest('usage details page has back to billing link', async ({ authedPage }) => {
    await authedPage.goto(URLS.usage);
    await waitForPageReady(authedPage);
    const backLink = authedPage.locator('text=Back to Billing');
    await expect(backLink).toBeVisible({ timeout: 10_000 });
  });
});
