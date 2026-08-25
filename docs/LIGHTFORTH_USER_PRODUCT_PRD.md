# Lightforth User Product PRD

**Version:** 2026-07-11  
**Status:** Current reference draft  
**Audience:** Product, design, engineering, QA, marketing, sales, support, leadership  
**Scope:** The customer-facing Lightforth experience across web, mobile preview, desktop copilot preview, onboarding, career workspace, subscriptions, and help.

## 1. Executive Summary

Lightforth is an AI career platform that helps job seekers move from "I need a better job" to "I am applying, interviewing, and improving every week." The product combines resume creation, ATS optimization, job-search automation, interview practice, live interview assistance, application tracking, billing, and guided help in one career workspace.

The product promise is simple: Lightforth helps users get more relevant job opportunities, produce stronger application materials, prepare better for interviews, and reduce the manual work of job searching.

## 2. Product Vision

Lightforth should become the operating system for a modern job search. A user should be able to:

- Build a credible career profile once.
- Turn that profile into strong resumes and application materials.
- Discover and apply to relevant jobs with minimal repetitive work.
- Practice interviews and improve their answers.
- Get real-time support during high-pressure interviews.
- Track usage, billing, credits, and next steps without confusion.

## 3. Target Users

| User | Description | Primary Need |
|---|---|---|
| Active job seeker | Candidate applying to multiple jobs per week | More applications with less manual effort |
| Career switcher | Candidate repositioning their background for a new role | Stronger resume framing and interview practice |
| Interview candidate | User preparing for scheduled interviews | Realistic practice and answer coaching |
| Live interview user | Candidate who wants guidance during an actual interview | Fast, structured prompts during pressure moments |
| Mobile-first job seeker | User managing the job search from a phone | Lightweight tracking, alerts, and copilot access |
| Paying subscriber | User evaluating plan value and credits | Clear access, usage, billing, and upgrade paths |

## 4. Business Goals

- Increase paid conversion from marketing pages and product previews.
- Improve onboarding completion and first-value activation.
- Drive recurring use of resume builder, auto-apply, interview prep, and copilot.
- Reduce support friction by making billing, credits, and product access clear.
- Create a product story that marketing and sales can explain without technical context.

## 5. Product Surfaces

Lightforth includes the following customer-facing surfaces:

- **Marketing Website:** Homepage, product pages, pricing, checkout, and legal pages.
- **Account and Onboarding:** Signup, login, password recovery, role preferences, location, resume upload, and profile setup.
- **Career Dashboard:** A command center for next steps, activity, credits, and product shortcuts.
- **Documents:** Resume history, AI-generated documents, and reusable user context.
- **Resume Builder:** Resume creation, editing, ATS scoring, AI suggestions, tailoring, and export.
- **Job Profile:** Career preferences, target roles, location, salary, and work preferences.
- **Auto-Apply:** Job matching, tailored application preparation, submission tracking, and blocker handling.
- **Interview Prep:** Practice sessions, guided prompts, feedback, and preparation history.
- **Interview Copilot:** Live interview setup, transcript, answer guidance, session history, and post-session insights.
- **Explore:** Discovery surface for Lightforth workflows and examples.
- **Downloads:** Access point for companion downloads and related assets.
- **Billing and Usage:** Plan management, credits, subscription state, and usage detail.
- **Settings:** Profile, security, and referrals.
- **How-To:** Guided education for core workflows.
- **Desktop Copilot Preview:** Product preview for desktop live-assistance experiences.
- **Mobile App Preview:** Product preview for mobile job search, applications, copilot, notifications, and profile.

## 6. Global Requirements

### 6.1 Account Access

**Overview:** Users must be able to create an account, sign in, recover access, and enter the right product experience.

**User Story:** As a job seeker, I want account access to be quick and predictable so that I can continue my job search without losing momentum.

**Acceptance Criteria:**

- Given a new visitor chooses to create an account, when they complete signup, then they can proceed into onboarding or the product workspace.
- Given a returning user signs in successfully, then they land in a relevant workspace rather than a dead end.
- Given a user forgets their password, when they request recovery, then they receive a clear confirmation and next step.
- Given a user tries to access a protected product area while signed out, then they are asked to sign in before continuing.
- Given a user does not have access to a paid feature, then the product explains what plan or upgrade is required.

### 6.2 Navigation and Information Architecture

**Overview:** Users need a clear way to move across their job-search workspace.

**User Story:** As a returning user, I want predictable navigation so that I can move between resumes, applications, interview tools, billing, and settings.

**Acceptance Criteria:**

