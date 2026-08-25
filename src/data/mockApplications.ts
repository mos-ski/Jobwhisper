export type AppStatus = 'failed' | 'needs_review' | 'completed' | 'pending'

export interface TimelineEvent {
  label: string
  time: string
}

export interface TimelineGroup {
  date: string
  events: TimelineEvent[]
}

export interface ApplicationQuestion {
  question: string
  answer: string
  incomplete?: boolean
}

export interface TraceEvent {
  time: string
  event: string
  detail?: string
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'cyan' | 'orange' | 'gray'
}

export interface AttemptDetail {
  number: number
  status: 'failed' | 'completed' | 'needs_review'
  date: string
  statusReason?: string
  logs: string[]
  traceLog: TraceEvent[]
}

export interface MockApplication {
  id: string
  studentId: string
  studentName: string
  jobTitle: string
  company: string
  companyColor: string
  type: string
  source: string
  postedAt: string
  dateApplied: string
  status: AppStatus
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: string
  birthday: string
  streetAddress: string
  city: string
  state: string
  postalCode: string
  country: string
  linkedin: string
  resumeName: string
  coverLetterName?: string
  attempts: AttemptDetail[]
  timeline?: TimelineGroup[]
  applicationQuestions?: ApplicationQuestion[]
}

const TRACE_FAILED: TraceEvent[] = [
  { time: '03:53:14', event: 'APPLICATION_STARTED',        detail: '{"submissionUrl":"https://jobs.wd1.myworkdayjobs.com/..."}',                                color: 'blue'   },
  { time: '03:53:14', event: 'RESUME_TAILORING_STARTED',   detail: undefined,                                                                                   color: 'yellow' },
  { time: '03:54:02', event: 'RESUME_TAILORED',            detail: '{"resumeUrl":"https://lightforth-prod-resume-bucket.nyc3.digitaloceanspaces.com/tailored/…"}', color: 'green'  },
  { time: '03:54:03', event: 'NAVIGATE',                   detail: undefined,                                                                                   color: 'blue'   },
  { time: '03:54:10', event: 'ATS_DETECTED',               detail: '{"atsType":"workday"}',                                                                     color: 'purple' },
  { time: '03:54:20', event: 'FORM_ANALYZED',              detail: undefined,                                                                                   color: 'cyan'   },
  { time: '04:00:07', event: 'FILL_FIELD',                 detail: '{"fieldsCompleted":0,"fieldsTotal":0,"missingFields":[],"stuckAtStep":"sign_in"}',           color: 'orange' },
  { time: '04:05:10', event: 'APPLICATION_FAILED',         detail: '{"errorType":"internal_error"}',                                                            color: 'red'    },
]

const TRACE_COMPLETED: TraceEvent[] = [
  { time: '09:12:05', event: 'APPLICATION_STARTED',        detail: '{"submissionUrl":"https://apply.workable.com/idexcorp/..."}',                               color: 'blue'   },
  { time: '09:12:05', event: 'RESUME_TAILORING_STARTED',   detail: undefined,                                                                                   color: 'yellow' },
  { time: '09:12:51', event: 'RESUME_TAILORED',            detail: '{"resumeUrl":"https://lightforth-prod-resume-bucket.nyc3.digitaloceanspaces.com/tailored/…"}', color: 'green'  },
  { time: '09:12:52', event: 'NAVIGATE',                   detail: undefined,                                                                                   color: 'blue'   },
  { time: '09:12:58', event: 'ATS_DETECTED',               detail: '{"atsType":"workable"}',                                                                    color: 'purple' },
  { time: '09:13:10', event: 'FORM_ANALYZED',              detail: undefined,                                                                                   color: 'cyan'   },
  { time: '09:15:30', event: 'FILL_FIELD',                 detail: '{"fieldsCompleted":14,"fieldsTotal":14,"missingFields":[]}',                                 color: 'orange' },
  { time: '09:16:02', event: 'APPLICATION_COMPLETED',      detail: '{"confirmationNumber":"WRK-2026-48291"}',                                                   color: 'green'  },
]

