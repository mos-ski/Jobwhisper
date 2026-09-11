import type { HelpArticle } from '../types'

export const interviewCopilotArticles: readonly HelpArticle[] = [
  {
    slug: 'what-is-interview-copilot',
    title: 'What is Interview Copilot?',
    description: 'Real-time AI support during your live interviews.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Interview Copilot provides real-time AI coaching during your actual live interview. The AI listens to the conversation and surfaces suggested answers on your screen, right when you need them.' },
      { type: 'heading', text: 'How it works', level: 2 },
      { type: 'list', ordered: true, items: [
        'Open the desktop app before your interview.',
        'Share your interview audio via browser tab, system audio, or microphone input.',
        'The AI listens and generates relevant suggestions drawn from your resume and experience.',
        'Suggestions appear only on your screen — the interviewer cannot see them.',
      ]},
      { type: 'callout', variant: 'info', text: 'Interview Copilot is a coaching tool, not a script. It surfaces the relevant point from your own experience faster than nerves let you recall it on your own.' },
    ],
  },
  {
    slug: 'is-this-cheating',
    title: 'Is using Interview Copilot cheating?',
    description: 'Why it is a coaching tool, not an unfair advantage.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Interview Copilot does not invent experiences you do not have. It draws from your own resume and experience to help you recall and articulate what you already know.' },
      { type: 'heading', text: 'What it does', level: 2 },
      { type: 'list', items: [
        'Surfaces relevant points from your resume in real time.',
        'Suggests structured ways to frame your answers.',
        'Helps you stay on track when nerves make you go blank.',
      ]},
      { type: 'heading', text: 'What it does not do', level: 2 },
      { type: 'list', items: [
        'Generate fake answers or experiences.',
        'See or hear the interviewer — it only processes your audio.',
        'Record or store your interview without your explicit consent.',
      ]},
      { type: 'paragraph', text: 'Think of it as having a career coach whispering reminders — except the coach already knows your background because it is based on your own resume.' },
    ],
  },
  {
    slug: 'setting-up-copilot',
    title: 'Setting up Interview Copilot',
    description: 'System requirements, permissions, and audio setup.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Interview Copilot runs on the desktop app (Mac or Windows). Here is what you need to set up before your first live interview.' },
      { type: 'heading', text: 'System requirements', level: 2 },
      { type: 'list', items: [
        'Desktop app — download from your Account > Downloads page.',
        'A modern browser (Chrome recommended) for the interview call.',
        'A working microphone.',
        'Stable internet connection.',
      ]},
      { type: 'heading', text: 'Audio sources', level: 2 },
      { type: 'list', items: [
        'Browser tab audio — for Zoom, Google Meet, Teams, etc.',
        'System audio — captures all audio from your computer.',
        'Microphone input — for phone interviews routed through the app.',
      ]},
      { type: 'callout', variant: 'warning', text: 'Always run a 2-minute test before your real interview. Go to Interview Copilot > Configure and run the test to confirm audio is being captured correctly.' },
    ],
  },
  {
    slug: 'does-copilot-work-for-phone-interviews',
    title: 'Does Copilot work for phone interviews?',
    description: 'Audio sources for phone and video calls.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Yes. Interview Copilot works for both phone and video interviews. The key is how you route the audio to the desktop app.' },
      { type: 'heading', text: 'Audio routing options', level: 2 },
      { type: 'list', items: [
        'Video calls (Zoom, Meet, Teams) — share the browser tab running the call.',
        'Phone calls — route the call through the desktop app\'s microphone input, or use speaker + microphone if the call is on your phone.',
        'System audio — capture all audio from your computer if you are on a laptop or desktop.',
      ]},
      { type: 'paragraph', text: 'The AI only processes the interview audio to generate suggestions. It does not send audio anywhere else.' },
    ],
  },
]
