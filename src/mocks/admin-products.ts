import type {
  AdminDoneForYouLead,
  AdminProductDetail,
  AdminProductDetailStat,
  AdminProductErrorGroup,
  AdminProductRow,
  AdminProductSessionOutcome,
  AdminProductSessionRow,
  AdminProductSku,
  AdminProductSummaryStat,
  AdminProductTierId,
  AdminProductTrendPoint,
} from '@/contracts/admin-products.draft'

export const adminProductRangeLabel = 'Aug 5 – Sep 3, 2026'

/** Distinct accounts that used at least one product in range, the denominator behind every adoption %. */
const DISTINCT_ACTIVE_ACCOUNTS = 9_214

export const adminProductSummary: readonly AdminProductSummaryStat[] = [
  {
    id: 'active-users',
    label: 'Active users',
    value: DISTINCT_ACTIVE_ACCOUNTS,
    format: 'count',
    caption: 'Distinct accounts that opened at least one product',
    deltaPercent: 9.3,
    deltaDirection: 'up',
    higherIsBetter: true,
  },
  {
    id: 'sessions',
    label: 'Sessions in range',
    value: 125_920,
    format: 'count',
    caption: 'Copilot and Prep sessions, Auto Apply runs, Resume prompts',
    deltaPercent: 14.1,
    deltaDirection: 'up',
    higherIsBetter: true,
  },
  {
    id: 'credits',
    label: 'Credits consumed',
    value: 812_940,
    format: 'count',
    caption: '1 credit ≈ 1 minute of Copilot',
    deltaPercent: 15.2,
    deltaDirection: 'up',
    higherIsBetter: true,
  },
  {
    id: 'revenue',
    label: 'Product revenue',
    value: 120_000_000,
    format: 'usd-cents',
    caption: 'Subscriptions, prepaid credits, packages, and marketplace',
    deltaPercent: 11.8,
    deltaDirection: 'up',
    higherIsBetter: true,
  },
]

const ALL_TIERS: readonly AdminProductTierId[] = ['unsubscribed', 'starter', 'pro', 'premium']
const PAID_COPILOT_TIERS: readonly AdminProductTierId[] = ['pro', 'premium']

export const adminProducts: readonly AdminProductRow[] = [
  {
    id: 'interview-prep',
    revenueParentId: 'interview-prep',
    name: 'Interview Prep',
    summary: 'Practice rounds with generated questions and a scored report.',
    status: 'live',
    saleModel: 'subscription',
    includedTiers: ALL_TIERS,
    tierNote: 'All tiers, plus the free 50 min/mo base',
    activeUsers: 2_874,
    sessionsInRange: 38_140,
    creditsConsumed: 196_480,
    revenueCents: 13_200_000,
    adoptionPercent: 31,
    health: {
      state: 'healthy',
      label: 'Healthy',
      detail: 'Report generation p95 at 41s, well inside the 90s budget.',
      errorRatePercent: 1.2,
    },
    detailHref: '/admin/products/interview-prep',
    blastRadiusUsers: 23_530,
    blastRadiusLabel: 'all 5,128 subscribers and the 18,402 accounts on the free 50 min/mo base',
  },
  {
    id: 'interview-copilot-web',
    revenueParentId: 'interview-copilot',
    name: 'Interview Copilot (web)',
    summary: 'Live in-interview answers in the browser tab.',
    status: 'live',
    saleModel: 'subscription',
    includedTiers: ALL_TIERS,
    tierNote: 'All tiers, plus the free 50 min/mo base',
    activeUsers: 2_610,
    sessionsInRange: 41_280,
    creditsConsumed: 318_400,
    revenueCents: 26_400_000,
    adoptionPercent: 28,
    health: {
      state: 'healthy',
      label: 'Healthy',
      detail: 'Transcript stream reconnects under 2s on 99.1% of drops.',
      errorRatePercent: 2.4,
    },
    detailHref: '/admin/products/interview-copilot-web',
    blastRadiusUsers: 23_530,
    blastRadiusLabel: 'all 5,128 subscribers and the 18,402 accounts on the free 50 min/mo base',
  },
  {
    id: 'interview-copilot-desktop',
    revenueParentId: 'interview-copilot',
    name: 'Interview Copilot (desktop)',
    summary: 'Always-on-top window that captures audio outside the browser.',
    status: 'live',
    saleModel: 'subscription',
    includedTiers: PAID_COPILOT_TIERS,
    tierNote: 'Pro and Premium',
    activeUsers: 812,
    sessionsInRange: 12_640,
    creditsConsumed: 104_760,
    revenueCents: 8_400_000,
    adoptionPercent: 9,
    health: {
      state: 'watch',
      label: 'Elevated errors',
      detail: 'Build 4.2.1 loses the capture device when macOS switches output mid-call.',
      errorRatePercent: 6.8,
    },
    detailHref: '/admin/products/interview-copilot-desktop',
    blastRadiusUsers: 3_319,
    blastRadiusLabel: '3,319 Pro and Premium subscribers',
  },
  {
    id: 'coding-copilot',
    revenueParentId: 'interview-copilot',
    name: 'Coding Copilot',
    summary: 'Reads the shared editor pane during a technical screen.',
    status: 'degraded',
    statusReason:
      'Chrome 141 changed the screen-share handshake on Sep 1. 18.4% of sessions since then never received an editor frame, so the session starts but never answers.',
    saleModel: 'subscription',
    includedTiers: PAID_COPILOT_TIERS,
    tierNote: 'Pro and Premium',
    activeUsers: 366,
    sessionsInRange: 5_910,
    creditsConsumed: 51_320,
    revenueCents: 4_200_000,
    adoptionPercent: 4,
    health: {
      state: 'critical',
      label: 'Failing',
      detail: 'Capture handshake fails on Chrome 141. Fix is in review, no rollback available.',
      errorRatePercent: 18.4,
    },
    detailHref: '/admin/products/coding-copilot',
    blastRadiusUsers: 3_319,
    blastRadiusLabel: '3,319 Pro and Premium subscribers',
  },
  {
    id: 'meeting-copilot',
    revenueParentId: 'interview-copilot',
    name: 'Meeting Copilot',
    summary: 'Joins recruiter and hiring-manager calls as a note-taking participant.',
    status: 'beta',
    saleModel: 'subscription',
    includedTiers: PAID_COPILOT_TIERS,
    tierNote: 'Pro and Premium, beta opt-in',
    activeUsers: 154,
    sessionsInRange: 2_480,
    creditsConsumed: 22_140,
    revenueCents: 1_800_000,
    adoptionPercent: 2,
    health: {
      state: 'watch',
      label: 'Elevated errors',
      detail: 'Zoom admission times out when the host has a waiting room enabled.',
      errorRatePercent: 9.6,
    },
    detailHref: '/admin/products/meeting-copilot',
    blastRadiusUsers: 3_319,
    blastRadiusLabel: '3,319 Pro and Premium subscribers, 154 of them active in the beta',
  },
  {
    id: 'auto-apply',
    revenueParentId: 'auto-apply',
    name: 'Auto Apply',
    summary: 'Scouts, filters, tailors, and submits applications end to end.',
    status: 'live',
    saleModel: 'prepaid-credits',
    includedTiers: [],
    tierNote: 'Sold standalone, $10 minimum, $1 per successful application',
    activeUsers: 2_186,
    sessionsInRange: 9_640,
    creditsConsumed: 84_320,
    revenueCents: 32_400_000,
    adoptionPercent: 24,
    health: {
      state: 'watch',
      label: 'Elevated errors',
      detail: 'Workday postings expire mid-run more often since their Aug 27 form change.',
      errorRatePercent: 7.1,
    },
    detailHref: '/admin/products/auto-apply',
    blastRadiusUsers: 2_186,
    blastRadiusLabel: '2,186 accounts holding an Auto Apply credit balance',
  },
  {
    id: 'resume-builder',
    revenueParentId: 'resume-builder',
    name: 'Resume Builder',
    summary: 'Build, fix, and tailor a resume prompt by prompt.',
    status: 'live',
    saleModel: 'prepaid-credits',
    includedTiers: [],
    tierNote: 'Sold standalone, $5 minimum, $0.10 per prompt',
    activeUsers: 1_615,
    sessionsInRange: 11_270,
    creditsConsumed: 35_520,
    revenueCents: 10_800_000,
    adoptionPercent: 18,
    health: {
      state: 'healthy',
      label: 'Healthy',
      detail: 'PDF export succeeds on 99.4% of first attempts.',
      errorRatePercent: 1.8,
    },
    detailHref: '/admin/products/resume-builder',
    blastRadiusUsers: 1_615,
    blastRadiusLabel: '1,615 accounts holding a Resume Builder credit balance',
  },
  {
    id: 'done-for-you',
    revenueParentId: 'done-for-you',
    name: 'Done For You',
    summary: 'A success manager applies on the client behalf, 10 or 20 interviews guaranteed.',
    status: 'live',
    saleModel: 'package',
    includedTiers: [],
    tierNote: 'One-time packages, $497 for 10 interviews and $997 for 20',
    activeUsers: 214,
    sessionsInRange: 642,
    creditsConsumed: 0,
    revenueCents: 18_000_000,
    adoptionPercent: 2,
    health: {
      state: 'healthy',
      label: 'Healthy',
      detail: 'Every active engagement is inside its committed job count.',
      errorRatePercent: 0.9,
    },
    detailHref: '/admin/products/done-for-you',
    blastRadiusUsers: 214,
    blastRadiusLabel: '214 clients mid-package and the 6 success managers working their queues',
    // Matches the Products nav badge, which counts `adminDoneForYouLeads` in the 'new' stage.
    // Kept a literal because that array is declared further down this file.
    attentionCount: 2,
    attentionLabel: 'new leads',
  },
  {
    id: 'marketplace',
    revenueParentId: 'marketplace',
    name: 'Marketplace',
    summary: 'One-time swipe files, scripts, and resume templates.',
    status: 'disabled',
    statusReason:
      'Switched off Sep 1 by Daniel Okoye while the $497 Done For You package moves into the checkout cart. Existing buyers keep their downloads.',
    saleModel: 'one-time',
    includedTiers: [],
    tierNote: 'One-time purchases, $9 to $29',
    activeUsers: 2_480,
    sessionsInRange: 3_918,
    creditsConsumed: 0,
    revenueCents: 4_800_000,
    adoptionPercent: 27,
    health: {
      state: 'healthy',
      label: 'Healthy',
      detail: 'No failures recorded before the product was switched off.',
      errorRatePercent: 0.4,
    },
    detailHref: '/admin/products/marketplace',
    blastRadiusUsers: 23_530,
    blastRadiusLabel: 'every signed-in account, 23,530 in total',
  },
]

