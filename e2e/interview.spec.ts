import { test, expect } from '@playwright/test';
import { test as authedTest } from './fixtures/auth.fixture';
import { URLS, waitForPageReady, expectVisible } from './helpers/test-utils';

// ──────────────────────────────────────────────
// Interview Prep Tests
// ──────────────────────────────────────────────

authedTest.describe('Interview Prep', () => {
  authedTest('loads interview prep page', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewPrep);
    await waitForPageReady(authedPage);
    const heading = authedPage.locator('h1:has-text("Interview Prep")').first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
  });

  authedTest('shows practice room header and description', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewPrep);
    await waitForPageReady(authedPage);
    const practiceLabel = authedPage.locator('text=Practice room').first();
    await expect(practiceLabel).toBeVisible({ timeout: 10_000 });
    const description = authedPage.locator('text=Pick a scenario, practice with an AI interviewer').first();
    await expect(description).toBeVisible({ timeout: 10_000 });
  });

  authedTest('role/position filter buttons are present', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewPrep);
    await waitForPageReady(authedPage);

    const expectedFilters = ['All', 'Recruiter Screen', 'Hiring Manager', 'Technical', 'Culture Fit', 'Final Round'];
    for (const filter of expectedFilters) {
      const btn = authedPage.locator(`button:has-text("${filter}")`).first();
      await expect(btn).toBeVisible({ timeout: 5_000 });
    }
  });

  authedTest('create scenario button and card are present', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewPrep);
    await waitForPageReady(authedPage);

    const createBtn = authedPage.locator('button:has-text("Create Scenario")').first();
    await expect(createBtn).toBeVisible({ timeout: 10_000 });

    const createCard = authedPage.locator('text=Create Your Own').first();
    await expect(createCard).toBeVisible({ timeout: 10_000 });
  });

  authedTest('scenario cards have configure and start buttons', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewPrep);
    await waitForPageReady(authedPage);

    const configureBtn = authedPage.locator('button:has-text("Configure & Start")').first();
    await expect(configureBtn).toBeVisible({ timeout: 10_000 });
  });

  authedTest('can start a practice interview via configure', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewPrep);
    await waitForPageReady(authedPage);

    // Click the first "Configure & Start" button on a scenario card
    const configureBtn = authedPage.locator('button:has-text("Configure & Start")').first();
    await expect(configureBtn).toBeVisible({ timeout: 10_000 });
    await configureBtn.click();
    await authedPage.waitForTimeout(500);

    // Should navigate to the configure view
    const configureHeading = authedPage.locator('h1:has-text("Configure your interview")').first();
    await expect(configureHeading).toBeVisible({ timeout: 10_000 });
  });

  authedTest('configure view shows interview setup fields', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewPrep);
    await waitForPageReady(authedPage);

    // Open configure view
    const configureBtn = authedPage.locator('button:has-text("Configure & Start")').first();
    await expect(configureBtn).toBeVisible({ timeout: 10_000 });
    await configureBtn.click();
    await authedPage.waitForTimeout(500);

    // Verify setup fields are present
    const interviewType = authedPage.locator('text=Interview type').first();
    await expect(interviewType).toBeVisible({ timeout: 5_000 });

    const difficulty = authedPage.locator('text=Difficulty').first();
    await expect(difficulty).toBeVisible({ timeout: 5_000 });

    const targetRole = authedPage.locator('text=Target role').first();
    await expect(targetRole).toBeVisible({ timeout: 5_000 });

    const company = authedPage.locator('label:has-text("Company")').first();
    await expect(company).toBeVisible({ timeout: 5_000 });
  });

  authedTest('configure view shows start interview button', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewPrep);
    await waitForPageReady(authedPage);

    const configureBtn = authedPage.locator('button:has-text("Configure & Start")').first();
    await expect(configureBtn).toBeVisible({ timeout: 10_000 });
    await configureBtn.click();
    await authedPage.waitForTimeout(500);

    const startBtn = authedPage.locator('button:has-text("Start Interview")').first();
    await expect(startBtn).toBeVisible({ timeout: 5_000 });
  });

  authedTest('history button is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewPrep);
    await waitForPageReady(authedPage);
    const historyBtn = authedPage.locator('button:has-text("History")').first();
    await expect(historyBtn).toBeVisible({ timeout: 10_000 });
  });
});

