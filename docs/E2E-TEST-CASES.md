# Lightforth User Web App — E2E Test Cases

> **Framework:** Playwright (TypeScript)  
> **Target:** `http://localhost:5173` (Vite dev server)  
> **Auth:** Demo user auto-logs in via `AuthProvider`  
> **Run:** `npx playwright test` or `npm run test:e2e`

---

## Table of Contents

1. [Dashboard & Navigation](#1-dashboard--navigation)
2. [Resume Builder](#2-resume-builder)
3. [My Documents](#3-my-documents)
4. [Auto-Apply](#4-auto-apply)
5. [Interview Prep & Copilot](#5-interview-prep--copilot)
6. [Billing & Usage](#6-billing--usage)
7. [Settings](#7-settings)
8. [Onboarding](#8-onboarding)

**Total: 122 test cases**

---

## 1. Dashboard & Navigation

**File:** `e2e/dashboard.spec.ts`

### Dashboard (6 tests)

| # | Test | What it verifies |
|---|------|------------------|
| 1 | `renders welcome greeting with user name` | Welcome message visible on `/app` |
| 2 | `shows resume upload section` | Resume upload prompt is present |
| 3 | `shows "Use last" resume button` | Quick resume reuse button exists |
| 4 | `action cards appear after selecting a resume` | After clicking "Use last", Tailor Resume card shows |
| 5 | `action cards are clickable and navigate` | Clicking Tailor Resume navigates to resume builder |
| 6 | `how-it-works section is present and toggleable` | "How it works" expands to show steps |
| 7 | `help links section exists` | Help Desk, Tutorial, Support links visible |

### Sidebar Navigation (10 tests)

| # | Test | What it verifies |
|---|------|------------------|
| 8 | `renders sidebar with all navigation items` | Dashboard, My Documents, Auto-Apply, Interview Prep, Co-Pilot, Explore, Downloads, Billing, Settings all present |
| 9 | `sidebar navigation to Dashboard` | Click Dashboard → lands on `/app` |
| 10 | `sidebar navigation to Documents` | Click My Documents → lands on `/documents` |
| 11 | `sidebar navigation to Auto-Apply` | Click Auto-Apply → lands on auto-apply page |
| 12 | `sidebar navigation to Interview` | Click Interview Prep → lands on interview page |
| 13 | `sidebar navigation to Billing` | Click Billing → lands on `/billing` |
| 14 | `sidebar navigation to Settings` | Click Settings → lands on `/settings` |
| 15 | `sidebar navigation to Explore` | Click Explore → lands on `/explore` |
| 16 | `sidebar shows "How to use" link` | How to use link visible |
| 17 | `UpgradeCard is visible for non-Premium users` | "Upgrade to Premium" card shown |

### Top Navigation (8 tests)

| # | Test | What it verifies |
|---|------|------------------|
| 18 | `top nav shows user avatar/menu` | Account menu button visible |
| 19 | `top nav shows credit counter` | Credit counter button visible |
| 20 | `top nav shows notification bell` | Notification bell visible |
| 21 | `user menu dropdown opens on click` | Click avatar → Logout button appears |
| 22 | `user menu shows Account and Security links` | Account/Security in dropdown |
| 23 | `notification dropdown opens on bell click` | Bell click → Notifications header visible |
| 24 | `notification panel has "Mark all read" button` | Mark all read option present |
| 25 | `credit counter dropdown shows remaining credits` | "Remaining Credits" visible |
| 26 | `credit counter dropdown shows Upgrade button` | Upgrade button in credit dropdown |

### Logout (1 test)

| # | Test | What it verifies |
|---|------|------------------|
| 27 | `logout from user menu navigates to auth` | Click Logout → redirected to `/auth` or `/` |

### Mobile Sidebar (3 tests)

| # | Test | What it verifies |
|---|------|------------------|
| 28 | `mobile menu toggle opens sidebar` | 375px viewport → hamburger opens sidebar |
| 29 | `mobile sidebar has close button` | Close button visible in mobile sidebar |
| 30 | `mobile sidebar close overlay works` | Click overlay closes sidebar |

### CreditBanner (1 test)

| # | Test | What it verifies |
|---|------|------------------|
| 31 | `CreditBanner is visible when credits are zero` | "0 credits remaining" banner + Upgrade link |

---

## 2. Resume Builder

**File:** `e2e/resume-builder.spec.ts`

### Template Selection (3 tests)

| # | Test | What it verifies |
|---|------|------------------|
| 1 | `loads resume builder page` | "Choose a resume template" heading visible |
| 2 | `template selection grid renders with templates` | 8+ template buttons with images |
| 3 | `can select a template` | Click template → Proceed button appears |

### Wizard Steps (5 tests)

| # | Test | What it verifies |
|---|------|------------------|
| 4 | `job title input is present` | Job Title heading + input field after proceeding |
| 5 | `professional summary textarea is present` | Summary textarea + AI Suggestions visible |
| 6 | `work experience section has add button` | "Add section" button in Experience on canvas |
| 7 | `education section has add button` | "Add section" button in Education on canvas |
| 8 | `skills section allows adding skills` | Skills textarea + skill chips (e.g., Figma) visible |

### Canvas Features (6 tests)

| # | Test | What it verifies |
|---|------|------------------|
| 9 | `contact info fields are present` | First Name, Email inputs in Personal Information |
| 10 | `languages section is present` | Language label visible in Languages section |
| 11 | `ATS score display is present` | "ATS Score" button in canvas top bar |
| 12 | `AI chat sidebar is present` | Chat tab + chat input visible |
| 13 | `download/export button is present` | "Download" button in canvas top bar |
| 14 | `resume preview is displayed` | Resume content (name, title) + zoom controls visible |

---

## 3. My Documents

**File:** `e2e/my-documents.spec.ts`

| # | Test | What it verifies |
|---|------|------------------|
| 1 | `loads documents page` | "Resumes" heading visible |
| 2 | `shows grid/list view toggle` | Grid and list view buttons present |
| 3 | `can toggle between grid and list view` | Grid → articles; List → table; back to grid |
| 4 | `search input is present` | Search input with placeholder visible |
| 5 | `can search documents` | Type "Darnell" → filtered results; clear → all 4 resumes back |
| 6 | `shows created by you / created by AI tabs` | Both tab buttons visible |
| 7 | `can switch between tabs` | Click AI tab → switch back → History section still visible |
| 8 | `create new resume button is present` | "Create from scratch" text visible |
| 9 | `upload resume option is present` | "Create from a resume" text visible |
| 10 | `resume cards show ATS score badges` | List view shows ATS Score column + score badges |

---

## 4. Auto-Apply

**File:** `e2e/auto-apply.spec.ts`

| # | Test | What it verifies |
|---|------|------------------|
| 1 | `loads auto-apply page` | "Auto-Apply" heading visible |
| 2 | `shows 4-step setup wizard or paywall` | Setup tab → 4 step labels: Resume, Contact, Preferences, Additional |
| 3 | `resume upload step is present` | Resume heading + "Upload new" button |
| 4 | `contact information form has expected fields` | Email, Phone, First Name, Last Name, LinkedIn URL labels |
| 5 | `job preferences section is present` | Job Preferences heading, Employment Type, Location Type, Full-Time/Part-Time/Contract pills |
| 6 | `job listing dashboard shows jobs` | Search input present, page has content |
| 7 | `applied tab shows application history` | Applied tab → 5+ items with "Applied" status badges |
| 8 | `agent tab shows Scout/Filter/Tailor/Driver pipeline` | All 4 agent names visible on Agent tab |
| 9 | `paywall shows for non-Pro users` | After step 3 → paywall with "Get Pro" / "Get Premium" OR step 4 |

---

## 5. Interview Prep & Copilot

**File:** `e2e/interview.spec.ts`

### Interview Prep (9 tests)

| # | Test | What it verifies |
|---|------|------------------|
| 1 | `loads interview prep page` | "Interview Prep" heading visible |
| 2 | `shows practice room header and description` | "Practice room" label + description text |
| 3 | `role/position filter buttons are present` | All, Recruiter Screen, Hiring Manager, Technical, Culture Fit, Final Round buttons |
| 4 | `create scenario button and card are present` | "Create Scenario" button + "Create Your Own" card |
| 5 | `scenario cards have configure and start buttons` | "Configure & Start" button visible |
| 6 | `can start a practice interview via configure` | Click Configure → "Configure your interview" heading |
| 7 | `configure view shows interview setup fields` | Interview type, Difficulty, Target role, Company fields |
| 8 | `configure view shows start interview button` | "Start Interview" button visible |
| 9 | `history button is present` | "History" button visible |

### Interview Copilot (13 tests)

| # | Test | What it verifies |
|---|------|------------------|
| 10 | `loads interview copilot page` | "Interview Co-Pilot" heading visible |
| 11 | `shows description and install options` | Description text visible |
| 12 | `install desktop and mobile buttons are present` | "Install Desktop" + "Install Mobile" buttons |
| 13 | `session history table is displayed` | History heading + table with 5+ rows |
| 14 | `search input is present` | Search input visible |
| 15 | `start interview button opens setup form` | Click "Start Interview" → "Set up Interview Copilot" heading |
| 16 | `setup form has job title and company inputs` | Job role input + company input visible |
| 17 | `setup form shows job title suggestions` | UI/UX Designer, Software Engineer, SEO Specialist suggestion buttons |
| 18 | `document attachment option is available` | "Add Documents" button + "Add context, notes, or other docs" |
| 19 | `resume selection options are present` | "Upload a new resume" + "Use Lightforth Resume" buttons |
| 20 | `can enter job details and continue to live session` | Fill role/company → Continue → Preference modal or Live Response |
| 21 | `preference modal shows response type options` | Default, Headlines, Coaching buttons (if modal appears) |
| 22 | `session history tab rows are clickable` | Click row → Interview Transcript or Insights visible |

---

## 6. Billing & Usage

**File:** `e2e/billing.spec.ts`

### Billing Page (5 tests)

| # | Test | What it verifies |
|---|------|------------------|
| 1 | `loads billing page` | "Billing" heading visible |
| 2 | `shows 3 plan tiers (Starter, Pro, Premium)` | STARTER, PRO, PREMIUM headings visible |
| 3 | `plan prices are displayed` | ₦5,000, ₦20,000, ₦50,000 visible |
| 4 | `annual/monthly toggle is visible` | "Annual" text + "save 20%" visible |
| 5 | `credit usage summary is shown` | "Credits" heading + "Left" text |
| 6 | `manage plan button is present` | "Manage Plan" button visible |

### Usage Details (8 tests)

| # | Test | What it verifies |
|---|------|------------------|
| 7 | `navigates to usage details page` | "Usage" heading visible at `/billing/usage` |
| 8 | `usage page shows credit transaction history` | "Credit History" heading + transactions |
| 9 | `usage page has date range filter` | Select with "Last 7 days", "Last 30 days", "Last 90 days" |
| 10 | `usage page has feature filter` | Select with "All features", "Resume Builder", "Interview Prep" |
| 11 | `usage page shows credit bar chart` | Chart container visible |
| 12 | `changing date range filter updates displayed data` | Select 7 days → credits text updates |
| 13 | `changing feature filter updates displayed data` | Select resume-builder → credits text updates |
| 14 | `usage details page has back to billing link` | "Back to Billing" link visible |

---

## 7. Settings

**File:** `e2e/settings.spec.ts`

| # | Test | What it verifies |
|---|------|------------------|
| 1 | `loads settings page` | "Settings" heading visible |
| 2 | `has Profile, Security, and Referral tabs` | All 3 tab links visible |
| 3 | `Profile tab shows name, email, phone fields` | First Name, Last Name, Email, Phone Number labels |
| 4 | `Profile tab shows country and city fields` | Country, City labels |
| 5 | `photo upload is available` | "Upload Photo" button visible |
| 6 | `Security tab shows password change form` | Current Password, New Password, Confirm New Password |
| 7 | `Security tab shows 2FA toggle` | "Two-step verification" visible |
| 8 | `Security tab shows delete account option` | "Delete Account" heading visible |
| 9 | `Referral tab shows referral link and code` | "Referral Link" + "Referral Code" labels |
| 10 | `Referral tab shows referral history table` | "Previous Referrals" heading + table with Name/Email/Status columns |
| 11 | `Save button is present on profile tab` | "Update" button visible |

---

## 8. Onboarding

**File:** `e2e/onboarding.spec.ts`

| # | Test | What it verifies |
|---|------|------------------|
| 1 | `loads onboarding page` | Heading visible |
| 2 | `step 1 shows target role selection` | "Job Function" label + role search input |
| 3 | `step 1 has job categories` | Software / AI, Product, Design, Marketing, Sales buttons |
| 4 | `step 1 has employment type selector` | "Employment Type" label + Full-Time, Part-Time, Contract, Temporary |
| 5 | `step 1 has experience level selector` | "Experience Level" label + Entry, Mid, Senior, Lead, Executive |
| 6 | `can proceed to step 2` | Select category → role → Continue → "Preferred Location" visible |
| 7 | `step 2 shows location preferences` | Preferred Location, Job Location Type, Relocation, H1B sponsorship |
| 8 | `step 3 shows resume upload` | "Drag & drop your resume here" + "PDF or Word" + "Skip for now" |
| 9 | `progress indicator shows current step` | "Step 1 of 3" + step dots |
| 10 | `progress indicator updates on step 2` | "Step 2 of 3" visible |
| 11 | `can go back from step 2 to step 1` | Click Back → "Job Function" + "Step 1 of 3" |

---

## Running the Tests

```bash
# Install dependencies (one time)
npm install -D @playwright/test
npx playwright install chromium

# Run all tests
npx playwright test

# Run specific file
npx playwright test e2e/dashboard.spec.ts

# Run with UI
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Run specific test by name
npx playwright test -g "renders welcome greeting"
```

## Test Infrastructure

- **`playwright.config.ts`** — Vite dev server at localhost:5173, Chromium, headless
- **`e2e/fixtures/auth.fixture.ts`** — `authedPage` fixture that auto-navigates to `/app` and waits for dashboard
- **`e2e/helpers/test-utils.ts`** — URL constants, `waitForPageReady`, `expectVisible`, `clickNavItem`, `expectUrl`
