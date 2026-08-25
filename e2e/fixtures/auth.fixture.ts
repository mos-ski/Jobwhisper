import { test as base, Page } from '@playwright/test';

type AuthFixtures = {
  authedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authedPage: async ({ page }, use) => {
    await page.goto('/app');
    await page.waitForSelector('[data-testid="dashboard-page"], h1:has-text("Welcome"), h1:has-text("Good")', { timeout: 15_000 });
    await use(page);
  },
});

export { expect } from '@playwright/test';