/**
 * Same nine products with the names, figures, and reasons an admin actually hits in a busy month:
 * platform-qualified names that wrap, seven-figure counts, and two products off at once.
 */
export const adminProductsDense: readonly AdminProductRow[] = adminProducts.map((product, index) => {
  const denseNames: Record<AdminProductSku, string> = {
    'interview-prep': 'Interview Prep · behavioral, system design, and case rounds',
    'interview-copilot-web': 'Interview Copilot (web) · Chrome, Edge, Safari, and Firefox',
    'interview-copilot-desktop': 'Interview Copilot (desktop app) · Windows, macOS, and Linux builds',
    'coding-copilot': 'Coding Copilot · CoderPad, HackerRank, CodeSignal, and shared editors',
    'meeting-copilot': 'Meeting Copilot · Zoom, Google Meet, and Microsoft Teams beta',
    'auto-apply': 'Auto Apply · AI-run scouting, tailoring, and submission',
    'resume-builder': 'Resume Builder · build, fix, tailor, and export',
    'done-for-you': 'Done For You · managed applications with an assigned success manager',
    marketplace: 'Marketplace · swipe files, negotiation scripts, and resume templates',
  }

  return {
    ...product,
    name: denseNames[product.id],
    activeUsers: product.activeUsers * 9 + 417,
    sessionsInRange: product.sessionsInRange * 11 + 2_384,
    creditsConsumed: product.creditsConsumed * 12,
    revenueCents: product.revenueCents * 12,
    status: index === 4 ? 'disabled' : product.status,
    statusReason:
      index === 4
        ? 'Switched off Aug 29 by Priya Raghunathan after the Zoom waiting-room admission bug hit 31% of beta joins.'
        : product.statusReason,
  }
})

