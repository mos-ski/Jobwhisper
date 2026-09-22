import type { HelpArticle } from '../types'

export const interviewCopilotArticles: readonly HelpArticle[] = [
  {
    slug: 'what-is-interview-copilot',
    title: 'What is Interview Copilot?',
    description: 'Live support during a real interview — what it shows you and what it will not.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Interview Copilot runs alongside a live interview. It follows the conversation, works out what is being asked, and puts the relevant material from your own background on your screen while you are answering.' },

      { type: 'heading', text: 'How it works', level: 2 },
      { type: 'list', ordered: true, items: [
        'Open Copilot before the call starts and select your session.',
        'Point it at the interview audio — a browser tab, system audio, or your microphone.',
        'As the interviewer speaks, Copilot identifies the question and surfaces the points from your resume and Knowledge Base that answer it.',
        'You read, pick what is relevant, and answer in your own words.',
      ]},

      { type: 'heading', text: 'What it is for', level: 2 },
      { type: 'paragraph', text: 'The problem it solves is recall under pressure, not knowledge. You know your own career. Under interview conditions people routinely forget the project that perfectly answers the question and remember it in the car afterwards. Copilot closes that gap by putting your own history in front of you at the moment it is relevant.' },

      { type: 'heading', text: 'What it will not do', level: 2 },
      { type: 'list', items: [
        'Write a script for you to read. Suggestions are points and structure, not sentences to recite.',
        'Invent experience. It works from your resume and Knowledge Base, so it can only surface what is actually yours.',
        'Show anything to the interviewer. It runs on your machine and displays only on your screen.',
        'Answer for you. There is no automated speech — you do the talking.',
      ]},

      { type: 'heading', text: 'Using it well', level: 2 },
      { type: 'paragraph', text: 'The most common mistake is reading the screen instead of talking to the person. That is visible — the eye movement, the flattened delivery, the sudden fluency mid-sentence. Glance, take the point, then look back at the camera and say it your own way.' },
      { type: 'list', items: [
        'Take the prompt, not the wording. A remembered fact delivered naturally beats a read-out sentence.',
        'Position the window near your camera so your eyeline barely moves.',
        'A pause is fine. "Let me think about that for a second" is normal interview behaviour and buys you a glance.',
        'Practise with it in Interview Prep first, so the reflex of glancing is already familiar on the day.',
      ]},

      { type: 'heading', text: 'Where it runs', level: 2 },
      { type: 'paragraph', text: 'Copilot on the web is available on every interview plan. The desktop app — which is what you need for system audio capture and for Coding and Meeting Copilot — is on Pro and above.' },

      { type: 'callout', variant: 'info', text: 'Live Copilot minutes come out of your monthly credits at one credit per minute. A 45-minute interview costs 45 credits, so Starter\'s 500 credits cover roughly ten hour-long interviews a month.' },
    ],
  },

  {
    slug: 'is-this-cheating',
    title: 'Is using Interview Copilot cheating?',
    description: 'An honest answer, including where the line is and where people disagree.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'This is the most common question we get and it deserves a straight answer rather than reassurance.' },

      { type: 'heading', text: 'The short version', level: 2 },
      { type: 'paragraph', text: 'Copilot surfaces your own experience from your own resume at the moment it is relevant. It does not know anything about you that you did not tell it, and it cannot manufacture a qualification you lack. If you use it that way, you are being assessed on your real background — which is what the interview is for.' },

      { type: 'heading', text: 'What it does', level: 2 },
      { type: 'list', items: [
        'Surfaces relevant points from material you supplied.',
        'Suggests a structure when a question is broad and you are unsure where to start.',
        'Gives you something to hold onto when nerves cause a blank.',
      ]},

      { type: 'heading', text: 'What it does not do', level: 2 },
      { type: 'list', items: [
        'Generate experience, employers, or results you did not have.',
        'Watch or hear the interviewer independently — it processes only the audio you route to it.',
        'Record or store your interview without you explicitly choosing to.',
        'Feed you answers to a test you were asked to complete unaided.',
      ]},

      { type: 'heading', text: 'Where the line actually is', level: 2 },
      { type: 'paragraph', text: 'Being straightforward about this is more useful than a blanket reassurance. Using Copilot to recall your own project is support. Using it to appear to hold knowledge you do not have is misrepresentation, and it does not survive contact with the job. Two specific cases are worth calling out.' },
      { type: 'list', items: [
        'If an employer states that an assessment must be completed without assistance, that instruction applies. A supervised or proctored test is not the place for it.',
        'If a suggestion refers to something you cannot speak to in your own words, do not use it. An answer you cannot defend under a follow-up is worse than admitting you have not done that yet.',
      ]},

      { type: 'heading', text: 'Why we think it is defensible', level: 2 },
      { type: 'paragraph', text: 'Interviews test recall under stress as much as ability, and that is largely incidental to the job. Almost no role requires you to recall a three-year-old project instantly with no notes. Candidates who interview often are better at this than candidates who are good at the work, and that gap is not something employers actually want to select on. Closing it with your own material is, in our view, correcting a distortion rather than creating one.' },
      { type: 'paragraph', text: 'Reasonable people disagree. That is the case we would make, and you should make your own judgement about any particular employer and format.' },

      { type: 'callout', variant: 'info', text: 'Copilot displays only on your machine and is not visible in screen sharing when you share a specific window or tab rather than the whole screen. Check what you are about to share before you share it.' },
    ],
  },

  {
    slug: 'setting-up-copilot',
    title: 'Setting up Interview Copilot',
    description: 'Requirements, audio routing, permissions, and the test run that prevents most problems.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Audio routing is the only genuinely fiddly part of Copilot, and it varies by operating system and meeting platform. Fifteen minutes of setup before your first real interview prevents nearly every problem people write to us about.' },

      { type: 'heading', text: 'What you need', level: 2 },
      { type: 'list', items: [
        'The desktop app for macOS or Windows, from Download Apps in your account. System audio capture and the Coding and Meeting Copilots need the desktop app.',
        'A Pro plan or above for the desktop app. Copilot on the web is available on every plan.',
        'A modern browser for the call itself — Chrome is the best tested.',
        'A working microphone and a stable connection. 10 Mbps or better is comfortable.',
      ]},

      { type: 'heading', text: 'Choosing an audio source', level: 2 },
      { type: 'paragraph', text: 'Copilot needs to hear the interviewer. How you deliver that depends on where the call is happening.' },
      { type: 'list', items: [
        'Browser tab audio — for Zoom, Google Meet, or Teams running in a browser tab. The most reliable option, and the narrowest: it captures only that tab.',
        'System audio — captures everything your computer plays. Use it when the call runs in a desktop client rather than a browser. On macOS this needs a screen-recording permission, which the app will prompt for.',
        'Microphone input — for a phone interview on speaker, where your mic picks up both sides.',
      ]},

      { type: 'heading', text: 'Permissions', level: 2 },
      { type: 'paragraph', text: 'macOS asks for permission the first time and, depending on your version, may require the app to be restarted before the grant takes effect. Grant it in System Settings under Privacy & Security, then quit and reopen the app. If audio capture silently produces nothing, an ungranted or un-restarted permission is the first thing to check.' },

      { type: 'heading', text: 'The test run', level: 2 },
      { type: 'list', ordered: true, items: [
        'Open Interview Copilot and go to Configure.',
        'Select the audio source you plan to use on the day.',
        'Start a two-minute test and play something with speech — any video with talking will do.',
        'Confirm the transcript is filling in. If words are appearing, the routing is correct.',
        'Check that suggestions are appearing and that the window sits where you want it relative to your camera.',
      ]},

      { type: 'callout', variant: 'warning', text: 'Run the test on the platform you will actually use. Zoom in a browser tab and Zoom in the desktop client need different audio sources, so a successful test on one proves nothing about the other.' },

      { type: 'heading', text: 'If the transcript stays empty', level: 2 },
      { type: 'list', items: [
        'Wrong source — tab audio selected for a call running in a desktop client is the most common cause.',
        'Wrong tab — tab capture is per tab, so check you picked the one with the call in it.',
        'Share-audio unchecked — when sharing a tab, the "share tab audio" checkbox must be ticked.',
        'Permission not applied — grant it, then fully quit and reopen the app.',
        'Output routed elsewhere — if your audio is going to headphones over Bluetooth, system capture may not see it. Test with your actual setup.',
      ]},
    ],
  },

  {
    slug: 'does-copilot-work-for-phone-interviews',
    title: 'Does Copilot work for phone interviews?',
    description: 'Routing audio for phone screens, and the trade-offs of each approach.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Yes, with a caveat: phone audio is harder to capture cleanly than a browser call, because the sound has to reach your computer somehow. It works, and it needs a little more setup.' },

      { type: 'heading', text: 'Options for a phone call', level: 2 },
      { type: 'list', items: [
        'Speaker plus microphone — put the call on speaker and let your computer\'s microphone hear the room. Simplest, works everywhere, and quality depends on the room.',
        'A computer-based dialler — if the interviewer calls through a service that runs in a browser, capture that tab and you get the same clean audio as a video call.',
        'System audio — if the call routes through your computer at all, this captures it directly.',
      ]},

      { type: 'heading', text: 'Getting speakerphone to work well', level: 3 },
      { type: 'paragraph', text: 'It is the fallback most people end up using, and a few things make the difference between a usable transcript and a useless one.' },
      { type: 'list', items: [
        'Quiet room, phone close to the computer microphone, volume higher than feels natural.',
        'Hard surface rather than a soft one — a desk beats a sofa arm.',
        'Do not wear headphones. If the interviewer\'s voice goes into your ear, your computer cannot hear it.',
        'Test with a real call first. Ring a friend and check the transcript fills in before you rely on it.',
      ]},

      { type: 'heading', text: 'Video calls', level: 2 },
      { type: 'paragraph', text: 'Zoom, Meet, and Teams are all straightforward. In a browser, capture the tab and tick the option to share its audio. In a desktop client, use system audio.' },

      { type: 'heading', text: 'What gets sent', level: 2 },
      { type: 'paragraph', text: 'Copilot processes the interview audio to work out what is being asked and what to surface from your material. It is not sent anywhere else and it is not recorded unless you choose to record the session yourself.' },

      { type: 'callout', variant: 'tip', text: 'For a first-round phone screen, Interview Prep is often the better tool. Phone screens are largely predictable — motivation, background, salary expectations — and rehearsing them beats fighting speakerphone audio on the day.' },
    ],
  },

  {
    slug: 'coding-and-meeting-copilot',
    title: 'Coding Copilot and Meeting Copilot',
    description: 'The two specialised Copilots on Pro and above, and when each one helps.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Alongside the interview Copilot, Pro and Premium include two variants tuned for situations where general interview support is the wrong shape. Both run in the desktop app.' },

      { type: 'heading', text: 'Coding Copilot', level: 2 },
      { type: 'paragraph', text: 'For technical interviews with a live coding or system-design component. It follows the problem as it is described and helps with approach and reasoning rather than producing a finished solution.' },
      { type: 'list', items: [
        'Suggests a way into the problem when the opening is the hard part.',
        'Prompts you on complexity, edge cases, and the trade-offs an interviewer usually probes for.',
        'Helps you narrate your thinking, which is often the actual assessment.',
      ]},
      { type: 'paragraph', text: 'Technical interviewers are generally evaluating how you reason, not whether you can produce optimal code silently. Support aimed at the explanation is worth more here than support aimed at the answer.' },

      { type: 'heading', text: 'Meeting Copilot', level: 2 },
      { type: 'paragraph', text: 'For conversations that are not quite interviews: a recruiter catch-up, a hiring manager chat, a negotiation, a team meet-and-greet. It follows the discussion and keeps notes and talking points to hand.' },
      { type: 'list', items: [
        'Surfaces the points you wanted to raise, so they do not get lost when the conversation moves.',
        'Keeps a record of what was discussed and agreed.',
        'Useful in salary conversations, where having your own numbers in front of you matters.',
      ]},

      { type: 'heading', text: 'Which to use', level: 2 },
      { type: 'list', items: [
        'A structured interview about your background — Interview Copilot.',
        'Anything where you will write or design code live — Coding Copilot.',
        'A two-way conversation where you also have an agenda — Meeting Copilot.',
      ]},

      { type: 'callout', variant: 'info', text: 'Both are included on Pro and Premium and both need the desktop app. They draw on the same credit balance as Interview Copilot, at one credit per minute.' },
    ],
  },

  {
    slug: 'knowledge-base',
    title: 'Using the Knowledge Base',
    description: 'Giving Copilot the material your resume leaves out.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Your resume is compressed by design — a decade of work in two pages. The Knowledge Base is where you put the detail that does not fit, so Copilot has something to draw on when an interviewer asks a question a resume bullet cannot answer.' },

      { type: 'heading', text: 'What to put in it', level: 2 },
      { type: 'list', items: [
        'Detailed project write-ups: what the problem was, what you did, what the result was, what you would change.',
        'Portfolio pieces, case studies, or published work.',
        'A longer-form career history covering roles compressed to a single line on the resume.',
        'Notes on the specific employer — their product, the team, why you want this job.',
        'Your own numbers for a salary conversation.',
      ]},

      { type: 'heading', text: 'How many documents you get', level: 2 },
      { type: 'list', items: [
        'Starter — 3 documents.',
        'Pro — 5 documents.',
        'Premium — 10 documents.',
      ]},

      { type: 'heading', text: 'Working within the limit', level: 3 },
      { type: 'paragraph', text: 'These limits are lower than they sound, because a document can be long. One well-organised document covering six projects is more useful than six thin ones, and it leaves slots free for employer-specific notes. Treat a slot as a topic, not as a file.' },

      { type: 'heading', text: 'Writing documents Copilot can use', level: 2 },
      { type: 'paragraph', text: 'The Knowledge Base is searched live, mid-conversation, while you are waiting to speak. Structure matters more than polish.' },
      { type: 'list', items: [
        'Use clear headings. They are how the right passage gets found quickly.',
        'Lead each section with the point. Copilot surfaces the opening, so context-then-conclusion buries what you need.',
        'Include the concrete details — numbers, technologies, timelines. Those are what you will be asked for.',
        'Write in your own voice, so anything surfaced already sounds like you.',
      ]},

      { type: 'callout', variant: 'tip', text: 'Before a specific interview, swap in a document about that employer and that role. It is the single highest-value thing in the Knowledge Base on the day, and far more useful than a generic document you never refresh.' },
    ],
  },
]
