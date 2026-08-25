// ============================================================
// Admin Mock Data — realistic, centralized, ready to swap for real API
// ============================================================

export type PlanTier = 'starter' | 'pro' | 'premium' | 'non_subscriber'
export type UserStatus = 'active' | 'suspended' | 'activation' | 'cancelled'
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type LogCategory = 'auth' | 'application' | 'payment' | 'admin' | 'system'

export interface AdminUser {
  id: string
  name: string
  email: string
  plan: PlanTier
  status: UserStatus
  credits: number
  creditsUsed: number
  signupDate: string
  lastActive: string
  location: string
  avatar?: string
  phone?: string
  bio?: string
  resumesCreated: number
  applicationsSent: number
  interviewsPrepped: number
  totalSpent: number
  billingHistory: BillingEntry[]
}

export interface BillingEntry {
  id: string
  date: string
  amount: number
  description: string
  status: 'paid' | 'pending' | 'refunded'
}

export interface Transaction {
  id: string
  userId: string
  userName: string
  email: string
  type: 'subscription' | 'one_time' | 'refund'
  amount: number
  plan: PlanTier
  date: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
}

export interface SupportTicket {
  id: string
  userId: string
  userName: string
  email: string
  subject: string
  description: string
  category: 'billing' | 'technical' | 'account' | 'feature_request' | 'bug_report'
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  updatedAt: string
  assignedTo?: string
}

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  email: string
  action: string
  resource: string
  ip: string
  status: 'success' | 'failed' | 'warning'
  category: LogCategory
  timestamp: string
}

export interface ResumeTemplate {
  id: string
  name: string
  category: 'Professional' | 'Creative' | 'ATS-Optimised' | 'Executive' | 'Modern'
  usageCount: number
  atsScore: number
  lastUpdated: string
  active: boolean
}

export interface Coupon {
  id: string
  name: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  duration: string
  usageCount: number
  maxUses: number
  status: 'active' | 'inactive' | 'expired'
  createdAt: string
  expiresAt: string
}

export interface Broadcast {
  id: string
  subject: string
  message: string
  audience: string
  channel: string[]
  recipients: number
  openRate?: number
  sentAt: string
  status: 'sent' | 'scheduled' | 'draft'
}

export interface MonthlyData {
  month: string
  signups: number
  revenue: number
  activeUsers: number
  signupsByPlan: { nonSubscriber: number; starter: number; pro: number; premium: number }
  revenueUsd: number
  revenueNgn: number
}

export interface FeatureUsage {
  feature: string
  users: number
  percentage: number
}

export interface CityData {
  city: string
  users: number
  percentage: number
}

// ============================================================
// MOCK DATA
// ============================================================

const firstNames = ['Darnell', 'Jessica', 'Omar', 'Chinonso', 'Sarah', 'Marcus', 'Aisha', 'Carlos', 'Priya', 'David', 'Fatima', 'James', 'Olivia', 'Ethan', 'Maya', 'Daniel', 'Sophia', 'Andre', 'Hannah', 'Liam', 'Zara', 'Noah', 'Isabella', 'Elijah', 'Mia', 'Lucas', 'Ava', 'Mason', 'Ella', 'Logan', 'Aria', 'Alexander', 'Chloe', 'Sebastian', 'Luna', 'Caleb', 'Aurora', 'Ryan', 'Penelope', 'Nathan']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores']
const cities = ['New York', 'Lagos', 'London', 'Toronto', 'Houston', 'San Francisco', 'Chicago', 'Atlanta', 'Dallas', 'Los Angeles', 'Miami', 'Nairobi', 'Accra', 'Berlin', 'Sydney', 'Singapore', 'Mumbai', 'Dubai', 'São Paulo', 'Paris']
const countries = ['USA', 'Nigeria', 'UK', 'Canada', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'Kenya', 'Ghana', 'Germany', 'Australia', 'Singapore', 'India', 'UAE', 'Brazil', 'France']

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return d.toISOString()
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