- Given a signed-in user enters the workspace, then primary product areas are visible in navigation.
- Given the user is inside a product area, then the current area is visually clear.
- Given the user is on a smaller screen, then navigation remains usable and dismissible.
- Given a paid feature is locked, then the locked state and upgrade path are explicit.

### 6.3 Credits, Plans, and Entitlements

**Overview:** Lightforth uses plan access and credits to meter premium actions.

**User Story:** As a paying user, I want to understand what I can use and how credits are spent so that I can manage my subscription confidently.

**Acceptance Criteria:**

- Given a user compares plans, then plan differences and credit usage are understandable.
- Given a user starts a premium action, then the product should make the cost or access requirement clear.
- Given a user has low credits, then the product surfaces an upgrade, top-up, or plan-management path.
- Given a user reviews usage, then credit consumption is broken down by product activity where available.

## 7. Marketing Website PRD

### 7.1 Homepage

**Overview:** The homepage introduces Lightforth, communicates the core career automation value, and directs visitors into product pages, pricing, signup, or checkout.

**User Story:** As a first-time visitor, I want to understand what Lightforth does and why it matters so that I can decide whether to start.

**Acceptance Criteria:**

- Given a visitor lands on the homepage, then the product value is clear within the first screen.
- Given a visitor scans the page, then they can understand the main product modules and outcomes.
- Given a visitor wants proof, then the page presents credibility signals such as examples, workflow previews, or outcome-oriented claims.
- Given a visitor is ready to act, then there is a clear path to start, compare pricing, or explore a specific product.

### 7.2 Product Marketing Pages

**Overview:** Product pages explain specific solutions such as ATS checking, resume building, auto-apply, interview prep, and copilot.

**User Story:** As a visitor interested in one problem, I want a focused product page so that I can evaluate that solution quickly.

**Acceptance Criteria:**

- Given a visitor opens a product page, then the page explains the target problem and user outcome.
- Given a product has paid capabilities, then the page reflects current plan positioning.
- Given the visitor reaches the decision point, then there is a clear next action.
- Given marketing, sales, or support references the page, then the claims should align with the product's actual capabilities.

### 7.3 Pricing and Checkout

**Overview:** Pricing helps buyers compare plans and proceed to purchase without confusion.

**User Story:** As a buyer, I want to choose the right plan and complete checkout so that I can unlock the features I need.

**Acceptance Criteria:**

- Given a visitor reviews pricing, then plans, credits, and major feature differences are easy to compare.
- Given a visitor selects a plan, then checkout retains that plan choice.
- Given checkout begins, then the buyer can understand what they are purchasing.
- Given checkout completes, then the user receives a clear next step into onboarding or the product workspace.

### 7.4 Legal and Policy Pages

**Overview:** Legal pages communicate privacy, terms, and refund policies.

**User Story:** As a visitor or subscriber, I want accessible policies so that I understand the terms of using Lightforth.

**Acceptance Criteria:**

- Given a user needs policy information, then privacy, terms, and refund content are available from relevant product surfaces.
- Given policy content changes, then marketing, checkout, and support references remain consistent.

## 8. Onboarding PRD

**Overview:** Onboarding collects the minimum information needed to personalize the job search: target roles, location, work preferences, experience level, resume, and missing profile details.

**User Story:** As a new user, I want to set up my career profile once so that Lightforth can personalize resumes, jobs, applications, and interview prep.

**Acceptance Criteria:**

- Given onboarding starts, then the user can provide target roles.
- Given the user continues, then they can provide location and work preferences such as remote, onsite, or hybrid.
- Given the user uploads a resume, then common resume formats are accepted and unsupported files are rejected with a clear reason.
- Given resume information is extracted, then the user can review and correct it.
- Given required information is missing, then onboarding prompts for it before completion.
- Given onboarding is complete, then the user reaches a useful product workspace with clear next steps.

## 9. Dashboard PRD

**Overview:** The dashboard is the user's job-search command center. It should summarize activity, credits, applications, and next recommended actions.

**User Story:** As a returning user, I want to know what happened and what to do next so that I can keep momentum in my job search.

**Acceptance Criteria:**

- Given the dashboard loads, then the user sees key career activity, credit state, and product shortcuts.
- Given there are pending actions, then they are surfaced clearly.
- Given the user chooses a shortcut, then they are taken to the relevant workflow.
- Given there is no activity yet, then the dashboard provides a helpful empty state and recommended first action.

## 10. Documents PRD

### 10.1 Resumes

**Overview:** The resumes area stores uploaded resumes, AI-generated resumes, and document history.

**User Story:** As a job seeker, I want all my resumes in one place so that I can manage and reuse them.

**Acceptance Criteria:**

