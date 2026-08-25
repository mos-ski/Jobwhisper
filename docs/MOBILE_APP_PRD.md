# Project Superpower: Lightforth Mobile App PRD

**Version:** 1.0  
**Status:** Draft / In-Review  
**Product:** Job seeker companion app featuring Auto-Apply and Interview Copilot.

---

## 1. Vision & Core Value Proposition
The Lightforth mobile app is the "on-the-go" companion to the desktop experience. It focuses on removing friction from the job search (Auto-Apply) and providing real-time support during high-stakes moments (Interview Copilot).

*   **Auto-Apply:** "Get the interviews while you sleep."
*   **Copilot:** "Ace the interview when it happens."

---

## 2. User Journey: Onboarding Flow

1.  **Splash Screen / Login**
    *   Simple, high-vibe branding.
    *   3 Authentication options: **Continue with Apple**, **Continue with Google**, **Continue with Email**.
    *   Terms of Service & Privacy Policy agreement.

2.  **Product Preview (The "Hook")**
    *   Slide 1: **Auto-Apply Preview** – Showcase how the app finds and submits applications for you.
    *   Slide 2: **Interview Copilot Preview** – Showcase real-time AI guidance during calls.

3.  **Profile Initialization (The "Resume Scan")**
    *   **Action:** User uploads their resume (PDF/Docx).
    *   **Processing:** AI scans and parses the resume in real-time.
    *   **Data Verification:** User reviews extracted data (Contact info, Job preferences, Work history).
    *   **Step-by-step forms:** Address any gaps (Salary target, Notice period, Referral code - optional).

4.  **Permissions & Finish**
    *   Enable Push Notifications (Critical for job replies/alerts).
    *   Onboarding Completed celebration.

---

## 3. Main Navigation (5-Tab Structure)

### Tab 1: Job Feeds (Job List)
*   **Purpose:** Discover and act on opportunities.
*   **Features:** 
    *   Personalized list based on Job Profile.
    *   **Single-Tap Apply:** Green "Auto Apply" button that triggers the backend agent swarm.
    *   **Status Indicators:** Clearly show "Applied", "Failed", or "Retrying" states.
    *   Filter/Search bar.

### Tab 2: Application Tracker
*   **Purpose:** Transparency and status.
*   **Features:** 
    *   **Activity Logs:** Step-by-step visibility (*Reading metadata -> Filling form -> Uploading Resume -> Submitted*).
    *   **See Replay:** Video/Gif playback of the bot's submission (Matches web "See Replay" feature).
    *   **Issue Resolution:** "Action Required" cards for applications that need manual intervention (e.g., security check or missing info).

### Tab 3: Copilot (Center Tab — "The Superpower")
*   **Purpose:** Real-time AI guidance for both phone and virtual interviews.
*   **Design:** Elevated center button with a primary blue audio mic icon.
*   **Modes:**
    *   **Default:** Direct, conversational answers.
    *   **Headlines (STAR):** Structured bullet points emphasizing Situation, Task, Action, Result.
    *   **Coaching:** Brief pointers and tactical advice instead of full answers.
*   **Session Management:** Settings for font size and auto-scroll speed (Matches web settings).

### Tab 4: Activities
*   **Purpose:** Engagement history and engagement logs.
*   **Features:** 
    *   Unified feed of all critical events.
    *   *"Resume tailored for [Company] successfully"*
    *   *"Scanned 155 jobs today, applied to 12"*
    *   *"Daily credit reward claimed."*

### Tab 5: Profile
*   **Purpose:** The user's career data hub and monetization center.
*   **Features:** 
    *   **Resume Overview (Parsed Data):** Displays Education, Experience, and Skills exactly as shown in the desktop builder.
    *   **Add/Update:** Quick actions to manually append new skills or roles.
    *   **Personal Data:** Edit contact info (Email, Phone, LinkedIn, Portfolio).
    *   **Resume Power Banner:** High-visibility banner for "Generate New Resume with Job Link." (Flow: Paste JD -> Select Template -> AI Refine -> Download).
    *   **Wallet:** Credit balance display with a prominent "Top Up" flow.

---

## 4. Monetization & Credits
*   **Credit Counter:** Clearly visible in Profile and Copilot tabs (e.g., "31 of 34 Left").
*   **Credit Value:** 1 credit = 1 auto-apply, 1 copilot session, or 1 resume generation. (Note: ATS scoring and AI Suggester are Free).
*   **Plans (Naira):**
    *   **STARTER (₦5,000):** 15 Credits/month + Resume builder.
    *   **PRO (₦20,000):** 50 Credits/month + Auto-apply & Copilot.
    *   **PREMIUM (₦50,000):** 100 Credits/month + Unlimited ATS/Suggestions.
*   **In-App Purchase (IAP):** Native Apple/Google pay for "Credit Packs" or "Subscription Upgrades."

---

## 5. Implementation Notes & Success Criteria
1.  **Resume Parsing (Phase 1):** Success rate of 90%+ for parsing common PDF resume formats.
2.  **Single-Tap Experience:** Auto-apply must be triggered directly from the job list with 0 latency.
3.  **Cross-Platform Sync:** Changes made to "Job Profile" on mobile must reflect on the web dashboard immediately.

---

## 6. Questions & Clarifications
1.  **Platform:** Is this being built as a Native (Swift/Kotlin) or Cross-platform (React Native) app?
2.  **Copilot Audio Source:** On mobile, are we supporting "System Audio" capture for interviews happening *on the phone*, or strictly microphone-in?
3.  **Job Feed Logic:** Should the feed pull from the same sources as the desktop web app (Scraping + APIs)?
4.  **Offline Access:** Does the "My Resume" section need offline download support?
