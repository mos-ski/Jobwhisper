// src/hooks/useAgentSession.ts
import { useState, useEffect, useRef } from 'react'

export type AgentName = 'scout' | 'filter' | 'tailor' | 'driver' | 'system'

export interface FeedLink {
  label: string
  url: string
}

export interface FeedEvent {
  id: string
  timestamp: Date
  agent: AgentName
  message: string
  thought?: string
  links?: FeedLink[]
}

export interface AgentStatus {
  name: AgentName
  label: string
  status: 'running' | 'working' | 'idle'
  currentTask: string
}

export interface AgentSessionStats {
  found: number
  matched: number
  tailored: number
  applied: number
}

export interface AgentSession {
  stats: AgentSessionStats
  agents: AgentStatus[]
  events: FeedEvent[]
}

const INITIAL_AGENTS: AgentStatus[] = [
  { name: 'scout',  label: 'Scout',  status: 'running', currentTask: 'Scanning LinkedIn, Greenhouse, Lever' },
  { name: 'filter', label: 'Filter', status: 'idle',    currentTask: 'Waiting for jobs' },
  { name: 'tailor', label: 'Tailor', status: 'idle',    currentTask: 'Waiting for matched jobs' },
  { name: 'driver', label: 'Driver', status: 'idle',    currentTask: 'Waiting for tailored docs' },
]

interface TickStep {
  agent: AgentName
  message: string
  thought?: string
  links?: FeedLink[]
  statsInc: Partial<AgentSessionStats>
  agentPatch: { name: AgentName; status: AgentStatus['status']; currentTask: string } | null
}

const TICK_STEPS: TickStep[] = [
  {
    agent: 'scout',
    message: 'Scanned LinkedIn — found 6 new roles matching GRC Analyst criteria (seniority: mid-senior, location: New York). Passing to Filter.',
    thought: 'Scoring by: title weight 40%, location 30%, cert match 20%, salary 10%.',
    links: [
      { label: 'GRC Analyst – Barclays', url: '#' },
      { label: 'Compliance Analyst – Goldman Sachs', url: '#' },
      { label: 'Risk Analyst – Citi', url: '#' },
    ],
    statsInc: { found: 6 }, agentPatch: { name: 'scout', status: 'running', currentTask: 'Scanning Greenhouse, Workday' },
  },
  {
    agent: 'filter',
    message: 'Received 6 jobs from Scout. Running match scoring against student profile — checking title alignment, required certs, location, and salary range.',
    thought: 'Running NLP embedding match on JD vs resume. Threshold: 85%.',
    statsInc: {}, agentPatch: { name: 'filter', status: 'running', currentTask: 'Scoring 6 jobs' },
  },
  {
    agent: 'scout',
    message: 'Scanned Greenhouse — found 8 new postings. 3 are GRC roles at FS firms, 5 are adjacent compliance roles. All forwarded to Filter queue.',
    thought: 'Deduplicating against previously seen job IDs before forwarding.',
    links: [
      { label: 'Senior GRC Analyst – JPMorgan Chase', url: '#' },
      { label: 'Compliance Officer – HSBC', url: '#' },
    ],
    statsInc: { found: 8 }, agentPatch: { name: 'scout', status: 'running', currentTask: 'Scanning Workday, Lever' },
  },
  {
    agent: 'filter',
    message: 'Scored 6 LinkedIn jobs — 4 passed (≥85% match), 2 rejected. Top match: "GRC Analyst" at Barclays (91%). Passed roles queued for resume tailoring.',
    thought: 'Rejected: KPMG — requires Big 4 background (not in profile). EY — salary below stated minimum.',
    links: [
      { label: 'GRC Analyst – Barclays (91%)', url: '#' },
      { label: 'Compliance Analyst – JPMorgan (88%)', url: '#' },
    ],
    statsInc: { matched: 4 }, agentPatch: { name: 'filter', status: 'running', currentTask: 'Scoring next batch' },
  },
  {
    agent: 'tailor',
    message: 'Starting resume tailoring for JPMorgan Chase "Compliance Analyst" (Req #8821). Mapping student certs and experience to JD keywords.',
    thought: 'Identified 11 key phrases in JD. Reordering bullet points by relevance. Injecting CISA + Basel III keywords.',
    links: [{ label: 'View job posting – JPMorgan Chase', url: '#' }],
    statsInc: {}, agentPatch: { name: 'tailor', status: 'working', currentTask: 'Building resume for JPMorgan Chase' },
  },
  {
    agent: 'scout',
    message: 'Scanned 34 Workday listings — 5 relevant roles identified. Skipped 29 due to title mismatch or salary below threshold.',
    thought: 'Filtering out contract roles and roles requiring security clearance.',
    statsInc: { found: 5 }, agentPatch: { name: 'scout', status: 'running', currentTask: 'Scanning Lever, Indeed' },
  },
  {
    agent: 'tailor',
    message: 'Resume tailored for JPMorgan Chase — ATS score 94/100. Highlighted CISA cert, GRC framework experience, and NYC availability.',
    thought: 'ATS simulation passed. Cover letter generated with role-specific opening paragraph.',
    links: [
      { label: 'Resume — JPMorgan Chase.pdf', url: '#' },
      { label: 'Cover letter — JPMorgan Chase.pdf', url: '#' },
    ],
    statsInc: { tailored: 1 }, agentPatch: { name: 'tailor', status: 'working', currentTask: 'Building resume for Citibank' },
  },
  {
    agent: 'driver',
    message: 'Submitted application to JPMorgan Chase (Req #8821) ✓ — filled all form fields, attached tailored resume, answered 3 screening questions.',
    thought: 'Navigating Workday ATS. Auto-filled 14 fields. Screening Q: "Are you legally authorised to work in the US?" → Yes.',
    links: [{ label: 'View application – JPMorgan Chase', url: '#' }],
    statsInc: { applied: 1 }, agentPatch: { name: 'driver', status: 'working', currentTask: 'Filling form for Citibank' },
  },
  {
    agent: 'filter',
    message: 'Scored Greenhouse batch — rejected 3 roles below 85%: KPMG (78%), Deloitte (72%), EY (69%). 5 roles passed.',
    thought: 'KPMG: no hybrid option flagged. Deloitte: Big 4 requirement not in profile. EY: title mismatch (Audit vs GRC).',
    statsInc: {}, agentPatch: null,
  },
  {
    agent: 'tailor',
    message: 'Resume tailored for Citibank "Risk & Compliance Analyst" — ATS score 91/100. Emphasised Basel III exposure and regulatory reporting skills.',
    thought: 'Swapped 3 generic bullet points for quantified achievements. Added Citibank-specific regulatory keywords.',
    links: [
      { label: 'Resume — Citibank.pdf', url: '#' },
      { label: 'Cover letter — Citibank.pdf', url: '#' },
    ],
    statsInc: { tailored: 1 }, agentPatch: { name: 'tailor', status: 'working', currentTask: 'Building resume for Goldman Sachs' },
  },
  {
    agent: 'driver',
    message: 'Submitted application to Citibank (Req #C-4401) ✓ — multi-step form completed, cover letter attached, EEO fields filled.',
    thought: 'Form had 3 pages. Uploaded resume to file field, pasted cover letter into text area. Saved application ID: C-4401-SM.',
    links: [{ label: 'View application – Citibank', url: '#' }],
    statsInc: { applied: 1 }, agentPatch: { name: 'driver', status: 'idle', currentTask: 'Waiting for next tailored doc' },
  },
  {
    agent: 'scout',
    message: 'Found "Compliance Analyst" at Goldman Sachs via LinkedIn — 92% match. Role is hybrid NYC, requires 3+ yrs GRC, CISA preferred.',
    thought: 'High priority flag: CISA cert is a direct match. Role salary band aligns with student preference.',
    links: [{ label: 'View job posting – Goldman Sachs', url: '#' }],
    statsInc: { found: 1 }, agentPatch: { name: 'scout', status: 'running', currentTask: 'Continuing scan...' },
  },
]

