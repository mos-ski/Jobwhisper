import type { HelpArticle } from '../types'

export const resumeBuilderArticles: readonly HelpArticle[] = [
  {
    slug: 'how-ai-resume-tailoring-works',
    title: 'How AI resume tailoring works',
    description: 'What happens to your resume, what stays fixed, and why one resume is not enough.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Resume Builder does not write you a resume. It takes the one you have and rewrites it against a specific job description — different emphasis, different ordering, different language, same career.' },

      { type: 'heading', text: 'The process', level: 2 },
      { type: 'list', ordered: true, items: [
        'Upload your base resume. This is the source of truth and nothing is added to it that you did not put there.',
        'Paste the target job description, ideally the full posting rather than the title.',
        'The AI reads the posting for required skills, responsibilities, and the language the employer uses for them.',
        'It matches those against your actual experience and rewrites the relevant bullets to lead with what this employer asked for.',
        'You get a tailored version with an ATS score and specific suggestions you can accept or ignore.',
      ]},

      { type: 'heading', text: 'What changes and what does not', level: 2 },
      { type: 'paragraph', text: 'The line matters, because this is what separates tailoring from fabricating.' },
      { type: 'list', items: [
        'Changes — which bullets appear first, how achievements are phrased, which of your skills are named explicitly, and the vocabulary used to describe work you already did.',
        'Does not change — employers, job titles, dates, or the substance of what you actually accomplished.',
      ]},
      { type: 'paragraph', text: 'If you managed a migration and the posting calls it "platform modernisation", tailoring will use their phrase for your work. It will not claim you led a team of twelve if you led three.' },

      { type: 'heading', text: 'Why every application needs its own version', level: 2 },
      { type: 'paragraph', text: 'Two postings for the same job title routinely want different things — one leads on stakeholder management, the next on technical depth. A single resume can lead on only one of them. Sending the same document everywhere means being second-best for every posting instead of the obvious fit for some.' },

      { type: 'heading', text: 'Getting better results', level: 2 },
      { type: 'list', items: [
        'Paste the whole posting, including the "nice to have" section. That is often where the differentiating keywords live.',
        'Keep your base resume complete rather than tidy. Tailoring can cut, but it cannot recover something you never listed.',
        'Correct the output where it misreads you. Those corrections make the next version better.',
        'Re-run tailoring if you substantially edit your base resume — the old version does not update itself.',
      ]},

      { type: 'callout', variant: 'warning', text: 'Always read the tailored version before sending it. The AI is working from a posting written by someone else and can misread an ambiguous requirement. You are the one who knows what you actually did.' },

      { type: 'heading', text: 'What it costs', level: 2 },
      { type: 'paragraph', text: 'Resume Builder is pay-as-you-go at $0.10 per AI prompt, topped up from $5, with no subscription required. ATS scoring and downloads are free — you are charged for the generation, not for checking or exporting the result.' },
    ],
  },

  {
    slug: 'understanding-your-ats-score',
    title: 'Understanding your ATS score',
    description: 'What an ATS actually does, what the score measures, and when to stop optimising.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Most employers of any size run applications through an Applicant Tracking System before a person sees them. The ATS parses your file into structured fields and ranks it against the posting. A resume that parses badly can be filtered out before anyone reads a word of it — which is what the score is trying to prevent.' },

      { type: 'heading', text: 'What the score measures', level: 2 },
      { type: 'list', items: [
        'Keyword match — whether the skills and terms the posting requires actually appear in your resume, in the employer\'s own wording.',
        'Format compatibility — whether the layout will parse correctly. Tables, text boxes, columns, headers, and graphics are the usual culprits.',
        'Section completeness — whether standard sections an ATS looks for (contact details, experience, education, skills) are present and recognisable.',
      ]},

      { type: 'heading', text: 'Reading the number', level: 2 },
      { type: 'list', items: [
        'Above 80 — strong. Send it.',
        '60 to 80 — worth one pass at the specific items flagged.',
        'Below 60 — usually a formatting problem rather than a content one. Check for columns and graphics first.',
      ]},

      { type: 'heading', text: 'Improving it honestly', level: 2 },
      { type: 'list', ordered: true, items: [
        'Fix formatting first. It is the cheapest win and it never costs you credibility.',
        'Add genuinely missing keywords — skills you have and simply did not list.',
        'Use the employer\'s vocabulary for things you have done, rather than your previous company\'s internal term.',
        'Make sure contact details are in the body of the document, not in a header or footer. Many parsers never read those.',
      ]},

      { type: 'heading', text: 'Why you should not chase 100', level: 2 },
      { type: 'paragraph', text: 'The score measures machine readability, not whether a hiring manager wants to meet you. Past a certain point the only way to push it higher is keyword stuffing, which reads badly to the human who picks up the resume next. A natural 85 beats a stuffed 98 every time, because the ATS is a filter and the human is the decision.' },

      { type: 'callout', variant: 'tip', text: 'Never add a keyword for a skill you do not have. It may clear the filter, but it sets up an interview question you cannot answer, which is a worse outcome than not being shortlisted.' },
    ],
  },

  {
    slug: 'exporting-downloading-resumes',
    title: 'Exporting and downloading resumes',
    description: 'Which format to use where, and why the file type matters.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Three formats are available, and the right one depends on where the resume is going. Downloads are unlimited and are not charged.' },

      { type: 'heading', text: 'The formats', level: 2 },
      { type: 'list', items: [
        'PDF — the default. Layout is fixed, so what you see is what the employer sees. Use it unless the application asks for something else.',
        'Word (.docx) — required by some employer portals and by most recruitment agencies, who often edit before passing a candidate on.',
        'Plain text — for online forms with a paste-only box, and for the occasional older system that mangles uploads.',
      ]},

      { type: 'heading', text: 'Which to use when', level: 2 },
      { type: 'list', items: [
        'Emailing a hiring manager directly — PDF.',
        'An upload field that accepts anything — PDF.',
        'Working through a recruitment agency — Word, because they will want to add their cover sheet.',
        'A form with a large text area and no upload — plain text, then check the spacing after you paste.',
      ]},

      { type: 'heading', text: 'Why PDF is the safe default', level: 3 },
      { type: 'paragraph', text: 'A Word file renders differently depending on the reader\'s fonts and version, so a document you laid out carefully can arrive with the spacing broken. PDF carries its layout with it. The old advice that PDFs defeat applicant tracking systems is long out of date; modern parsers handle them without trouble.' },

      { type: 'paragraph', text: 'All three exports are built to parse cleanly in automated screening. The formatting choices that break an ATS are made in the document layout, not in the export step.' },

      { type: 'callout', variant: 'tip', text: 'Name the file with your own name — "Jane Okafor - Product Manager.pdf" rather than "resume-final-v3.pdf". It is the filename a recruiter sees in a folder of hundreds.' },
    ],
  },

  {
    slug: 'creating-multiple-resume-versions',
    title: 'Creating multiple resume versions',
    description: 'Keeping versions straight, and why the one you sent matters at interview.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Tailoring produces a new version for each posting, so an active search generates a lot of documents quickly. Every version you create is saved in your resume history and can be reopened, edited, or downloaded again at any time.' },

      { type: 'heading', text: 'Why versions are worth keeping', level: 2 },
      { type: 'list', items: [
        'You can see exactly which document an employer is holding when they call.',
        'A version that produced interviews tells you what is working, which is useful signal for the rest of your search.',
        'Re-tailoring from a strong recent version is faster than starting from your original base.',
      ]},

      { type: 'heading', text: 'The interview reason', level: 3 },
      { type: 'paragraph', text: 'This is the one that catches people out. An interviewer is reading the version you sent them, not the one you remember writing. If that version led with a project you have half-forgotten, you will be asked about it. Opening the exact document before the call is the cheapest interview preparation there is.' },

      { type: 'heading', text: 'Keeping it manageable', level: 2 },
      { type: 'list', items: [
        'Let the company name carry the version — tailoring is per posting, so per-posting naming matches how you will search for it later.',
        'Keep one clean base resume and always tailor from it, rather than tailoring a tailored version. Repeated passes drift away from your actual record.',
        'When your base resume changes materially, update the base rather than patching individual versions.',
      ]},

      { type: 'callout', variant: 'tip', text: 'Before any interview, open the exact version you sent that employer and read it through once. It takes two minutes and it is the difference between recalling a project instantly and reconstructing it live.' },
    ],
  },
]