export const adminDoneForYouLeads: readonly AdminDoneForYouLead[] = [
  {
    id: 'dfy_lead_001',
    accountId: 'acct_grace_abernathy',
    userName: 'Grace Abernathy',
    userEmail: 'grace.abernathy@example.com',
    userPhone: '+1 (720) 555-0148',
    packageId: 'dfy-large',
    amountPaidCents: 99_700,
    signedUpLabel: 'Sep 4, 2026',
    stage: 'new',
    targetRoles: ['Engineering Manager', 'Director of Engineering'],
    experienceLevel: 'Lead',
    locations: ['Denver, CO', 'Remote'],
    resumeFileName: 'Grace Abernathy_Engineering Manager_2026.pdf',
    excludedCompanies: 'Current employer (Airbnb)',
    shareSalaryExpectations: true,
    contactPreference: 'email',
    contactNote: 'Weekday afternoons, MT',
    agreedToTermsLabel: 'Sep 4, 2026 · 9:12 AM',
    applicationLog: [],
  },
  {
    id: 'dfy_lead_002',
    accountId: 'acct_jonas_lindberg',
    userName: 'Jonas Lindberg',
    userEmail: 'jonas.lindberg@example.com',
    userPhone: '+46 70 555 0113',
    packageId: 'dfy-small',
    amountPaidCents: 49_700,
    signedUpLabel: 'Sep 3, 2026',
    stage: 'new',
    targetRoles: ['Technical Program Manager'],
    experienceLevel: 'Senior',
    locations: ['Stockholm, Sweden', 'Remote'],
    resumeFileName: 'Jonas Lindberg_TPM_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: false,
    contactPreference: 'either',
    contactNote: '',
    agreedToTermsLabel: 'Sep 3, 2026 · 2:40 PM',
    applicationLog: [],
  },
  {
    id: 'dfy_lead_003',
    accountId: 'acct_zainab_al_rashid',
    userName: 'Zainab Al-Rashid',
    userEmail: 'zainab.alrashid@example.com',
    userPhone: '+971 50 555 0177',
    packageId: 'dfy-large',
    amountPaidCents: 99_700,
    signedUpLabel: 'Sep 3, 2026',
    stage: 'call',
    targetRoles: ['Growth Marketing Lead', 'Head of Growth'],
    experienceLevel: 'Lead',
    locations: ['Dubai, UAE', 'Remote'],
    resumeFileName: 'Zainab Al-Rashid_Growth Lead_2026.pdf',
    excludedCompanies: 'Twilio (past employer, NDA)',
    shareSalaryExpectations: true,
    contactPreference: 'phone',
    contactNote: 'Call scheduled Sep 5, 2pm GST',
    agreedToTermsLabel: 'Sep 3, 2026 · 11:05 AM',
    applicationLog: [],
  },
  {
    id: 'dfy_lead_004',
    accountId: 'acct_nikhil_ramanathan',
    userName: 'Nikhil Ramanathan',
    userEmail: 'nikhil.ramanathan@example.com',
    userPhone: '+91 98 5550 1142',
    packageId: 'dfy-small',
    amountPaidCents: 49_700,
    signedUpLabel: 'Sep 2, 2026',
    stage: 'call',
    targetRoles: ['Mobile Engineer, iOS'],
    experienceLevel: 'Mid Level',
    locations: ['Bengaluru, India'],
    resumeFileName: 'Nikhil Ramanathan_iOS Engineer_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: true,
    contactPreference: 'email',
    contactNote: 'Best reached after 7pm IST',
    agreedToTermsLabel: 'Sep 2, 2026 · 6:22 PM',
    applicationLog: [],
  },
  {
    id: 'dfy_lead_005',
    accountId: 'acct_olga_vasilenko',
    userName: 'Olga Vasilenko',
    userEmail: 'olga.vasilenko@example.com',
    userPhone: '+380 44 555 0199',
    packageId: 'dfy-small',
    amountPaidCents: 49_700,
    signedUpLabel: 'Aug 31, 2026',
    stage: 'call',
    targetRoles: ['Product Designer'],
    experienceLevel: 'Senior',
    locations: ['Warsaw, Poland', 'Remote'],
    resumeFileName: 'Olga Vasilenko_Product Designer_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: true,
    contactPreference: 'email',
    contactNote: '',
    agreedToTermsLabel: 'Aug 31, 2026 · 10:15 AM',
    assignedSuccessManager: 'Rachel Adeyemi',
    applicationLog: [],
  },
  {
    id: 'dfy_lead_006',
    accountId: 'acct_gregory_whitfield',
    userName: 'Gregory Whitfield',
    userEmail: 'gregory.whitfield@example.com',
    userPhone: '+44 161 555 0134',
    packageId: 'dfy-large',
    amountPaidCents: 99_700,
    signedUpLabel: 'Aug 30, 2026',
    stage: 'declined',
    targetRoles: ['Engineering Manager'],
    experienceLevel: 'Lead',
    locations: ['Manchester, UK'],
    resumeFileName: 'Gregory Whitfield_Engineering Manager_2026.pdf',
    excludedCompanies: 'Mastercard (current employer)',
    shareSalaryExpectations: false,
    contactPreference: 'phone',
    contactNote: 'Prefers LinkedIn outreach handled manually, not through the platform',
    agreedToTermsLabel: 'Aug 30, 2026 · 4:50 PM',
    applicationLog: [],
  },
  {
    id: 'dfy_lead_007',
    accountId: 'acct_darnell_smith',
    userName: 'Darnell Smith',
    userEmail: 'darnell.smith@example.com',
    userPhone: '+1 (404) 555-0176',
    packageId: 'dfy-large',
    amountPaidCents: 99_700,
    signedUpLabel: 'Aug 30, 2026',
    stage: 'call',
    targetRoles: ['Senior Product Manager'],
    experienceLevel: 'Senior',
    locations: ['Atlanta, GA', 'Remote'],
    resumeFileName: 'Darnell Smith_Product Manager_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: true,
    contactPreference: 'email',
    contactNote: '',
    agreedToTermsLabel: 'Aug 30, 2026 · 11:20 AM',
    assignedSuccessManager: 'Daniel Okoye',
    applicationLog: [
      { id: 'dfy_log_001', jobTitle: 'Senior Product Manager', companyName: 'Stripe', link: 'https://stripe.com/jobs/listing/senior-product-manager/6034812', appliedLabel: 'Sep 1, 2026', loggedBy: 'Daniel Okoye' },
      { id: 'dfy_log_002', jobTitle: 'Product Manager, Platform', companyName: 'Shopify', link: 'https://www.shopify.com/careers/product-manager-platform-7729', appliedLabel: 'Sep 2, 2026', loggedBy: 'Daniel Okoye' },
      { id: 'dfy_log_003', jobTitle: 'Senior PM, Payments', companyName: 'Block', link: 'https://block.xyz/careers/senior-pm-payments-4471', appliedLabel: 'Sep 3, 2026', loggedBy: 'Daniel Okoye' },
    ],
  },
  {
    id: 'dfy_lead_008',
    accountId: 'acct_priyanka_venkataraman',
    userName: 'Priyanka Venkataraman-Krishnamurthy',
    userEmail: 'priyanka.venkataraman.krishnamurthy@postgraduate-careers.example.edu',
    userPhone: '+1 (415) 555-0122',
    packageId: 'dfy-large',
    amountPaidCents: 99_700,
    signedUpLabel: 'Aug 27, 2026',
    stage: 'call',
    targetRoles: ['Staff Frontend Engineer'],
    experienceLevel: 'Senior',
    locations: ['San Francisco, CA', 'Remote'],
    resumeFileName: 'Priyanka Venkataraman-Krishnamurthy_Frontend Engineer_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: true,
    contactPreference: 'email',
    contactNote: '',
    agreedToTermsLabel: 'Aug 27, 2026 · 3:05 PM',
    assignedSuccessManager: 'Priya Raghunathan',
    applicationLog: [
      { id: 'dfy_log_004', jobTitle: 'Staff Frontend Engineer', companyName: 'Figma', link: 'https://www.figma.com/careers/roles/staff-frontend-engineer-5521', appliedLabel: 'Aug 28, 2026', loggedBy: 'Priya Raghunathan' },
      { id: 'dfy_log_005', jobTitle: 'Staff Engineer, Web Platform', companyName: 'Notion', link: 'https://www.notion.so/careers/staff-engineer-web-platform-3390', appliedLabel: 'Aug 29, 2026', loggedBy: 'Priya Raghunathan' },
    ],
  },
  {
    id: 'dfy_lead_009',
    accountId: 'acct_marcus_bell',
    userName: 'Marcus Bell',
    userEmail: 'marcus.bell@example.com',
    userPhone: '+1 (678) 555-0190',
    packageId: 'dfy-small',
    amountPaidCents: 49_700,
    signedUpLabel: 'Aug 24, 2026',
    stage: 'completed',
    targetRoles: ['Data Scientist'],
    experienceLevel: 'Mid Level',
    locations: ['Atlanta, GA'],
    resumeFileName: 'Marcus Bell_Data Scientist_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: true,
    contactPreference: 'phone',
    contactNote: '',
    agreedToTermsLabel: 'Aug 24, 2026 · 9:40 AM',
    assignedSuccessManager: 'Rachel Adeyemi',
    applicationLog: [],
  },
  {
    id: 'dfy_lead_010',
    accountId: 'acct_sofia_marchetti',
    userName: 'Sofia Marchetti',
    userEmail: 'sofia.marchetti@example.com',
    userPhone: '+39 06 555 0163',
    packageId: 'dfy-small',
    amountPaidCents: 49_700,
    signedUpLabel: 'Sep 3, 2026',
    stage: 'call',
    targetRoles: ['Product Designer'],
    experienceLevel: 'Mid Level',
    locations: ['Rome, Italy', 'Remote'],
    resumeFileName: 'Sofia Marchetti_Product Designer_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: true,
    contactPreference: 'email',
    contactNote: '',
    agreedToTermsLabel: 'Sep 3, 2026 · 4:15 PM',
    assignedSuccessManager: 'Daniel Okoye',
    applicationLog: [],
  },
  {
    id: 'dfy_lead_011',
    accountId: 'acct_hannah_kirsch',
    userName: 'Hannah Kirsch',
    userEmail: 'hannah.kirsch@example.com',
    userPhone: '+1 (303) 555-0141',
    packageId: 'dfy-large',
    amountPaidCents: 99_700,
    signedUpLabel: 'Aug 19, 2026',
    stage: 'completed',
    targetRoles: ['Engineering Manager'],
    experienceLevel: 'Lead',
    locations: ['Denver, CO', 'Remote'],
    resumeFileName: 'Hannah Kirsch_Engineering Manager_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: true,
    contactPreference: 'email',
    contactNote: '',
    agreedToTermsLabel: 'Aug 19, 2026 · 1:30 PM',
    assignedSuccessManager: 'Priya Raghunathan',
    applicationLog: [],
  },
  {
    id: 'dfy_lead_012',
    accountId: 'acct_fatima_al_mansouri',
    userName: 'Fatima Al-Mansouri',
    userEmail: 'fatima.almansouri@example.com',
    userPhone: '+971 4 555 0128',
    packageId: 'dfy-small',
    amountPaidCents: 49_700,
    signedUpLabel: 'Sep 1, 2026',
    stage: 'call',
    targetRoles: ['Solutions Architect'],
    experienceLevel: 'Senior',
    locations: ['Dubai, UAE', 'Remote'],
    resumeFileName: 'Fatima Al-Mansouri_Solutions Architect_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: true,
    contactPreference: 'phone',
    contactNote: '',
    agreedToTermsLabel: 'Sep 1, 2026 · 10:50 AM',
    assignedSuccessManager: 'Rachel Adeyemi',
    applicationLog: [],
  },
  {
    id: 'dfy_lead_013',
    accountId: 'acct_nkechi_obiora',
    userName: 'Nkechi Obiora',
    userEmail: 'nkechi.obiora@example.com',
    userPhone: '+234 1 555 0187',
    packageId: 'dfy-large',
    amountPaidCents: 99_700,
    signedUpLabel: 'Aug 28, 2026',
    stage: 'call',
    targetRoles: ['Security Engineer'],
    experienceLevel: 'Senior',
    locations: ['Lagos, Nigeria', 'Remote'],
    resumeFileName: 'Nkechi Obiora_Security Engineer_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: true,
    contactPreference: 'email',
    contactNote: '',
    agreedToTermsLabel: 'Aug 28, 2026 · 8:15 AM',
    assignedSuccessManager: 'Daniel Okoye',
    applicationLog: [],
  },
  {
    id: 'dfy_lead_014',
    accountId: 'acct_ryan_delacroix',
    userName: 'Ryan Delacroix',
    userEmail: 'ryan.delacroix@example.com',
    userPhone: '+1 (514) 555-0155',
    packageId: 'dfy-small',
    amountPaidCents: 49_700,
    signedUpLabel: 'Sep 3, 2026',
    stage: 'call',
    targetRoles: ['Growth Marketing Lead'],
    experienceLevel: 'Mid Level',
    locations: ['Montreal, QC', 'Remote'],
    resumeFileName: 'Ryan Delacroix_Growth Marketing Lead_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: true,
    contactPreference: 'email',
    contactNote: '',
    agreedToTermsLabel: 'Sep 3, 2026 · 5:40 PM',
    assignedSuccessManager: 'Priya Raghunathan',
    applicationLog: [],
  },
  {
    id: 'dfy_lead_015',
    accountId: 'acct_yuki_tanaka',
    userName: 'Yuki Tanaka',
    userEmail: 'yuki.tanaka@example.com',
    userPhone: '+81 3 5550 1149',
    packageId: 'dfy-large',
    amountPaidCents: 99_700,
    signedUpLabel: 'Aug 14, 2026',
    stage: 'completed',
    targetRoles: ['Machine Learning Engineer'],
    experienceLevel: 'Senior',
    locations: ['Tokyo, Japan', 'Remote'],
    resumeFileName: 'Yuki Tanaka_Machine Learning Engineer_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: true,
    contactPreference: 'email',
    contactNote: '',
    agreedToTermsLabel: 'Aug 14, 2026 · 7:25 AM',
    assignedSuccessManager: 'Rachel Adeyemi',
    applicationLog: [
      { id: 'dfy_log_006', jobTitle: 'Machine Learning Engineer', companyName: 'Preferred Networks', link: 'https://www.preferred.jp/en/careers/machine-learning-engineer-118', appliedLabel: 'Aug 18, 2026', loggedBy: 'Rachel Adeyemi' },
      { id: 'dfy_log_007', jobTitle: 'ML Engineer, Search Ranking', companyName: 'Rakuten', link: 'https://global.rakuten.com/corp/careers/ml-engineer-search-ranking-2287', appliedLabel: 'Aug 21, 2026', loggedBy: 'Rachel Adeyemi' },
      { id: 'dfy_log_008', jobTitle: 'Applied Scientist, ML', companyName: 'LINE', link: 'https://linecorp.com/en/career/position/applied-scientist-ml-905', appliedLabel: 'Aug 25, 2026', loggedBy: 'Rachel Adeyemi' },
    ],
  },
  {
    id: 'dfy_lead_016',
    accountId: 'acct_diego_restrepo',
    userName: 'Diego Restrepo',
    userEmail: 'diego.restrepo@example.com',
    userPhone: '+57 1 555 0172',
    packageId: 'dfy-small',
    amountPaidCents: 49_700,
    signedUpLabel: 'Aug 31, 2026',
    stage: 'call',
    targetRoles: ['Site Reliability Engineer'],
    experienceLevel: 'Mid Level',
    locations: ['Bogotá, Colombia', 'Remote'],
    resumeFileName: 'Diego Restrepo_Site Reliability Engineer_2026.pdf',
    excludedCompanies: '',
    shareSalaryExpectations: true,
    contactPreference: 'email',
    contactNote: '',
    agreedToTermsLabel: 'Aug 31, 2026 · 2:10 PM',
    assignedSuccessManager: 'Daniel Okoye',
    applicationLog: [],
  },
]

