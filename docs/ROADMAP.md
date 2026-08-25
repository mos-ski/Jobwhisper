# Lightforth Product Roadmap

> **Context:** Lightforth is a live, functioning AI-powered career platform. This document outlines product opportunities, feature expansions, and strategic initiatives to grow the product. This is NOT a technical gap-fill -- the app works. This is about what comes next to make it better, stickier, and more valuable.

---

## Current Feature Set (What Exists Today)

| Feature | What It Does |
|---------|-------------|
| **Resume Builder** | Create, edit, and tailor resumes with 20 templates, AI suggestions, ATS scoring |
| **Auto-Apply** | Automatically apply to jobs based on user preferences |
| **Interview Prep** | Practice interviews with AI interviewer, get feedback reports |
| **Interview Copilot** | Real-time AI assistance during live interviews |
| **My Documents** | Manage and track all created resumes |
| **Billing & Credits** | Subscription plans, credit tracking, usage-based pricing |
| **Job Profile** | Set target role, preferences, skills for personalization |
| **Downloads** | Desktop app for Mac/Windows (Copilot) |
| **Referral Program** | Earn credits by referring friends |

---

## Strategic Questions to Frame the Roadmap

Before diving in, these are the questions I'd want answers to:

1. **What are our top 3 metrics right now?** (e.g., signups, active users, conversion rate, retention, revenue)
2. **Where do users drop off most?** (onboarding, resume builder, paywall, etc.)
3. **What do users say in support tickets or reviews?** What do they love? What frustrates them?
4. **Who is our primary user persona?** Fresh grad? Career switcher? Senior professional? Which segment converts best?
5. **What's our biggest competitor doing that we're not?** (Teal, Jobscan, Rezi, LazyApply, etc.)
6. **What's the #1 reason people cancel or don't upgrade?**
7. **Are we focused on growth, retention, or monetization right now?** (Pick one as the north star)

---

## Roadmap Themes

Organized by product outcome, not technical effort.

---

### Theme 1: Increase Activation (Get New Users to Their "Aha!" Moment Faster)

The biggest risk for any product is users signing up and never experiencing value.

#### 1.1 Guided Onboarding Flow

**The Problem:** Users land on the dashboard and see a lot of options. They may not know where to start or what the product can do for them.

**What to Do:**
- Build a step-by-step onboarding wizard: "What brings you here?" → "Build a resume" / "Apply to jobs" / "Prepare for interviews"
- Based on their choice, guide them through a focused first experience (e.g., if they chose "Apply to jobs," walk them through uploading a resume, setting preferences, and seeing their first auto-applied job)
- Add a progress tracker: "You're 3 of 5 steps away from your first application"
- Celebrate the first win with a clear success moment

**Potential Win:**
- Users experience value within their first session instead of bouncing
- Higher activation rate → more users reaching the paywall with intent
- **Metric Impact:** Activation rate, Day-1 retention, time-to-first-value

---

#### 1.2 Pre-Built Resume Templates by Industry

**The Problem:** Starting from a blank resume is intimidating. Users may not know what a good resume looks like for their field.

**What to Do:**
- Offer industry-specific starter templates: "Software Engineer Resume," "Marketing Manager Resume," "Nurse Resume," etc.
- Each template comes pre-filled with realistic (but editable) content for that role
- Users pick a template, customize their details, and they're done in minutes instead of hours

**Potential Win:**
- Dramatically reduces time-to-first-resume
- Users feel the product "gets" their industry
- **Metric Impact:** Resume completion rate, activation rate, user satisfaction

---

#### 1.3 "Paste a Job Link" Quick Start

**The Problem:** Users come with a specific job in mind. Make it dead simple to act on it.

**What to Do:**
- Prominent input on the dashboard: "Paste a job URL and we'll tailor your resume for it"
- Auto-extract job details, generate a tailored resume, and show a before/after comparison
- One-click apply if auto-apply is enabled

**Potential Win:**
- Captures users at their highest-intent moment
- Demonstrates AI value immediately
- **Metric Impact:** Feature adoption, conversion to paid

---

### Theme 2: Increase Retention (Keep Users Coming Back)

Job searching is episodic -- users may disappear for weeks. The goal is to stay top-of-mind and provide ongoing value.

#### 2.1 Job Alerts and Match Notifications

**The Problem:** Users set up auto-apply and then forget about the app. They only remember it when they need to check results.

