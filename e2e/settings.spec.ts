import { test as authedTest, expect } from './fixtures/auth.fixture';
import { URLS, waitForPageReady } from './helpers/test-utils';

authedTest.describe('Settings', () => {
  authedTest('loads settings page', async ({ authedPage }) => {
    await authedPage.goto(URLS.settings);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('h1:has-text("Settings")')).toBeVisible({ timeout: 10_000 });
  });

  authedTest('has Profile, Security, and Referral tabs', async ({ authedPage }) => {
    await authedPage.goto(URLS.settings);
    await waitForPageReady(authedPage);
    const profileTab = authedPage.locator('a:has-text("profile")').first();
    const securityTab = authedPage.locator('a:has-text("security")').first();
    const referralTab = authedPage.locator('a:has-text("referral")').first();
    await expect(profileTab).toBeVisible({ timeout: 10_000 });
    await expect(securityTab).toBeVisible();
    await expect(referralTab).toBeVisible();
  });

  authedTest('Profile tab shows name, email, phone fields', async ({ authedPage }) => {
    await authedPage.goto(URLS.settings);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('text=First Name')).toBeVisible({ timeout: 10_000 });
    await expect(authedPage.locator('text=Last Name')).toBeVisible();
    await expect(authedPage.locator('text=Email')).toBeVisible();
    await expect(authedPage.locator('text=Phone Number')).toBeVisible();
  });

  authedTest('Profile tab shows country and city fields', async ({ authedPage }) => {
    await authedPage.goto(URLS.settings);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('text=Country')).toBeVisible({ timeout: 10_000 });
    await expect(authedPage.locator('text=City')).toBeVisible();
  });

  authedTest('photo upload is available', async ({ authedPage }) => {
    await authedPage.goto(URLS.settings);
    await waitForPageReady(authedPage);
    const uploadBtn = authedPage.locator('button:has-text("Upload Photo")');
    await expect(uploadBtn).toBeVisible({ timeout: 10_000 });
  });

  authedTest('Security tab shows password change form', async ({ authedPage }) => {
    await authedPage.goto(`${URLS.settings}?tab=security`);
    await waitForPageReady(authedPage);
    await expect(authedPage.getByText('Current Password', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(authedPage.getByText('New Password', { exact: true })).toBeVisible();
    await expect(authedPage.getByText('Confirm New Password', { exact: true })).toBeVisible();
  });

  authedTest('Security tab shows 2FA toggle', async ({ authedPage }) => {
    await authedPage.goto(`${URLS.settings}?tab=security`);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('text=Two-step verification')).toBeVisible({ timeout: 10_000 });
  });

  authedTest('Security tab shows delete account option', async ({ authedPage }) => {
    await authedPage.goto(`${URLS.settings}?tab=security`);
    await waitForPageReady(authedPage);
    await expect(authedPage.getByRole('heading', { name: 'Delete Account' })).toBeVisible({ timeout: 10_000 });
  });

  authedTest('Referral tab shows referral link and code', async ({ authedPage }) => {
    await authedPage.goto(`${URLS.settings}?tab=referral`);
    await waitForPageReady(authedPage);
    await expect(authedPage.getByText('Referral Link', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(authedPage.getByText('Referral Code', { exact: true })).toBeVisible();
  });

  authedTest('Referral tab shows referral history table', async ({ authedPage }) => {
    await authedPage.goto(`${URLS.settings}?tab=referral`);
    await waitForPageReady(authedPage);
    await expect(authedPage.locator('text=Previous Referrals')).toBeVisible({ timeout: 10_000 });
    const table = authedPage.locator('table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    await expect(authedPage.locator('th:has-text("Name")')).toBeVisible();
    await expect(authedPage.locator('th:has-text("Email")')).toBeVisible();
    await expect(authedPage.locator('th:has-text("Status")')).toBeVisible();
  });

  authedTest('Save button is present on profile tab', async ({ authedPage }) => {
    await authedPage.goto(URLS.settings);
    await waitForPageReady(authedPage);
    const updateBtn = authedPage.locator('button:has-text("Update")');
    await expect(updateBtn).toBeVisible({ timeout: 10_000 });
  });
});
