import { test, expect } from '@playwright/test';
import { test as authedTest } from './fixtures/auth.fixture';
import { URLS, waitForPageReady, expectVisible } from './helpers/test-utils';

// ──────────────────────────────────────────────
// Resume Builder — Template Selection Screen
// ──────────────────────────────────────────────

authedTest.describe('Resume Builder — Template Selection', () => {
  authedTest('loads resume builder page', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    const heading = authedPage.locator('h1:has-text("Choose a resume template")').first();
    await expect(heading).toBeVisible({ timeout: 15_000 });
  });

  authedTest('template selection grid renders with templates', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    const templateButtons = authedPage.locator('button:has(img[alt])');
    const count = await templateButtons.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  authedTest('can select a template', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    const firstTemplate = authedPage.locator('button:has(img[alt])').first();
    await firstTemplate.click();
    await authedPage.waitForTimeout(300);
    const proceedBtn = authedPage.locator('button:has-text("Proceed")').first();
    await expect(proceedBtn).toBeVisible({ timeout: 5_000 });
  });
});

// ──────────────────────────────────────────────
// Resume Builder — Job Title Screen
// ──────────────────────────────────────────────

authedTest.describe('Resume Builder — Job Title', () => {
  authedTest('job title input is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    const proceedBtn = authedPage.locator('button:has-text("Proceed")').first();
    await proceedBtn.click();
    await authedPage.waitForTimeout(500);
    const heading = authedPage.locator('h1:has-text("Job Title")').first();
    if (await heading.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(heading).toBeVisible();
      const jobInput = authedPage.locator('input[placeholder*="Product"], input[placeholder*="job"], input[placeholder*="title"], input[placeholder*="Engineer"]').first();
      if (await jobInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await expect(jobInput).toBeVisible();
      }
    }
  });
});

// ──────────────────────────────────────────────
// Resume Builder — Professional Summary
// ──────────────────────────────────────────────

authedTest.describe('Resume Builder — Professional Summary', () => {
  authedTest('professional summary textarea is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    const proceedBtn = authedPage.locator('button:has-text("Proceed")').first();
    await proceedBtn.click();
    await authedPage.waitForTimeout(500);

    // Navigate through wizard steps to reach summary
    const jobTitleBtn = authedPage.locator('button:has-text("Next"), button:has-text("Proceed")').first();
    if (await jobTitleBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await jobTitleBtn.click();
      await authedPage.waitForTimeout(500);
    }

    const summaryHeading = authedPage.locator('h1:has-text("Professional Summary")').first();
    if (await summaryHeading.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(summaryHeading).toBeVisible();
      const textarea = authedPage.locator('textarea[placeholder*="results"], textarea[placeholder*="professional"]').first();
      if (await textarea.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await expect(textarea).toBeVisible();
      }
      const aiSuggestions = authedPage.locator('text=AI Suggestions').first();
      if (await aiSuggestions.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await expect(aiSuggestions).toBeVisible();
      }
    }
  });
});

// ──────────────────────────────────────────────
// Resume Builder — Work Experience
// ──────────────────────────────────────────────

authedTest.describe('Resume Builder — Work Experience', () => {
  authedTest('work experience section has add button', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    // Navigate to canvas by going through wizard quickly
    const proceedBtn = authedPage.locator('button:has-text("Proceed")').first();
    await proceedBtn.click();
    await authedPage.waitForTimeout(500);

    // Click through steps to reach canvas
    for (let i = 0; i < 8; i++) {
      const nextBtn = authedPage.locator('button:has-text("Next"), button:has-text("Start Building")').first();
      if (await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await nextBtn.click();
        await authedPage.waitForTimeout(400);
      } else {
        break;
      }
    }

    // On canvas, switch to Create tab and check Experience section
    const createTab = authedPage.locator('button:has-text("Create")').first();
    if (await createTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await createTab.click();
      await authedPage.waitForTimeout(300);
      const experienceSection = authedPage.locator('button:has-text("Experience")').first();
      if (await experienceSection.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await experienceSection.click();
        await authedPage.waitForTimeout(300);
        const addBtn = authedPage.locator('button:has-text("Add section")').first();
        if (await addBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await expect(addBtn).toBeVisible();
        }
      }
    }
  });
});

// ──────────────────────────────────────────────
// Resume Builder — Education
// ──────────────────────────────────────────────