export function useAgentSession(_studentId: string): AgentSession {
  const [session, setSession] = useState<AgentSession>({
    stats: { found: 0, matched: 0, tailored: 0, applied: 0 },
    agents: INITIAL_AGENTS,
    events: [
      { id: 'seed-1', timestamp: new Date(), agent: 'system', message: 'Agent session initialised for student. Pipeline active — Scout is running, Filter, Tailor and Driver are on standby.' },
      { id: 'seed-2', timestamp: new Date(), agent: 'scout',  message: 'Starting job scan across LinkedIn, Greenhouse, and Lever. Filters loaded: title=GRC/Compliance/Risk, location=New York, seniority=mid-senior.' },
    ],
  })

  const stepRef = useRef(0)
  const counterRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const step = TICK_STEPS[stepRef.current % TICK_STEPS.length]
      stepRef.current += 1
      setSession(prev => {
        const newStats: AgentSessionStats = {
          found:    prev.stats.found    + (step.statsInc.found    ?? 0),
          matched:  prev.stats.matched  + (step.statsInc.matched  ?? 0),
          tailored: prev.stats.tailored + (step.statsInc.tailored ?? 0),
          applied:  prev.stats.applied  + (step.statsInc.applied  ?? 0),
        }
        const newAgents = step.agentPatch
          ? prev.agents.map(a =>
              a.name === step.agentPatch!.name
                ? { ...a, status: step.agentPatch!.status, currentTask: step.agentPatch!.currentTask }
                : a
            )
          : prev.agents
        const newEvent: FeedEvent = {
          id: `tick-${++counterRef.current}`,
          timestamp: new Date(),
          agent: step.agent,
          message: step.message,
          thought: step.thought,
          links: step.links,
        }
        return { stats: newStats, agents: newAgents, events: [...prev.events, newEvent] }
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return session
}
