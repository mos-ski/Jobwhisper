export type ApplicationStatus = 'submitted' | 'viewed' | 'shortlisted' | 'interview' | 'rejected'

export interface MockJob {
  id: string
  title: string
  company: string
  location: string
  logoColor: string
  matchTag: string
  postedAgo: string
  description: string
  salary: string
  source: string
}

export interface MockApplication {
  id: string
  jobTitle: string
  company: string
  status: ApplicationStatus
  appliedOn: string
  logoColor: string
}

export type NotificationCategory = 'applications' | 'matches' | 'account'

export interface MockNotification {
  id: string
  category: NotificationCategory
  title: string
  body: string
  timestamp: string
  read: boolean
}

export interface MockQA {
  q: string
  a: string
}

export interface MockResume {
  name: string
  role: string
  date: string
}

export const MOCK_JOBS: MockJob[] = [
  { id: 'job-1', title: 'Product Designer', company: 'Stripe', location: 'Remote', logoColor: '#635BFF', matchTag: '95% match', postedAgo: '2h ago', description: 'Design end-to-end payment experiences used by millions of businesses worldwide. You will partner with engineering and research to ship polished, accessible interfaces.', salary: '$180k', source: 'LinkedIn' },
  { id: 'job-2', title: 'Senior Frontend Engineer', company: 'Notion', location: 'Remote · US', logoColor: '#000000', matchTag: '91% match', postedAgo: '5h ago', description: 'Build the editor experiences that power millions of workspaces. Strong React and performance instincts required.', salary: '$165k', source: 'Indeed' },
  { id: 'job-3', title: 'Product Manager', company: 'Figma', location: 'San Francisco, CA', logoColor: '#A259FF', matchTag: '88% match', postedAgo: '1d ago', description: 'Own the roadmap for collaboration features. Work closely with design and engineering to ship features used by designers everywhere.', salary: '$175k', source: 'Glassdoor' },
  { id: 'job-4', title: 'UX Researcher', company: 'Airbnb', location: 'Remote', logoColor: '#FF5A5F', matchTag: '84% match', postedAgo: '2d ago', description: 'Lead qualitative and quantitative research that shapes how millions of guests and hosts experience Airbnb.', salary: '$155k', source: 'Workable' },
  { id: 'job-5', title: 'Staff Designer', company: 'Linear', location: 'Remote', logoColor: '#5E6AD2', matchTag: '93% match', postedAgo: '3h ago', description: 'Own the end-to-end product design of Linear\'s issue tracking and project management experience. You\'ll define the visual language and interaction patterns.', salary: '$190k', source: 'LinkedIn' },
  { id: 'job-6', title: 'Design Engineer', company: 'Vercel', location: 'San Francisco, CA', logoColor: '#000000', matchTag: '87% match', postedAgo: '6h ago', description: 'Bridge design and engineering at the intersection of frontend infrastructure. Build and maintain Vercel\'s design system and developer experience.', salary: '$170k', source: 'Indeed' },
  { id: 'job-7', title: 'Senior Product Designer', company: 'OpenAI', location: 'San Francisco, CA', logoColor: '#10A37F', matchTag: '90% match', postedAgo: '1d ago', description: 'Design AI-powered experiences that push the boundaries of what\'s possible. You\'ll work on products used by millions to create, learn, and build.', salary: '$200k', source: 'LinkedIn' },
  { id: 'job-8', title: 'UX Designer', company: 'Google', location: 'New York, NY', logoColor: '#4285F4', matchTag: '82% match', postedAgo: '3d ago', description: 'Design for Google\'s core products that serve billions of users. You\'ll collaborate across teams to create intuitive, accessible experiences at scale.', salary: '$185k', source: 'Glassdoor' },
  { id: 'job-9', title: 'Design Lead', company: 'Apple', location: 'Cupertino, CA', logoColor: '#555555', matchTag: '86% match', postedAgo: '4d ago', description: 'Lead design for key iOS experiences. You\'ll define the visual direction and interaction models for features that ship to hundreds of millions of users.', salary: '$220k', source: 'Workable' },
  { id: 'job-10', title: 'Product Designer', company: 'Discord', location: 'Remote', logoColor: '#5865F2', matchTag: '89% match', postedAgo: '12h ago', description: 'Design social features that connect millions of communities. You\'ll craft delightful, real-time interaction experiences for web and mobile.', salary: '$160k', source: 'Indeed' },
  { id: 'job-11', title: 'Senior UI Designer', company: 'Spotify', location: 'New York, NY', logoColor: '#1DB954', matchTag: '85% match', postedAgo: '2d ago', description: 'Shape the visual identity of Spotify\'s listening experience. You\'ll design intuitive interfaces that help users discover and enjoy music.', salary: '$170k', source: 'LinkedIn' },
  { id: 'job-12', title: 'Design Systems Lead', company: 'GitHub', location: 'Remote', logoColor: '#24292E', matchTag: '92% match', postedAgo: '1d ago', description: 'Lead GitHub\'s design system strategy, component library, and tooling. You\'ll empower dozens of product teams to ship consistent, accessible UI.', salary: '$185k', source: 'Glassdoor' },
  { id: 'job-13', title: 'Product Design Manager', company: 'Meta', location: 'Menlo Park, CA', logoColor: '#0668E1', matchTag: '80% match', postedAgo: '5d ago', description: 'Lead and grow a team of product designers working on family of apps. You\'ll set design direction and elevate craft across the org.', salary: '$210k', source: 'Workable' },
  { id: 'job-14', title: 'Staff UX Designer', company: 'Netflix', location: 'Los Angeles, CA', logoColor: '#E50914', matchTag: '83% match', postedAgo: '3d ago', description: 'Design the streaming experience used by 250M+ subscribers. You\'ll work on content discovery, personalization, and playback experiences.', salary: '$195k', source: 'LinkedIn' },
  { id: 'job-15', title: 'Senior Designer', company: 'Pinterest', location: 'San Francisco, CA', logoColor: '#E60023', matchTag: '86% match', postedAgo: '2d ago', description: 'Design visual discovery tools that inspire millions to create their dream life. You\'ll shape the core browsing and saving experience.', salary: '$165k', source: 'Indeed' },
  { id: 'job-16', title: 'Interaction Designer', company: 'Adobe', location: 'San Jose, CA', logoColor: '#FF0000', matchTag: '81% match', postedAgo: '4d ago', description: 'Design next-generation creative tools for professionals. You\'ll define interaction patterns that make complex creative workflows feel intuitive.', salary: '$175k', source: 'Glassdoor' },
  { id: 'job-17', title: 'Design Technologist', company: 'Microsoft', location: 'Redmond, WA', logoColor: '#00A4EF', matchTag: '78% match', postedAgo: '1w ago', description: 'Bridge design and engineering on Microsoft\'s design system team. You\'ll build tooling and infrastructure that accelerates design delivery.', salary: '$160k', source: 'Workable' },
  { id: 'job-18', title: 'Product Design Lead', company: 'Supabase', location: 'Remote', logoColor: '#3ECF8E', matchTag: '94% match', postedAgo: '8h ago', description: 'Own the product design at a fast-growing developer platform. You\'ll shape the dashboard, docs, and developer experience from the ground up.', salary: '$175k', source: 'LinkedIn' },
  { id: 'job-19', title: 'Senior Product Designer', company: 'Coinbase', location: 'Remote', logoColor: '#0052FF', matchTag: '87% match', postedAgo: '1d ago', description: 'Design the future of decentralized finance. You\'ll create trusted, accessible experiences that make crypto simple and secure for everyone.', salary: '$185k', source: 'Indeed' },
  { id: 'job-20', title: 'Visual Designer', company: 'Canva', location: 'Remote', logoColor: '#00C4CC', matchTag: '90% match', postedAgo: '6h ago', description: 'Design templates and visual tools that empower anyone to create. You\'ll define the visual language across Canva\'s ever-expanding product.', salary: '$155k', source: 'Glassdoor' },
  { id: 'job-21', title: 'Design Operations Lead', company: 'Atlassian', location: 'New York, NY', logoColor: '#0052CC', matchTag: '79% match', postedAgo: '6d ago', description: 'Build the systems and processes that enable design teams to do their best work. You\'ll drive design ops strategy across a global org.', salary: '$170k', source: 'Workable' },
  { id: 'job-22', title: 'Senior UX Designer', company: 'Shopify', location: 'Remote', logoColor: '#96BF48', matchTag: '88% match', postedAgo: '3d ago', description: 'Design commerce experiences for millions of entrepreneurs. You\'ll work on the core merchant platform that powers independent businesses.', salary: '$165k', source: 'LinkedIn' },
  { id: 'job-23', title: 'Product Designer', company: 'Datadog', location: 'New York, NY', logoColor: '#632CA6', matchTag: '84% match', postedAgo: '2d ago', description: 'Design monitoring and observability tools for engineering teams. You\'ll turn complex data into clear, actionable visualizations.', salary: '$170k', source: 'Indeed' },
  { id: 'job-24', title: 'Staff Product Designer', company: 'Rippling', location: 'San Francisco, CA', logoColor: '#1E3A5F', matchTag: '85% match', postedAgo: '1d ago', description: 'Design the all-in-one platform for HR, IT, and finance. You\'ll own critical product areas and drive design strategy across the company.', salary: '$190k', source: 'Glassdoor' },
  { id: 'job-25', title: 'Design Manager', company: 'HubSpot', location: 'Remote', logoColor: '#FF7A59', matchTag: '82% match', postedAgo: '4d ago', description: 'Lead a team of product designers building the CRM platform for scaling businesses. You\'ll mentor designers and shape product strategy.', salary: '$180k', source: 'Workable' },
]