const CANDIDATES: readonly { readonly name: string; readonly email: string; readonly plan: AdminProductTierId }[] = [
  { name: 'Darnell Smith', email: 'darnell.smith@example.com', plan: 'pro' },
  { name: 'Amara Nwosu', email: 'amara.nwosu@example.com', plan: 'starter' },
  { name: 'Yuki Tanaka', email: 'yuki.tanaka@example.com', plan: 'premium' },
  { name: 'Marcus Bell', email: 'marcus.bell@example.com', plan: 'pro' },
  { name: 'Sofia Marchetti', email: 'sofia.marchetti@example.com', plan: 'starter' },
  { name: 'Kwame Mensah', email: 'kwame.mensah@example.com', plan: 'pro' },
  { name: 'Hannah Lindqvist', email: 'hannah.lindqvist@example.com', plan: 'premium' },
  { name: 'Rajesh Iyer', email: 'rajesh.iyer@example.com', plan: 'pro' },
  { name: 'Chloe Beaumont', email: 'chloe.beaumont@example.com', plan: 'unsubscribed' },
  { name: 'Tobias Kruger', email: 'tobias.kruger@example.com', plan: 'starter' },
  { name: 'Ifeoma Okafor', email: 'ifeoma.okafor@example.com', plan: 'pro' },
  { name: 'Daniel Petrov', email: 'daniel.petrov@example.com', plan: 'premium' },
  { name: 'Mei-Ling Chow', email: 'meiling.chow@example.com', plan: 'pro' },
  { name: 'Grace Abernathy', email: 'grace.abernathy@example.com', plan: 'starter' },
  { name: 'Omar Haddad', email: 'omar.haddad@example.com', plan: 'pro' },
  { name: 'Priyanka Deshmukh', email: 'priyanka.deshmukh@example.com', plan: 'premium' },
  { name: 'Ethan Caldwell', email: 'ethan.caldwell@example.com', plan: 'unsubscribed' },
  { name: 'Ana Lucia Ferreira', email: 'analucia.ferreira@example.com', plan: 'pro' },
  { name: 'Jonas Lindberg', email: 'jonas.lindberg@example.com', plan: 'starter' },
  { name: 'Naledi Motsepe', email: 'naledi.motsepe@example.com', plan: 'pro' },
  { name: 'Victor Nakamura', email: 'victor.nakamura@example.com', plan: 'premium' },
  { name: 'Rebecca Osei', email: 'rebecca.osei@example.com', plan: 'pro' },
  { name: 'Liam Fitzgerald', email: 'liam.fitzgerald@example.com', plan: 'starter' },
  { name: 'Zainab Al-Rashid', email: 'zainab.alrashid@example.com', plan: 'pro' },
  { name: 'Andres Villalobos', email: 'andres.villalobos@example.com', plan: 'unsubscribed' },
  { name: 'Kirsten Vandenberg', email: 'kirsten.vandenberg@example.com', plan: 'premium' },
  { name: 'Samuel Adeyinka', email: 'samuel.adeyinka@example.com', plan: 'pro' },
  { name: 'Elena Kowalczyk', email: 'elena.kowalczyk@example.com', plan: 'starter' },
  { name: 'Nikhil Ramanathan', email: 'nikhil.ramanathan@example.com', plan: 'pro' },
  { name: 'Beatrice Cheng', email: 'beatrice.cheng@example.com', plan: 'premium' },
  { name: 'Diego Fuentes', email: 'diego.fuentes@example.com', plan: 'starter' },
  { name: 'Aisha Bello', email: 'aisha.bello@example.com', plan: 'pro' },
  { name: 'Patrick O’Sullivan', email: 'patrick.osullivan@example.com', plan: 'unsubscribed' },
  { name: 'Lena Hoffmann', email: 'lena.hoffmann@example.com', plan: 'pro' },
  { name: 'Tunde Balogun', email: 'tunde.balogun@example.com', plan: 'premium' },
  { name: 'Camille Roussel', email: 'camille.roussel@example.com', plan: 'starter' },
  { name: 'Arjun Malhotra', email: 'arjun.malhotra@example.com', plan: 'pro' },
  { name: 'Fatima Zahra Benali', email: 'fatimazahra.benali@example.com', plan: 'pro' },
  { name: 'Gregory Whitfield', email: 'gregory.whitfield@example.com', plan: 'starter' },
  { name: 'Sun-Hee Park', email: 'sunhee.park@example.com', plan: 'premium' },
  { name: 'Ibrahim Toure', email: 'ibrahim.toure@example.com', plan: 'pro' },
  { name: 'Madeleine Fontaine', email: 'madeleine.fontaine@example.com', plan: 'unsubscribed' },
  { name: 'Wesley Anand', email: 'wesley.anand@example.com', plan: 'pro' },
  { name: 'Olga Vasilenko', email: 'olga.vasilenko@example.com', plan: 'starter' },
  { name: 'Chidi Eze', email: 'chidi.eze@example.com', plan: 'premium' },
  { name: 'Tanvi Krishnan', email: 'tanvi.krishnan@example.com', plan: 'pro' },
  { name: 'Robert Ellingsworth-Hayes', email: 'robert.ellingsworth-hayes@example.com', plan: 'pro' },
  { name: 'Mariam Sissoko', email: 'mariam.sissoko@example.com', plan: 'starter' },
]