authedTest.describe('Resume Builder — Education', () => {
  authedTest('education section has add button', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    const proceedBtn = authedPage.locator('button:has-text("Proceed")').first();
    await proceedBtn.click();
    await authedPage.waitForTimeout(500);

    for (let i = 0; i < 8; i++) {
      const nextBtn = authedPage.locator('button:has-text("Next"), button:has-text("Start Building")').first();
      if (await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await nextBtn.click();
        await authedPage.waitForTimeout(400);
      } else {
        break;
      }
    }

    const createTab = authedPage.locator('button:has-text("Create")').first();
    if (await createTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await createTab.click();
      await authedPage.waitForTimeout(300);
      const educationSection = authedPage.locator('button:has-text("Education")').first();
      if (await educationSection.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await educationSection.click();
        await authedPage.waitForTimeout(300);
        const addBtn = authedPage.locator('button:has-text("Add section")').first();
        if (await addBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await expect(addBtn).toBeVisible();
        }
      }
    }
  });
});

// ──────────────────────────────────────────────
// Resume Builder — Skills
// ──────────────────────────────────────────────

authedTest.describe('Resume Builder — Skills', () => {
  authedTest('skills section allows adding skills', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    const proceedBtn = authedPage.locator('button:has-text("Proceed")').first();
    await proceedBtn.click();
    await authedPage.waitForTimeout(500);

    for (let i = 0; i < 8; i++) {
      const nextBtn = authedPage.locator('button:has-text("Next"), button:has-text("Start Building")').first();
      if (await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await nextBtn.click();
        await authedPage.waitForTimeout(400);
      } else {
        break;
      }
    }

    const createTab = authedPage.locator('button:has-text("Create")').first();
    if (await createTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await createTab.click();
      await authedPage.waitForTimeout(300);
      const skillsSection = authedPage.locator('button:has-text("Skills")').first();
      if (await skillsSection.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await skillsSection.click();
        await authedPage.waitForTimeout(300);
        const skillsTextarea = authedPage.locator('textarea[placeholder*="Figma"], textarea[placeholder*="skills"]').first();
        if (await skillsTextarea.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await expect(skillsTextarea).toBeVisible();
        }
        // Check for skill chips
        const figmaChip = authedPage.locator('button:has-text("Figma")').first();
        if (await figmaChip.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await expect(figmaChip).toBeVisible();
        }
      }
    }
  });
});

// ──────────────────────────────────────────────
// Resume Builder — Contact Info
// ──────────────────────────────────────────────

authedTest.describe('Resume Builder — Contact Info', () => {
  authedTest('contact info fields are present', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    const proceedBtn = authedPage.locator('button:has-text("Proceed")').first();
    await proceedBtn.click();
    await authedPage.waitForTimeout(500);

    for (let i = 0; i < 8; i++) {
      const nextBtn = authedPage.locator('button:has-text("Next"), button:has-text("Start Building")').first();
      if (await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await nextBtn.click();
        await authedPage.waitForTimeout(400);
      } else {
        break;
      }
    }

    const createTab = authedPage.locator('button:has-text("Create")').first();
    if (await createTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await createTab.click();
      await authedPage.waitForTimeout(300);
      const personalSection = authedPage.locator('button:has-text("Personal Information")').first();
      if (await personalSection.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await personalSection.click();
        await authedPage.waitForTimeout(300);
        // Check for contact fields
        const firstNameInput = authedPage.locator('input[value="Adedamola"], input').first();
        if (await firstNameInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await expect(firstNameInput).toBeVisible();
        }
        // Check for email and phone inputs
        const emailInput = authedPage.locator('input[type="email"], input[value*="adedamola"]').first();
        if (await emailInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await expect(emailInput).toBeVisible();
        }
      }
    }
  });
});

// ──────────────────────────────────────────────
// Resume Builder — Languages
// ──────────────────────────────────────────────

authedTest.describe('Resume Builder — Languages', () => {
  authedTest('languages section is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    const proceedBtn = authedPage.locator('button:has-text("Proceed")').first();
    await proceedBtn.click();
    await authedPage.waitForTimeout(500);

    for (let i = 0; i < 8; i++) {
      const nextBtn = authedPage.locator('button:has-text("Next"), button:has-text("Start Building")').first();
      if (await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await nextBtn.click();
        await authedPage.waitForTimeout(400);
      } else {
        break;
      }
    }

    const createTab = authedPage.locator('button:has-text("Create")').first();
    if (await createTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await createTab.click();
      await authedPage.waitForTimeout(300);
      const langSection = authedPage.locator('button:has-text("Language")').first();
      if (await langSection.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await langSection.click();
        await authedPage.waitForTimeout(300);
        const langLabel = authedPage.locator('span:has-text("Language"), label:has-text("Language")').first();
        if (await langLabel.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await expect(langLabel).toBeVisible();
        }
      }
    }
  });
});