export const MOCK_APPLICATIONS: MockApplication[] = [
  { id: 'app-1', jobTitle: 'Product Designer', company: 'Stripe', status: 'interview', appliedOn: '3rd Jun, 2026', logoColor: '#635BFF' },
  { id: 'app-2', jobTitle: 'Senior Frontend Engineer', company: 'Notion', status: 'shortlisted', appliedOn: '1st Jun, 2026', logoColor: '#000000' },
  { id: 'app-3', jobTitle: 'Staff Designer', company: 'Linear', status: 'viewed', appliedOn: '29th May, 2026', logoColor: '#5E6AD2' },
  { id: 'app-4', jobTitle: 'Product Manager', company: 'Figma', status: 'submitted', appliedOn: '27th May, 2026', logoColor: '#A259FF' },
  { id: 'app-5', jobTitle: 'UX Lead', company: 'Duolingo', status: 'rejected', appliedOn: '20th May, 2026', logoColor: '#58CC02' },
]

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  { id: 'notif-1', category: 'applications', title: 'Stripe wants to schedule an interview', body: 'Tap to respond and pick a time that works for you.', timestamp: '10 min ago', read: false },
  { id: 'notif-2', category: 'matches', title: '3 new roles match your profile', body: 'Including a Senior Designer role at Google.', timestamp: '2 hours ago', read: false },
  { id: 'notif-3', category: 'applications', title: 'Someone at Notion viewed your application', body: 'Your Senior Frontend Engineer application is getting attention — stay ready.', timestamp: '5 hours ago', read: false },
  { id: 'notif-4', category: 'account', title: 'You have 1 credit left', body: 'Top up before your next interview session.', timestamp: '1 day ago', read: true },
  { id: 'notif-5', category: 'applications', title: "Good news — you've been shortlisted", body: 'Your Senior Frontend Engineer application at Notion was shortlisted.', timestamp: '2 days ago', read: true },
  { id: 'notif-6', category: 'applications', title: "Your application to Duolingo wasn't selected this time", body: 'Keep going — three new roles are waiting for you.', timestamp: '4 days ago', read: true },
]

export const MOCK_QA: MockQA[] = [
  { q: 'Can you tell me a little bit about yourself and your background?', a: "I'm a product designer with 6 years of experience building digital products across fintech and AI. I've shipped a dozen live products end to end, from early discovery through launch and iteration." },
  { q: 'What would you say is your greatest professional strength?', a: 'My greatest strength is owning the full product lifecycle — from strategy through to shipped, polished experiences. That end-to-end ownership cuts handoff friction and speeds up delivery.' },
  { q: 'Why are you interested in this role specifically?', a: "I've followed your team's work closely, and the focus on accessible, user-centred products lines up with what I care most about building. I'd love to bring that same care here." },
  { q: 'Walk me through how you approach a brand new feature.', a: 'I start with the problem, not the solution — talking to users, reviewing data, mapping the journey. Then I prototype early and test before committing to a full build.' },
]

export const MOCK_RESUMES: MockResume[] = [
  { name: 'Darnell Smith', role: 'Product Designer', date: '1st Jun, 2026' },
  { name: 'Darnell Smith', role: 'UI/UX Designer', date: '15th Apr, 2026' },
]
