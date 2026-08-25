export type AutoApplySetup = {
  readonly uploadedFileName: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly gender: string;
  readonly dob: string;
  readonly country: string;
  readonly city: string;
  readonly streetAddress: string;
  readonly postalCode: string;
  readonly linkedIn: string;
  readonly github: string;
  readonly portfolio: string;
  readonly desiredRole: readonly string[];
  readonly experienceLevel: string;
  readonly salary: { readonly min: number; readonly max: number };
  readonly locations: readonly string[];
  readonly employmentTypes: readonly string[];
  readonly locationTypes: readonly string[];
  readonly openToRelocate: boolean;
  readonly race: string;
  readonly citizenship: string;
  readonly veteran: string;
  readonly disability: string;
  readonly securityClearance: string;
  readonly usWorkAuth: string;
  readonly canadaWorkAuth: string;
  readonly authorizedToWork: 'yes' | 'no';
  readonly willingToStart: string;
  readonly workSchedule: string;
  readonly willingToTravel: boolean;
  readonly drugTestConsent: boolean;
  readonly backgroundCheckConsent: boolean;
  readonly preventPublicTrust: 'yes' | 'no';
  readonly drugDiversion: 'yes' | 'no';
};

export const DEFAULT_AUTO_APPLY_SETUP: AutoApplySetup = {
  uploadedFileName: 'Darnell_Smith_Product_Manager_2026.pdf',
  firstName: 'Darnell',
  lastName: 'Smith',
  email: 'demo@lightforth.ai',
  phone: '',
  gender: '',
  dob: '',
  country: 'Nigeria',
  city: '',
  streetAddress: 'Lagos',
  postalCode: '10001',
  linkedIn: '',
  github: '',
  portfolio: '',
  desiredRole: ['Product Manager'],
  experienceLevel: 'Senior',
  salary: { min: 80000, max: 150000 },
  locations: [],
  employmentTypes: [],
  locationTypes: [],
  openToRelocate: false,
  race: '',
  citizenship: '',
  veteran: '',
  disability: '',
  securityClearance: '',
  usWorkAuth: '',
  canadaWorkAuth: '',
  authorizedToWork: 'no',
  willingToStart: '',
  workSchedule: '',
  willingToTravel: false,
  drugTestConsent: false,
  backgroundCheckConsent: false,
  preventPublicTrust: 'no',
  drugDiversion: 'no',
};

export type AutoApplyOutcome = 'success' | 'needs-review' | 'failed' | 'closed';

export type AutoApplyJob = {
  readonly id: string;
  readonly title: string;
  readonly company: string;
  readonly location: string;
  readonly type: string;
  readonly matchPercent: number;
  readonly source: string;
  readonly dateLabel: string;
  readonly status: 'applied' | 'new';
  readonly outcome?: AutoApplyOutcome;
  readonly reviewNote?: string;
  readonly listingUrl: string;
  readonly resumeFileName: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly creditsRemaining: number;
  readonly creditsTotal: number;
};

export type AutoApplyApplicationEvent = {
  readonly label: string;
  readonly time: string;
};

export type AutoApplyApplication = {
  readonly job: AutoApplyJob;
  readonly appliedDate: string;
  readonly events: readonly AutoApplyApplicationEvent[];
  readonly activityLog: readonly string[];
};

export type AutoApplyMetric = { readonly label: string; readonly value: number };

export type AutoApplyAgentStatus = {
  readonly name: string;
  readonly status: 'running' | 'complete' | 'idle';
  readonly description: string;
};

export type AutoApplyActivity = {
  readonly id: string;
  readonly actor: string;
  readonly time: string;
  readonly message: string;
  readonly detail: string;
  readonly links: readonly string[];
  readonly tone: 'success' | 'muted' | 'default';
};

export const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Volunteer'] as const;
export const LOCATION_TYPES = ['Onsite', 'Remote', 'Hybrid'] as const;
export const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'] as const;
export const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive'] as const;
export const RACE_OPTIONS = ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic or Latino', 'Native Hawaiian or Pacific Islander', 'White', 'Two or more races', 'Prefer not to say'] as const;
export const VETERAN_OPTIONS = ['Not a Veteran', 'Veteran', 'Active Duty', 'Reserve or National Guard', 'Prefer not to say'] as const;
export const DISABILITY_OPTIONS = ['No disability', 'Yes, I have a disability', 'Prefer not to say'] as const;
export const SECURITY_CLEARANCE_OPTIONS = ['None', 'Confidential', 'Secret', 'Top Secret', 'TS/SCI'] as const;
export const US_WORK_AUTH_OPTIONS = ['US Citizen', 'Green Card Holder', 'H-1B Visa', 'OPT/CPT', 'TN Visa', 'Other', 'Not Authorized'] as const;
export const START_TIMELINE_OPTIONS = ['Immediately', '2 weeks', '1 month', '2 months', '3+ months'] as const;
export const WORK_SCHEDULE_OPTIONS = ['9-5 / Standard', 'Flexible', 'Nights', 'Weekends', 'Shifts'] as const;
