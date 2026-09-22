import type { HelpArticle } from '../types'

export const troubleshootingArticles: readonly HelpArticle[] = [
  {
    slug: 'browser-requirements',
    title: 'Browser and system requirements',
    description: 'What you need for the web app, and what the desktop app adds.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Most of Jobwhisper runs in a browser. Live interview support is the part with real requirements, because it is capturing and processing audio while you are talking.' },

      { type: 'heading', text: 'Supported browsers', level: 2 },
      { type: 'list', items: [
        'Google Chrome, latest version — recommended, and the best tested for tab audio capture.',
        'Microsoft Edge, latest version — Chromium-based, so it behaves much like Chrome.',
        'Mozilla Firefox, latest version.',
        'Apple Safari, latest version.',
      ]},
      { type: 'paragraph', text: 'Chrome is the recommendation specifically because of audio. Tab capture is the most reliable Copilot source, and Chrome\'s implementation is the one we test against most closely. Resume Builder and Auto Apply work equally well anywhere.' },

      { type: 'heading', text: 'Connection and hardware', level: 2 },
      { type: 'list', items: [
        'A stable connection. 10 Mbps or better is comfortable for Interview Copilot.',
        'A working microphone for Interview Prep and Copilot.',
        'The desktop app, on macOS or Windows, for live interview coaching with system audio.',
      ]},

      { type: 'heading', text: 'Why connection stability matters more than speed', level: 3 },
      { type: 'paragraph', text: 'Copilot is processing speech as it happens, so a connection that drops for two seconds loses two seconds of the question. A stable 10 Mbps link is better than an intermittent 200 Mbps one. If you have the option, use a wired connection or sit close to the router for an interview.' },

      { type: 'heading', text: 'Desktop app availability', level: 2 },
      { type: 'list', items: [
        'macOS — Apple Silicon and Intel builds.',
        'Windows.',
        'Linux — not yet available.',
        'iOS and Android — not yet available.',
      ]},
      { type: 'paragraph', text: 'Download links are under Download Apps in your account. The desktop app requires Pro or above; Copilot on the web is on every plan.' },

      { type: 'callout', variant: 'tip', text: 'Ad blockers and privacy extensions are the most common cause of a feature that silently does nothing. If something will not load or a button does nothing, try a private window first — it rules extensions in or out in one step.' },
    ],
  },

  {
    slug: 'common-issues',
    title: 'Common issues and fixes',
    description: 'The problems people actually report, in the order they are worth checking.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Grouped by where the problem shows up, with the likeliest cause first in each list.' },

      { type: 'heading', text: 'Copilot is not hearing the interview', level: 2 },
      { type: 'paragraph', text: 'The most reported issue, and nearly always audio routing rather than a fault. Work down this list in order.' },
      { type: 'list', ordered: true, items: [
        'Wrong source for the call. Tab audio only works for a call in a browser tab; a desktop Zoom or Teams client needs system audio.',
        'The wrong tab. Tab capture is per tab — check you selected the one with the call in it.',
        'Share-audio not ticked. When you pick a tab, the option to share its audio must be checked, and it defaults to off in some browsers.',
        'macOS permission not applied. Grant screen recording under Privacy & Security, then fully quit and reopen the app — some versions will not pick it up until a restart.',
        'Bluetooth headphones. If the interviewer\'s audio goes straight to your headset, system capture may never see it. Test with the setup you will actually use.',
      ]},
      { type: 'paragraph', text: 'If the transcript is filling in, routing is correct and any remaining problem is elsewhere.' },

      { type: 'heading', text: 'Suggestions are slow or off-topic', level: 2 },
      { type: 'list', items: [
        'A thin Knowledge Base. Copilot can only surface what you gave it — if your material is a resume alone, answers will stay at resume depth.',
        'No job description on the session. Without it, Copilot is guessing at the role and the seniority.',
        'An unstable connection, which shows up as lag rather than as an error.',
        'Crosstalk. Where several people speak at once, transcription degrades and so does relevance.',
      ]},

      { type: 'heading', text: 'The tailored resume looks wrong', level: 2 },
      { type: 'list', items: [
        'A thin source resume. Tailoring can reorder and rephrase, but it cannot recover detail you never included.',
        'A vague job description. A title alone produces generic output — paste the whole posting.',
        'A tailored version used as the source. Always tailor from your clean base resume; repeated passes drift.',
        'Stale output after editing your base. Re-run tailoring; existing versions do not update themselves.',
      ]},

      { type: 'heading', text: 'No Auto Apply matches', level: 2 },
      { type: 'list', ordered: true, items: [
        'Location radius too tight — usually the single biggest constraint.',
        'Salary floor above the market for the roles you are targeting.',
        'Over-specific role titles. "Staff Platform Engineer" matches far less than "Platform Engineer".',
        'Too many stacked non-negotiables. Relax one at a time so you can see which one was doing the damage.',
      ]},

      { type: 'heading', text: 'A blank page or a feature that does nothing', level: 2 },
      { type: 'list', ordered: true, items: [
        'Open a private window. This rules extensions in or out immediately.',
        'If that works, disable extensions one at a time — ad and script blockers first.',
        'Clear your cache, which handles a stale build after an update.',
        'Check your connection.',
      ]},

      { type: 'heading', text: 'Credits look wrong', level: 2 },
      { type: 'list', items: [
        'Check which balance you are reading. Interview minutes and job-search credits are separate and shown separately.',
        'Job-search credits expire 30 days after purchase.',
        'Interview credits refresh on your billing date, not on the first of the month.',
        'Practice sessions spend the same credits as live interviews, which surprises people mid-month.',
      ]},

      { type: 'callout', variant: 'warning', text: 'If an interview is imminent and audio is not working, use Copilot on the web in a browser tab rather than debugging the desktop app. It is the fastest route to something functioning, and you can sort the desktop setup out afterwards.' },
    ],
  },

  {
    slug: 'contacting-support',
    title: 'Contacting support',
    description: 'How to reach us, and what to include so the first reply is useful.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'If the help centre does not cover it, contact us directly. A little detail up front usually saves a round trip.' },

      { type: 'heading', text: 'Channels', level: 2 },
      { type: 'list', items: [
        'Email — support@jobwhisper.org, answered within 24 hours on business days.',
        'In-app — the Support option in the app, which attaches your account details automatically.',
      ]},
      { type: 'paragraph', text: 'Premium includes priority support with faster response times.' },

      { type: 'heading', text: 'What to include', level: 2 },
      { type: 'list', items: [
        'The email address on your account.',
        'What you expected to happen and what happened instead.',
        'The steps that produce it, if it is reproducible.',
        'Your browser and operating system, for anything involving audio or the desktop app.',
        'A screenshot or short recording. Optional, and it often removes a whole exchange.',
      ]},

      { type: 'heading', text: 'If an interview is imminent', level: 2 },
      { type: 'paragraph', text: 'Say so in the subject line. Support cannot always turn around inside the hour, so also try the fallback: Copilot on the web in a browser tab, which sidesteps every desktop-app and system-permission problem. Get through the interview first and debug afterwards.' },

      { type: 'heading', text: 'Billing questions', level: 2 },
      { type: 'paragraph', text: 'Include the charge date and amount. For a refund request, send it within the 14-day window — the date of your message is what counts, so write first and supply details after if you are close to the deadline.' },

      { type: 'callout', variant: 'tip', text: 'Telling us which help article you already tried is genuinely useful. It skips the suggestions you have ruled out, and it tells us where the documentation is unclear.' },
    ],
  },

  {
    slug: 'privacy-and-security',
    title: 'Privacy and security',
    description: 'How your career material and interview audio are handled.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'A Jobwhisper account holds your full work history, the applications you have sent, and audio from real interviews. That is sensitive material and it is worth being specific about how it is treated.' },

      { type: 'heading', text: 'Encryption', level: 2 },
      { type: 'list', items: [
        'In transit — TLS 1.3.',
        'At rest — AES-256.',
      ]},

      { type: 'heading', text: 'How your data is used', level: 2 },
      { type: 'list', items: [
        'We do not sell your data.',
        'We do not use your resumes, applications, or interview data to train AI models.',
        'AI suggestions are generated in real time through third-party model providers under data-processing agreements.',
        'Payments are handled by Stripe. Card details do not reach our servers.',
      ]},

      { type: 'heading', text: 'Interview audio', level: 2 },
      { type: 'paragraph', text: 'Audio is processed as the interview happens, to work out what is being asked and what to surface from your material. It is not retained afterwards unless you deliberately turn on session recording.' },
      { type: 'paragraph', text: 'Recording a conversation has legal implications that vary by country and, in the United States, by state — some require the consent of everyone present. If you enable recording, that is on you to get right.' },

      { type: 'heading', text: 'What the interviewer can see', level: 2 },
      { type: 'paragraph', text: 'Copilot runs on your machine and renders only on your screen. It does not join the call, appear in the participant list, or transmit anything to the interviewer.' },
      { type: 'paragraph', text: 'Screen sharing is the exception worth knowing: if you share your entire screen, anything visible is visible. Share a specific window or tab instead, and check the preview before you confirm.' },

      { type: 'heading', text: 'Your rights', level: 2 },
      { type: 'list', items: [
        'Export everything from Settings at any time.',
        'Delete your account and its data — processed within 30 days.',
        'GDPR and CCPA compliant.',
      ]},

      { type: 'callout', variant: 'info', text: 'For the current legal text, see the Privacy Policy and Terms of Service. This article describes how the product works in practice; those documents are the binding version.' },
    ],
  },
]
