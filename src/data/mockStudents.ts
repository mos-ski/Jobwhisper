export interface MockStudent {
  id: string
  name: string
  email: string
  role: string
  seniority: 'mid' | 'senior' | 'lead' | 'manager'
  location: string
  initials: string
  preferences: string[]
  appliedCount: number
  status: 'active' | 'inactive'
  autoApply: 'running' | 'paused'
  performance: number
}

export const STUDENT_QUOTA = 100

export const MOCK_STUDENTS: MockStudent[] = [
  { id: '1', name: 'Sarah Mitchell',   email: 'sarah.mitchell@gmail.com',   role: 'GRC Analyst',        seniority: 'mid',     location: 'New York',      initials: 'SM', preferences: ['On-site', 'Senior', 'Banking', 'GRC'],            appliedCount: 9,  status: 'active', autoApply: 'running', performance: 90 },
  { id: '2', name: 'James Okafor',     email: 'james.okafor@gmail.com',     role: 'Compliance Officer', seniority: 'senior',  location: 'Chicago',       initials: 'JO', preferences: ['Hybrid', 'Senior', 'Fintech', 'Compliance'],       appliedCount: 34, status: 'active', autoApply: 'running', performance: 77 },
  { id: '3', name: 'Priya Sharma',     email: 'priya.sharma@gmail.com',     role: 'Risk Analyst',       seniority: 'mid',     location: 'Austin',        initials: 'PS', preferences: ['Remote', 'Mid', 'Financial Services', 'Risk'],     appliedCount: 61, status: 'active', autoApply: 'paused',  performance: 81 },
  { id: '4', name: 'David Chen',       email: 'david.chen@gmail.com',       role: 'AML Analyst',        seniority: 'senior',  location: 'San Francisco', initials: 'DC', preferences: ['Remote', 'Senior', 'FinTech', 'AML'],             appliedCount: 22, status: 'active', autoApply: 'running', performance: 45 },
  { id: '5', name: 'Aisha Patel',      email: 'aisha.patel@gmail.com',      role: 'Risk Manager',       seniority: 'manager', location: 'London',        initials: 'AP', preferences: ['Hybrid', 'Manager', 'Banking', 'Risk'],           appliedCount: 78, status: 'active', autoApply: 'running', performance: 81 },
  { id: '6', name: 'Marcus Johnson',   email: 'marcus.johnson@gmail.com',   role: 'Compliance Lead',    seniority: 'lead',    location: 'Boston',        initials: 'MJ', preferences: ['On-site', 'Lead', 'Insurance', 'Compliance'],     appliedCount: 45, status: 'active', autoApply: 'running', performance: 77 },
  { id: '7', name: 'Elena Vasquez',    email: 'elena.vasquez@gmail.com',    role: 'Privacy Counsel',    seniority: 'senior',  location: 'Miami',         initials: 'EV', preferences: ['Remote', 'Senior', 'Tech', 'Privacy'],            appliedCount: 93, status: 'active', autoApply: 'running', performance: 90 },
  { id: '8', name: 'Kevin Osei',       email: 'kevin.osei@gmail.com',       role: 'Regulatory Analyst', seniority: 'mid',     location: 'Atlanta',       initials: 'KO', preferences: ['Hybrid', 'Mid', 'Financial Services', 'RegTech'], appliedCount: 17, status: 'active', autoApply: 'running', performance: 84 },
]