const ROLES: readonly string[] = [
  'Senior Backend Engineer',
  'Product Manager',
  'Data Scientist',
  'Staff Frontend Engineer',
  'Engineering Manager',
  'Solutions Architect',
  'Site Reliability Engineer',
  'Product Designer',
  'Financial Analyst',
  'Machine Learning Engineer',
  'Technical Program Manager',
  'Customer Success Manager',
  'Security Engineer',
  'Growth Marketing Lead',
  'Platform Engineer',
  'Business Intelligence Analyst',
  'Mobile Engineer, iOS',
  'Director of Operations',
]

const COMPANIES: readonly string[] = [
  'Stripe',
  'Shopify',
  'Datadog',
  'Atlassian',
  'Airbnb',
  'Snowflake',
  'Cloudflare',
  'Wise',
  'Klarna',
  'Instacart',
  'DoorDash',
  'Figma',
  'Twilio',
  'Robinhood',
  'Northwestern Mutual',
  'Mastercard',
  'Flutterwave',
  'Canva',
]

const DAY_LABELS: readonly string[] = ['Sep 3', 'Sep 2', 'Sep 1', 'Aug 31', 'Aug 30', 'Aug 29', 'Aug 28', 'Aug 27']
const CLOCK_LABELS: readonly string[] = ['09:42', '10:15', '11:03', '12:37', '13:20', '14:06', '15:48', '16:29', '17:11', '18:54', '20:07', '21:33']
const ID_ALPHABET = '3479ACDFHJKLMNPQRTVWXY'

