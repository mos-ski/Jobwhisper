import type { HelpArticle } from '../types'

export const resumeBuilderArticles: readonly HelpArticle[] = [
  {
    slug: 'how-ai-resume-tailoring-works',
    title: 'How AI resume tailoring works',
    description: 'Understand how Jobwhisper customizes your resume for each job.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Jobwhisper does not generate a single generic resume. It tailors your existing resume to match the specific keywords, requirements, and qualifications in each job description.' },
      { type: 'heading', text: 'The process', level: 2 },
      { type: 'list', ordered: true, items: [
        'Upload your base resume — this is your source of truth.',
        'Paste the target job description.',
        'AI analyzes the job posting and matches your experience to its requirements.',
        'You receive a tailored version with an ATS compatibility score and specific improvement suggestions.',
      ]},
      { type: 'paragraph', text: 'Every tailored version is different because every job description is different. This is what makes the approach effective — it speaks directly to what each employer is looking for.' },
    ],
  },
  {
    slug: 'understanding-your-ats-score',
    title: 'Understanding your ATS score',
    description: 'What the score means and how to improve it.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Your ATS (Applicant Tracking System) score shows how well your tailored resume will perform against the automated screening systems most companies use.' },
      { type: 'heading', text: 'What the score covers', level: 2 },
      { type: 'list', items: [
        'Keyword match — how many required skills and terms from the job posting appear in your resume.',
        'Format compatibility — whether your resume layout will parse correctly in common ATS tools.',
        'Section completeness — whether you have the standard sections employers expect.',
      ]},
      { type: 'heading', text: 'Improving your score', level: 2 },
      { type: 'list', items: [
        'Add missing keywords that genuinely apply to your experience.',
        'Remove non-standard formatting (tables, text boxes, graphics).',
        'Ensure your contact info and work history are in standard sections.',
      ]},
      { type: 'callout', variant: 'tip', text: 'A score above 80 is strong. Do not chase a perfect 100 — natural language matters more than keyword stuffing.' },
    ],
  },
  {
    slug: 'exporting-downloading-resumes',
    title: 'Exporting and downloading resumes',
    description: 'Available formats and how to download.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Once you are happy with your tailored resume, you can download it in three formats.' },
      { type: 'heading', text: 'Available formats', level: 2 },
      { type: 'list', items: [
        'PDF — the most universally accepted format. Use this unless the application specifically requests something else.',
        'Word (.docx) — some applicant portals require a Word document.',
        'Plain text — useful for pasting into online forms that do not accept file uploads.',
      ]},
      { type: 'paragraph', text: 'All three formats are ATS-compatible, meaning they will parse correctly in automated screening systems.' },
    ],
  },
  {
    slug: 'creating-multiple-resume-versions',
    title: 'Creating multiple resume versions',
    description: 'Why and how to maintain different versions.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'We recommend creating a fresh tailored version for each application. Here is why.' },
      { type: 'heading', text: 'Why different versions matter', level: 2 },
      { type: 'list', items: [
        'Each job description emphasizes different skills and experiences.',
        'A tailored resume scores higher in ATS and reads better to human reviewers.',
        'Tracking which version you sent helps you prepare for interviews.',
      ]},
      { type: 'heading', text: 'Managing versions', level: 2 },
      { type: 'paragraph', text: 'All your tailored versions are saved in your Resume History. You can revisit, re-edit, or re-download any previous version at any time.' },
      { type: 'callout', variant: 'info', text: 'Pro and Premium plans include unlimited resume versions. Starter plans are limited to 10 active versions.' },
    ],
  },
]