// Generate consistent user data
export const USERS: AdminUser[] = Array.from({ length: 50 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length]
  const lastName = lastNames[i % lastNames.length]
  const cityIdx = i % cities.length
  const plan: PlanTier = i < 5 ? 'premium' : i < 15 ? 'pro' : i < 30 ? 'starter' : 'non_subscriber'
  const status: UserStatus = i < 3 ? 'suspended' : i < 8 ? 'activation' : i < 45 ? 'active' : 'cancelled'
  const credits = plan === 'premium' ? 100 : plan === 'pro' ? 50 : plan === 'starter' ? 15 : 5
  const creditsUsed = Math.floor(Math.random() * credits)
  const signupDate = randomDate(new Date('2025-09-01'), new Date('2026-06-30'))

  return {
    id: String(i + 1),
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomFrom(['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'proton.me'])}`,
    plan,
    status,
    credits,
    creditsUsed,
    signupDate,
    lastActive: randomDate(new Date('2026-06-01'), new Date('2026-07-11')),
    location: `${cities[cityIdx]}, ${countries[cityIdx]}`,
    phone: `+1 (${Math.floor(200 + Math.random() * 800)}) ${Math.floor(200 + Math.random() * 800)}-${Math.floor(1000 + Math.random() * 9000)}`,
    bio: i % 3 === 0 ? 'Software engineer looking for next opportunity' : i % 3 === 1 ? 'Marketing professional seeking remote roles' : 'Recent graduate exploring career options',
    resumesCreated: Math.floor(Math.random() * 12) + 1,
    applicationsSent: Math.floor(Math.random() * 200) + 5,
    interviewsPrepped: Math.floor(Math.random() * 20),
    totalSpent: plan === 'premium' ? Math.floor(Math.random() * 500) + 200 : plan === 'pro' ? Math.floor(Math.random() * 300) + 100 : plan === 'starter' ? Math.floor(Math.random() * 100) + 20 : 0,
    billingHistory: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, j) => ({
      id: generateId(),
      date: randomDate(new Date('2025-10-01'), new Date('2026-07-01')),
      amount: plan === 'premium' ? 79 : plan === 'pro' ? 49 : plan === 'starter' ? 27 : 0,
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - Monthly`,
      status: Math.random() > 0.1 ? 'paid' : 'pending' as const,
    })),
  }
})

export const TRANSACTIONS: Transaction[] = Array.from({ length: 80 }, (_, i) => {
  const user = USERS[i % USERS.length]
  const type = i < 5 ? 'refund' : i < 15 ? 'one_time' : 'subscription'
  return {
    id: generateId(),
    userId: user.id,
    userName: user.name,
    email: user.email,
    type,
    amount: type === 'refund' ? -(Math.floor(Math.random() * 50) + 20) : type === 'subscription' ? (user.plan === 'premium' ? 79 : user.plan === 'pro' ? 49 : 27) : Math.floor(Math.random() * 30) + 10,
    plan: user.plan,
    date: randomDate(new Date('2025-10-01'), new Date('2026-07-11')),
    status: type === 'refund' ? 'refunded' : Math.random() > 0.05 ? 'completed' : Math.random() > 0.5 ? 'pending' : 'failed',
  }
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export const TICKETS: SupportTicket[] = [
  { id: 'TK-001', userId: '1', userName: 'Darnell Smith', email: 'darnell.smith@gmail.com', subject: 'Cannot access Auto-Apply feature', description: 'I upgraded to Pro but Auto-Apply still shows as locked. I need help accessing this feature.', category: 'technical', priority: 'high', status: 'open', createdAt: '2026-07-10T14:30:00Z', updatedAt: '2026-07-10T14:30:00Z' },
  { id: 'TK-002', userId: '3', userName: 'Omar Khan', email: 'omar.k@outlook.com', subject: 'Refund request for duplicate charge', description: 'I was charged twice for my Pro subscription. Please refund the extra charge.', category: 'billing', priority: 'high', status: 'in_progress', createdAt: '2026-07-09T09:15:00Z', updatedAt: '2026-07-10T11:00:00Z', assignedTo: 'Support Team' },
  { id: 'TK-003', userId: '5', userName: 'Sarah Johnson', email: 'sarah.j@yahoo.com', subject: 'Interview Copilot not working on Zoom', description: 'The copilot overlay disappears when I share my screen on Zoom. Is this a known issue?', category: 'bug_report', priority: 'medium', status: 'open', createdAt: '2026-07-08T16:45:00Z', updatedAt: '2026-07-08T16:45:00Z' },
  { id: 'TK-004', userId: '8', userName: 'Carlos Rodriguez', email: 'carlos.r@gmail.com', subject: 'How do I cancel my subscription?', description: 'I want to cancel my Pro subscription. Where do I go to do this?', category: 'account', priority: 'low', status: 'resolved', createdAt: '2026-07-07T10:00:00Z', updatedAt: '2026-07-08T14:00:00Z', assignedTo: 'Support Team' },
  { id: 'TK-005', userId: '12', userName: 'James Brown', email: 'james.b@hotmail.com', subject: 'Feature request: LinkedIn integration', description: 'It would be great if Lightforth could directly import my LinkedIn profile to build my resume.', category: 'feature_request', priority: 'low', status: 'open', createdAt: '2026-07-06T11:30:00Z', updatedAt: '2026-07-06T11:30:00Z' },
  { id: 'TK-006', userId: '2', userName: 'Jessica Williams', email: 'jessica.w@gmail.com', subject: 'Resume not downloading', description: 'When I try to download my resume as PDF, the download starts but the file is empty.', category: 'bug_report', priority: 'high', status: 'in_progress', createdAt: '2026-07-05T08:20:00Z', updatedAt: '2026-07-10T09:00:00Z', assignedTo: 'Dev Team' },
  { id: 'TK-007', userId: '15', userName: 'Hannah Lee', email: 'hannah.l@gmail.com', subject: 'Upgrade plan question', description: 'What happens to my credits if I upgrade from Starter to Pro mid-cycle?', category: 'billing', priority: 'low', status: 'resolved', createdAt: '2026-07-04T13:00:00Z', updatedAt: '2026-07-05T10:00:00Z', assignedTo: 'Support Team' },
  { id: 'TK-008', userId: '20', userName: 'Noah Wilson', email: 'noah.w@outlook.com', subject: 'Account locked after too many login attempts', description: 'I forgot my password and tried too many times. Now my account is locked.', category: 'account', priority: 'medium', status: 'open', createdAt: '2026-07-03T17:45:00Z', updatedAt: '2026-07-03T17:45:00Z' },
  { id: 'TK-009', userId: '7', userName: 'Aisha Davis', email: 'aisha.d@yahoo.com', subject: 'Auto-Apply sending wrong applications', description: 'Auto-Apply is sending me marketing job applications but I set my profile to software engineering.', category: 'bug_report', priority: 'high', status: 'open', createdAt: '2026-07-02T09:30:00Z', updatedAt: '2026-07-02T09:30:00Z' },
  { id: 'TK-010', userId: '25', userName: 'Sophia Clark', email: 'sophia.c@gmail.com', subject: 'Cannot edit resume after creation', description: 'I created a resume but now I cannot go back and edit it. The edit button does nothing.', category: 'technical', priority: 'medium', status: 'in_progress', createdAt: '2026-07-01T14:15:00Z', updatedAt: '2026-07-09T16:00:00Z', assignedTo: 'Dev Team' },
]

export const ACTIVITY_LOGS: ActivityLog[] = [
  { id: '1', userId: '1', userName: 'Darnell Smith', email: 'darnell.smith@gmail.com', action: 'Login', resource: 'Auth', ip: '72.134.56.89', status: 'success', category: 'auth', timestamp: '2026-07-11T08:30:00Z' },
  { id: '2', userId: '3', userName: 'Omar Khan', email: 'omar.k@outlook.com', action: 'Subscription Upgraded', resource: 'Billing', ip: '192.168.1.45', status: 'success', category: 'payment', timestamp: '2026-07-11T08:15:00Z' },
  { id: '3', userId: '5', userName: 'Sarah Johnson', email: 'sarah.j@yahoo.com', action: 'Resume Created', resource: 'Resume Builder', ip: '10.0.0.123', status: 'success', category: 'application', timestamp: '2026-07-11T08:00:00Z' },
  { id: '4', userId: '8', userName: 'Carlos Rodriguez', email: 'carlos.r@gmail.com', action: 'Auto-Apply Started', resource: 'Auto-Apply', ip: '172.16.0.55', status: 'success', category: 'application', timestamp: '2026-07-11T07:45:00Z' },
  { id: '5', userId: '12', userName: 'James Brown', email: 'james.b@hotmail.com', action: 'Payment Failed', resource: 'Billing', ip: '203.0.113.42', status: 'failed', category: 'payment', timestamp: '2026-07-11T07:30:00Z' },
  { id: '6', userId: '15', userName: 'Hannah Lee', email: 'hannah.l@gmail.com', action: 'Feature Flag Updated', resource: 'Admin', ip: '198.51.100.14', status: 'success', category: 'admin', timestamp: '2026-07-11T07:15:00Z' },
  { id: '7', userId: '20', userName: 'Noah Wilson', email: 'noah.w@outlook.com', action: 'Account Suspended', resource: 'Admin', ip: '192.0.2.88', status: 'warning', category: 'admin', timestamp: '2026-07-11T07:00:00Z' },
  { id: '8', userId: '2', userName: 'Jessica Williams', email: 'jessica.w@gmail.com', action: 'Interview Prep Completed', resource: 'Interview Prep', ip: '100.64.0.1', status: 'success', category: 'application', timestamp: '2026-07-11T06:45:00Z' },
  { id: '9', userId: '7', userName: 'Aisha Davis', email: 'aisha.d@yahoo.com', action: 'Login Failed', resource: 'Auth', ip: '192.168.2.100', status: 'failed', category: 'auth', timestamp: '2026-07-11T06:30:00Z' },
  { id: '10', userId: '25', userName: 'Sophia Clark', email: 'sophia.c@gmail.com', action: 'Credits Purchased', resource: 'Billing', ip: '10.1.1.1', status: 'success', category: 'payment', timestamp: '2026-07-11T06:15:00Z' },
  { id: '11', userId: '10', userName: 'David Martinez', email: 'david.m@gmail.com', action: 'Login', resource: 'Auth', ip: '72.134.56.90', status: 'success', category: 'auth', timestamp: '2026-07-11T06:00:00Z' },
  { id: '12', userId: '18', userName: 'Daniel Moore', email: 'daniel.m@gmail.com', action: 'Resume Downloaded', resource: 'Resume Builder', ip: '172.16.0.56', status: 'success', category: 'application', timestamp: '2026-07-11T05:45:00Z' },
  { id: '13', userId: '30', userName: 'Logan Taylor', email: 'logan.t@outlook.com', action: 'Subscription Cancelled', resource: 'Billing', ip: '203.0.113.43', status: 'warning', category: 'payment', timestamp: '2026-07-11T05:30:00Z' },
  { id: '14', userId: '35', userName: 'Ryan Anderson', email: 'ryan.a@gmail.com', action: 'Copilot Session Started', resource: 'Interview Copilot', ip: '100.64.0.2', status: 'success', category: 'application', timestamp: '2026-07-11T05:15:00Z' },
  { id: '15', userId: '40', userName: 'Nathan Thomas', email: 'nathan.t@yahoo.com', action: 'System Backup Completed', resource: 'System', ip: '198.51.100.15', status: 'success', category: 'system', timestamp: '2026-07-11T05:00:00Z' },
]

export const TEMPLATES: ResumeTemplate[] = [
  { id: '1', name: 'Executive Pro', category: 'Executive', usageCount: 2847, atsScore: 96, lastUpdated: '2026-06-15', active: true },
  { id: '2', name: 'Modern Minimalist', category: 'Modern', usageCount: 4521, atsScore: 94, lastUpdated: '2026-07-01', active: true },
  { id: '3', name: 'Creative Portfolio', category: 'Creative', usageCount: 1893, atsScore: 82, lastUpdated: '2026-05-20', active: true },
  { id: '4', name: 'ATS Fortress', category: 'ATS-Optimised', usageCount: 6234, atsScore: 99, lastUpdated: '2026-07-05', active: true },
  { id: '5', name: 'Clean Professional', category: 'Professional', usageCount: 3567, atsScore: 91, lastUpdated: '2026-06-10', active: true },
  { id: '6', name: 'Tech Startup', category: 'Modern', usageCount: 2103, atsScore: 88, lastUpdated: '2026-04-25', active: true },
  { id: '7', name: 'Bold Statement', category: 'Creative', usageCount: 987, atsScore: 78, lastUpdated: '2026-03-15', active: false },
  { id: '8', name: 'Classic Traditional', category: 'Professional', usageCount: 1456, atsScore: 93, lastUpdated: '2026-06-28', active: true },
  { id: '9', name: 'Academic Scholar', category: 'Professional', usageCount: 756, atsScore: 90, lastUpdated: '2026-05-01', active: false },
  { id: '10', name: 'Infographic CV', category: 'Creative', usageCount: 432, atsScore: 65, lastUpdated: '2026-02-10', active: false },
]

export const COUPONS: Coupon[] = [
  { id: '1', name: 'Welcome Offer', code: 'WELCOME20', discountType: 'percentage', discountValue: 20, duration: 'First month', usageCount: 1247, maxUses: 5000, status: 'active', createdAt: '2025-09-01', expiresAt: '2026-12-31' },
  { id: '2', name: 'Student Discount', code: 'STUDENT30', discountType: 'percentage', discountValue: 30, duration: '3 months', usageCount: 856, maxUses: 2000, status: 'active', createdAt: '2025-10-15', expiresAt: '2026-12-31' },
  { id: '3', name: 'Hassan Referral', code: 'HASSAN40LF', discountType: 'percentage', discountValue: 40, duration: 'Lifetime', usageCount: 23, maxUses: 50, status: 'active', createdAt: '2026-01-10', expiresAt: '2026-12-31' },
  { id: '4', name: 'Marc Referral', code: 'MARC40LF', discountType: 'percentage', discountValue: 40, duration: 'Lifetime', usageCount: 15, maxUses: 50, status: 'active', createdAt: '2026-01-15', expiresAt: '2026-12-31' },
  { id: '5', name: 'Black Friday', code: 'BLACKFRIDAY50', discountType: 'percentage', discountValue: 50, duration: 'First year', usageCount: 342, maxUses: 1000, status: 'expired', createdAt: '2025-11-20', expiresAt: '2025-12-01' },
  { id: '6', name: 'New Year Sale', code: 'NEWYEAR25', discountType: 'percentage', discountValue: 25, duration: 'First 3 months', usageCount: 567, maxUses: 2000, status: 'expired', createdAt: '2025-12-26', expiresAt: '2026-01-15' },
  { id: '7', name: 'LinkedIn Promo', code: 'LINKEDIN15', discountType: 'percentage', discountValue: 15, duration: 'First month', usageCount: 890, maxUses: 3000, status: 'inactive', createdAt: '2026-02-01', expiresAt: '2026-06-30' },
  { id: '8', name: 'Partner Code - Tolulope', code: 'TOLU30LF', discountType: 'percentage', discountValue: 30, duration: 'Lifetime', usageCount: 8, maxUses: 100, status: 'active', createdAt: '2026-03-01', expiresAt: '2026-12-31' },
  { id: '9', name: 'Spring Promotion', code: 'SPRING2026', discountType: 'percentage', discountValue: 20, duration: 'First month', usageCount: 0, maxUses: 500, status: 'inactive', createdAt: '2026-03-20', expiresAt: '2026-05-31' },
  { id: '10', name: 'Flash Sale', code: 'FLASH48HR', discountType: 'fixed', discountValue: 10, duration: 'One-time', usageCount: 234, maxUses: 500, status: 'expired', createdAt: '2026-04-01', expiresAt: '2026-04-03' },
]

export const BROADCASTS: Broadcast[] = [
  { id: '1', subject: 'New Feature: Interview Copilot v2', message: 'We just launched Interview Copilot v2 with real-time stealth mode...', audience: 'All Users', channel: ['email', 'in_app'], recipients: 9396, openRate: 68.2, sentAt: '2026-07-08T10:00:00Z', status: 'sent' },
  { id: '2', subject: 'Your July Credits Have Arrived', message: 'Your monthly credits have been refreshed. Time to land that dream job...', audience: 'Paid Users', channel: ['email'], recipients: 2880, openRate: 72.5, sentAt: '2026-07-01T08:00:00Z', status: 'sent' },
  { id: '3', subject: 'We Miss You - Come Back for 30% Off', message: 'It has been a while since your last login. Here is 30% off to come back...', audience: 'Inactive Users', channel: ['email', 'push'], recipients: 311, openRate: 45.1, sentAt: '2026-06-25T12:00:00Z', status: 'sent' },
  { id: '4', subject: 'System Maintenance Notice', message: 'Scheduled maintenance on July 15th from 2-4 AM EST...', audience: 'All Users', channel: ['in_app'], recipients: 9396, openRate: 34.8, sentAt: '2026-06-20T09:00:00Z', status: 'sent' },
  { id: '5', subject: 'Resume Builder Tips & Tricks', message: 'Get the most out of our Resume Builder with these expert tips...', audience: 'Non-subscribers', channel: ['email'], recipients: 2460, openRate: 52.3, sentAt: '2026-06-15T14:00:00Z', status: 'sent' },
]

export const MONTHLY_DATA: MonthlyData[] = [
  { month: 'Jan 2026', signups: 1247, revenue: 18950, activeUsers: 3420, signupsByPlan: { nonSubscriber: 620, starter: 340, pro: 187, premium: 100 }, revenueUsd: 14200, revenueNgn: 7200000 },
  { month: 'Feb 2026', signups: 1456, revenue: 22340, activeUsers: 4120, signupsByPlan: { nonSubscriber: 710, starter: 400, pro: 226, premium: 120 }, revenueUsd: 16800, revenueNgn: 8500000 },
  { month: 'Mar 2026', signups: 1689, revenue: 28750, activeUsers: 5230, signupsByPlan: { nonSubscriber: 820, starter: 470, pro: 269, premium: 130 }, revenueUsd: 21600, revenueNgn: 11000000 },
  { month: 'Apr 2026', signups: 1534, revenue: 26100, activeUsers: 5890, signupsByPlan: { nonSubscriber: 750, starter: 420, pro: 244, premium: 120 }, revenueUsd: 19700, revenueNgn: 10000000 },
  { month: 'May 2026', signups: 1823, revenue: 32450, activeUsers: 6780, signupsByPlan: { nonSubscriber: 890, starter: 500, pro: 293, premium: 140 }, revenueUsd: 24500, revenueNgn: 12500000 },
  { month: 'Jun 2026', signups: 2104, revenue: 38900, activeUsers: 7850, signupsByPlan: { nonSubscriber: 1020, starter: 580, pro: 344, premium: 160 }, revenueUsd: 29400, revenueNgn: 15000000 },
  { month: 'Jul 2026', signups: 943, revenue: 17650, activeUsers: 9396, signupsByPlan: { nonSubscriber: 460, starter: 260, pro: 143, premium: 80 }, revenueUsd: 13300, revenueNgn: 6800000 },
]

export const FEATURE_USAGE: FeatureUsage[] = [
  { feature: 'Auto-Apply', users: 7890, percentage: 84 },
  { feature: 'Resume Builder', users: 6765, percentage: 72 },
  { feature: 'Interview Prep', users: 5732, percentage: 61 },
  { feature: 'Interview Copilot', users: 4416, percentage: 47 },
  { feature: 'Career Specialist', users: 1691, percentage: 18 },
]

export const TOP_CITIES: CityData[] = [
  { city: 'New York', users: 1523, percentage: 16.2 },
  { city: 'Lagos', users: 1247, percentage: 13.3 },
  { city: 'London', users: 987, percentage: 10.5 },
  { city: 'Toronto', users: 756, percentage: 8.0 },
  { city: 'Houston', users: 634, percentage: 6.7 },
  { city: 'San Francisco', users: 523, percentage: 5.6 },
  { city: 'Chicago', users: 445, percentage: 4.7 },
  { city: 'Atlanta', users: 398, percentage: 4.2 },
  { city: 'Dallas', users: 367, percentage: 3.9 },
  { city: 'Nairobi', users: 312, percentage: 3.3 },
]

export const OVERVIEW_STATS = {
  totalRevenue: 185140,
  totalUsers: 9396,
  paidUsers: 2880,
  nonSubscriberUsers: 6516,
  mrr: 38900,
  arr: 466800,
  churnRate: 3.2,
  conversionRate: 4.8,
  avgRevenuePerUser: 13.5,
  activationToProRenewalRate: 24.6,
  newSignupsToday: 47,
  activeUsersToday: 3245,
  revenueGrowthMoM: 12.4,
  userGrowthMoM: 8.7,
}

export const SYSTEM_STATUS = [
  { name: 'API Gateway', status: 'operational' as const, uptime: 99.98 },
  { name: 'Database', status: 'operational' as const, uptime: 99.99 },
  { name: 'AI Pipeline', status: 'degraded' as const, uptime: 98.5 },
  { name: 'Job Board Integrations', status: 'operational' as const, uptime: 99.95 },
  { name: 'Email Service', status: 'operational' as const, uptime: 99.97 },
  { name: 'Payment Gateway', status: 'operational' as const, uptime: 99.99 },
]

export const ACTIVE_ALERTS = [
  { id: '1', type: 'warning' as const, title: 'AI Pipeline Latency', message: 'Response times elevated to 3.2s (target: <1.5s). Investigating.', time: '12 min ago' },
  { id: '2', type: 'info' as const, title: 'Signup Spike Detected', message: '47 signups in the last hour (2.3x normal). Marketing campaign likely.', time: '1 hr ago' },
  { id: '3', type: 'success' as const, title: 'Database Migration Complete', message: 'Successfully migrated to new connection pool. Performance improved 15%.', time: '3 hrs ago' },
]

// ============================================================
// NG (Nigeria) GEO-SEGMENTED DATA
// ============================================================

export interface NgUser {
  id: string
  name: string
  email: string
  plan: PlanTier
  status: UserStatus
  credits: number
  creditsUsed: number
  city: string
  totalSpentNgn: number
  signupDate: string
  lastActive: string
}

export interface NgTransaction {
  id: string
  userName: string
  email: string
  plan: PlanTier
  amountNgn: number
  amountUsd: number
  type: 'subscription' | 'one_time' | 'refund'
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  date: string
}

const ngNames = [
  { first: 'Chinonso', last: 'Okafor' },
  { first: 'Adaeze', last: 'Nwosu' },
  { first: 'Emeka', last: 'Adeyemi' },
  { first: 'Ngozi', last: 'Okonkwo' },
  { first: 'Tunde', last: 'Bakare' },
  { first: 'Amara', last: 'Obi' },
  { first: 'Chidi', last: 'Eze' },
  { first: 'Folake', last: 'Adewale' },
  { first: 'Obinna', last: 'Chukwu' },
  { first: 'Zainab', last: 'Mohammed' },
  { first: 'Kayode', last: 'Ogundimu' },
  { first: 'Chioma', last: 'Igwe' },
  { first: 'Damilola', last: 'Akinola' },
  { first: 'Nneka', last: 'Uche' },
  { first: 'Yemi', last: 'Osagie' },
  { first: 'Ifeoma', last: 'Agor' },
  { first: 'Babatunde', last: 'Fashola' },
  { first: 'Chiamaka', last: 'Udoh' },
  { first: 'Segun', last: 'Oyebanji' },
  { first: 'Amaka', last: 'Ezeilo' },
]

const ngCities = ['Lagos', 'Lagos', 'Lagos', 'Abuja', 'Abuja', 'Ibadan', 'Port Harcourt', 'Kano', 'Enugu', 'Benin City', 'Lagos', 'Lagos', 'Abuja', 'Ibadan', 'Lagos', 'Port Harcourt', 'Abuja', 'Lagos', 'Ibadan', 'Enugu']

export const NG_USERS: NgUser[] = ngNames.map((n, i) => {
  const plan: PlanTier = i < 2 ? 'premium' : i < 6 ? 'pro' : i < 12 ? 'starter' : 'non_subscriber'
  const credits = plan === 'premium' ? 100 : plan === 'pro' ? 50 : plan === 'starter' ? 15 : 5
  return {
    id: `ng-${i + 1}`,
    name: `${n.first} ${n.last}`,
    email: `${n.first.toLowerCase()}.${n.last.toLowerCase()}@${randomFrom(['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'])}`,
    plan,
    status: i < 17 ? 'active' : 'activation',
    credits,
    creditsUsed: Math.floor(Math.random() * credits),
    city: ngCities[i],
    totalSpentNgn: plan === 'premium' ? 50000 * (Math.floor(Math.random() * 6) + 1) : plan === 'pro' ? 20000 * (Math.floor(Math.random() * 8) + 1) : plan === 'starter' ? 5000 * (Math.floor(Math.random() * 4) + 1) : 0,
    signupDate: randomDate(new Date('2025-10-01'), new Date('2026-06-30')),
    lastActive: randomDate(new Date('2026-06-01'), new Date('2026-07-11')),
  }
})

export const NG_TRANSACTIONS: NgTransaction[] = Array.from({ length: 30 }, (_, i) => {
  const user = NG_USERS[i % NG_USERS.length]
  const type = i < 2 ? 'refund' : 'subscription'
  const amounts: Record<PlanTier, { ngn: number; usd: number }> = {
    premium: { ngn: 50000, usd: 79 },
    pro: { ngn: 20000, usd: 49 },
    starter: { ngn: 5000, usd: 27 },
    non_subscriber: { ngn: 0, usd: 0 },
  }
  const amt = amounts[user.plan]
  return {
    id: generateId(),
    userName: user.name,
    email: user.email,
    plan: user.plan,
    amountNgn: type === 'refund' ? -amt.ngn : amt.ngn,
    amountUsd: type === 'refund' ? -amt.usd : amt.usd,
    type,
    status: i < 2 ? 'refunded' : i < 28 ? 'completed' : 'pending',
    date: randomDate(new Date('2025-10-01'), new Date('2026-07-11')),
  }
})

export const NG_REVENUE = {
  totalNgn: NG_TRANSACTIONS.filter(t => t.status === 'completed').reduce((s, t) => s + t.amountNgn, 0),
  totalUsd: NG_TRANSACTIONS.filter(t => t.status === 'completed').reduce((s, t) => s + t.amountUsd, 0),
  thisMonthNgn: NG_TRANSACTIONS.filter(t => {
    const d = new Date(t.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.status === 'completed'
  }).reduce((s, t) => s + t.amountNgn, 0),
  thisMonthUsd: NG_TRANSACTIONS.filter(t => {
    const d = new Date(t.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.status === 'completed'
  }).reduce((s, t) => s + t.amountUsd, 0),
  totalUsers: NG_USERS.length,
  activeUsers: NG_USERS.filter(u => u.status === 'active').length,
  premiumUsers: NG_USERS.filter(u => u.plan === 'premium').length,
  proUsers: NG_USERS.filter(u => u.plan === 'pro').length,
  starterUsers: NG_USERS.filter(u => u.plan === 'starter').length,
  conversionRate: 38.2,
  avgRevenuePerUser: 12400,
}

export const GLOBAL_REVENUE = {
  totalUsd: TRANSACTIONS.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0),
  thisMonthUsd: TRANSACTIONS.filter(t => {
    const d = new Date(t.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.status === 'completed'
  }).reduce((s, t) => s + t.amount, 0),
  totalUsers: USERS.length,
  activeUsers: USERS.filter(u => u.status === 'active').length,
  premiumUsers: USERS.filter(u => u.plan === 'premium').length,
  proUsers: USERS.filter(u => u.plan === 'pro').length,
  starterUsers: USERS.filter(u => u.plan === 'starter').length,
  nonSubscriberUsers: USERS.filter(u => u.plan === 'non_subscriber').length,
  conversionRate: Math.round((USERS.filter(u => u.plan !== 'non_subscriber').length / USERS.length) * 100 * 10) / 10,
  avgRevenuePerUser: Math.round(TRANSACTIONS.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0) / USERS.length),
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getRevenueStats() {
  const now = new Date()
  const thisMonth = TRANSACTIONS.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const completed = thisMonth.filter(t => t.status === 'completed')
  return {
    thisMonthRevenue: completed.reduce((sum, t) => sum + t.amount, 0),
    thisMonthTransactions: completed.length,
    thisMonthRefunds: thisMonth.filter(t => t.status === 'refunded').reduce((sum, t) => sum + Math.abs(t.amount), 0),
  }
}

export function getUserStats() {
  return {
    total: USERS.length,
    active: USERS.filter(u => u.status === 'active').length,
    activation: USERS.filter(u => u.status === 'activation').length,
    suspended: USERS.filter(u => u.status === 'suspended').length,
    cancelled: USERS.filter(u => u.status === 'cancelled').length,
    premium: USERS.filter(u => u.plan === 'premium').length,
    pro: USERS.filter(u => u.plan === 'pro').length,
    starter: USERS.filter(u => u.plan === 'starter').length,
    nonSubscriber: USERS.filter(u => u.plan === 'non_subscriber').length,
  }
}
