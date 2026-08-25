import { InterviewAnswer, InterviewQuestion, InterviewReport, InterviewScenario, InterviewerPersona, InterviewTranscriptTurn } from './types'

export const personas: InterviewerPersona[] = [
  {
    id: 'maya',
    name: 'Maya',
    role: 'Senior Recruiter',
    company: 'Stripe',
    voice: 'Warm, direct, fast-moving',
    tone: 'Friendly pressure',
    accentColor: '#14b8a6',
    initials: 'MS',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=360&h=360&q=85',
    tags: ['Recruiter screen', 'Behavioral', 'Concise follow-ups'],
  },
  {
    id: 'marcus',
    name: 'Marcus',
    role: 'Engineering Manager',
    company: 'OpenAI',
    voice: 'Calm, precise, technical',
    tone: 'Socratic and exacting',
    accentColor: '#f97316',
    initials: 'MJ',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=360&h=360&q=85',
    tags: ['Technical systems thinker', 'Architecture', 'Tradeoffs'],
  },
  {
    id: 'nora',
    name: 'Nora',
    role: 'Head of Design',
    company: 'Airbnb',
    voice: 'Reflective, senior, probing',
    tone: 'Strategic critique',
    accentColor: '#8b5cf6',
    initials: 'NO',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=360&h=360&q=85',
    tags: ['Portfolio depth', 'Product sense', 'Leadership'],
  },
  {
    id: 'ade',
    name: 'Ade',
    role: 'VP Product',
    company: 'Lightforth',
    voice: 'Measured, skeptical, practical',
    tone: 'Executive bar raiser',
    accentColor: '#2563eb',
    initials: 'AA',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=360&h=360&q=85',
    tags: ['Final round', 'Business impact', 'Executive presence'],
  },
]

export const scenarios: InterviewScenario[] = [
  {
    id: 'recruiter-product-designer',
    title: 'Recruiter Screen - Product Designer',
    type: 'Recruiter Screen',
    company: 'Stripe',
    targetRole: 'Product Designer',
    difficulty: 'Medium',
    durationMinutes: 18,
    interviewerId: 'maya',
    summary: 'Practice a crisp story, compensation range, portfolio overview, and role motivation.',
    context: 'The company wants a designer who can connect craft, systems thinking, and measurable product outcomes.',
  },
  {
    id: 'technical-frontend',
    title: 'Technical Deep Dive - Frontend Engineer',
    type: 'Technical',
    company: 'OpenAI',
    targetRole: 'Frontend Engineer',
    difficulty: 'Hard',
    durationMinutes: 28,
    interviewerId: 'marcus',
    summary: 'Explain architecture decisions, performance tradeoffs, debugging habits, and collaboration with product.',
    context: 'The interviewer will push for concrete examples, not high-level claims.',
  },
  {
    id: 'hiring-manager-pm',
    title: 'Hiring Manager - Senior PM',
    type: 'Hiring Manager',
    company: 'Ramp',
    targetRole: 'Senior Product Manager',
    difficulty: 'Medium',
    durationMinutes: 24,
    interviewerId: 'ade',
    summary: 'Sharpen product judgment, prioritization stories, metrics, and cross-functional leadership examples.',
    context: 'The manager is testing whether you can own ambiguous problems and communicate tradeoffs clearly.',
  },
  {
    id: 'culture-fit-designer',
    title: 'Culture Fit - Design Lead',
    type: 'Culture Fit',
    company: 'Airbnb',
    targetRole: 'Design Lead',
    difficulty: 'Medium',
    durationMinutes: 20,
    interviewerId: 'nora',
    summary: 'Practice conflict, feedback, mentorship, and how you make teams better.',
    context: 'The panel values humility, taste, and strong examples of raising the quality bar.',
  },
  {
    id: 'final-round-chief-of-staff',
    title: 'Final Round - Chief of Staff',
    type: 'Final Round',
    company: 'Lightforth',
    targetRole: 'Chief of Staff',
    difficulty: 'Expert',
    durationMinutes: 30,
    interviewerId: 'ade',
    summary: 'Prepare for executive judgment, ambiguity, operating cadence, and closing questions.',
    context: 'The executive wants evidence of ownership, calm under pressure, and mature communication.',
  },
]

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'story',
    text: 'Tell me about yourself and what kind of product work you want to be known for. Keep it to about ninety seconds.',
    focus: 'Positioning',
  },
  {
    id: 'impact',
    text: 'Give me one specific project where your work changed a product metric or customer outcome.',
    focus: 'Specificity',
  },
  {
    id: 'pressure',
    text: 'Tell me about a time you had to defend a product decision under pressure. What did you do?',
    focus: 'Judgment',
  },
  {
    id: 'questions',
    text: 'What would you want to ask the hiring manager before deciding whether this role is right for you?',
    focus: 'Closing questions',
  },
]

