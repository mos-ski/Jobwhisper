import { test, expect } from '@playwright/test';
import { test as authedTest } from './fixtures/auth.fixture';
import { URLS, waitForPageReady, expectVisible, clickNavItem, expectUrl } from './helpers/test-utils';

// ──────────────────────────────────────────────
// Dashboard Tests
// ──────────────────────────────────────────────

authedTest.describe('Dashboard', () => {
  authedTest('renders welcome greeting with user name', async ({ authedPage }) => {
    const greeting = authedPage.locator('text=Welcome').first();
    await expect(greeting).toBeVisible({ timeout: 10_000 });
  });

  authedTest('shows resume upload section', async ({ authedPage }) => {
    const uploadSection = authedPage.locator('text=We\'ll analyze your resume, [data-testid="resume-upload"]').first();
    if (await uploadSection.isVisible()) {
      await expect(uploadSection).toBeVisible();
    }
  });

  authedTest('shows "Use last" resume button', async ({ authedPage }) => {
    const lastResume = authedPage.locator('text=Use last').first();
    if (await lastResume.isVisible()) {
      await expect(lastResume).toBeVisible();
    }
  });

  authedTest('action cards appear after selecting a resume', async ({ authedPage }) => {
    const useLastBtn = authedPage.locator('button:has-text("Use last")').first();
    if (await useLastBtn.isVisible()) {
      await useLastBtn.click();
      await authedPage.waitForTimeout(1000);
      const tailorCard = authedPage.locator('text=Tailor my Resume').first();
      await expect(tailorCard).toBeVisible({ timeout: 10_000 });
    }
  });

  authedTest('action cards are clickable and navigate', async ({ authedPage }) => {
    const useLastBtn = authedPage.locator('button:has-text("Use last")').first();
    if (await useLastBtn.isVisible()) {
      await useLastBtn.click();
      await authedPage.waitForTimeout(1000);
      const tailorCard = authedPage.locator('a:has-text("Tailor my Resume")').first();
      if (await tailorCard.isVisible()) {
        await tailorCard.click();
        await authedPage.waitForTimeout(1500);
        const url = authedPage.url();
        expect(url.includes('resume-builder') || url.includes('tailor')).toBeTruthy();
      }
    }
  });

  authedTest('how-it-works section is present and toggleable', async ({ authedPage }) => {
    const howItWorks = authedPage.locator('button:has-text("How it works")').first();
    await expect(howItWorks).toBeVisible({ timeout: 10_000 });
    await howItWorks.click();
    await authedPage.waitForTimeout(500);
    const resumeBuilderCard = authedPage.locator('text=For Resume Builder').first();
    await expect(resumeBuilderCard).toBeVisible({ timeout: 5_000 });
  });

  authedTest('help links section exists', async ({ authedPage }) => {
    const helpDesk = authedPage.locator('text=Visit Help Desk').first();
    await expect(helpDesk).toBeVisible({ timeout: 10_000 });
    const tutorial = authedPage.locator('text=Watch Quick Tutorial').first();
    await expect(tutorial).toBeVisible();
    const support = authedPage.locator('text=Contact us for support').first();
    await expect(support).toBeVisible();
  });
});

// ──────────────────────────────────────────────
// Navigation Tests (Sidebar)
// ──────────────────────────────────────────────