function sessionCode(sku: AdminProductSku, index: number): string {
  const seed = index * 7919 + sku.length * 131
  let code = ''
  for (let position = 0; position < 6; position += 1) {
    code += ID_ALPHABET[(seed >> (position * 3)) % ID_ALPHABET.length]
  }
  return code
}

type SessionShape = {
  readonly prefix: string
  /** Every nth row fails; a smaller number means a sicker product. */
  readonly failEvery: number
  readonly abandonEvery: number
  readonly baseMinutes: number
  readonly minuteSpread: number
  /** `minutes` bills a credit per minute; `per-success` only bills a completed run; `prompts` bills per prompt. */
  readonly creditRule: 'minutes' | 'per-success' | 'prompts' | 'none'
  readonly failureReasons: readonly string[]
}

const SESSION_SHAPES: Readonly<Record<AdminProductSku, SessionShape>> = {
  'interview-prep': {
    prefix: 'prp',
    failEvery: 17,
    abandonEvery: 6,
    baseMinutes: 24,
    minuteSpread: 18,
    creditRule: 'minutes',
    failureReasons: [
      'Question generation timed out after 90s',
      'Uploaded job description could not be parsed',
      'Scoring service returned an empty report',
    ],
  },
  'interview-copilot-web': {
    prefix: 'cop',
    failEvery: 12,
    abandonEvery: 7,
    baseMinutes: 38,
    minuteSpread: 26,
    creditRule: 'minutes',
    failureReasons: [
      'Microphone permission revoked mid-session',
      'Websocket dropped, two reconnects failed',
      'Speech service timed out after 30s of silence',
      'Browser tab closed before the transcript flushed',
    ],
  },
  'interview-copilot-desktop': {
    prefix: 'dsk',
    failEvery: 8,
    abandonEvery: 9,
    baseMinutes: 44,
    minuteSpread: 22,
    creditRule: 'minutes',
    failureReasons: [
      'Build 4.2.1 lost the capture device on output switch',
      'macOS screen recording permission missing',
      'Always-on-top window crashed on display change',
    ],
  },
  'coding-copilot': {
    prefix: 'cod',
    failEvery: 5,
    abandonEvery: 8,
    baseMinutes: 52,
    minuteSpread: 20,
    creditRule: 'minutes',
    failureReasons: [
      'Screen-share handshake failed on Chrome 141',
      'Editor pane not detected in the shared window',
      'Code context exceeded the 32k window',
    ],
  },
  'meeting-copilot': {
    prefix: 'mtg',
    failEvery: 9,
    abandonEvery: 11,
    baseMinutes: 31,
    minuteSpread: 16,
    creditRule: 'minutes',
    failureReasons: [
      'Zoom admission timed out in the host waiting room',
      'Google Meet rejected the note-taker participant',
      'Teams guest join blocked by tenant policy',
    ],
  },
  'auto-apply': {
    prefix: 'app',
    failEvery: 9,
    abandonEvery: 14,
    baseMinutes: 6,
    minuteSpread: 9,
    creditRule: 'per-success',
    failureReasons: [
      'ATS rejected the submission, required field missing',
      'Workday session expired before submit',
      'Posting closed between scouting and submission',
      'Duplicate application detected on the same req',
    ],
  },
  'resume-builder': {
    prefix: 'res',
    failEvery: 19,
    abandonEvery: 8,
    baseMinutes: 11,
    minuteSpread: 14,
    creditRule: 'prompts',
    failureReasons: [
      'PDF export failed on a four-page layout',
      'Prompt exceeded the tailoring context limit',
    ],
  },
  'done-for-you': {
    prefix: 'dfy',
    failEvery: 23,
    abandonEvery: 15,
    baseMinutes: 27,
    minuteSpread: 20,
    creditRule: 'none',
    failureReasons: [
      'Success manager could not reach the client for approval',
      'Client withdrew the target role before submission',
    ],
  },
  marketplace: {
    prefix: 'mkt',
    failEvery: 21,
    abandonEvery: 13,
    baseMinutes: 3,
    minuteSpread: 5,
    creditRule: 'none',
    failureReasons: ['Download link expired before first use'],
  },
}

function buildSessions(sku: AdminProductSku, count: number): readonly AdminProductSessionRow[] {
  const shape = SESSION_SHAPES[sku]

  return Array.from({ length: count }, (_, index): AdminProductSessionRow => {
    const candidate = CANDIDATES[(index * 5 + 3) % CANDIDATES.length]
    const outcome: AdminProductSessionOutcome =
      index % shape.failEvery === shape.failEvery - 1
        ? 'failed'
        : index % shape.abandonEvery === shape.abandonEvery - 2
          ? 'abandoned'
          : 'completed'

    const fullMinutes = shape.baseMinutes + ((index * 13) % shape.minuteSpread)
    const durationMinutes =
      outcome === 'completed' ? fullMinutes : outcome === 'abandoned' ? Math.max(1, Math.round(fullMinutes / 3)) : Math.max(1, (index % 4) + 1)

    const creditsUsed =
      shape.creditRule === 'minutes'
        ? durationMinutes
        : shape.creditRule === 'per-success'
          ? outcome === 'completed'
            ? 1
            : 0
          : shape.creditRule === 'prompts'
            ? outcome === 'completed'
              ? 2 + (index % 5)
              : 1
            : 0

    return {
      id: `ses_${shape.prefix}_${sessionCode(sku, index)}`,
      userName: candidate.name,
      userEmail: candidate.email,
      plan: candidate.plan,
      targetRole: ROLES[(index * 3 + 1) % ROLES.length],
      targetCompany: COMPANIES[(index * 7 + 2) % COMPANIES.length],
      startedLabel: `${DAY_LABELS[Math.floor(index / 8) % DAY_LABELS.length]}, ${CLOCK_LABELS[index % CLOCK_LABELS.length]}`,
      durationLabel: `${durationMinutes} min`,
      durationMinutes,
      creditsUsed,
      outcome,
      failureReason: outcome === 'failed' ? shape.failureReasons[index % shape.failureReasons.length] : undefined,
    }
  })
}

