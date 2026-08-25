import { test, expect } from '@playwright/test';
import { test as authedTest } from './fixtures/auth.fixture';
import { URLS, waitForPageReady, expectVisible } from './helpers/test-utils';

// ──────────────────────────────────────────────
// My Documents Page Tests
// ──────────────────────────────────────────────

authedTest.describe('My Documents', () => {
  authedTest('loads documents page', async ({ authedPage }) => {
    await authedPage.goto(URLS.documents);
    await waitForPageReady(authedPage);
    const heading = authedPage.locator('main h1:has-text("Resumes")');
    await expect(heading).toBeVisible({ timeout: 10_000 });
  });

  authedTest('shows grid/list view toggle', async ({ authedPage }) => {
    await authedPage.goto(URLS.documents);
    await waitForPageReady(authedPage);
    const listBtn = authedPage.locator('main button:has(svg.lucide-layout-list)');
    const gridBtn = authedPage.locator('main button:has(svg.lucide-layout-grid)');
    await expect(listBtn).toBeVisible({ timeout: 10_000 });
    await expect(gridBtn).toBeVisible({ timeout: 10_000 });
  });

  authedTest('can toggle between grid and list view', async ({ authedPage }) => {
    await authedPage.goto(URLS.documents);
    await waitForPageReady(authedPage);

    // Default is grid view — resume cards shown as articles
    const gridArticles = authedPage.locator('main article');
    await expect(gridArticles.first()).toBeVisible({ timeout: 10_000 });

    // Click list view button
    const listBtn = authedPage.locator('main button:has(svg.lucide-layout-list)');
    await listBtn.click();
    await authedPage.waitForTimeout(500);

    // In list view, a table should appear
    const table = authedPage.locator('main table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    // Click grid view button to go back
    const gridBtn = authedPage.locator('main button:has(svg.lucide-layout-grid)');
    await gridBtn.click();
    await authedPage.waitForTimeout(500);

    // Grid articles should be visible again
    await expect(authedPage.locator('main article').first()).toBeVisible({ timeout: 10_000 });
  });

  authedTest('search input is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.documents);
    await waitForPageReady(authedPage);
    const searchInput = authedPage.locator('main input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
  });

  authedTest('can search documents', async ({ authedPage }) => {
    await authedPage.goto(URLS.documents);
    await waitForPageReady(authedPage);

    const searchInput = authedPage.locator('main input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible({ timeout: 10_000 });

    // Type a search query
    await searchInput.fill('Darnell');
    await authedPage.waitForTimeout(500);

    // Should filter to show only matching resumes
    const cards = authedPage.locator('main article');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // All visible cards should contain the search term
    for (let i = 0; i < count; i++) {
      const text = await cards.nth(i).textContent();
      expect(text?.toLowerCase()).toContain('darnell');
    }

    // Clear search
    await searchInput.fill('');
    await authedPage.waitForTimeout(500);

    // All resumes should be visible again
    const allCards = authedPage.locator('main article');
    const allCount = await allCards.count();
    expect(allCount).toBe(4);
  });

  authedTest('shows created by you / created by AI tabs', async ({ authedPage }) => {
    await authedPage.goto(URLS.documents);
    await waitForPageReady(authedPage);
    const yoursTab = authedPage.locator('main button:has-text("Created by you")');
    await expect(yoursTab).toBeVisible({ timeout: 10_000 });
    const aiTab = authedPage.locator('main button:has-text("Created by AI")');
    await expect(aiTab).toBeVisible({ timeout: 10_000 });
  });

  authedTest('can switch between tabs', async ({ authedPage }) => {
    await authedPage.goto(URLS.documents);
    await waitForPageReady(authedPage);

    // "Created by you" is active by default
    const yoursTab = authedPage.locator('main button:has-text("Created by you")');
    await expect(yoursTab).toBeVisible({ timeout: 10_000 });

    // Click "Created by AI" tab
    const aiTab = authedPage.locator('main button:has-text("Created by AI")');
    await aiTab.click();
    await authedPage.waitForTimeout(500);

    // Switch back to "Created by you"
    await yoursTab.click();
    await authedPage.waitForTimeout(500);

    // History section should remain visible
    const history = authedPage.locator('main h2:has-text("History")');
    await expect(history).toBeVisible({ timeout: 10_000 });
  });

  authedTest('create new resume button is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.documents);
    await waitForPageReady(authedPage);
    const createBtn = authedPage.locator('main p:has-text("Create from scratch")').first();
    await expect(createBtn).toBeVisible({ timeout: 10_000 });
  });

  authedTest('upload resume option is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.documents);
    await waitForPageReady(authedPage);
    const uploadOption = authedPage.locator('main p:has-text("Create from a resume")').first();
    await expect(uploadOption).toBeVisible({ timeout: 10_000 });
  });

  authedTest('resume cards show ATS score badges', async ({ authedPage }) => {
    await authedPage.goto(URLS.documents);
    await waitForPageReady(authedPage);

    // In grid view, resume cards should be visible
    const cards = authedPage.locator('main article');
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });

    // Switch to list view to see ATS scores in table
    const listBtn = authedPage.locator('main button:has(svg.lucide-layout-list)');
    await listBtn.click();
    await authedPage.waitForTimeout(500);

    // ATS score column should exist in the table header
    const atsHeader = authedPage.locator('main th:has-text("ATS Score")');
    await expect(atsHeader).toBeVisible({ timeout: 10_000 });

    // ATS score badges should be visible in table rows
    const scoreBadges = authedPage.locator('main td span.rounded-full');
    const count = await scoreBadges.count();
    expect(count).toBeGreaterThan(0);
  });
});