**What to Do:**
- Send proactive notifications: "3 new jobs matching your profile found today"
- Weekly digest email: "Here's what happened with your applications this week"
- Push notifications for application status changes: "Your application to Google was viewed"

**Potential Win:**
- Keeps the product top-of-mind during the job search
- Drives repeat visits without user effort
- **Metric Impact:** DAU/MAU, session frequency, retention rate

---

#### 2.2 Application Tracker and Dashboard

**The Problem:** Users apply to jobs across multiple platforms and lose track. Lightforth can be their command center.

**What to Do:**
- Build a unified application tracker: all applications in one place, regardless of where they were applied
- Status columns: Saved → Applied → Interview → Offer → Rejected
- Allow manual entry for applications done outside Lightforth
- Add notes, reminders, and follow-up prompts
- Show analytics: response rate by company, average time to response, best-performing resume

**Potential Win:**
- Becomes the user's daily job search hub, not just a tool they use once
- High switching cost -- users won't leave because they'd lose their tracking data
- **Metric Impact:** Retention, session duration, feature stickiness

---

#### 2.3 Skill Gap Analysis and Learning Recommendations

**The Problem:** Users get rejected and don't know why. Lightforth can help them improve.

**What to Do:**
- Analyze job descriptions for the user's target role and identify commonly required skills they're missing
- Show a "Skill Gap Report": "You're missing these 3 skills that appear in 60% of jobs you're targeting"
- Recommend courses, certifications, or projects to close the gap (partner with Coursera, Udemy, or free resources)
- Track progress over time

**Potential Win:**
- Provides value even when users aren't actively applying
- Positions Lightforth as a career growth partner, not just a job application tool
- **Metric Impact:** Long-term retention, user engagement, potential new revenue stream (course affiliate)

---

### Theme 3: Increase Monetization (Get More Revenue Per User)

#### 3.1 Tiered Feature Unlocking (Non-Subscriber Activation)

**The Problem:** Non-subscribers receive 5 monthly credits, but may not understand what paid plans unlock or why the $10 first-month Pro activation offer is the fastest route to meaningful value.

**What to Do:**
- Audit the non-subscriber vs. paid feature split. Current structure:
  - Non-subscriber: 5 credits/month for limited testing and usage
  - Starter: $27/month for light resume and cover letter workflows
  - Pro: $49/month, with first-time $10 activation offer when active
  - Premium: $79/month for high-volume users
- Consider a "teaser" model: let non-subscribers experience one high-value AI action, then present the $10 Pro activation offer
- Add a credit progress bar: "You've used 4 of 5 monthly credits. Activate Pro for $10 to keep going."
- Offer a one-time "boost" purchase: "Need 50 more credits? ₦2,000 one-time"

**Potential Win:**
- More users experience the "wow" moment before hitting the paywall
- Lower barrier to entry with micro-transactions
- **Metric Impact:** Free-to-paid conversion rate, ARPU

---

#### 3.2 Premium Resume Review Service

**The Problem:** Some users want human expertise, not just AI.

**What to Do:**
- Offer a paid add-on: "Get your resume reviewed by a professional recruiter" (48-hour turnaround)
- Price at a premium (e.g., ₦10,000-₦20,000 per review)
- Partner with freelance recruiters or career coaches
- Deliver feedback as an annotated PDF or video

**Potential Win:**
- High-margin add-on service
- Appeals to users who don't fully trust AI
- **Metric Impact:** Revenue per user, upsell conversion

---

#### 3.3 Team/Enterprise Plan for Career Centers

**The Problem:** Universities, bootcamps, and career centers serve many job seekers but have no bulk solution.

**What to Do:**
- Create a team plan: "Equip your students with AI-powered job search tools"
- Admin dashboard: track student usage, resume quality, placement rates
- Bulk pricing: ₦X per student per month
- White-label option for institutions

**Potential Win:**
- B2B revenue stream with higher contract values
- Bulk user acquisition through institutions
- **Metric Impact:** New revenue stream, user acquisition cost reduction

---

### Theme 4: Expand the Product (New Features That Open New Markets)

#### 4.1 LinkedIn Profile Optimization

**The Problem:** Users optimize their resume but neglect their LinkedIn profile, which is equally important.

**What to Do:**
- AI-powered LinkedIn profile audit: headline, about section, experience descriptions
- Before/after suggestions with one-click copy
- "Optimize for this job" feature: tailor your LinkedIn profile for a specific role
- Profile strength score

