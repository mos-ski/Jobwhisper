# Lightforth to Jobwhisper Transition Plan

> **Note:** converted from a PDF for editing. The pricing table in this document is now superseded by `PRICING.md` at the repo root (corrected 2026-09-02) — kept below exactly as originally written for reference. Everything else here (migration mechanics, timeline, checklist, email campaign) is not a pricing matter and is unaffected.

## Objective

Transition Lightforth to Jobwhisper without disrupting existing paying customers, while moving all new subscriptions to Jobwhisper and introducing the new US-focused pricing, credits and add-on model.

## 30–60 Day Coexistence

Lightforth will remain live for 30–60 days. Existing users can continue accessing Lightforth during this transition period. However, new Lightforth subscriptions will be stopped. When a new user reaches the payment stage on Lightforth, they will be redirected to Jobwhisper to subscribe.

## New User Payment Flow

Lightforth visitor → explores product (or landing page) → attempts to subscribe → sees Jobwhisper transition prompt → creates Jobwhisper account → receives first-time Pro offer → pays → completes Jobwhisper onboarding.

Suggested message: "Lightforth is now Jobwhisper. We've rebuilt the experience with a new account system, flexible plans and more focused career tools. Continue on Jobwhisper and get Pro for $20 for your first month, normally $99/month. Renews at $99/month."

*(As originally written. Note this PDF is internally inconsistent about the Pro renewal price — this line says $99/month, the pricing table below says "$20 first month; 80% off; renews at $100/month," and the Email Campaign section below says "$20 for the first month, normally $100/month." **`PRICING.md` resolves this: $40 first month, renews at $99/month** — a correction from 2026-09-02, not a pick between the two numbers already here.)*

## Existing Lightforth Users

Existing users can continue using Lightforth during the transition. Existing paying customers must not lose paid subscription time, eligible credits or account value. They should create a Jobwhisper account using the same email address used on Lightforth. If they have subscription, credit or account issues, Migration Support will verify the old account and restore the appropriate value on Jobwhisper. Double billing must be prevented.

## Database Migration

A full migration of the old Lightforth database is not required if the data is not clean. Instead, create a clean migration record for active paying users containing: email, current plan, amount paid, payment customer ID, renewal date, remaining eligible credits/value, Jobwhisper account status and migration status.

## Subscription and Billing

First confirm whether existing Lightforth recurring subscriptions can continue while users receive equivalent access on Jobwhisper. If this is possible, preserve the billing relationship.

If it is not possible, stop the next Lightforth renewal only after preserving the customer's remaining paid period, then move the customer to Jobwhisper billing at the correct renewal point.

## Jobwhisper Pricing

**Superseded — see `PRICING.md` for corrected numbers.** As originally written in this plan:

| Offer | Price | Notes |
|---|---|---|
| Starter | $47/month | 20 credits; Interview Prep; Interview Copilot Web ~200mins |
| Pro | $99/month | 100 credits; Web + Desktop; Coding Copilot ~10,000mins |
| First-Time Pro Offer | $20 first month | 80% off; renews at $100/month |
| Premium | $197/month | 2000 credits; Pro features; Meeting Copilot; Priority Support ~20,000mins |
| Resume Builder | $15/month add-on | Separate paid unlock |
| Auto Apply | $40/month add-on | Separate paid unlock |

*(Typo preserved from the original: the Pro row says "~10,00mins" — presumably 10,000, matching the pattern of Starter's ~200mins and Premium's ~20,000mins scaling by 100x/tier, but not corrected here since the actual number wasn't confirmed.)*

## Lightforth Website Communication

Persistent banner: "Lightforth is now Jobwhisper. We're moving to a rebuilt platform with a new account and pricing system. Create your Jobwhisper account to continue."

At the payment stage, new users should see the stronger commercial migration message and be redirected to the Jobwhisper $20 first-month Pro offer. *(See the note above — this first-month number is now $40 per `PRICING.md`.)*

Existing users should have a clear Migration Support option for subscriptions, credits, previous account information and billing issues.

## Email Campaign

- **Email 1: Announcement.** Lightforth is now Jobwhisper. Explain the rebrand and 30–60 day transition.
- **Email 2: Existing User Migration.** Explain new account creation, same-email verification and how paid value will be handled.
- **Email 3: What Has Changed.** Introduce the new plans, credit system, Copilots and paid add-ons.
- **Email 4: First-Time Offer.** Promote Pro at $20 for the first month, normally $100/month, with renewal clearly disclosed. *(Numbers superseded — see above.)*
- **Email 5: Migration Reminder.** Remind remaining users to move before Lightforth retirement and provide support.

## US Relaunch Cleanup

- Remove Nigerian and Naira pricing from active acquisition flows.
- Retire outdated Lightforth pricing pages, checkout links, promotions and ads.
- Use USD consistently across Jobwhisper.
- Update onboarding, FAQs, support documents and marketing materials.
- Clearly disclose the first-month price and renewal price (see `PRICING.md` for the current numbers to use here).

## Internal Checklist

- **Product:** finalize pricing, credits, add-ons, migration screens and account flow.
- **Engineering:** keep Lightforth accessible, stop new Lightforth payments, build payment redirect, create migration records and prevent double billing.
- **QA:** test migration, subscriptions, renewals, credits, add-ons, cancellations and failed payments.
- **Marketing:** launch rebrand campaign, US VSL funnel and first-time offer.
- **Content:** prepare emails, banners, FAQs and support scripts.
- **Support:** handle account verification, subscription transfers, credits and migration issues.
- **SBU Lead:** approve migration rules, pricing, revenue tracking and final shutdown.

## Timeline

**Days 1–7:** Finalize pricing/billing, export active subscribers, create migration records, QA Jobwhisper, add Lightforth banners and payment interception.

**Days 8–30:** Launch Jobwhisper, move all new subscriptions to Jobwhisper, run migration emails and support existing customers.

**Days 31–60:** Continue legacy Lightforth access, intensify migration reminders, resolve remaining credits/subscriptions and prepare shutdown.

**Final Retirement:** Disable Lightforth product access after the communicated deadline and redirect Lightforth traffic to Jobwhisper.

## Success Outcome

At the end of the transition, new revenue should flow only through Jobwhisper, existing paying Lightforth customers should retain the value they paid for, the new US pricing model should be fully active, and Lightforth should be ready for retirement without unnecessary customer or billing disruption.