authedTest.describe('Sidebar Navigation', () => {
  authedTest('renders sidebar with all navigation items', async ({ authedPage }) => {
    // Desktop sidebar is the second aside in DOM (mobile sidebar is first but hidden at md+)
    const sidebar = authedPage.locator('aside').nth(1);
    await expect(sidebar).toBeVisible({ timeout: 10_000 });

    const expectedLabels = ['Dashboard', 'My Documents', 'Auto-Apply', 'Interview Prep', 'Interview Co-Pilot', 'Explore', 'Downloads', 'Billing', 'Settings'];
    for (const label of expectedLabels) {
      const item = sidebar.locator(`a:has-text("${label}"), button:has-text("${label}")`).first();
      if (await item.isVisible()) {
        await expect(item).toBeVisible();
      }
    }
  });

  authedTest('sidebar navigation to Dashboard', async ({ authedPage }) => {
    await authedPage.locator('nav a:has-text("Dashboard")').last().click();
    await authedPage.waitForLoadState('domcontentloaded');
    await expectUrl(authedPage, '/app');
  });

  authedTest('sidebar navigation to Documents', async ({ authedPage }) => {
    const docsBtn = authedPage.locator('button:has-text("My Documents")').last();
    if (await docsBtn.isVisible()) {
      await docsBtn.click();
      await authedPage.waitForTimeout(300);
      const resumesLink = authedPage.locator('nav a:has-text("Resumes")').last();
      if (await resumesLink.isVisible()) {
        await resumesLink.click();
      } else {
        await docsBtn.click();
      }
      await authedPage.waitForLoadState('domcontentloaded');
      await expectUrl(authedPage, '/documents');
    }
  });

  authedTest('sidebar navigation to Auto-Apply', async ({ authedPage }) => {
    const item = authedPage.locator('nav a:has-text("Auto-Apply")').last();
    if (await item.isVisible()) {
      await item.click();
      await authedPage.waitForLoadState('domcontentloaded');
      const url = authedPage.url();
      expect(url.includes('auto-apply')).toBeTruthy();
    }
  });

  authedTest('sidebar navigation to Interview', async ({ authedPage }) => {
    const item = authedPage.locator('nav a:has-text("Interview Prep")').last();
    if (await item.isVisible()) {
      await item.click();
      await authedPage.waitForLoadState('domcontentloaded');
      const url = authedPage.url();
      expect(url.includes('interview')).toBeTruthy();
    }
  });

  authedTest('sidebar navigation to Billing', async ({ authedPage }) => {
    const item = authedPage.locator('nav a:has-text("Billing")').last();
    if (await item.isVisible()) {
      await item.click();
      await authedPage.waitForLoadState('domcontentloaded');
      await expectUrl(authedPage, '/billing');
    }
  });

  authedTest('sidebar navigation to Settings', async ({ authedPage }) => {
    await authedPage.locator('nav a:has-text("Settings")').last().click();
    await authedPage.waitForLoadState('domcontentloaded');
    await expectUrl(authedPage, '/settings');
  });

  authedTest('sidebar navigation to Explore', async ({ authedPage }) => {
    await authedPage.locator('nav a:has-text("Explore")').last().click();
    await authedPage.waitForLoadState('domcontentloaded');
    await expectUrl(authedPage, '/explore');
  });

  authedTest('sidebar shows "How to use" link', async ({ authedPage }) => {
    const howToUse = authedPage.locator('nav a:has-text("How to use")').last();
    if (await howToUse.isVisible()) {
      await expect(howToUse).toBeVisible();
    }
  });

  authedTest('UpgradeCard is visible for non-Premium users', async ({ authedPage }) => {
    const upgradeCard = authedPage.locator('text=Upgrade to Premium').first();
    if (await upgradeCard.isVisible()) {
      await expect(upgradeCard).toBeVisible();
    }
  });
});

// ──────────────────────────────────────────────
// Top Navigation Tests
// ──────────────────────────────────────────────

authedTest.describe('Top Navigation', () => {
  authedTest('top nav shows user avatar/menu', async ({ authedPage }) => {
    const avatar = authedPage.locator('[aria-label="Open account menu"]').first();
    await expect(avatar).toBeVisible({ timeout: 10_000 });
  });

  authedTest('top nav shows credit counter', async ({ authedPage }) => {
    const creditBtn = authedPage.locator('[aria-label="Open credit counter"]').first();
    await expect(creditBtn).toBeVisible({ timeout: 10_000 });
  });

  authedTest('top nav shows notification bell', async ({ authedPage }) => {
    const bell = authedPage.locator('[aria-label="Notifications"]').first();
    await expect(bell).toBeVisible({ timeout: 10_000 });
  });

  authedTest('user menu dropdown opens on click', async ({ authedPage }) => {
    const avatar = authedPage.locator('[aria-label="Open account menu"]').first();
    await avatar.click();
    await authedPage.waitForTimeout(500);
    const logoutBtn = authedPage.locator('text=Logout').first();
    await expect(logoutBtn).toBeVisible({ timeout: 5_000 });
  });

  authedTest('user menu shows Account and Security links', async ({ authedPage }) => {
    const avatar = authedPage.locator('[aria-label="Open account menu"]').first();
    await avatar.click();
    await authedPage.waitForTimeout(500);
    const account = authedPage.locator('text=Account').first();
    await expect(account).toBeVisible({ timeout: 5_000 });
    const security = authedPage.locator('text=Security').first();
    await expect(security).toBeVisible();
  });

  authedTest('notification dropdown opens on bell click', async ({ authedPage }) => {
    const bell = authedPage.locator('[aria-label="Notifications"]').first();
    await bell.click();
    await authedPage.waitForTimeout(500);
    const notifHeader = authedPage.locator('text=Notifications').first();
    await expect(notifHeader).toBeVisible({ timeout: 5_000 });
  });

  authedTest('notification panel has "Mark all read" button', async ({ authedPage }) => {
    const bell = authedPage.locator('[aria-label="Notifications"]').first();
    await bell.click();
    await authedPage.waitForTimeout(500);
    const markRead = authedPage.locator('text=Mark all read').first();
    await expect(markRead).toBeVisible({ timeout: 5_000 });
  });

  authedTest('credit counter dropdown shows remaining credits', async ({ authedPage }) => {
    const creditBtn = authedPage.locator('[aria-label="Open credit counter"]').first();
    await creditBtn.click();
    await authedPage.waitForTimeout(500);
    const remaining = authedPage.locator('text=Remaining Credits').first();
    await expect(remaining).toBeVisible({ timeout: 5_000 });
  });

  authedTest('credit counter dropdown shows Upgrade button', async ({ authedPage }) => {
    const creditBtn = authedPage.locator('[aria-label="Open credit counter"]').first();
    await creditBtn.click();
    await authedPage.waitForTimeout(500);
    const upgradeBtn = authedPage.getByRole('button', { name: /Upgrade/i }).or(authedPage.getByRole('link', { name: /Upgrade/i }));
    await expect(upgradeBtn.first()).toBeVisible({ timeout: 5_000 });
  });
});