export const defaultTranscript: InterviewTranscriptTurn[] = [
  {
    id: 't1',
    speaker: 'interviewer',
    speakerName: 'Maya',
    time: '00:09',
    text: 'Walk me through the kind of product work you want to be known for, and keep it to ninety seconds.',
  },
  {
    id: 't2',
    speaker: 'user',
    speakerName: 'You',
    time: '00:31',
    text: 'I want to be known for turning messy user problems into clear product systems. My strongest work sits where research, interaction design, and business goals meet.',
  },
  {
    id: 't3',
    speaker: 'interviewer',
    speakerName: 'Maya',
    time: '02:14',
    text: 'That is clear, but I need one specific product example. What changed because of your work?',
  },
  {
    id: 't4',
    speaker: 'user',
    speakerName: 'You',
    time: '02:46',
    text: 'On a retention project, I redesigned onboarding around user intent signals and partnered with engineering to instrument drop-off. Activation improved from 42 percent to 57 percent over the next release cycle.',
  },
]

export const report: InterviewReport = {
  score: 82,
  summary:
    'You showed strong raw material: specific metrics, a grounded product story, and calm recovery when pressed. The main improvement area is sequencing. Lead with the concrete example earlier, then use the broader narrative as support.',
  whatWentWell: [
    'Specific impact story at 02:46: the activation lift gave the interviewer evidence instead of adjectives.',
    'Calm recovery under pressure: you accepted the follow-up and answered directly.',
    'Clear role positioning: your strongest line connected research, interaction design, and business goals.',
  ],
  whatNeedsWork: [
    'Opening was too abstract for a recruiter screen. Start with the product example, then zoom out.',
    'You missed a chance to ask a closing question about what success looks like in the first six months.',
    'A few phrases sounded rehearsed. Shorter sentences would make the answer feel more conversational.',
  ],
  knowledgeGaps: [
    'Company-specific product strategy: add one recent product launch or market signal.',
    'Team shape: prepare a question about design, PM, and engineering collaboration.',
    'Interview logistics: be ready to state compensation range and start-date constraints cleanly.',
  ],
  suggestedQuestions: [
    'What would make someone excellent in this role after six months?',
    'Where does the team most need better product-design partnership right now?',
    'Which customer segment is the biggest priority for this product area this year?',
  ],
  rubric: [
    { element: 'STAR clarity', status: 'Strong', notes: 'Situation, action, and result were easy to follow once the example appeared.' },
    { element: 'Role relevance', status: 'Strong', notes: 'Answers mapped well to senior product-design expectations.' },
    { element: 'Specificity', status: 'Partial', notes: 'Strong metric later in the answer, but the opener needed concrete detail sooner.' },
    { element: 'Technical depth', status: 'Partial', notes: 'Mentioned instrumentation, but could explain the event model or decision tradeoff.' },
    { element: 'Culture fit', status: 'Strong', notes: 'Collaborative language felt mature without sounding passive.' },
    { element: 'Closing questions', status: 'Needs work', notes: 'No high-quality question asked back to the interviewer.' },
  ],
  talkTime: {
    user: 47,
    interviewer: 53,
  },
  transcript: defaultTranscript,
}

function answerHasEvidence(answer: string) {
  return /\d|percent|%|metric|revenue|activation|retention|conversion|users|customers|launched|reduced|increased/i.test(answer)
}

function answerUsesStructure(answer: string) {
  return /because|first|then|result|so|therefore|impact|learned|tradeoff/i.test(answer)
}