/** The dashboard's every-other-day sampling, reused so both screens read off one shape. */
const TREND_WEIGHTS: readonly { readonly label: string; readonly weight: number }[] = [
  { label: 'Aug 5', weight: 21_480 },
  { label: 'Aug 7', weight: 23_010 },
  { label: 'Aug 9', weight: 19_640 },
  { label: 'Aug 11', weight: 26_320 },
  { label: 'Aug 13', weight: 28_150 },
  { label: 'Aug 15', weight: 25_970 },
  { label: 'Aug 17', weight: 24_110 },
  { label: 'Aug 19', weight: 30_240 },
  { label: 'Aug 21', weight: 32_880 },
  { label: 'Aug 23', weight: 29_460 },
  { label: 'Aug 25', weight: 27_730 },
  { label: 'Aug 27', weight: 34_910 },
  { label: 'Aug 29', weight: 37_240 },
  { label: 'Aug 31', weight: 33_580 },
  { label: 'Sep 2', weight: 39_120 },
]

const TREND_WEIGHT_TOTAL = TREND_WEIGHTS.reduce((total, point) => total + point.weight, 0)

function buildTrend(sessionsInRange: number, creditsConsumed: number): readonly AdminProductTrendPoint[] {
  return TREND_WEIGHTS.map((point) => ({
    label: point.label,
    sessions: Math.round((sessionsInRange * point.weight) / TREND_WEIGHT_TOTAL),
    creditsConsumed: Math.round((creditsConsumed * point.weight) / TREND_WEIGHT_TOTAL),
  }))
}

type DetailConfig = {
  readonly avgDurationMinutes: number
  readonly completionRatePercent: number
  readonly usersDelta: number
  readonly sessionsDelta: number
  readonly sessionCount: number
  readonly errorGroups: readonly AdminProductErrorGroup[]
}

const DETAIL_CONFIG: Readonly<Record<AdminProductSku, DetailConfig>> = {
  'interview-prep': {
    avgDurationMinutes: 27,
    completionRatePercent: 84,
    usersDelta: 6.4,
    sessionsDelta: 9.8,
    sessionCount: 58,
    errorGroups: [
      { id: 'prp-e1', reason: 'Question generation timed out after 90s', count: 214, sharePercent: 47, lastSeenLabel: '2 hours ago', severity: 'warning' },
      { id: 'prp-e2', reason: 'Uploaded job description could not be parsed', count: 156, sharePercent: 34, lastSeenLabel: '41 minutes ago', severity: 'warning' },
      { id: 'prp-e3', reason: 'Scoring service returned an empty report', count: 87, sharePercent: 19, lastSeenLabel: 'Yesterday', severity: 'info' },
    ],
  },
  'interview-copilot-web': {
    avgDurationMinutes: 41,
    completionRatePercent: 79,
    usersDelta: 11.2,
    sessionsDelta: 13.6,
    sessionCount: 62,
    errorGroups: [
      { id: 'cop-e1', reason: 'Websocket dropped, two reconnects failed', count: 412, sharePercent: 42, lastSeenLabel: '9 minutes ago', severity: 'critical' },
      { id: 'cop-e2', reason: 'Microphone permission revoked mid-session', count: 288, sharePercent: 29, lastSeenLabel: '26 minutes ago', severity: 'warning' },
      { id: 'cop-e3', reason: 'Speech service timed out after 30s of silence', count: 190, sharePercent: 19, lastSeenLabel: '1 hour ago', severity: 'warning' },
      { id: 'cop-e4', reason: 'Browser tab closed before the transcript flushed', count: 97, sharePercent: 10, lastSeenLabel: '3 hours ago', severity: 'info' },
    ],
  },
  'interview-copilot-desktop': {
    avgDurationMinutes: 46,
    completionRatePercent: 74,
    usersDelta: 18.9,
    sessionsDelta: 21.4,
    sessionCount: 44,
    errorGroups: [
      { id: 'dsk-e1', reason: 'Build 4.2.1 lost the capture device on output switch', count: 356, sharePercent: 58, lastSeenLabel: '14 minutes ago', severity: 'critical' },
      { id: 'dsk-e2', reason: 'macOS screen recording permission missing', count: 168, sharePercent: 27, lastSeenLabel: '52 minutes ago', severity: 'warning' },
      { id: 'dsk-e3', reason: 'Always-on-top window crashed on display change', count: 92, sharePercent: 15, lastSeenLabel: '4 hours ago', severity: 'warning' },
    ],
  },
  'coding-copilot': {
    avgDurationMinutes: 54,
    completionRatePercent: 61,
    usersDelta: 4.1,
    sessionsDelta: 2.7,
    sessionCount: 40,
    errorGroups: [
      { id: 'cod-e1', reason: 'Screen-share handshake failed on Chrome 141', count: 803, sharePercent: 74, lastSeenLabel: '3 minutes ago', severity: 'critical' },
      { id: 'cod-e2', reason: 'Editor pane not detected in the shared window', count: 194, sharePercent: 18, lastSeenLabel: '22 minutes ago', severity: 'warning' },
      { id: 'cod-e3', reason: 'Code context exceeded the 32k window', count: 90, sharePercent: 8, lastSeenLabel: '2 hours ago', severity: 'info' },
    ],
  },
  'meeting-copilot': {
    avgDurationMinutes: 33,
    completionRatePercent: 72,
    usersDelta: 34.7,
    sessionsDelta: 41.2,
    sessionCount: 32,
    errorGroups: [
      { id: 'mtg-e1', reason: 'Zoom admission timed out in the host waiting room', count: 148, sharePercent: 62, lastSeenLabel: '18 minutes ago', severity: 'critical' },
      { id: 'mtg-e2', reason: 'Google Meet rejected the note-taker participant', count: 61, sharePercent: 26, lastSeenLabel: '2 hours ago', severity: 'warning' },
      { id: 'mtg-e3', reason: 'Teams guest join blocked by tenant policy', count: 29, sharePercent: 12, lastSeenLabel: 'Yesterday', severity: 'info' },
    ],
  },
  'auto-apply': {
    avgDurationMinutes: 9,
    completionRatePercent: 81,
    usersDelta: 7.9,
    sessionsDelta: 12.3,
    sessionCount: 54,
    errorGroups: [
      { id: 'app-e1', reason: 'Workday session expired before submit', count: 289, sharePercent: 44, lastSeenLabel: '7 minutes ago', severity: 'critical' },
      { id: 'app-e2', reason: 'ATS rejected the submission, required field missing', count: 201, sharePercent: 31, lastSeenLabel: '33 minutes ago', severity: 'warning' },
      { id: 'app-e3', reason: 'Posting closed between scouting and submission', count: 108, sharePercent: 16, lastSeenLabel: '1 hour ago', severity: 'info' },
      { id: 'app-e4', reason: 'Duplicate application detected on the same req', count: 59, sharePercent: 9, lastSeenLabel: '5 hours ago', severity: 'info' },
    ],
  },
  'resume-builder': {
    avgDurationMinutes: 14,
    completionRatePercent: 88,
    usersDelta: 5.2,
    sessionsDelta: 6.8,
    sessionCount: 48,
    errorGroups: [
      { id: 'res-e1', reason: 'PDF export failed on a four-page layout', count: 76, sharePercent: 63, lastSeenLabel: '1 hour ago', severity: 'warning' },
      { id: 'res-e2', reason: 'Prompt exceeded the tailoring context limit', count: 45, sharePercent: 37, lastSeenLabel: '3 hours ago', severity: 'info' },
    ],
  },
  'done-for-you': {
    avgDurationMinutes: 31,
    completionRatePercent: 93,
    usersDelta: 3.4,
    sessionsDelta: 4.1,
    sessionCount: 0,
    errorGroups: [],
  },
  marketplace: {
    avgDurationMinutes: 4,
    completionRatePercent: 96,
    usersDelta: 2.1,
    sessionsDelta: 1.4,
    sessionCount: 0,
    errorGroups: [],
  },
}

