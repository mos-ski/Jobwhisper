# Lightforth Copilot (Desktop) — Product Requirements Document

- **Version:** 1.0
- **Status:** Draft / In-Review
- **Author:** Product
- **Product:** A stealth, real-time AI assistant that runs on a user's desktop during live interviews, coding assessments, meetings, and sales calls — sold as three distinct products to three distinct buyers.

---

## 1. Problem Statement

High-stakes live conversations — job interviews, technical assessments, client meetings, sales calls — reward people who can think and respond quickly under pressure, regardless of whether they actually know the material best. Today, candidates and reps either go in unprepared, or rely on a second monitor full of notes that's awkward to use and obvious to the other party.

Lightforth Copilot removes that disadvantage. It listens (or watches the screen), understands what's being asked in real time, and surfaces the right response — invisibly, so the other party never knows it's there.

The product serves three very different buyers with three very different needs, so it is packaged and sold as three separate products built on one shared core engine: **Regular Copilot** (Interview, Coding, Meeting), **Exam Ghost** (proctored professional exams), and **Sales Closer AI** (enterprise sales teams).

---

## 2. Target Users

| Segment | Who they are | What they're using Copilot for |
|---|---|---|
| **Individual job seeker** | Actively interviewing for roles, often across multiple companies in the same week | Live interviews, take-home/live coding rounds, and prep calls — wants confidence and speed under pressure |
| **Certification / exam candidate** | Sitting a proctored or remote knowledge exam (professional certifications, licensing exams, etc.) | A single, focused need: answer on-screen questions correctly and quickly — no interview or meeting use case required |
| **Enterprise sales team** | A B2B sales organization (manager/admin buys, reps use) | Live sales calls where reps need instant, accurate answers about their own product/pricing/policies, pulled from their company's own knowledge base, not generic AI knowledge |

---

## 3. Product Lineup & Pricing

Three products, three buyers, one underlying engine:

| Product | Buyer | Price | What it unlocks |
|---|---|---|---|
| **Regular Copilot — Pro** | Individual | **$49/mo** | Interview and Coding use cases |
| **Regular Copilot — Premium** | Individual | **$79/mo** | Everything in Pro, **plus** the Meeting use case |
| **Exam Ghost** | Individual | **$500 one-time** | Exam use case only — no subscription, no other use cases |
| **Sales Closer AI** | Company (admin buys on behalf of team) | **$5,000 one-time setup fee** + **$79/seat/month** | Sales Call use case for every activated rep, plus a web admin dashboard for the company |

Each product has its own landing page, its own checkout, and its own first-run destination after purchase. A buyer should never see pricing, features, or setup steps belonging to a product they didn't choose.

### Why split it this way
- **Regular** customers are shopping for an ongoing career tool and expect subscription pricing with room to grow (more use cases, more credits).
- **Pro vs. Premium is a real feature gate, not just a credits difference.** Meeting is the use case most likely to be used by people already paying for more — internal stakeholders, account managers, client-facing roles — so it's the natural upsell lever that gives Premium a distinct reason to exist beyond "more of the same." A Pro subscriber who tries to start a Meeting session should be clearly prompted to upgrade, not see the use case at all in their setup screen.
- **Exam** customers have one task, one sitting, and don't want to commit to a subscription for a single use — one-time pricing matches the one-time need.
- **Enterprise** is sold top-down to a company, not bottom-up to an individual rep. The admin is the buyer and the seat-manager; reps never see a price tag.

---

## 4. Account Recognition & Sign-In Routing

A returning user who signs in must land exactly where their purchase entitles them to be — never repeating a payment flow or a setup step they've already completed, and never seeing a use case they haven't unlocked.

| Account type | How it's created | Where sign-in routes them |
|---|---|---|
| Regular individual | Signs up, picks Pro/Premium, pays | Straight to their unlocked use cases (Interview/Coding/Meeting) |
| Exam individual | Signs up, pays the one-time fee | Straight to the Exam canvas — never the use-case picker |
| Enterprise admin | Buys the Enterprise plan, pays setup fee + own seat | Straight to Sales Call (their seat is active immediately, independent of the rest of their team) |
| Enterprise member (rep) | Invited by their admin via name + email, gets an invite code | Once their admin has activated their seat (paid the $79/mo for them), they sign in with the invite code and land on Sales Call. Before their seat is activated, sign-in should clearly tell them their seat isn't active yet, not silently fail |