export function buildInterviewReport(
  scenario: InterviewScenario,
  persona: InterviewerPersona,
  answers: InterviewAnswer[],
): InterviewReport {
  if (answers.length === 0) return report

  const answeredText = answers.map(item => item.answer).join(' ')
  const averageLength = answeredText.split(/\s+/).filter(Boolean).length / answers.length
  const evidenceCount = answers.filter(item => answerHasEvidence(item.answer)).length
  const structureCount = answers.filter(item => answerUsesStructure(item.answer)).length
  const score = Math.min(94, Math.max(48, Math.round(58 + averageLength * 0.7 + evidenceCount * 6 + structureCount * 4)))

  const transcript: InterviewTranscriptTurn[] = answers.flatMap((item, index) => [
    {
      id: `q-${item.question.id}`,
      speaker: 'interviewer' as const,
      speakerName: persona.name,
      time: `0${index * 2}:0${Math.min(index + 1, 9)}`,
      text: item.question.text,
    },
    {
      id: `a-${item.question.id}`,
      speaker: 'user' as const,
      speakerName: 'You',
      time: `0${index * 2}:3${Math.min(index + 1, 9)}`,
      text: item.answer,
    },
  ])

  return {
    score,
    summary: `You completed ${answers.length} ${answers.length === 1 ? 'question' : 'questions'} for the ${scenario.targetRole} practice room. Your strongest moments came when you connected your experience to concrete outcomes. The next level is making every answer open with the specific example before moving into broader positioning.`,
    whatWentWell: [
      evidenceCount > 0
        ? 'You included evidence or outcome language, which makes your answers more credible than generic self-description.'
        : 'You stayed conversational and gave the interviewer enough material to continue the discussion.',
      structureCount > 0
        ? 'Several answers had a visible reasoning path, which helped the interviewer follow your decisions.'
        : 'You answered directly without overcomplicating the conversation.',
      `You maintained relevance to ${scenario.company} and the ${scenario.targetRole} role instead of drifting into unrelated background.`,
    ],
    whatNeedsWork: [
      evidenceCount < answers.length
        ? 'Add one measurable detail to every major answer: a metric, scope, timeline, customer segment, or business result.'
        : 'Keep the metric, but move it closer to the beginning of the answer so the interviewer hears impact immediately.',
      averageLength < 35
        ? 'Some answers were too short for a real interview. Use a quick setup, action, and result so the interviewer can evaluate your judgment.'
        : 'Tighten the middle of longer answers so the key point lands faster.',
      'End with a stronger forward-facing close: what you learned, how you would apply it here, or the question you would ask next.',
    ],
    knowledgeGaps: [
      `Prepare one recent ${scenario.company} product or business signal before the call.`,
      `Have two stories ready for ${scenario.type}: one about impact and one about conflict or tradeoffs.`,
      'Prepare one smart question about team expectations, success metrics, or the first 90 days.',
    ],
    suggestedQuestions: [
      `What would make someone excellent in this ${scenario.targetRole} role after six months?`,
      'Where does this team most need stronger product judgment right now?',
      'What customer or business metric is most important for this role this year?',
    ],
    rubric: [
      { element: 'STAR clarity', status: structureCount >= 2 ? 'Strong' : 'Partial', notes: structureCount >= 2 ? 'Answers showed a clear path from context to action and outcome.' : 'Add clearer situation, action, and result markers.' },
      { element: 'Role relevance', status: 'Strong', notes: `Most answers stayed anchored to ${scenario.targetRole} expectations.` },
      { element: 'Specificity', status: evidenceCount >= 2 ? 'Strong' : 'Partial', notes: evidenceCount >= 2 ? 'Concrete evidence appeared in multiple answers.' : 'Use more numbers, scope, product names, or customer examples.' },
      { element: 'Technical depth', status: scenario.type === 'Technical' && evidenceCount < 2 ? 'Needs work' : 'Partial', notes: 'Go one layer deeper on systems, tradeoffs, or decision criteria when pressed.' },
      { element: 'Culture fit', status: 'Strong', notes: 'Tone was collaborative and mature.' },
      { element: 'Closing questions', status: answers.some(item => item.question.id === 'questions' && item.answer.length > 25) ? 'Strong' : 'Needs work', notes: 'Always finish with a question that reveals how success is measured.' },
    ],
    talkTime: {
      user: Math.min(68, Math.max(38, Math.round(42 + averageLength / 3))),
      interviewer: Math.max(32, Math.min(62, Math.round(58 - averageLength / 3))),
    },
    transcript,
  }
}

export function getPersona(id: string) {
  return personas.find(persona => persona.id === id) ?? personas[0]
}

export function getScenarioPersona(scenario: InterviewScenario) {
  const persona = getPersona(scenario.interviewerId)
  return scenario.interviewerRole ? { ...persona, role: scenario.interviewerRole } : persona
}

export function createCustomScenario(): InterviewScenario {
  return {
    id: 'custom',
    title: 'Custom Scenario',
    type: 'Recruiter Screen',
    company: 'Lightforth',
    targetRole: 'Product Manager',
    difficulty: 'Medium',
    durationMinutes: 20,
    interviewerId: personas[0].id,
    interviewerRole: personas[0].role,
    summary: 'Build a custom interview around your target role, company, interviewer, and extra context.',
    context: 'Use this space to include job description details, portfolio notes, or anything the interviewer should probe.',
  }
}
