# Lightforth Mobile App — Product Brief

---

## What It Is

The Lightforth mobile app brings two of the platform's most powerful features to the user's phone — Interview Copilot and Auto Apply. It's designed to be the companion to the web and desktop experience, giving users the flexibility to prepare, apply, and get real-time interview support from anywhere.

The mobile app covers two core modules:

1. **Interview Copilot** — real-time AI assistance during live interviews
2. **Auto Apply** — one-tap job applications directly from the phone

---

## Module 1: Interview Copilot

### How It Works on Mobile

The mobile version of Copilot works the same way as the desktop app, with one key difference in how the user positions it during an interview.

**For video interviews (Zoom, Teams, Google Meet, etc.):**
The user places their phone beside their laptop or desktop screen. As the interviewer speaks, Copilot listens through the phone's microphone and displays the suggested response on the phone screen. The user glances at their phone to read the answer — naturally, as if checking notes — while the interviewer only sees the user looking slightly to the side.

**For phone call interviews:**
If the interview is happening as a voice call directly on the phone, the user opens Copilot in the same session. Copilot listens to the call audio and displays suggested responses on screen in real time, so the user can read and respond without the interviewer knowing.

---

### The Full Setup Flow

The setup experience on mobile mirrors the desktop app exactly:

**Step 1 — Onboarding and Permissions**
On first launch, the user sees a welcome screen explaining how Copilot works on mobile, what permissions are needed (microphone access, and audio recording where applicable), and how to grant them. A **Continue** button moves them forward once setup is confirmed.

**Step 2 — Session Setup**
The same setup form as desktop:
- **Job title** — text input with quick-select suggestions
- **Resume** — upload a new resume or use their Lightforth-built resume (recommended), with filename shown and a remove option
- **Job description** — optional paste field with an AI "Suggest for me" button
- **Audio device** — microphone selection with a permission prompt and a green "Connected" confirmation once linked
- **Don't ask me again** — checkbox to save preferences and skip setup on future sessions

**Step 3 — Response Style Preference**
A modal to choose how Copilot presents answers:
- **Default** — full natural-sounding answer to read aloud
- **Headlines** — STAR-format bullet points
- **Coaching** — short tips to guide the user's own response

**Step 4 — Live Canvas**
The same live experience as desktop — status bar showing network strength and audio state (*Listening...*, *Processing...*, *Answering...*), the response panel with the green listening glow, bouncing processing dots, and fast-streaming answer text. The settings icon opens the same preferences popover with a reset option.

**Step 5 — Session Complete**
Confirmation screen with a Go Home button.

---

### Pricing and Access

- Available on **Pro and Premium plans only**
- **1 credit = 1 session**, including test runs
- Credit balance should be shown clearly before the session starts

---

## Module 2: Auto Apply

### What It Does

Auto Apply on mobile lets the user apply to jobs with a single tap — the same way it works on the Lightforth web app, but from their phone.

When the user finds a job they want to apply for, Lightforth automatically fills in the application using their saved career profile and resume. No manual form filling, no copy-pasting. One tap and it's done.

Jobs are surfaced based on the user's career profile — their experience, target roles, and preferences — so what they see is already relevant to them.

### Key Behaviours

- One-tap apply — Lightforth handles the full application automatically in the background
- Applications are tracked and visible in the user's apply history, same as on web
- The user can review what was submitted and the status of each application
- Works across all job sources Lightforth supports

---

## Notification Strategy for Auto Apply

Keeping users informed about their applications is critical — but getting the notification experience wrong (too many, too vague, wrong timing) will cause users to turn them off entirely. The goal is to make every notification feel relevant and worth acting on.

---

### Push Notifications

Push notifications should be reserved for events that are time-sensitive or require the user's attention. They should never feel like marketing blasts.

**What triggers a push notification:**