The admin's own access is **never blocked waiting on the rest of the team** — they paid for their own seat the moment they completed setup.

---

## 5. Core Experience: The Live Canvas

This is the shared engine behind Interview, Meeting, and Sales Call. All three are the same kind of moment — a live, spoken, multi-party conversation — so they share one canvas pattern.

### 5.1 Setup (before the call)

One screen, not a multi-step wizard. Fields needed depend on the use case, but the pattern is consistent: title on top, input field directly under it, plain vertical flow — no buried settings.

- **Use case selector** — for Regular Copilot, the unlocked use cases are presented as a single setup screen with a segmented tab control at the top (not a separate "pick a use case" screen). Switching tabs swaps which fields are shown. **Only the tabs the user's plan has unlocked are shown** — a Pro subscriber sees Interview and Coding; a Premium subscriber sees Interview, Coding, and Meeting. A locked use case should never be reachable from this screen at all, not just disabled.
- **Position / role** — a type-ahead field that suggests common job titles as the user types, rather than a flat text box.
- **Job description** — optional paste field, with a "Suggest for me" action that generates a plausible job description from the role alone, for users who don't have one handy.
- **Company name** (Sales Call) — who the rep is calling.
- A **"don't ask me again"** option so repeat users skip straight to the canvas next time. The only way to bring setup back is a control inside the canvas itself, so it's never triggered by accident mid-session.

### 5.2 Going live

When the session starts, the assistant:
1. Listens to the live audio.
2. Transcribes what's said in real time.
3. Identifies who is speaking.
4. Generates and streams a suggested response toward the user.

Target time from "question finishes" to "first word of the suggested answer appears" is **about 2 seconds**.

### 5.3 Multi-speaker awareness (new in this phase)

