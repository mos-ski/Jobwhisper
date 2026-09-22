import type { HelpArticle } from '../types'

export const gettingStartedArticles: readonly HelpArticle[] = [
  {
    slug: 'what-is-jobwhisper',
    title: 'What is Jobwhisper?',
    description: 'What the platform does, how the pieces fit together, and who it is for.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Jobwhisper is a career platform built around one idea: the hard part of a job search is not finding openings, it is getting through the stages that follow. Most tools stop at the application. Jobwhisper stays with you from the first tailored resume through to the live interview where the offer is actually decided.' },

      { type: 'heading', text: 'The four tools', level: 2 },
      { type: 'paragraph', text: 'Each tool solves a different stage of the search. You can use them together or on their own — they share your profile and resume, so work you do in one carries into the next.' },
      { type: 'list', items: [
        'Resume Builder — rewrites your existing resume against a specific job description, scores it for ATS compatibility, and exports in PDF, Word, or plain text.',
        'Auto Apply — finds roles that match your preferences, prepares each application, and submits it once you approve.',
        'Interview Prep — an AI interviewer that asks role-appropriate questions and returns a written performance report.',
        'Interview Copilot — live support during a real interview, surfacing the right point from your own background while the conversation is happening.',
      ]},

      { type: 'heading', text: 'Why it is built this way', level: 2 },
      { type: 'paragraph', text: 'Two design decisions shape everything else, and they explain most of what people find surprising about the product.' },

      { type: 'heading', text: 'Nothing is sent without your approval', level: 3 },
      { type: 'paragraph', text: 'Auto Apply could technically fire off hundreds of applications unattended. It does not. Every match is shown to you with its tailored resume before anything is submitted, because an application sent in your name is your reputation, not ours. This is slower than full automation and that is the intended trade-off.' },

      { type: 'heading', text: 'The AI works from your material, not from invention', level: 3 },
      { type: 'paragraph', text: 'Resume Builder rewrites what you already did; it does not add jobs you never held. Interview Copilot surfaces things from your own resume and Knowledge Base; it does not fabricate a project to impress an interviewer. This is a deliberate limit. A resume that wins an interview on invented experience fails at the interview, and an answer you cannot defend is worse than a pause.' },

      { type: 'heading', text: 'Who it is for', level: 2 },
      { type: 'list', items: [
        'Active job seekers running a search alongside a current job, who need the admin work to take less of the evening.',
        'Career changers whose experience is relevant but does not read that way to a recruiter scanning for keywords.',
        'Recent graduates with real projects and little idea how to frame them for a hiring manager.',
        'Experienced candidates who interview rarely and are out of practice at talking about their own work.',
      ]},

      { type: 'heading', text: 'What Jobwhisper does not do', level: 2 },
      { type: 'paragraph', text: 'Worth knowing before you start, so the tool matches your expectations:' },
      { type: 'list', items: [
        'It does not guarantee a specific employer will interview you. Nobody can promise that.',
        'It does not apply on your behalf without review, and it will not fill in answers to employer screening questions it cannot verify from your profile.',
        'It does not write experience you do not have into your resume.',
        'It is not a recruiter and does not have inside contacts at employers.',
      ]},

      { type: 'callout', variant: 'info', text: 'Jobwhisper was previously called Lightforth. Same team and same product line — the name changed, and older links and emails may still use the old one.' },
    ],
  },

  {
    slug: 'how-to-create-an-account',
    title: 'How to create an account',
    description: 'Signing up, verifying your email, and what to have ready first.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Signing up takes a couple of minutes. Having your current resume to hand makes the rest of the setup much faster, because almost everything else in Jobwhisper is built on top of it.' },

      { type: 'heading', text: 'Steps', level: 2 },
      { type: 'list', ordered: true, items: [
        'Go to jobwhisper.org and choose Get started.',
        'Enter your email and a password, or continue with Google.',
        'Verify your email — we send a link, and the account stays limited until you use it.',
        'Complete your profile: name, the role you are targeting, and the locations you would work in.',
        'Upload your existing resume. Any recent version is fine; it does not need to be polished.',
      ]},

      { type: 'heading', text: 'Why we ask for a resume up front', level: 3 },
      { type: 'paragraph', text: 'Your resume is the source material for everything else. Resume Builder rewrites from it, Auto Apply submits versions of it, Interview Prep asks questions about it, and Interview Copilot draws its suggestions from it. An account without one can still browse, but every feature will be working from nothing.' },

      { type: 'heading', text: 'Signing in with Google', level: 2 },
      { type: 'paragraph', text: 'Google sign-in skips the password and the verification email, since Google has already confirmed the address. If you start with a password and later want to use Google, sign in with Google using the same email address and the accounts connect automatically.' },

      { type: 'heading', text: 'If the verification email does not arrive', level: 2 },
      { type: 'list', items: [
        'Check spam and, in Gmail, the Promotions tab.',
        'Confirm the address you typed — a typo here is the most common cause.',
        'Wait two minutes before requesting a new link; each new request invalidates the previous one, so requesting repeatedly can leave you clicking a dead link.',
        'On a work address, a corporate filter may be holding it. A personal address is usually the faster fix.',
      ]},

      { type: 'callout', variant: 'tip', text: 'New accounts include free credits so you can try Interview Prep and Resume Builder before paying for anything. No card is required to sign up.' },
    ],
  },

  {
    slug: 'choosing-a-plan',
    title: 'Choosing a plan',
    description: 'Subscriptions, pay-as-you-go credits, and which one matches your search.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Jobwhisper charges in two different ways, and picking the right one matters more than picking the right tier. Interview tools run on a subscription; Resume Builder and Auto Apply are prepaid and need no subscription at all.' },

      { type: 'heading', text: 'Interview plans (subscription)', level: 2 },
      { type: 'paragraph', text: 'These cover Interview Prep and the live Copilot. Included credits are measured in minutes — one credit is one interview minute — and they refresh each billing cycle.' },
      { type: 'list', items: [
        'Starter — $47/month. 500 credits. Interview Prep and Interview Copilot on the web, Knowledge Base with 3 documents.',
        'Pro — $99/month. 1,000 credits. Everything in Starter, plus the desktop app, Coding Copilot, Meeting Copilot, and a 5-document Knowledge Base.',
        'Premium — $497/month. 4,000 credits. Everything in Pro, plus priority support and a 10-document Knowledge Base.',
      ]},
      { type: 'paragraph', text: 'Annual billing saves 20% on all three. Switch the toggle on the pricing page to see the annual rate before you commit.' },

      { type: 'heading', text: 'Job-search credits (pay as you go)', level: 2 },
      { type: 'paragraph', text: 'Resume Builder and Auto Apply are not part of the subscription. They run on prepaid balances you top up when you need them, which means you can use them during an active search and stop paying entirely when you are not looking.' },
      { type: 'list', items: [
        'Resume Builder — $0.10 per AI prompt, from $5. ATS scoring is free and downloads are unlimited.',
        'Auto Apply — $1 per successful application, from $10. You are charged only when an application actually goes through.',
      ]},

      { type: 'heading', text: 'How to choose', level: 2 },
      { type: 'paragraph', text: 'The useful question is not which tier is best, it is how much live interviewing you expect this month.' },
      { type: 'list', items: [
        'Applying but not interviewing yet — skip the subscription. Buy job-search credits and come back for a plan when interviews start landing.',
        'One or two interviews a month, on the web — Starter. 500 minutes is more than most people use.',
        'Interviewing regularly, or technical roles — Pro. The desktop app and Coding Copilot are the reason to move up, more than the extra credits.',
        'Interviewing constantly, or running long panels — Premium. 4,000 minutes and priority support.',
      ]},

      { type: 'callout', variant: 'tip', text: 'Start lower than you think you need. Upgrades apply immediately and are prorated, so moving up mid-month costs only the difference — there is no penalty for guessing low.' },

      { type: 'heading', text: 'Done For You', level: 2 },
      { type: 'paragraph', text: 'A separate, one-time managed service rather than a plan. A success manager runs the search for you — scouting roles, tailoring the resume, and submitting applications — until you reach a set number of interview invitations. See the Done For You section on the pricing page for current packages.' },
    ],
  },

  {
    slug: 'your-first-job-search',
    title: 'Your first job search',
    description: 'A realistic first week, and the order that gets results fastest.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'The most common mistake in the first week is starting with Auto Apply. Volume early feels productive and is usually wasted, because the resume going out has not been tested against a real posting yet. This order fixes that.' },

      { type: 'heading', text: 'Day 1 — get one application genuinely right', level: 2 },
      { type: 'list', ordered: true, items: [
        'Upload your resume and paste in a real job description for a role you would actually take.',
        'Read the tailored version against the original. Where it is wrong, correct it — you are teaching the tool your voice as much as producing a document.',
        'Check the ATS score, then fix what it flags. Anything above 80 is strong.',
        'Download it and read it once on paper or full screen. Typos survive on-screen review.',
      ]},
      { type: 'paragraph', text: 'One resume you trust is worth more than twenty you have not read, and every later tailored version starts from this improved base.' },

      { type: 'heading', text: 'Days 2–3 — widen the funnel', level: 2 },
      { type: 'list', ordered: true, items: [
        'Set Auto Apply preferences: target roles, locations, salary floor, and any non-negotiables.',
        'Review the first batch of matches properly. Reject the ones that are wrong — rejections cost nothing and they sharpen later matching.',
        'Approve a small first batch rather than everything, so you can see the quality of what goes out.',
        'Run one Interview Prep session for the role you most want, even if nothing is scheduled. It is easier to discover a weak answer now than on a call.',
      ]},

      { type: 'heading', text: 'Days 4–7 — prepare for the calls', level: 2 },
      { type: 'list', ordered: true, items: [
        'Check application status on your dashboard and adjust filters based on what came back.',
        'Add your key documents to the Knowledge Base so Copilot can reference them live.',
        'If an interview is booked, install the desktop app and run a two-minute Copilot test on the platform you will actually use.',
        'Run a second Interview Prep session focused on whatever your first report marked as weakest.',
      ]},

      { type: 'callout', variant: 'warning', text: 'Do not let your first use of Interview Copilot be a real interview. Audio routing is the one part that varies by machine and meeting platform, and a two-minute test beforehand is the difference between it working and it not.' },

      { type: 'heading', text: 'If matches are not appearing', level: 2 },
      { type: 'paragraph', text: 'Almost always over-narrow filters. Relax one constraint at a time — usually location radius or salary floor first — so you can see which one was doing the damage. Changing everything at once tells you nothing.' },
    ],
  },
]