function buildDoneForYouStats(): readonly AdminProductDetailStat[] {
  const leadsCount = adminDoneForYouLeads.filter((lead) => lead.stage === 'new').length
  const clientsCount = adminDoneForYouLeads.filter((lead) => lead.stage === 'call' || lead.stage === 'completed').length
  const applicationsSubmitted = adminDoneForYouLeads.reduce((sum, lead) => sum + lead.applicationLog.length, 0)
  const revenueCents = adminDoneForYouLeads.reduce((sum, lead) => sum + lead.amountPaidCents, 0)

  return [
    {
      id: 'dfy-leads',
      label: 'Leads',
      value: leadsCount,
      format: 'count',
      caption: 'Paid, awaiting an onboarding call',
      deltaPercent: 12.5,
      deltaDirection: 'up',
      higherIsBetter: true,
    },
    {
      id: 'dfy-clients',
      label: 'Clients',
      value: clientsCount,
      format: 'count',
      caption: 'Assigned a success manager',
      deltaPercent: 8.1,
      deltaDirection: 'up',
      higherIsBetter: true,
    },
    {
      id: 'dfy-applications',
      label: 'Applications submitted',
      value: applicationsSubmitted,
      format: 'count',
      caption: 'Across all active and completed clients',
      deltaPercent: 14.2,
      deltaDirection: 'up',
      higherIsBetter: true,
    },
    {
      id: 'dfy-revenue',
      label: 'Revenue',
      value: revenueCents,
      format: 'usd-cents',
      caption: 'From leads and clients combined',
      deltaPercent: 9.6,
      deltaDirection: 'up',
      higherIsBetter: true,
    },
  ]
}

function buildStats(product: AdminProductRow, config: DetailConfig): readonly AdminProductDetailStat[] {
  return [
    {
      id: 'active-users',
      label: 'Active users',
      value: product.activeUsers,
      format: 'count',
      caption: `${product.adoptionPercent}% of all active accounts`,
      deltaPercent: config.usersDelta,
      deltaDirection: 'up',
      higherIsBetter: true,
    },
    {
      id: 'sessions',
      label: 'Sessions',
      value: product.sessionsInRange,
      format: 'count',
      caption: 'Started in the selected range',
      deltaPercent: config.sessionsDelta,
      deltaDirection: 'up',
      higherIsBetter: true,
    },
    {
      id: 'avg-duration',
      label: 'Average duration',
      value: config.avgDurationMinutes,
      format: 'minutes',
      caption: 'Across completed sessions only',
      deltaPercent: 3.2,
      deltaDirection: 'up',
      higherIsBetter: true,
    },
    {
      id: 'credits',
      label: 'Credits consumed',
      value: product.creditsConsumed,
      format: 'count',
      caption: product.creditsConsumed === 0 ? 'Not a credit-metered product' : '1 credit ≈ 1 minute',
      deltaPercent: 10.6,
      deltaDirection: 'up',
      higherIsBetter: true,
    },
    {
      id: 'completion-rate',
      label: 'Completion rate',
      value: config.completionRatePercent,
      format: 'percent',
      caption: 'Sessions that reached a finished state',
      deltaPercent: 1.8,
      deltaDirection: config.completionRatePercent < 70 ? 'down' : 'up',
      higherIsBetter: true,
    },
    {
      id: 'error-rate',
      label: 'Error rate',
      value: product.health.errorRatePercent,
      format: 'percent',
      caption: product.health.detail,
      deltaPercent: product.health.state === 'healthy' ? 0.3 : 5.9,
      deltaDirection: product.health.state === 'healthy' ? 'down' : 'up',
      higherIsBetter: false,
    },
  ]
}

function buildDetail(product: AdminProductRow, sessionCount: number): AdminProductDetail {
  const config = DETAIL_CONFIG[product.id]

  return {
    id: product.id,
    name: product.name,
    summary: product.summary,
    status: product.status,
    statusReason: product.statusReason,
    tierNote: product.tierNote,
    rangeLabel: adminProductRangeLabel,
    stats: product.id === 'done-for-you' ? buildDoneForYouStats() : buildStats(product, config),
    trend: buildTrend(product.sessionsInRange, product.creditsConsumed),
    sessions: buildSessions(product.id, sessionCount),
    ...(product.id === 'done-for-you' ? { doneForYouLeads: adminDoneForYouLeads } : {}),
    errorGroups: config.errorGroups,
    blastRadiusUsers: product.blastRadiusUsers,
    blastRadiusLabel: product.blastRadiusLabel,
  }
}

function toDetailRecord(sessionCount?: (product: AdminProductRow) => number): Readonly<Record<AdminProductSku, AdminProductDetail>> {
  const entries = adminProducts.map((product) => [
    product.id,
    buildDetail(product, sessionCount ? sessionCount(product) : DETAIL_CONFIG[product.id].sessionCount),
  ] as const)
  return Object.fromEntries(entries) as Record<AdminProductSku, AdminProductDetail>
}

export const adminProductDetails = toDetailRecord()

/** 124 rows per product, the log an admin actually scrolls when a product starts failing. */
export const adminProductDetailsDense = toDetailRecord(() => 124)

export function isAdminProductSku(value: string): value is AdminProductSku {
  return adminProducts.some((product) => product.id === value)
}