- Given the user opens their documents, then current resumes and resume history are visible.
- Given the user has personal uploads and AI-generated resumes, then they can distinguish between them.
- Given the user wants a new resume, then there is a clear path to create or upload one.
- Given a resume appears in the list, then name, date, status, and available actions are clear.

### 10.2 Career Context

**Overview:** Career context stores reusable background information that AI workflows can use to produce more accurate outputs.

**User Story:** As a user, I want Lightforth to remember my background and preferences so that AI-generated outputs feel specific to me.

**Acceptance Criteria:**

- Given the user reviews career context, then saved context items are visible.
- Given the user adds or updates context, then downstream AI workflows can reference the latest information.
- Given context is empty, then the product explains what to add and why it matters.

## 11. Resume Builder PRD

**Overview:** Resume Builder helps users create, edit, score, tailor, and export resumes.

**User Story:** As a job seeker, I want to build and optimize a resume for a target role so that I improve my screening and interview chances.

**Acceptance Criteria:**

- Given the builder opens, then the user can edit resume content and see the resume structure.
- Given the user edits a section, then the resume preview updates clearly.
- Given the user provides a job description, then ATS analysis can score relevance and identify improvements.
- Given AI suggestions are generated, then the user can apply selected fixes or apply all suitable fixes.
- Given the user exports a resume, then the final resume is available in the selected format.
- Given no job description is present, then the builder still supports general resume creation.

## 12. Job Profile PRD

**Overview:** Job Profile stores the user's target roles, experience level, location, salary expectations, and work preferences.

**User Story:** As a user, I want my job preferences to stay up to date so that Lightforth targets the right opportunities.

**Acceptance Criteria:**

- Given the user opens Job Profile, then current preferences are visible.
- Given the user edits preferences, then changes are saved and reflected in matching workflows.
- Given required profile fields are incomplete, then they are clearly marked.
- Given the user updates role, location, or salary preferences, then future job matching uses the updated preferences.

## 13. Auto-Apply PRD

**Overview:** Auto-Apply finds relevant jobs, prepares application material, submits applications where possible, and tracks status.

**User Story:** As a job seeker, I want Lightforth to apply to relevant jobs for me so that I spend less time on repetitive applications.

**Acceptance Criteria:**

- Given the user opens Auto-Apply, then job opportunities, automation status, and application activity are visible.
- Given the user starts an auto-apply workflow, then the product uses job profile and resume context to target suitable jobs.
- Given a job is selected for application, then Lightforth can tailor a resume or cover letter before submission.
- Given an application is submitted, then it appears in application history with status.
- Given an application fails or needs manual intervention, then the blocker and next step are visible.
- Given required user information is missing, then Auto-Apply requests the missing fields before attempting submission.

## 14. Interview Prep PRD

**Overview:** Interview Prep provides a structured practice studio with prompts, mock sessions, answer guidance, feedback, and preparation history.

**User Story:** As a candidate preparing for interviews, I want realistic practice and feedback so that I can improve before the real interview.

**Acceptance Criteria:**

- Given the user opens Interview Prep, then a clear practice workspace is available.
- Given the user selects a practice path, then relevant prompts and preparation material appear.
- Given the user completes a practice response, then feedback or improvement guidance is available.
- Given the user has recent sessions or saved preparation, then they can resume easily.
- Given the user is on a smaller screen, then the practice experience remains usable.

## 15. Interview Copilot PRD

**Overview:** Interview Copilot supports live interview sessions with setup, transcript, answer guidance, preferences, history, and post-session insights.

**User Story:** As a candidate in a live interview, I want real-time assistance and post-session review so that I can answer confidently and improve after the call.

**Acceptance Criteria:**

- Given the user opens Interview Copilot, then setup and prior session history are available where applicable.
- Given the user starts setup, then they can provide role, job context, and preferred answer style.
- Given a session is live, then transcript and AI guidance are displayed.
- Given the user changes response style, then guidance can shift between full answers, structured headlines, and coaching.
- Given the user ends the session, then a completion view summarizes transcript and insights.
- Given historical sessions exist, then the user can review them.

## 16. Explore PRD

**Overview:** Explore helps users discover Lightforth workflows, examples, and adjacent services.

**User Story:** As a user, I want to discover useful tools inside Lightforth so that I get more value from my subscription.

**Acceptance Criteria:**

- Given the user opens Explore, then major product workflows are visible.
- Given the user selects a workflow, then they are guided to the relevant product area.
- Given examples are shown, then they support resume improvement, applications, or interview preparation.

## 17. Downloads PRD

**Overview:** Downloads provides access to companion apps, exported assets, and downloadable resources.