**Potential Win:**
- Expands the product beyond resumes into full professional presence
- High perceived value -- LinkedIn is where recruiters find candidates
- **Metric Impact:** Feature adoption, user satisfaction, differentiation

---

#### 4.2 Cover Letter Generator

**The Problem:** Many jobs still require cover letters. Users hate writing them.

**What to do:**
- AI-generated cover letters tailored to specific job descriptions
- Multiple tone options: professional, creative, concise, storytelling
- One-click generate, edit, and download
- Bundle with resume tailoring: "Tailor your resume AND cover letter for this job"

**Potential Win:**
- Completes the application toolkit
- Additional credit consumption per application
- **Metric Impact:** Feature usage, credit consumption, user satisfaction

---

#### 4.3 Salary Insights and Negotiation Coach

**The Problem:** Users don't know what they should be earning and struggle with salary negotiations.

**What to do:**
- Salary data for the user's role, location, and experience level
- "Are you being underpaid?" analysis based on their current/offer salary
- AI negotiation coach: practice salary conversations, get suggested responses
- Real-time negotiation tips during offer discussions

**Potential Win:**
- High-value feature that directly impacts user's financial outcome
- Strong word-of-mouth potential ("Lightforth helped me negotiate ₦5M more")
- **Metric Impact:** User advocacy, differentiation, premium tier appeal

---

#### 4.4 Networking and Referral Finder

**The Problem:** Most jobs are filled through referrals, but users don't know who to reach out to.

**What to do:**
- Show 2nd-degree connections at companies the user is applying to (LinkedIn integration)
- Suggested outreach messages: "Hi [Name], I noticed we both went to [University]. I'm applying for [Role] at [Company] and would love to learn about your experience..."
- Track referral outreach and responses
- "Warm intro" scoring: how likely is this person to respond?

**Potential Win:**
- Tackles the #1 way people actually get jobs
- Massive differentiator -- no competitor does this well
- **Metric Impact:** User success rate, word-of-mouth growth, retention

---

### Theme 5: Trust, Credibility, and Social Proof

#### 5.1 Success Stories and Outcome Tracking

**The Problem:** Users don't know if the product actually works. They need proof.

**What to do:**
- "Where are Lightforth users working?" -- a live counter or map showing companies where users got hired
- User-submitted success stories with testimonials
- "This user got 3 interviews in 2 weeks using Auto-Apply" case studies
- Before/after resume comparisons (with permission)

**Potential Win:**
- Builds trust with skeptical users
- Powerful marketing asset for landing pages and ads
- **Metric Impact:** Conversion rate, brand trust, organic growth

---

#### 5.2 Transparency Dashboard

**The Problem:** Users don't know how auto-apply works or whether their applications are actually being submitted.

**What to do:**
- Real-time application log: "Applied to Google at 2:34 PM -- Status: Submitted"
- Show exactly what was submitted (resume version, answers to application questions)
- Error transparency: "This application failed because the form required a field we couldn't fill. Here's what to do."
- Success rate metrics: "Your applications have a 12% response rate, which is above average for your role"

**Potential Win:**
- Builds trust in the auto-apply feature
- Reduces support tickets about "did my application go through?"
- **Metric Impact:** User trust, support ticket reduction, retention

---

### Theme 6: Growth and Distribution

#### 6.1 Viral Referral Program 2.0

**The Problem:** Current referral program exists but may not be optimized for virality.

**What to do:**
- "Give 50 credits, get 50 credits" -- make the reward immediate and visible
- Referral leaderboard: "You've referred 3 friends this month. Top referrer gets a free month."
- Social sharing: "I just built my resume with Lightforth in 5 minutes" with a branded image
- Milestone rewards: "Refer 5 friends and unlock Premium for a month"

**Potential Win:**
- Low-cost user acquisition through existing users
- Network effects in job-seeking communities
- **Metric Impact:** CAC reduction, viral coefficient, new signups

---

#### 6.2 Content Marketing: Free Tools

**The Problem:** Users discover products through search. Lightforth needs SEO-friendly entry points.

**What to do:**
- Free, no-signup tools that drive traffic:
  - "ATS Resume Checker" -- paste your resume, get a score
  - "Resume Score Calculator" -- instant feedback
  - "Job Description Analyzer" -- what skills is this job really asking for?
- Each tool ends with: "Want to fix this? Try Lightforth free."