| Event | Example copy |
|---|---|
| Application submitted | "Your application to Stripe has been sent ✓" |
| Employer viewed your application | "Someone at Stripe viewed your application — stay ready" |
| Application shortlisted | "Good news — you've been shortlisted for the Product Designer role at Stripe" |
| Interview request received | "Stripe wants to schedule an interview. Tap to respond" |
| Application rejected | "Your application to Stripe wasn't selected this time. Keep going" |
| New job matches | "3 new roles match your profile — including one at Google" |
| Low credit balance | "You have 1 credit left. Top up before your next interview" |

**Best practices:**

- **Be specific, not generic.** Always include the job title and company name. "Your application was viewed" tells the user nothing. "Someone at Stripe viewed your Product Designer application" tells them everything.
- **One tap, one destination.** Every notification deep-links directly to the relevant screen — not the home screen. Interview request notification goes straight to the interview scheduling screen. Rejection goes to the application detail.
- **Cap daily volume.** No more than 2–3 push notifications per day per user. If multiple events happen in a short window, batch them: "2 updates on your applications — tap to see."
- **Respect quiet hours.** No pushes between 10pm and 8am in the user's local timezone by default. Users can adjust this in settings.
- **Urgent events fire immediately.** Interview requests and rejections go out the moment they happen. Job match alerts are batched and sent once a day at a reasonable time (e.g. 9am).

---

### In-App Notifications

The notification centre is the source of truth for everything that happened — whether the user dismissed the push or never saw it.

**How it works:**

- Accessible from a bell icon in the app's top navigation bar, with an unread badge count
- Every event that triggers a push also creates an in-app notification, stored with a timestamp
- Notifications are grouped into three categories:
  - **Application Updates** — status changes, views, shortlists, rejections, interview requests
  - **Job Matches** — new roles that fit the user's profile
  - **Account & Credits** — credit balance warnings, billing updates, plan changes
- Tapping any notification takes the user directly to the relevant screen
- Users can mark individual items as read or clear all at once
- Notifications older than 30 days are automatically archived

---

### Email Digests

Email is not for instant alerts — it's for summaries and reflection. Users check email at a different pace, and the content should match that.

**Weekly digest (every Monday morning):**
- A summary of all applications submitted that week
- Current status of each (submitted, viewed, shortlisted, etc.)
- Top 3–5 new job matches based on their profile
- One clear CTA: "See all your applications"

**Triggered emails (sent immediately, not in the digest):**
- Interview request received — this is high-stakes, users need it now
- Application rejection — users should know promptly so they can move on and apply elsewhere

**Email design principles:**
- Each application listed as a clean row: company logo, job title, status badge, one action button
- No walls of text — scannable in under 30 seconds
- Plain, professional design that matches the Lightforth brand
- Unsubscribing from digest emails does not affect push or in-app notifications

---

### Notification Preferences

Users need control. A user who can't customise notifications will turn them all off. Give them granular options without making it overwhelming.

**Settings screen layout:**

**Application Updates**
- Push notifications: On / Off
- Email alerts: On / Off (for triggered emails like interview requests and rejections)

**Job Matches**
- Push notifications: On / Off
- Frequency: Immediately / Daily digest / Weekly digest
- Email digest: On / Off

**Account & Credits**
- Push notifications: On / Off (credit warnings, plan updates)

**Quiet Hours**
- Default: 10pm – 8am (local timezone)
- User can set custom start and end time

Users should be able to reach this screen from the in-app notification centre with one tap, so there's no friction when they want to dial something back.

---

## Important Product Notes

**Mobile is the companion, not a replacement.** The web and desktop apps are where users build their resume, manage their profile, and do deeper prep work. Mobile is for staying active on the go — applying to jobs while commuting, or having Copilot available on interview day without needing a second device.

**The phone call use case is unique to mobile.** No other version of Copilot can support a live phone interview — this is a mobile-only capability and should be highlighted in the app's onboarding and marketing.

**Auto Apply on mobile removes the biggest barrier to consistent job seeking** — users don't apply to jobs because it's tedious. One-tap apply from the phone means they can act on a good opportunity the moment they see it, not when they get back to their laptop.

**Response Style syncs across platforms.** Whatever style the user selected in Interview Prep or the desktop Copilot should carry over as their default on mobile.