**User Story:** As a user, I want one place to find Lightforth downloads so that I can install or retrieve what I need.

**Acceptance Criteria:**

- Given the user opens Downloads, then available download options are visible.
- Given a download is not available yet, then the product explains the state honestly.
- Given the user selects a download, then they receive confirmation or a clear next step.

## 18. Billing and Usage PRD

**Overview:** Billing and Usage helps users manage plans, subscriptions, credits, and consumption history.

**User Story:** As a subscriber, I want to understand my plan and usage so that I can manage what I pay for.

**Acceptance Criteria:**

- Given the user opens Billing, then plan, subscription, and credit details are visible.
- Given the user reviews usage, then product activity and credit consumption are visible where available.
- Given the user wants to upgrade, downgrade, or manage billing, then the action path is clear.
- Given a billing issue exists, then the product should show status and next step rather than hiding it.

## 19. Settings PRD

**Overview:** Settings supports profile, security, and referrals.

**User Story:** As a user, I want to manage account details and referrals so that my account remains accurate and secure.

**Acceptance Criteria:**

- Given the user opens Settings, then profile information is visible first.
- Given the user switches sections, then profile, security, and referral areas are accessible.
- Given profile fields are editable or locked, then that state is visually clear.
- Given security settings are shown, then password, two-step verification, and account deletion options are visible.
- Given referrals are shown, then referral code and referral history are visible.

## 20. How-To PRD

**Overview:** How-To gives users guided education for common Lightforth workflows.

**User Story:** As a user who needs help, I want guided tutorials so that I can learn without contacting support.

**Acceptance Criteria:**

- Given the user opens How-To, then help topics for core workflows are visible.
- Given the user selects a tutorial, then relevant guide content or media appears.
- Given help content is not available, then the product provides a clear label and next step rather than a broken state.

## 21. Desktop Copilot Preview PRD

**Overview:** Desktop Copilot Preview demonstrates the desktop live-assistance product for interviews, coding, meetings, and related real-time support.

**User Story:** As a prospective copilot user, I want to preview the desktop experience so that I understand how live assistance works before buying or installing.

**Acceptance Criteria:**

- Given a visitor opens the desktop preview, then a realistic desktop-style copilot experience is shown.
- Given the visitor progresses through setup, then permissions, preferences, and use-case configuration are understandable.
- Given a use case is selected, then the preview reflects that scenario.
- Given a live session is simulated, then transcript, prompt, or answer guidance appears.
- Given the simulated session ends, then a completion state appears.

## 22. Mobile App Preview PRD

**Overview:** Mobile App Preview demonstrates the mobile companion experience, including onboarding, job feeds, applications, copilot, notifications, activities, wallet, and profile.

**User Story:** As a mobile-first user, I want to preview the mobile experience so that I understand how Lightforth supports my job search on the go.

**Acceptance Criteria:**

- Given a visitor opens the mobile preview, then a phone-style product experience is visible.
- Given the visitor navigates the preview, then onboarding, resume upload, job preferences, job feeds, application tracker, copilot, notifications, activities, and profile are represented.
- Given application tracker is shown, then statuses such as applied, pending, failed, and retrying are distinguishable.
- Given profile or wallet content appears, then credit and career data are understandable.

## 23. Non-Functional Requirements

- **Clarity:** Product language should be understandable to users, marketing, sales, and support.
- **Performance:** Core workflows should feel responsive and avoid long unexplained waits.
- **Responsive Design:** Key surfaces should remain usable on desktop and mobile-sized screens.
- **Accessibility:** Buttons, forms, navigation, tabs, and modals should be usable with keyboard and assistive technology.
- **Data Sensitivity:** Resume data, job history, interview transcripts, billing details, and personal profile information must be handled as sensitive data.
- **Reliability:** Loading, empty, restricted, and error states must be intentional and useful.
- **Consistency:** Navigation, typography, tone, and visual hierarchy should feel like one product.

## 24. Success Metrics

- Visitor-to-signup conversion by product page.
- Checkout conversion by plan.
- Onboarding completion rate.
- Percentage of new users who upload or create a resume within 24 hours.
- Auto-Apply activation rate.
- Applications submitted per active user.
- Interview Prep sessions completed per active user.
- Interview Copilot sessions started and completed.
- Subscription upgrade rate.
- Credit usage by product module.
- Support contact rate per active user.
- User retention by plan and product usage.

## 25. Out of Scope

- Internal admin and operations workflows, covered in the admin PRD.
- Backend architecture and vendor selection.
- Payment processor implementation details.
- AI model provider decisions.
- Any separated product lines that are not part of the core Lightforth career platform.