const LOGS_FAILED = [
  '[2026-06-12T02:53:13.601Z] [DEBUG] [ApplicationProcessor] [Jitter] Delaying start by 306ms to stagger concurrent jobs',
  '[2026-06-12T02:53:14.389Z] [LOG] [ApplicationProcessor] [Resume Tailoring] MS_RESUME_URL=https://api.lightforth.org/resume, has description=true',
  '[2026-06-12T02:53:14.389Z] [LOG] [ApplicationProcessor] Tailoring resume for application 6a2b401de47c656c09eb26a6',
  '[2026-06-12T02:54:02.850Z] [LOG] [ApplicationProcessor] Resume tailored: https://lightforth-prod-resume-bucket.nyc3.digitaloceanspaces.com/tailored/…',
  '[2026-06-12T02:54:03.069Z] [LOG] [AutomationOrchestrator] Downloading resume from https://lightforth-prod-resume-bucket.nyc3.digitaloceanspaces.com/tailored/…',
  '[2026-06-12T02:54:03.511Z] [LOG] [AutomationOrchestrator] Resume downloaded to /tmp/resume-1781232843510.pdf',
  '[2026-06-12T02:54:03.511Z] [LOG] [AutomationOrchestrator] Browser context: proxy=NO for https://raymondjames.wd1.myworkdayjobs.com/…',
  '[2026-06-12T02:54:03.520Z] [DEBUG] [BrowserPoolService] Context acquired for session on browser 2',
  '[2026-06-12T02:54:03.798Z] [LOG] [AutomationOrchestrator] Navigating to: https://raymondjames.wd1.myworkdayjobs.com/…',
  '[2026-06-12T02:54:08.519Z] [DEBUG] [AutomationOrchestrator] Dismissed popup via: button:has-text("Accept")',
  '[2026-06-12T02:54:10.418Z] [DEBUG] [StorageService] Screenshot uploaded: screenshots/initial-load.png',
  '[2026-06-12T02:54:10.612Z] [DEBUG] [StorageService] HTML uploaded: html/initial-load.html',
  '[2026-06-12T04:00:07.201Z] [ERROR] [AutomationOrchestrator] Stuck at step: sign_in — cannot fill personal-info fields',
  '[2026-06-12T04:05:10.000Z] [ERROR] [ApplicationProcessor] APPLICATION_FAILED: internal_error',
]

const LOGS_COMPLETED = [
  '[2026-06-12T09:12:05.102Z] [DEBUG] [ApplicationProcessor] Starting application for Idexcorp',
  '[2026-06-12T09:12:05.880Z] [LOG] [ApplicationProcessor] [Resume Tailoring] Tailoring resume…',
  '[2026-06-12T09:12:51.312Z] [LOG] [ApplicationProcessor] Resume tailored successfully',
  '[2026-06-12T09:12:52.001Z] [LOG] [AutomationOrchestrator] Navigating to application form',
  '[2026-06-12T09:12:58.410Z] [LOG] [AutomationOrchestrator] ATS detected: workable',
  '[2026-06-12T09:13:10.005Z] [LOG] [AutomationOrchestrator] Form analyzed: 14 fields',
  '[2026-06-12T09:15:30.711Z] [LOG] [AutomationOrchestrator] All fields filled successfully',
  '[2026-06-12T09:16:02.900Z] [LOG] [AutomationOrchestrator] Application submitted. Confirmation: WRK-2026-48291',
]