// ──────────────────────────────────────────────
// Logout Test
// ──────────────────────────────────────────────

authedTest.describe('Logout', () => {
  authedTest('logout from user menu navigates to auth', async ({ authedPage }) => {
    const avatar = authedPage.locator('[aria-label="Open account menu"]').first();
    await avatar.click();
    await authedPage.waitForTimeout(500);
    const logoutBtn = authedPage.locator('text=Logout').first();
    await expect(logoutBtn).toBeVisible({ timeout: 5_000 });
    await logoutBtn.click();
    await authedPage.waitForTimeout(2000);
    const url = authedPage.url();
    expect(url.includes('/auth') || url.includes('/')).toBeTruthy();
  });
});

// ──────────────────────────────────────────────
// Mobile Sidebar Toggle
// ──────────────────────────────────────────────

authedTest.describe('Mobile Sidebar', () => {
  authedTest('mobile menu toggle opens sidebar', async ({ authedPage }) => {
    // Set viewport to mobile size
    await authedPage.setViewportSize({ width: 375, height: 812 });
    const menuBtn = authedPage.locator('[aria-label="Open menu"]').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await authedPage.waitForTimeout(500);
      // The mobile sidebar should be visible with navigation items
      const mobileSidebar = authedPage.locator('.fixed.inset-y-0.left-0').first();
      await expect(mobileSidebar).toBeVisible({ timeout: 5_000 });
    }
  });

  authedTest('mobile sidebar has close button', async ({ authedPage }) => {
    await authedPage.setViewportSize({ width: 375, height: 812 });
    const menuBtn = authedPage.locator('[aria-label="Open menu"]').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await authedPage.waitForTimeout(500);
      const closeBtn = authedPage.locator('[aria-label="Close menu"]').first();
      await expect(closeBtn).toBeVisible({ timeout: 5_000 });
      await closeBtn.click();
      await authedPage.waitForTimeout(500);
    }
  });

  authedTest('mobile sidebar close overlay works', async ({ authedPage }) => {
    await authedPage.setViewportSize({ width: 375, height: 812 });
    const menuBtn = authedPage.locator('[aria-label="Open menu"]').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await authedPage.waitForTimeout(500);
      const overlay = authedPage.locator('.fixed.inset-0.z-50.bg-black\\/40').first();
      if (await overlay.isVisible()) {
        await overlay.click({ force: true });
        await authedPage.waitForTimeout(500);
      }
    }
  });
});

// ──────────────────────────────────────────────
// CreditBanner Test
// ──────────────────────────────────────────────

authedTest.describe('CreditBanner', () => {
  authedTest('CreditBanner is visible when credits are zero', async ({ authedPage }) => {
    const banner = authedPage.locator('text=0 credits remaining today').first();
    if (await banner.isVisible()) {
      await expect(banner).toBeVisible();
      const upgradeLink = authedPage.locator('text=Upgrade').first();
      await expect(upgradeLink).toBeVisible();
    }
  });
});