Real conversations aren't one-on-one. An interview panel can have two interviewers; a meeting can have five attendees; a sales call can have the prospect plus a colleague who joins midway. The Copilot already knows which voice is the user's own (they're wearing the mic) — the requirement here is to track and label the **other voices** in the room:

- **Audio source is the other party's side of the call** — the interviewer, the meeting attendees, the customer/prospect — not the user's own microphone feed. Multi-speaker detection only matters on that side; the user is always one known, separate voice.
- When a new, previously-unheard voice joins the conversation, the assistant should recognize it as distinct from voices already tracked, without requiring the user to manually introduce every attendee.
- Each tracked voice gets a label (e.g., "Interviewer 1," "Interviewer 2," or a name if one was provided at setup) and subsequent lines in the transcript are attributed to the right speaker.
- **Interjections** — when one speaker cuts into another speaker's question or answer before they finish — should be visually distinguishable from a normal back-and-forth turn, so the user can tell at a glance "this wasn't the original question, someone jumped in." This should read as a lightweight, secondary thread off the main line of conversation, not its own heavyweight UI element competing for attention with the actual answer the user needs.

### 5.4 Response style

Users choose how they want answers presented, set once and reusable across sessions:
- **Default** — a complete, ready-to-read-aloud answer.
- **Headlines** — STAR-format bullet points (Situation, Task, Action, Result).
- **Coaching** — short directional pointers rather than a scripted answer, for users who want to formulate their own words but need a nudge.

### 5.5 Window behavior (stealth — the core differentiator)

This is why the product exists as a desktop app instead of a browser tab:
- **Invisible on screen shares and recordings.** If the other party asks to see the user's full screen, or the call gets recorded, the Copilot window must not appear in either.
- **Stealth mode toggle** — on by default; can be turned off if the user wants a normal, visible window (e.g., while testing).
- **Transparency control** — adjustable opacity so the window can sit over other applications without blocking what's behind it.
- **Always-on-top** — keeps the window floating above whatever else is in focus.

### 5.6 Ending a session

A single, clear "End" action. On completion, the user gets confirmation that the session was saved. For Sales Call specifically, the completed call (with its full transcript) is what populates the admin's Call History — see §7.4.

---

## 6. Core Experience: The Screenshot Canvas (Coding & Exam)

Coding rounds and exams aren't spoken conversations — they're a question on screen that needs an answer. This is a separate, simpler canvas pattern shared by the Coding use case (under Regular Copilot) and the standalone Exam Ghost.

- **Auto-capture by default.** The assistant watches the screen and automatically captures and answers new questions as they appear — the user shouldn't have to remember to trigger anything during a timed exam.
- **Manual override always available.** Power users or edge cases (a question the auto-capture missed, or wanting to force a re-read) can trigger a capture manually at any time. Two ways to trigger it, so the user isn't boxed into one input method (e.g., a single key press, or a key combination) — both must always work side-by-side with auto-capture, never one replacing the other.
- Response streams in the same way as the live canvas: fast, visibly "thinking," then answering.

**Exam Ghost specifically:** after purchase, the user goes straight from download/sign-in to this canvas. There is no use-case picker, no setup screen asking which use case they want — they bought exactly one thing and should land on exactly that.

---

## 7. Sales Closer AI — Admin Dashboard

This is the part of the product that doesn't live in the desktop app at all — it's a web dashboard for the company admin who bought the product. Think of it as the control plane for everything the sales team's Copilot says and does.

### 7.1 Overview (landing page)
At-a-glance status: setup fee paid, how many seats are active out of how many added, and team call activity — total calls completed, which rep has made the most calls, and average call length. This is the admin's "is this thing working and is my team using it" check, so it leads with usage, not configuration.

### 7.2 Knowledge Base
The single most important admin surface, because **this is what the AI says on a live sales call instead of generic answers.** It has five areas:
- **Documents** — uploaded reference files (pricing sheets, playbooks, case studies).
- **FAQs** — structured question/answer pairs.
- **Knowledge Center** — named, freeform policy/process write-ups organized into categories the admin defines (e.g., "Refund Policy," "Objection Handling," "Escalation Procedure"). There's always a default catch-all category for anything that doesn't fit elsewhere, separate from any categories the admin creates themselves.
- **Text** — short freeform notes that don't need a title or category (a quick reminder, a talking point).
- **Links** — reference URLs and contact info (website, email, phone, social), with website links automatically scanned for relevant content.
- Every individual entry across all five areas can be toggled on/off without being deleted — admins should be able to temporarily silence something without losing it.

### 7.3 Team
The admin adds reps by name and email; each gets an invite code. A rep's desktop access only activates once the admin pays their $79/mo seat — the admin can add as many reps as they want up front and activate seats on their own schedule as the team grows, without being forced to pay for everyone on day one. **Seat activation is admin-only for MVP** — there is no self-serve path for a rep to activate or expense their own seat. **Access control is also admin-only for MVP**: the admin has full access to every area of the dashboard (Knowledge Base, Team, Call History, Billing, Integrations). Role-based permissions (e.g., a rep-level login with restricted access) are a deliberate phase-2 scope cut, not an oversight.

### 7.4 Call History
Every completed sales call from every rep on the team, with the full transcript available to review. This is both a coaching tool (review how a rep handled a call) and a trust-building tool (proof the product is actually being used, and used well).

### 7.5 Billing & Subscription
What's been paid (the one-time setup fee) and what's being paid monthly (sum of active seats × $79), broken down per person so the admin can see exactly what each teammate costs and reconcile it against who's actually using the product.

### 7.6 Integrations
Connections to the tools the sales team already lives in — CRM (Salesforce, HubSpot, Pipedrive), calling/meeting tools (Zoom, Google Meet), and team communication (Slack, Google Calendar) — so call data and Copilot usage can flow into the systems of record the team already trusts, rather than living only inside this dashboard.

### 7.7 Settings
Admin profile and account security.

---

## 8. Monetization Summary

| | Regular | Exam | Enterprise |
|---|---|---|---|
| **Buyer** | Individual | Individual | Company admin |
| **Model** | Subscription | One-time | Setup fee + per-seat subscription |
| **Price** | $49–$79/mo | $500 | $5,000 + $79/seat/mo |
| **What scales the price** | Plan tier (more credits/use cases) | Nothing — flat | Number of activated seats |
| **Who can downgrade/cancel** | The individual, anytime | N/A (one-time) | The admin, per seat |

### How a credit is consumed (Regular Copilot)
Credits are tied to session length, not session count: a session **under 1 hour costs 1 credit**, and each additional full hour adds another credit (a session that runs 2 hours costs 2 credits, 3 hours costs 3 credits, and so on). The user should be **notified when they have less than 1 hour of credit remaining**, so a long session doesn't quietly run out mid-conversation — credit balance needs to be visible going into a session, not just discovered after.

---

## 9. Non-Functional Requirements

- **Undetectability is non-negotiable.** The Copilot window must never appear in a screen share, a screen recording, or any captured footage of the call, on any of the platforms it's used alongside (video conferencing apps, proctoring software for exams, etc.). This is the entire value proposition — a visible Copilot is a liability, not a feature.
- **Response latency.** Target ~2 seconds from end-of-question to start-of-answer on the live canvas; near-instant on the screenshot canvas once a capture is triggered.
- **Speaker attribution accuracy.** Misattributing a line to the wrong speaker, or failing to separate two distinct voices, actively damages trust in the product — this needs a high accuracy bar before multi-speaker support is considered reliable enough to rely on in a real interview or call.
- **Data handling.** Live audio, transcripts, screenshots, and enterprise knowledge base content are all sensitive by nature (job interviews, exams, client conversations, proprietary sales material). **Retention is set at up to 90 days** for call transcripts and recordings. Formal compliance work (SOC 2, recording-consent disclosures, region-specific data residency) is explicitly deferred past MVP — revisit once enterprise demand justifies the investment, not before.
- **Seat-gating integrity.** An enterprise rep without an activated seat must not be able to access the desktop canvas, even with a valid invite code — billing correctness depends on this being airtight.

---

## 10. Success Metrics

- **Activation:** % of purchasers who complete at least one full session within 7 days of buying.
- **Reliability:** % of sessions where a response was generated within the target latency window.
- **Speaker accuracy:** % of multi-speaker sessions where attendee voices were correctly distinguished and labeled (measured against session recordings/feedback, not self-reported).
- **Enterprise seat utilization:** % of admin-activated seats with at least one completed call in the last 30 days — a proxy for whether the admin is getting their money's worth and likely to keep paying.
- **Enterprise knowledge base adoption:** % of accounts with at least one populated Knowledge Base category — an empty knowledge base means the AI is falling back to generic answers, undermining the entire enterprise pitch.
- **Retention:** Regular subscription renewal rate; Enterprise seat count trend (growing vs. shrinking) per account over time.
- **Conversion:** Landing page → checkout completion rate, tracked separately per product (Regular / Exam / Enterprise), since they have different buyers and different friction points.

---

## 11. Out of Scope (this PRD)

- Real payment processing / subscription billing infrastructure.
- CRM-level two-way sync logic for Integrations (beyond "data flows in") — depth of each integration is its own scope.
- Mobile Copilot — covered separately in the mobile app PRD; this document is desktop-only.
- Resume building, ATS scoring, or any other Lightforth web-app feature — this PRD is the Copilot product only.
- Specific underlying AI/transcription vendor selection — a technical decision for the implementing team, not a product requirement here.

---

## 12. User Stories & Acceptance Criteria

### Individual — Regular Copilot

**US-1. Sign-up and payment happen on the website, not in the app.**
As an individual job seeker, I want to create my account and pay on the website, so that the desktop app stays focused on just running my live sessions.

- Given I open the desktop app for the first time, when I reach the welcome screen, then I see three ways to continue — Email, Google, LinkedIn (in that order) — and a separate "Sign in" link for returning users.
- Given I choose any of the three sign-up methods, when I click it, then I'm taken to the website to complete account creation and payment; no pricing or payment screen exists inside the desktop app itself.
- Given I've completed checkout on the website, when I return to the desktop app, then I land on sign-in with my email already filled in, and only need to enter my password.
- Given I try to sign in with an email that has no account yet, when I submit, then I see an inline error directing me to sign up on the website — I am never silently dropped into a broken or missing screen.

**US-2. My plan determines exactly which use cases I can reach.**
As a Pro or Premium subscriber, I want to only see the use cases I've paid for, so that I'm never confused or tempted by a feature I haven't unlocked.

- Given I'm signed in on a Pro plan, when I reach setup, then I see exactly Interview and Coding as tabs — Meeting is not present anywhere on screen, not just disabled.
- Given I'm signed in on a Premium plan, when I reach setup, then I see Interview, Coding, and Meeting.
- Given my account upgrades from Pro to Premium on the website, when I next sign in, then Meeting becomes available without any other change to my setup.

**US-3. Copilot keeps up when more than one other person is talking.**
As a user in a live Interview or Meeting session, I want Copilot to tell multiple other speakers apart, so that I get the right context no matter who's asking.

- Given a session is live, when audio comes in, then it's captured from the other party's side of the call, not my own microphone.
- Given a new voice that hasn't been heard yet joins the conversation, when it speaks, then it's automatically tracked as distinct from voices already identified — I never have to manually introduce an attendee.
- Given one speaker cuts into another speaker's question before they finish, when that happens, then the interjection is visually distinguishable from a normal back-and-forth turn in my transcript.

**US-4. I always know how my credits are being spent.**
As a subscriber, I want to understand my credit usage in real time, so that I'm never surprised mid-session.

- Given a session runs under 1 hour, when it ends, then exactly 1 credit is deducted.
- Given a session runs past a full additional hour, when each hour completes, then 1 more credit is deducted (a 2-hour session costs 2 credits, a 3-hour session costs 3).
- Given my remaining credit balance drops under 1 hour during a live session, when that threshold is crossed, then I'm notified on screen before I run out.

### Exam candidate

**US-5. Purchase takes me straight into the exam, with nothing in between.**
As someone who bought Exam Ghost, I want to go directly from sign-in to the exam interface, so that I don't waste time on setup or a use-case picker.

- Given I've completed the Exam Ghost purchase on its dedicated website checkout, when I return to the desktop app and sign in, then I land directly on the Exam screenshot canvas.
- Given I'm an exam account, when I sign in, then no use-case picker or setup form is shown — there's exactly one thing to land on.

*Note — intentionally out of scope:* this PRD does not specify "defeating anti-cheating or remote-proctoring software" as a requirement for Exam Ghost. Helping a candidate evade the controls a certification or licensing body uses to verify a test-taker's own knowledge is a different kind of harm than the "the other person on the call can't see it" framing used for Interview/Meeting (§5.5) — it risks enabling fraud against whoever issues the credential and against anyone who later relies on it. If the $500 price point is meant to be justified specifically by defeating proctoring, that's a direction worth a direct conversation with whoever owns this product line, not something to quietly write into a requirements doc.

### Enterprise admin

**US-6. I can tell at a glance whether my team is actually using this.**
As an enterprise admin, I want full visibility into my team's usage from one dashboard, so that I know whether the product is being used and used well.

- Given I open the dashboard, when the Overview page loads, then I see setup-fee status, active-seat count out of total added, total completed calls, the rep with the most calls, and average call length.

**US-7. I only pay for reps who are actually active.**
As an enterprise admin, I want to control exactly which reps have paid access, so that I'm never billed for someone who isn't using the product.

- Given I add a rep by name and email, when I save them, then they receive an invite code but have no desktop access yet and I am not charged for their seat.
- Given a rep's seat has not been activated, when they try to sign in with their invite code, then they're clearly told their seat isn't active yet, not silently rejected.
- Given I activate a rep's seat, when I do, then I'm billed $79/mo for that seat starting immediately, independent of every other rep's status.
- Given I am the admin, when I complete my own setup, then my own seat is active immediately, regardless of whether any rep has been added yet.
- There is no self-serve path for a rep to activate or expense their own seat — activation is admin-only in this version.

**US-8. Our call data is handled responsibly enough to trust with real client conversations.**
As an enterprise admin, I want clear limits on how our data is retained and who can see it, so that I can trust the product with real client calls.

- Given a call completes, when it's saved, then its transcript and recording are retained for up to 90 days.
- Given I am the admin, when I access the dashboard, then I have full access to every area (Knowledge Base, Team, Call History, Billing, Integrations) — there are no separate per-rep permission tiers in this version.

**US-9. My knowledge base actually shapes what the AI says on a call.**
As an enterprise admin, I want the AI to answer from our own material instead of generic knowledge, so that reps sound like they know our product, not like they're using a generic tool.

- Given I add content to Documents, FAQs, Knowledge Center, Text, or Links, when a rep is on a live call, then the AI's answers draw from that content.
- Given I want to temporarily silence an entry without losing it, when I toggle it off, then it stops being used but remains saved.

### Enterprise rep

**US-10. Copilot keeps up even when more than one person joins from the prospect's side.**
As an enterprise rep on a live sales call, I want Copilot to tell multiple prospect-side voices apart, so that I don't lose the thread when a second stakeholder joins partway through.

- Given more than one voice is present on the prospect's side of the call, when each speaks, then Copilot tracks and labels them as distinct speakers, the same way it does for an Interview or Meeting session.