**Potential Win:**
- Organic traffic from high-intent search queries
- Top-of-funnel user acquisition without ad spend
- **Metric Impact:** Organic signups, brand awareness, SEO ranking

---

#### 6.3 Partnerships with Job Boards and Recruiters

**The Problem:** Lightforth is a tool for job seekers, but the other side of the market (employers/recruiters) is untapped.

**What to do:**
- Partner with job boards to offer "Apply with Lightforth" as a one-click option
- Build a recruiter-facing portal: "Find candidates who use Lightforth" (opt-in)
- Sponsored job placements: companies pay to be prioritized in auto-apply matching

**Potential Win:**
- Two-sided marketplace potential
- New revenue stream from employers
- **Metric Impact:** Revenue diversification, user value (more relevant jobs)

---

## Prioritization Framework

Use this to decide what to build first:

| Initiative | User Impact | Business Impact | Effort | Priority |
|-----------|-------------|-----------------|--------|----------|
| Guided Onboarding | High | High | Medium | **P0** |
| Application Tracker | High | High | Medium | **P0** |
| Job Alerts & Notifications | High | Medium | Low | **P0** |
| Cover Letter Generator | Medium | Medium | Low | **P1** |
| LinkedIn Profile Optimization | High | Medium | Medium | **P1** |
| Success Stories & Social Proof | Medium | High | Low | **P1** |
| Non-Subscriber Activation | High | High | Medium | **P1** |
| Salary Insights & Negotiation | High | High | High | **P2** |
| Skill Gap Analysis | Medium | Medium | High | **P2** |
| Networking/Referral Finder | High | High | High | **P2** |
| Premium Resume Review | Medium | High | Low | **P2** |
| Enterprise/Team Plan | Medium | High | High | **P3** |
| Free SEO Tools | Medium | High | Medium | **P3** |
| Recruiter Partnerships | High | High | High | **P3** |

---

## Suggested 90-Day Plan

### Month 1: Activation & Retention Foundation
- [ ] Guided onboarding flow
- [ ] Job alerts and match notifications
- [ ] Application tracker dashboard
- [ ] Success stories section on landing page

### Month 2: Monetization & Feature Expansion
- [ ] Cover letter generator
- [ ] LinkedIn profile optimization
- [ ] Non-subscriber activation optimization (5-credit teaser, $10 Pro activation, micro-transactions)
- [ ] Referral program 2.0

### Month 3: Trust & Growth
- [ ] Transparency dashboard for auto-apply
- [ ] Free ATS checker tool (SEO play)
- [ ] Salary insights (MVP)
- [ ] Success story collection campaign

---

## Metrics to Track

| Metric | Current | Target | Why It Matters |
|--------|---------|--------|----------------|
| Activation Rate | ? | >40% | % of signups who complete their first resume or application |
| Day-7 Retention | ? | >25% | % of users who return within 7 days |
| Non-subscriber-to-Paid Conversion | ? | >5% | % of non-subscribers who upgrade |
| ARPU | ? | Increase | Average revenue per user |
| Applications Per User | ? | >10 | How many jobs each user applies to |
| NPS | ? | >40 | Net Promoter Score |
| CAC | ? | Decrease | Cost to acquire a customer |
| Churn Rate | ? | <5% monthly | % of paying users who cancel |

---

## Questions I Need From You

1. **What's the #1 metric you're trying to move right now?** (Growth, retention, revenue, engagement?)
2. **What do users complain about most?** (Support tickets, reviews, social media)
3. **What's the live app's biggest strength?** What do users love?
4. **What's the live app's biggest weakness?** Where are you losing users?
5. **Who is your ideal customer?** (Fresh grads, mid-career, tech, non-tech, Nigeria-specific, global?)
6. **What's your current pricing and conversion rate?**
7. **Are there any features on the live app that are underperforming?**
8. **What competitors are you watching?** What are they doing that you want to match or beat?
9. **What's your team capacity?** (How many people can execute on this?)
10. **Any regulatory or market constraints?** (Nigeria-specific payment, data privacy, etc.)

---

## Notes

- This is a living document. Update it as you learn more about users and the market.
- Every initiative should tie back to a metric. If it doesn't move a metric, question whether it's worth building.
- Talk to users before building anything. The best roadmap comes from user interviews, not assumptions.
- Consider running quick experiments (landing page tests, fake door tests, concierge MVPs) before committing to full builds.