export const MOCK_APPLICATIONS: MockApplication[] = [
  {
    id: 'app-001',
    studentId: '1',
    studentName: 'Sarah Mitchell',
    jobTitle: 'VP, Insurance Operations',
    company: 'Raymond James Financial',
    companyColor: '#003087',
    type: 'full-time',
    source: '-',
    postedAt: 'Jun 11, 2026',
    dateApplied: 'Jun 12, 2026',
    status: 'failed',
    firstName: 'SARAH',
    lastName: 'MITCHELL',
    email: 'sarah.mitchell@gmail.com',
    phone: '+12125550198',
    gender: 'female',
    birthday: 'Mar 15, 1992',
    streetAddress: '412 West 42nd Street',
    city: 'New York',
    state: 'NY',
    postalCode: '10036',
    country: 'United States of America',
    linkedin: 'https://linkedin.com/in/sarahmitchell',
    resumeName: 'sarah_mitchell_resume.pdf',
    coverLetterName: 'cover_letter_raymond_james.pdf',
    timeline: [
      { date: 'JUN 12', events: [
        { label: 'Job picked up by Agent', time: '03:53 AM' },
        { label: 'Application failed', time: '04:05 AM' },
      ]},
    ],
    applicationQuestions: [
      { question: 'Describe your experience managing large-scale insurance operations across multiple business lines.', answer: '', incomplete: true },
    ],
    attempts: [
      {
        number: 1,
        status: 'failed',
        date: 'Jun 12, 2026 3:53 AM',
        statusReason: 'Failed: internal_error. stuck_at_step=sign_in: Cannot fill personal-info fields — wizard is on \'sign_in\' step (account creation or upload likely failed upstream)',
        logs: LOGS_FAILED,
        traceLog: TRACE_FAILED,
      },
      {
        number: 2,
        status: 'failed',
        date: 'Jun 12, 2026 5:14 AM',
        statusReason: 'Failed: internal_error. stuck_at_step=sign_in: Cannot fill personal-info fields — wizard is on \'sign_in\' step (account creation or upload likely failed upstream)',
        logs: LOGS_FAILED,
        traceLog: TRACE_FAILED,
      },
    ],
  },
  {
    id: 'app-002',
    studentId: '1',
    studentName: 'Sarah Mitchell',
    jobTitle: 'Senior Manager, Cybersecurity Incident Response & Security Operations',
    company: 'Idexcorp',
    companyColor: '#4A90D9',
    type: 'full-time',
    source: '-',
    postedAt: 'Jun 11, 2026',
    dateApplied: 'Jun 12, 2026',
    status: 'needs_review',
    firstName: 'SARAH',
    lastName: 'MITCHELL',
    email: 'sarah.mitchell@gmail.com',
    phone: '+12125550198',
    gender: 'female',
    birthday: 'Mar 15, 1992',
    streetAddress: '412 West 42nd Street',
    city: 'New York',
    state: 'NY',
    postalCode: '10036',
    country: 'United States of America',
    linkedin: 'https://linkedin.com/in/sarahmitchell',
    resumeName: 'sarah_mitchell_resume.pdf',
    coverLetterName: 'cover_letter_idexcorp.pdf',
    timeline: [
      { date: 'JUN 12', events: [
        { label: 'Job picked up by Agent', time: '09:12 AM' },
        { label: 'Application submitted', time: '09:16 AM' },
        { label: 'Flagged for review', time: '09:16 AM' },
      ]},
    ],
    applicationQuestions: [
      {
        question: 'Describe your experience leading cybersecurity incident response for enterprise environments.',
        answer: 'Over 8 years at Goldman Sachs, I led the CISO\'s Incident Response function across North America and EMEA. I built and managed a 14-person SOC team, established playbooks for 40+ threat scenarios, and drove our MTTD from 72 hours down to under 6 hours. My team handled 3 critical ransomware events with zero data exfiltration.',
      },
      {
        question: 'What security frameworks (NIST, ISO 27001, etc.) have you implemented or overseen?',
        answer: 'I have hands-on implementation experience with NIST CSF, ISO 27001/27002, SOC 2 Type II, and PCI-DSS. At Goldman Sachs I drove our ISO 27001 certification across 12 data centres and led two successful SOC 2 audits. I am also familiar with MITRE ATT&CK as a threat modelling layer over NIST.',
      },
    ],
    attempts: [
      {
        number: 1,
        status: 'needs_review',
        date: 'Jun 12, 2026 9:12 AM',
        statusReason: 'Needs human review: ambiguous field detected in employment history section',
        logs: LOGS_COMPLETED,
        traceLog: TRACE_COMPLETED,
      },
    ],
  },
  {
    id: 'app-003',
    studentId: '1',
    studentName: 'Sarah Mitchell',
    jobTitle: 'Director for Cybersecurity Operations',
    company: 'Jabil',
    companyColor: '#E31837',
    type: 'full-time',
    source: '-',
    postedAt: 'Jun 11, 2026',
    dateApplied: 'Jun 12, 2026',
    status: 'completed',
    firstName: 'SARAH',
    lastName: 'MITCHELL',
    email: 'sarah.mitchell@gmail.com',
    phone: '+12125550198',
    gender: 'female',
    birthday: 'Mar 15, 1992',
    streetAddress: '412 West 42nd Street',
    city: 'New York',
    state: 'NY',
    postalCode: '10036',
    country: 'United States of America',
    linkedin: 'https://linkedin.com/in/sarahmitchell',
    resumeName: 'sarah_mitchell_resume.pdf',
    coverLetterName: 'cover_letter_jabil.pdf',
    timeline: [
      { date: 'JUN 12', events: [
        { label: 'Job picked up by Agent', time: '10:45 AM' },
        { label: 'Application submitted', time: '10:52 AM' },
      ]},
    ],
    applicationQuestions: [
      {
        question: 'Describe your experience building and managing a cybersecurity operations function from the ground up.',
        answer: 'In my role as VP of Cybersecurity Operations at Synchrony Financial, I built the function from a 4-person team to a 22-person organisation over 3 years. I established a 24/7 SOC, implemented a SIEM platform, and created a vulnerability management programme that reduced our critical exposure window from 30 days to 5 days. I also led the selection and deployment of our EDR platform across 8,000 endpoints.',
      },
      {
        question: 'How have you aligned cybersecurity strategy with business objectives in a manufacturing or industrial context?',
        answer: 'While I have primarily worked in financial services, I have extensive experience aligning security strategy with operational constraints. At Jabil I would apply the same principle: embed security into the OT/IT convergence roadmap, conduct risk-tiered asset classification, and ensure security controls do not impede production throughput. I have spoken at ISACA on this exact topic.',
      },
    ],
    attempts: [
      {
        number: 1,
        status: 'completed',
        date: 'Jun 12, 2026 10:45 AM',
        statusReason: undefined,
        logs: LOGS_COMPLETED,
        traceLog: TRACE_COMPLETED,
      },
    ],
  },
  {
    id: 'app-004',
    studentId: '2',
    studentName: 'James Okafor',
    jobTitle: 'Compliance Manager, Financial Services',
    company: 'KPMG',
    companyColor: '#00338D',
    type: 'full-time',
    source: '-',
    postedAt: 'Jun 10, 2026',
    dateApplied: 'Jun 11, 2026',
    status: 'completed',
    firstName: 'JAMES',
    lastName: 'OKAFOR',
    email: 'james.okafor@gmail.com',
    phone: '+13125550147',
    gender: 'male',
    birthday: 'Sep 22, 1989',
    streetAddress: '1800 North Michigan Avenue',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60611',
    country: 'United States of America',
    linkedin: 'https://linkedin.com/in/jamesokafor',
    resumeName: 'james_okafor_resume.pdf',
    attempts: [
      { number: 1, status: 'completed', date: 'Jun 11, 2026 7:30 AM', logs: LOGS_COMPLETED, traceLog: TRACE_COMPLETED },
    ],
  },
  {
    id: 'app-005',
    studentId: '2',
    studentName: 'James Okafor',
    jobTitle: 'Senior Audit Manager – Cybersecurity, AI and Cloud',
    company: 'Bank of Montreal',
    companyColor: '#0079C1',
    type: 'full-time',
    source: '-',
    postedAt: 'Jun 10, 2026',
    dateApplied: 'Jun 12, 2026',
    status: 'failed',
    firstName: 'JAMES',
    lastName: 'OKAFOR',
    email: 'james.okafor@gmail.com',
    phone: '+13125550147',
    gender: 'male',
    birthday: 'Sep 22, 1989',
    streetAddress: '1800 North Michigan Avenue',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60611',
    country: 'United States of America',
    linkedin: 'https://linkedin.com/in/jamesokafor',
    resumeName: 'james_okafor_resume.pdf',
    attempts: [
      { number: 1, status: 'failed', date: 'Jun 12, 2026 2:15 AM', statusReason: 'Failed: timeout. Application form did not load within allotted time.', logs: LOGS_FAILED, traceLog: TRACE_FAILED },
    ],
  },
  {
    id: 'app-006',
    studentId: '3',
    studentName: 'Priya Sharma',
    jobTitle: 'Risk Analytics Lead',
    company: 'Citi',
    companyColor: '#003B70',
    type: 'full-time',
    source: '-',
    postedAt: 'Jun 9, 2026',
    dateApplied: 'Jun 10, 2026',
    status: 'needs_review',
    firstName: 'PRIYA',
    lastName: 'SHARMA',
    email: 'priya.sharma@gmail.com',
    phone: '+15125550214',
    gender: 'female',
    birthday: 'Jan 8, 1994',
    streetAddress: '6800 Burleson Road',
    city: 'Austin',
    state: 'TX',
    postalCode: '78744',
    country: 'United States of America',
    linkedin: 'https://linkedin.com/in/priyasharma',
    resumeName: 'priya_sharma_resume.pdf',
    attempts: [
      { number: 1, status: 'needs_review', date: 'Jun 10, 2026 8:00 AM', statusReason: 'Needs review: salary expectation field requires manual entry', logs: LOGS_COMPLETED, traceLog: TRACE_COMPLETED },
    ],
  },
  {
    id: 'app-007',
    studentId: '4',
    studentName: 'David Chen',
    jobTitle: 'AML Investigator, Senior',
    company: 'Wells Fargo',
    companyColor: '#CC0000',
    type: 'full-time',
    source: '-',
    postedAt: 'Jun 8, 2026',
    dateApplied: 'Jun 9, 2026',
    status: 'completed',
    firstName: 'DAVID',
    lastName: 'CHEN',
    email: 'david.chen@gmail.com',
    phone: '+14155550382',
    gender: 'male',
    birthday: 'Nov 30, 1991',
    streetAddress: '550 California Street',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94104',
    country: 'United States of America',
    linkedin: 'https://linkedin.com/in/davidchen',
    resumeName: 'david_chen_resume.pdf',
    attempts: [
      { number: 1, status: 'completed', date: 'Jun 9, 2026 11:20 AM', logs: LOGS_COMPLETED, traceLog: TRACE_COMPLETED },
    ],
  },
  {
    id: 'app-008',
    studentId: '5',
    studentName: 'Aisha Patel',
    jobTitle: 'Head of Risk Management',
    company: 'Barclays',
    companyColor: '#00AEEF',
    type: 'full-time',
    source: '-',
    postedAt: 'Jun 7, 2026',
    dateApplied: 'Jun 9, 2026',
    status: 'completed',
    firstName: 'AISHA',
    lastName: 'PATEL',
    email: 'aisha.patel@gmail.com',
    phone: '+442071234567',
    gender: 'female',
    birthday: 'Apr 12, 1987',
    streetAddress: '1 Churchill Place',
    city: 'London',
    state: 'England',
    postalCode: 'E14 5HP',
    country: 'United Kingdom',
    linkedin: 'https://linkedin.com/in/aishapatel',
    resumeName: 'aisha_patel_resume.pdf',
    attempts: [
      { number: 1, status: 'completed', date: 'Jun 9, 2026 3:45 PM', logs: LOGS_COMPLETED, traceLog: TRACE_COMPLETED },
    ],
  },
  {
    id: 'app-009',
    studentId: '5',
    studentName: 'Aisha Patel',
    jobTitle: 'VP, Enterprise Risk',
    company: 'NatWest Group',
    companyColor: '#5B0EAF',
    type: 'full-time',
    source: '-',
    postedAt: 'Jun 8, 2026',
    dateApplied: 'Jun 10, 2026',
    status: 'failed',
    firstName: 'AISHA',
    lastName: 'PATEL',
    email: 'aisha.patel@gmail.com',
    phone: '+442071234567',
    gender: 'female',
    birthday: 'Apr 12, 1987',
    streetAddress: '1 Churchill Place',
    city: 'London',
    state: 'England',
    postalCode: 'E14 5HP',
    country: 'United Kingdom',
    linkedin: 'https://linkedin.com/in/aishapatel',
    resumeName: 'aisha_patel_resume.pdf',
    attempts: [
      { number: 1, status: 'failed', date: 'Jun 10, 2026 1:00 AM', statusReason: 'Failed: captcha. Unable to bypass CAPTCHA challenge during sign-in.', logs: LOGS_FAILED, traceLog: TRACE_FAILED },
    ],
  },
  {
    id: 'app-010',
    studentId: '6',
    studentName: 'Marcus Johnson',
    jobTitle: 'Compliance & Ethics Lead',
    company: 'MetLife',
    companyColor: '#0066CC',
    type: 'full-time',
    source: '-',
    postedAt: 'Jun 6, 2026',
    dateApplied: 'Jun 7, 2026',
    status: 'completed',
    firstName: 'MARCUS',
    lastName: 'JOHNSON',
    email: 'marcus.johnson@gmail.com',
    phone: '+16175550491',
    gender: 'male',
    birthday: 'Jul 19, 1988',
    streetAddress: '200 State Street',
    city: 'Boston',
    state: 'MA',
    postalCode: '02109',
    country: 'United States of America',
    linkedin: 'https://linkedin.com/in/marcusjohnson',
    resumeName: 'marcus_johnson_resume.pdf',
    attempts: [
      { number: 1, status: 'completed', date: 'Jun 7, 2026 6:55 AM', logs: LOGS_COMPLETED, traceLog: TRACE_COMPLETED },
    ],
  },
  {
    id: 'app-011',
    studentId: '7',
    studentName: 'Elena Vasquez',
    jobTitle: 'Data Privacy Officer',
    company: 'Salesforce',
    companyColor: '#00A1E0',
    type: 'full-time',
    source: '-',
    postedAt: 'Jun 5, 2026',
    dateApplied: 'Jun 6, 2026',
    status: 'needs_review',
    firstName: 'ELENA',
    lastName: 'VASQUEZ',
    email: 'elena.vasquez@gmail.com',
    phone: '+13055550271',
    gender: 'female',
    birthday: 'Feb 28, 1990',
    streetAddress: '415 NW 26th Street',
    city: 'Miami',
    state: 'FL',
    postalCode: '33127',
    country: 'United States of America',
    linkedin: 'https://linkedin.com/in/elenavasquez',
    resumeName: 'elena_vasquez_resume.pdf',
    attempts: [
      { number: 1, status: 'needs_review', date: 'Jun 6, 2026 4:30 PM', statusReason: 'Needs review: cover letter field requires manual content', logs: LOGS_COMPLETED, traceLog: TRACE_COMPLETED },
    ],
  },
  {
    id: 'app-012',
    studentId: '8',
    studentName: 'Kevin Osei',
    jobTitle: 'Regulatory Affairs Analyst',
    company: 'Fiserv',
    companyColor: '#FF6600',
    type: 'full-time',
    source: '-',
    postedAt: 'Jun 10, 2026',
    dateApplied: 'Jun 11, 2026',
    status: 'completed',
    firstName: 'KEVIN',
    lastName: 'OSEI',
    email: 'kevin.osei@gmail.com',
    phone: '+14045550639',
    gender: 'male',
    birthday: 'May 3, 1996',
    streetAddress: '3500 Lenox Road',
    city: 'Atlanta',
    state: 'GA',
    postalCode: '30326',
    country: 'United States of America',
    linkedin: 'https://linkedin.com/in/kevin.osei',
    resumeName: 'kevin_osei_resume.pdf',
    attempts: [
      { number: 1, status: 'completed', date: 'Jun 11, 2026 8:10 AM', logs: LOGS_COMPLETED, traceLog: TRACE_COMPLETED },
    ],
  },
]
