import { Page, Locator, expect } from '@playwright/test';

export const URLS = {
  home: '/',
  pricing: '/pricing',
  auth: '/auth',
  dashboard: '/app',
  documents: '/documents',
  contextPage: '/documents/context',
  resumeBuilder: '/resume-builder',
  autoApply: '/app/auto-apply',
  interviewPrep: '/app/interview-prep',
  interviewCopilot: '/interview-copilot',
  jobProfile: '/job-profile',
  billing: '/billing',
  usage: '/billing/usage',
  settings: '/settings',
  onboarding: '/onboarding',
  explore: '/explore',
  downloads: '/downloads',
  howToUse: '/how-to-use',
};

export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
}

export async function expectVisible(locator: Locator) {
  await expect(locator).toBeVisible({ timeout: 10_000 });
}

export async function clickNavItem(page: Page, label: string) {
  await page.click(`nav a:has-text("${label}"), aside a:has-text("${label}"), [role="navigation"] a:has-text("${label}")`);
  await page.waitForLoadState('networkidle');
}

export async function expectUrl(page: Page, path: string) {
  await expect(page).toHaveURL(new RegExp(path));
}