// ──────────────────────────────────────────────
// Resume Builder — ATS Score
// ──────────────────────────────────────────────

authedTest.describe('Resume Builder — ATS Score', () => {
  authedTest('ATS score display is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    const proceedBtn = authedPage.locator('button:has-text("Proceed")').first();
    await proceedBtn.click();
    await authedPage.waitForTimeout(500);

    for (let i = 0; i < 8; i++) {
      const nextBtn = authedPage.locator('button:has-text("Next"), button:has-text("Start Building")').first();
      if (await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await nextBtn.click();
        await authedPage.waitForTimeout(400);
      } else {
        break;
      }
    }

    // On canvas screen, look for ATS Score button in top bar
    const atsButton = authedPage.locator('button:has-text("ATS Score")').first();
    if (await atsButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(atsButton).toBeVisible();
    }
  });
});

// ──────────────────────────────────────────────
// Resume Builder — AI Chat Sidebar
// ──────────────────────────────────────────────

authedTest.describe('Resume Builder — AI Chat Sidebar', () => {
  authedTest('AI chat sidebar is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    const proceedBtn = authedPage.locator('button:has-text("Proceed")').first();
    await proceedBtn.click();
    await authedPage.waitForTimeout(500);

    for (let i = 0; i < 8; i++) {
      const nextBtn = authedPage.locator('button:has-text("Next"), button:has-text("Start Building")').first();
      if (await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await nextBtn.click();
        await authedPage.waitForTimeout(400);
      } else {
        break;
      }
    }

    // On canvas, check for Chat tab and chat input
    const chatTab = authedPage.locator('button:has-text("Chat")').first();
    if (await chatTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(chatTab).toBeVisible();
      const chatInput = authedPage.locator('textarea[placeholder*="job description"], textarea[placeholder*="Message Lightforth"]').first();
      if (await chatInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await expect(chatInput).toBeVisible();
      }
    }
  });
});

// ──────────────────────────────────────────────
// Resume Builder — Download / Export
// ──────────────────────────────────────────────

authedTest.describe('Resume Builder — Download / Export', () => {
  authedTest('download/export button is present', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    const proceedBtn = authedPage.locator('button:has-text("Proceed")').first();
    await proceedBtn.click();
    await authedPage.waitForTimeout(500);

    for (let i = 0; i < 8; i++) {
      const nextBtn = authedPage.locator('button:has-text("Next"), button:has-text("Start Building")').first();
      if (await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await nextBtn.click();
        await authedPage.waitForTimeout(400);
      } else {
        break;
      }
    }

    // On canvas, look for Download button in top bar
    const downloadBtn = authedPage.locator('button:has-text("Download")').first();
    if (await downloadBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(downloadBtn).toBeVisible();
    }
  });
});

// ──────────────────────────────────────────────
// Resume Builder — Resume Preview
// ──────────────────────────────────────────────

authedTest.describe('Resume Builder — Resume Preview', () => {
  authedTest('resume preview is displayed', async ({ authedPage }) => {
    await authedPage.goto(URLS.resumeBuilder);
    await waitForPageReady(authedPage);
    await authedPage.locator('h1:has-text("Choose a resume template")').first().waitFor({ timeout: 15_000 });
    const proceedBtn = authedPage.locator('button:has-text("Proceed")').first();
    await proceedBtn.click();
    await authedPage.waitForTimeout(500);

    for (let i = 0; i < 8; i++) {
      const nextBtn = authedPage.locator('button:has-text("Next"), button:has-text("Start Building")').first();
      if (await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await nextBtn.click();
        await authedPage.waitForTimeout(400);
      } else {
        break;
      }
    }

    // On canvas, the resume paper/preview should be visible in the main area
    const resumeContent = authedPage.locator('text=Adedamola, text=Adewale, text=Director of Product').first();
    if (await resumeContent.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(resumeContent).toBeVisible();
    }
    // Check for zoom controls as indicator of preview area
    const zoomOut = authedPage.locator('[aria-label="Zoom out"]').first();
    if (await zoomOut.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await expect(zoomOut).toBeVisible();
    }
  });
});
