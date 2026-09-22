import type { HelpArticle } from '../types'

export const interviewPrepArticles: readonly HelpArticle[] = [
  {
    slug: 'how-mock-interviews-work',
    title: 'How AI mock interviews work',
    description: 'Running a practice session, reading the report, and what practice actually fixes.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Interview Prep is a rehearsal with an AI interviewer that has read your resume and the posting. It asks, you answer out loud or in writing, it follows up, and afterwards you get a written report on how the answers landed.' },

      { type: 'heading', text: 'Starting a session', level: 2 },
      { type: 'list', ordered: true, items: [
        'Pick the resume to practise against — ideally the exact version you sent this employer.',
        'Add the target role: job description if you have it, company and title if you do not.',
        'Choose the interview type: behavioural, technical, case study, or general.',
        'Answer as you would on the day. Speaking aloud is worth more than typing, because the gap between knowing an answer and saying it is the thing practice closes.',
      ]},

      { type: 'heading', text: 'Answer out loud if you can', level: 3 },
      { type: 'paragraph', text: 'Typed answers get edited as you write them — you reorder a clause, you cut a tangent, and the result is better than what you would actually say. Speaking surfaces the real problems: the rambling opening, the story with no ending, the filler while you think. Those are the things a real interviewer hears.' },

      { type: 'heading', text: 'The report', level: 2 },
      { type: 'paragraph', text: 'After the session you get a written report covering what worked, what did not, per-answer quality scores, and specific suggestions for each question. It is meant to be read against the transcript rather than on its own.' },
      { type: 'list', items: [
        'Strengths — the answers that landed, so you can reuse the structure elsewhere.',
        'Weak points — vague claims, missing results, answers that never reached a conclusion.',
        'Per-question scores — where to spend your remaining preparation time.',
        'Suggestions — concrete rewrites rather than general advice.',
      ]},

      { type: 'heading', text: 'How much practice is useful', level: 2 },
      { type: 'paragraph', text: 'Two or three sessions per role is the point of diminishing returns. The first exposes the obvious gaps, the second tests whether your fixes hold under a differently-worded question, and a third is worth it for a role you badly want. Beyond that you are memorising, and memorised answers are audible.' },

      { type: 'callout', variant: 'info', text: 'Practice sessions draw on the same credit balance as live Copilot minutes — one credit is one interview minute. A twenty-minute practice session costs twenty credits.' },
    ],
  },

  {
    slug: 'interview-types',
    title: 'Interview types you can practice',
    description: 'Behavioural, technical, case study and general — and which to pick.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Four types are available. They differ in what is being tested, not just in the questions asked, so choosing the right one changes what the report is able to tell you.' },

      { type: 'heading', text: 'Behavioural', level: 2 },
      { type: 'paragraph', text: 'Past experience: leadership, conflict, failure, working across teams. Questions open with "tell me about a time". This is the most common format in almost every industry and the one most candidates underestimate, because the questions sound easy and the answers are hard to structure under pressure.' },
      { type: 'paragraph', text: 'What it tests is whether you can tell a complete story — situation, what you actually did, and how it ended — in about two minutes without wandering.' },

      { type: 'heading', text: 'Technical', level: 2 },
      { type: 'paragraph', text: 'Coding problems, system design, and domain questions for engineering and technical roles. Practice here is about explaining your reasoning while you work, which is usually what is being assessed — an interviewer can see the code, but only hears the thinking if you narrate it.' },

      { type: 'heading', text: 'Case study', level: 2 },
      { type: 'paragraph', text: 'An open business problem to work through out loud. Standard for consulting, and increasingly used for product and strategy roles. There is rarely a correct answer; the assessment is whether you structure the problem before diving at it, state your assumptions, and reach a defensible recommendation.' },

      { type: 'heading', text: 'General', level: 2 },
      { type: 'paragraph', text: 'A mix: motivation, strengths and weaknesses, why this company, where you want to be. Best for a first-round screen with a recruiter, or when you do not yet know the format.' },

      { type: 'heading', text: 'Choosing', level: 2 },
      { type: 'list', items: [
        'You do not know the format — general first, then behavioural.',
        'A recruiter screen — general.',
        'A hiring-manager round — behavioural.',
        'An engineering loop — technical, plus one behavioural session. The behavioural round is where technical candidates most often lose offers.',
        'Consulting, product, or strategy — case study, plus behavioural.',
      ]},

      { type: 'callout', variant: 'tip', text: 'If the invitation names the format, match it. If it does not, ask the recruiter — they answer this question all the time and it is a completely normal thing to ask.' },
    ],
  },

  {
    slug: 'practicing-for-a-specific-company',
    title: 'Practicing for a specific company',
    description: 'Giving the AI enough context to ask the questions you will actually face.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'A generic session produces generic questions. Given the company, the role, and the posting, the AI can shape both its questions and its follow-ups to the seniority and industry you are actually interviewing for.' },

      { type: 'heading', text: 'Setting it up', level: 2 },
      { type: 'list', ordered: true, items: [
        'Enter the company name and the exact job title from the posting.',
        'Paste the full job description. This is the single largest improvement you can make to a session.',
        'Select the resume version you sent that employer, so the questions come from what they actually read.',
        'Add anything you know about the format — panel, take-home follow-up, who you are meeting.',
      ]},

      { type: 'heading', text: 'Why the posting matters so much', level: 3 },
      { type: 'paragraph', text: 'A job title is ambiguous; "Product Manager" covers everything from a first PM role to running a portfolio. The posting resolves it. It states the seniority, the responsibilities that matter to this team, and the requirements the interviewer has been asked to probe. Without it the AI guesses at a level, and questions pitched at the wrong seniority are not useful practice.' },

      { type: 'heading', text: 'Getting more out of it', level: 2 },
      { type: 'list', items: [
        'Run a session per round rather than per company. A recruiter screen and a hiring-manager round need different preparation.',
        'Practise against the resume version you actually sent — the interviewer will ask about what is on it.',
        'Add your key documents to the Knowledge Base first, so questions can reach your real projects rather than only the resume summary.',
        'After a real interview, run a session on the questions that caught you out, while you still remember them.',
      ]},

      { type: 'callout', variant: 'warning', text: 'The AI does not have inside knowledge of any employer\'s interview process. It infers a likely format from the role, the industry, and the posting. Treat it as well-informed rehearsal, not as a leaked question list.' },
    ],
  },
]