// ──────────────────────────────────────────────
// Interview Copilot Tests
// ──────────────────────────────────────────────

authedTest.describe('Interview Copilot', () => {
  authedTest('loads interview copilot page', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);
    const heading = authedPage.locator('h1:has-text("Interview Co-Pilot")').first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
  });

  authedTest('shows description and install options', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);
    const description = authedPage.locator('text=Bring Co-Pilot into your next interview').first();
    await expect(description).toBeVisible({ timeout: 10_000 });
  });

  authedTest('install desktop and mobile buttons are present', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);
    const desktopBtn = authedPage.locator('button:has-text("Install Desktop")').first();
    await expect(desktopBtn).toBeVisible({ timeout: 10_000 });
    const mobileBtn = authedPage.locator('button:has-text("Install Mobile")').first();
    await expect(mobileBtn).toBeVisible({ timeout: 10_000 });
  });

  authedTest('session history table is displayed', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);

    const historyHeading = authedPage.locator('h2:has-text("History")').first();
    await expect(historyHeading).toBeVisible({ timeout: 10_000 });

    // Verify the table exists and has rows
    const table = authedPage.locator('table').first();
    await expect(table).toBeVisible({ timeout: 5_000 });

    const rows = authedPage.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  authedTest('search input is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);
    const searchInput = authedPage.locator('input[placeholder="Search"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
  });

  authedTest('start interview button opens setup form', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);

    const startBtn = authedPage.locator('button:has-text("Start Interview")').first();
    await expect(startBtn).toBeVisible({ timeout: 10_000 });
    await startBtn.click();
    await authedPage.waitForTimeout(500);

    // Setup overlay should appear
    const setupHeading = authedPage.locator('h1:has-text("Set up Interview Copilot")').first();
    await expect(setupHeading).toBeVisible({ timeout: 10_000 });
  });

  authedTest('setup form has job title and company inputs', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);

    const startBtn = authedPage.locator('button:has-text("Start Interview")').first();
    await expect(startBtn).toBeVisible({ timeout: 10_000 });
    await startBtn.click();
    await authedPage.waitForTimeout(500);

    // Job title input
    const jobTitleInput = authedPage.locator('input[placeholder="Enter job role"]').first();
    await expect(jobTitleInput).toBeVisible({ timeout: 5_000 });

    // Company input
    const companyInput = authedPage.locator('input[placeholder*="Microsoft"]').first();
    await expect(companyInput).toBeVisible({ timeout: 5_000 });
  });

  authedTest('setup form shows job title suggestions', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);

    const startBtn = authedPage.locator('button:has-text("Start Interview")').first();
    await startBtn.click();
    await authedPage.waitForTimeout(500);

    // Verify suggestion buttons
    for (const suggestion of ['UI/UX Designer', 'Software Engineer', 'SEO Specialist']) {
      const suggestionBtn = authedPage.locator(`button:has-text("${suggestion}")`).first();
      await expect(suggestionBtn).toBeVisible({ timeout: 5_000 });
    }
  });

  authedTest('document attachment option is available', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);

    const startBtn = authedPage.locator('button:has-text("Start Interview")').first();
    await startBtn.click();
    await authedPage.waitForTimeout(500);

    // Documents section with "Add Documents" button
    const addDocsBtn = authedPage.locator('button:has-text("Add Documents")').first();
    await expect(addDocsBtn).toBeVisible({ timeout: 5_000 });

    // Or the empty state "Add context, notes, or other docs" button
    const addContextBtn = authedPage.locator('text=Add context, notes, or other docs').first();
    await expect(addContextBtn).toBeVisible({ timeout: 5_000 });
  });

  authedTest('resume selection options are present', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);

    const startBtn = authedPage.locator('button:has-text("Start Interview")').first();
    await startBtn.click();
    await authedPage.waitForTimeout(500);

    const uploadBtn = authedPage.locator('button:has-text("Upload a new resume")').first();
    await expect(uploadBtn).toBeVisible({ timeout: 5_000 });

    const lightforthBtn = authedPage.locator('button:has-text("Use Lightforth Resume")').first();
    await expect(lightforthBtn).toBeVisible({ timeout: 5_000 });
  });

  authedTest('can enter job details and continue to live session', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);

    const startBtn = authedPage.locator('button:has-text("Start Interview")').first();
    await expect(startBtn).toBeVisible({ timeout: 10_000 });
    await startBtn.click();
    await authedPage.waitForTimeout(500);

    // Fill in job title
    const jobTitleInput = authedPage.locator('input[placeholder="Enter job role"]').first();
    await jobTitleInput.fill('Software Engineer');
    await authedPage.waitForTimeout(300);

    // Fill in company
    const companyInput = authedPage.locator('input[placeholder*="Microsoft"]').first();
    await companyInput.fill('Google');
    await authedPage.waitForTimeout(300);

    // Click Continue
    const continueBtn = authedPage.locator('button:has-text("Continue")').first();
    await expect(continueBtn).toBeVisible({ timeout: 5_000 });
    await continueBtn.click();
    await authedPage.waitForTimeout(500);

    // Preference modal should appear OR live view
    const prefModal = authedPage.locator('text=Preference').first();
    const liveView = authedPage.locator('text=Live Response').first();
    const prefVisible = await prefModal.isVisible().catch(() => false);
    const liveVisible = await liveView.isVisible().catch(() => false);
    expect(prefVisible || liveVisible).toBeTruthy();
  });

  authedTest('preference modal shows response type options', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);

    const startBtn = authedPage.locator('button:has-text("Start Interview")').first();
    await startBtn.click();
    await authedPage.waitForTimeout(500);

    // Fill job title
    const jobTitleInput = authedPage.locator('input[placeholder="Enter job role"]').first();
    await jobTitleInput.fill('Software Engineer');
    await authedPage.waitForTimeout(300);

    // Continue to preference modal
    const continueBtn = authedPage.locator('button:has-text("Continue")').first();
    await continueBtn.click();
    await authedPage.waitForTimeout(500);

    // If preference modal appeared, verify response type options
    const defaultOption = authedPage.locator('button:has-text("Default")').first();
    const headlinesOption = authedPage.locator('button:has-text("Headlines")').first();
    const coachingOption = authedPage.locator('button:has-text("Coaching")').first();

    if (await defaultOption.isVisible().catch(() => false)) {
      await expect(defaultOption).toBeVisible();
      await expect(headlinesOption).toBeVisible();
      await expect(coachingOption).toBeVisible();
    }
  });

  authedTest('session history tab rows are clickable', async ({ authedPage }) => {
    await authedPage.goto(URLS.interviewCopilot);
    await waitForPageReady(authedPage);

    // Verify history rows are clickable (they trigger report view)
    const firstRow = authedPage.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 10_000 });
    await firstRow.click();
    await authedPage.waitForTimeout(500);

    // Should navigate to report view
    const transcriptHeading = authedPage.locator('text=Interview Transcript').first();
    const insightsHeading = authedPage.locator('text=Insights').first();
    const transcriptVisible = await transcriptHeading.isVisible().catch(() => false);
    const insightsVisible = await insightsHeading.isVisible().catch(() => false);
    expect(transcriptVisible || insightsVisible).toBeTruthy();
  });
});
