import type {
  CopilotCodingTurn,
  CopilotHistoryRow,
  CopilotLiveSession,
  CopilotPermissionStep,
  CopilotReport,
  CopilotSetup,
  CopilotTranscriptTurn,
} from '@/contracts/copilot.draft'

export const copilotSetup: CopilotSetup = {
  mode: 'interview',
  uploadedFileName: 'adewale_damola_PM_resume.pdf',
  interviewType: 'Introductory',
  difficulty: 'Medium',
  targetRole: 'Product Manager',
  companyName: 'Google',
  additionalContext:
    'Use this space to include job description details, portfolio notes, or anything the interviewer should probe during the live call.',
  responseMode: 'default',
  responseLength: 'medium',
}

export const copilotShareSteps: readonly CopilotPermissionStep[] = [
  {
    id: 'screen',
    title: 'Share your screen',
    description: 'Required - the AI reads your screen during the call',
    status: 'available',
    actionLabel: 'Share Screen',
  },
  {
    id: 'microphone',
    title: 'Turn on your microphone',
    description: 'Required - connects to your call audio',
    status: 'disabled',
    actionLabel: 'Turn on Microphone',
  },
]

export const copilotReadySteps: readonly CopilotPermissionStep[] = [
  {
    id: 'screen',
    title: 'Share your screen',
    description: 'Required - the AI reads your screen during the call',
    status: 'complete',
    actionLabel: 'Share Screen',
  },
  {
    id: 'microphone',
    title: 'Turn on your microphone',
    description: 'Required - connects to your call audio',
    status: 'complete',
    actionLabel: 'Start Interview',
  },
]

export const copilotLiveSession: CopilotLiveSession = {
  mode: 'interview',
  title: 'Interview for UI/UX Designer',
  timer: '00:04',
  signalLabel: 'Strong',
  activityLabel: 'Idle...',
  screenPreviewSrc: '/v3-assets/figma/copilot-live-interview-preview.png',
  prompts: [
    'Summarize the discussion so far',
    'How well am I doing so far?',
    'Suggest follow-up questions',
    'What was discussed in the last two minutes?',
  ],
}

export const copilotHistoryRows: readonly CopilotHistoryRow[] = [
  { id: 'copilot-history-1', mode: 'interview', title: 'Product Manager', where: 'Desktop', company: 'Amazon Inc.', duration: '34m', dateTime: 'August 13th 2026, 12:49 pm' },
  { id: 'copilot-history-2', mode: 'interview', title: 'Senior Product Designer', where: 'Mobile', company: 'Google', duration: '21m', dateTime: 'August 9th 2026, 2:31 pm' },
  { id: 'copilot-history-3', mode: 'meeting', title: 'Weekly Product Sync', where: 'Desktop', company: 'Notion', duration: '47m', dateTime: 'August 5th 2026, 7:58 am' },
  { id: 'copilot-history-4', mode: 'interview', title: 'Backend Engineer, Payments', where: 'Desktop', company: 'Stripe', duration: '16m', dateTime: 'August 1st 2026, 10:44 am' },
  { id: 'copilot-history-5', mode: 'interview', title: 'UX Researcher', where: 'Mobile', company: 'Spotify', duration: '38m', dateTime: 'July 27th 2026, 4:16 pm' },
  { id: 'copilot-history-6', mode: 'coding', title: 'Coding Interview — Two Sum & Sliding Window', where: 'Desktop', company: 'Goldman Sachs', duration: '13m', dateTime: 'July 22nd 2026, 9:20 am' },
  { id: 'copilot-history-7', mode: 'interview', title: 'Data Analyst', where: 'Desktop', company: 'Airbnb', duration: '29m', dateTime: 'July 17th 2026, 1:02 pm' },
  { id: 'copilot-history-8', mode: 'interview', title: 'Marketing Manager, Lifecycle', where: 'Mobile', company: 'HubSpot', duration: '24m', dateTime: 'July 12th 2026, 3:47 pm' },
  { id: 'copilot-history-9', mode: 'meeting', title: 'Q3 Roadmap Review', where: 'Desktop', company: 'Lightforth', duration: '55m', dateTime: 'July 7th 2026, 11:12 am' },
  { id: 'copilot-history-10', mode: 'coding', title: 'Coding Interview — System Design: Rate Limiter', where: 'Desktop', company: 'DeeXoptions', duration: '18m', dateTime: 'July 1st 2026, 5:39 pm' },
]

export const copilotInterviewTranscript: readonly CopilotTranscriptTurn[] = [
  {
    speaker: 'Interviewer',
    question: 'Can you tell me a bit about yourself and your background in product management?',
    answer:
      "I'm a product manager with 6 years of experience shipping B2B and consumer products, most recently leading the payments team at a fintech startup. I focus on translating ambiguous problems into clear roadmaps, and I'm most energized by the intersection of user research and measurable business impact.",
  },
  {
    speaker: 'Interviewer',
    question: 'What would you say is your greatest strength as a PM?',
    answer:
      'My greatest strength is owning the full product lifecycle — from discovery through launch and iteration. That end-to-end ownership reduces handoff friction. On my last team, it helped us cut time-to-market by roughly 30% over two quarters.',
  },
  {
    speaker: 'Interviewer',
    question: 'Tell me about a time you disagreed with a stakeholder on product direction.',
    answer:
      'A senior stakeholder wanted to ship a feature I believed would hurt retention based on our research. Instead of pushing back directly, I brought a data brief showing the risk alongside two alternatives that met their goal differently. We shipped a smaller version with a 30-day review gate — it performed well and strengthened the relationship.',
    interjection: { speaker: 'Interviewer', text: 'And how did they react once they saw the data?' },
  },
  {
    speaker: 'Interviewer',
    question: 'How do you prioritize when you have limited engineering time?',
    answer:
      'I use RICE scoring to quantify reach, impact, confidence, and effort, paired with qualitative input from customer success and sales — they often catch signals the data misses. The output is a ranked backlog everyone can see and challenge transparently.',
  },
  {
    speaker: 'Interviewer',
    question: 'Where do you see yourself in the next three to five years?',
    answer:
      "I'd like to be leading product strategy at a company building something with real impact — either as a Director of Product or in a founding role. I'm especially interested in how AI can make product experiences more personalized without sacrificing trust.",
  },
]

export const copilotMeetingTranscript: readonly CopilotTranscriptTurn[] = [
  {
    speaker: 'Priya (Eng Lead)',
    question: 'I think we should push the launch date by two weeks to finish QA properly.',
    answer:
      "That tracks with the bug count we're seeing. Suggest a checkpoint: propose a go/no-go review next Wednesday so the team doesn't lose more time than necessary while still protecting quality.",
  },
  {
    speaker: 'Marcus (Marketing)',
    question: 'Marketing already has assets scheduled for the original date — any slip needs to be decided today, not next week.',
    answer:
      'Bridge the conflict: loop marketing into the QA checkpoint today so they can adjust the campaign calendar in parallel rather than finding out at the last minute.',
    interjection: { speaker: 'Priya (Eng Lead)', text: "Does marketing need the final date today, or just a heads-up that it might move?" },
  },
  {
    speaker: 'Marcus (Marketing)',
    question: "What's the actual blocker on QA — is it headcount or test coverage?",
    answer: 'Push for clarity: ask the QA lead directly whether it\'s resourcing or scope, since the fix looks different either way.',
    interjection: { speaker: 'Devon (QA Lead)', text: "It's coverage, not headcount — we're missing edge cases on the payments flow." },
  },
  {
    speaker: 'Devon (QA Lead)',
    question: "If we get two more days on payments-flow coverage, I'm comfortable signing off.",
    answer:
      'Capture the commitment: two extra days on payments-flow coverage, then a sign-off — worth confirming this in writing so the go/no-go review has a clear condition to check against.',
    interjection: { speaker: 'Priya (Eng Lead)', text: 'Two days works on our side — I can free up a second engineer.' },
  },
  {
    speaker: 'Marcus (Marketing)',
    question: 'So we\'re looking at a one-week slip, not two — can everyone confirm that before I update the campaign calendar?',
    answer:
      'Summarize for the room: Eng needs two extra days on payments-flow coverage, QA signs off after that, and Marketing shifts assets by roughly a week rather than the original two — worth a quick thumbs-up from Priya and Devon before Marcus locks the calendar.',
    interjection: { speaker: 'Devon (QA Lead)', text: 'Confirmed on my end, assuming the extra engineer lands today.' },
  },
]

export const copilotCodingBank: readonly CopilotCodingTurn[] = [
  {
    question: 'Write a function that returns the nth Fibonacci number using memoization.',
    answer: 'function fib(n, memo = {}) {\n  if (n in memo) return memo[n]\n  if (n <= 1) return n\n  memo[n] = fib(n - 1, memo) + fib(n - 2, memo)\n  return memo[n]\n}',
  },
  {
    question: 'Reverse a singly linked list in place.',
    answer: 'function reverseList(head) {\n  let prev = null\n  let curr = head\n  while (curr) {\n    const next = curr.next\n    curr.next = prev\n    prev = curr\n    curr = next\n  }\n  return prev\n}',
  },
  {
    question: 'Given an array of integers, return the two indices whose values sum to a target.',
    answer: 'function twoSum(nums, target) {\n  const seen = new Map()\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i]\n    if (seen.has(complement)) return [seen.get(complement), i]\n    seen.set(nums[i], i)\n  }\n  return []\n}',
  },
]

export const copilotReport: CopilotReport = {
  title: 'Product Manager — Amazon Inc.',
  subtitle: 'Interview · 34 min · Desktop',
  score: 78,
  summary:
    'Strong product thinking and clear communication. You demonstrated solid prioritization frameworks and stakeholder management. The main gaps were in metrics depth and technical trade-off discussions. Focus on leading with measurable outcomes.',
  whatWentWell: [
    'Clear prioritization framework using RICE scoring',
    'Strong stakeholder management language — showed genuine partnership',
    'Good recovery when challenged on a product decision',
  ],
  whatNeedsWork: [
    'Lead with measurable outcomes earlier in your answers',
    'Deepen technical trade-off discussions — mention latency, cost, complexity',
    'Tighten the opening — too much context before the core point',
  ],
  knowledgeGaps: [
    'Metrics definition lacked specificity beyond top-level KPIs',
    'No mention of A/B testing or experimentation methodology',
    'Limited depth on how technical constraints shaped product decisions',
  ],
  suggestedQuestions: [
    'Describe a time you had to prioritize competing feature requests from different stakeholders.',
    'How do you define and track success metrics for a new feature launch?',
    'Tell me about a product decision that didn\'t go as planned. What did you learn?',
    'Walk me through how you collaborate with engineering when a feature requires technical trade-offs.',
  ],
  rubric: [
    { element: 'Product Thinking', status: 'strong', notes: 'Clear framework for prioritization. Showed genuine product intuition.' },
    { element: 'Metrics & Data', status: 'needs-work', notes: 'Mentioned top-level KPIs but lacked depth on how to define and track them.' },
    { element: 'Stakeholder Management', status: 'strong', notes: 'Language showed partnership, not handoff. Good cross-functional examples.' },
    { element: 'Technical Depth', status: 'partial', notes: 'Acknowledged trade-offs but didn\'t explain how they were evaluated.' },
    { element: 'Communication Clarity', status: 'partial', notes: 'Good overall but opening answers were too long before reaching the point.' },
    { element: 'Recovery Under Pressure', status: 'strong', notes: 'Adapted quickly when challenged. Showed intellectual honesty.' },
  ],
  talkTime: {
    userPercent: 52,
    otherPercent: 48,
    otherLabel: 'Interviewer',
    tip: 'Good balance. Slightly less talking would leave more room for follow-up questions.',
  },
  transcript: [
    { id: 'ct-1', speaker: 'Interviewer', isUser: false, timestamp: '00:12', text: 'Tell me about a time you had to make a difficult product prioritization decision.' },
    { id: 'ct-2', speaker: 'You', isUser: true, timestamp: '00:28', text: 'In my last role, we had three competing feature requests from different stakeholder groups. I used RICE scoring to objectively evaluate each one against our quarterly goals.' },
    { id: 'ct-3', speaker: 'Interviewer', isUser: false, timestamp: '01:45', text: 'How did you handle pushback from the stakeholders whose features didn\'t make the cut?' },
    { id: 'ct-4', speaker: 'You', isUser: true, timestamp: '02:03', text: 'I set up individual conversations to walk through the scoring and listen to their concerns. In two cases, we found ways to incorporate partial scope into the top-priority feature.' },
    { id: 'ct-5', speaker: 'Interviewer', isUser: false, timestamp: '03:22', text: 'What metrics did you use to measure success?' },
    { id: 'ct-6', speaker: 'You', isUser: true, timestamp: '03:40', text: 'We tracked activation rate and feature adoption over the first 30 days. Activation improved from 38% to 51%.' },
  ],
}

export const copilotCodingReport: CopilotReport = {
  title: 'Coding Session — Stripe',
  subtitle: 'Coding · 41 min · Screen share',
  score: 84,
  summary:
    'Solid problem-solving with a working solution on all three prompts. You talked through your approach before coding, which is exactly what interviewers want to see. The main gap is time-complexity awareness — you found working solutions but didn\'t always name the Big-O trade-offs out loud.',
  whatWentWell: [
    'Talked through your approach before writing code on every prompt',
    'Caught and fixed your own off-by-one error on the linked-list reversal without prompting',
    'Used a hash map for two-sum immediately instead of starting with brute force',
  ],
  whatNeedsWork: [
    'State time and space complexity out loud once you finish a solution',
    'Ask clarifying questions before coding — e.g. can the input array be empty or unsorted',
    'Narrate edge cases you\'re handling as you write them, not just at the end',
  ],
  knowledgeGaps: [
    'Memoization pattern was correct but you couldn\'t explain why it drops fibonacci from O(2^n) to O(n)',
    'No mention of iterative alternatives to the recursive Fibonacci approach',
  ],
  suggestedQuestions: [
    'Practice explaining time and space complexity out loud for every solution, even correct ones.',
    'Try the same three problems again, this time asking 1-2 clarifying questions before writing any code.',
    'Practice an iterative version of a problem you solved recursively.',
  ],
  rubric: [
    { element: 'Problem-Solving Approach', status: 'strong', notes: 'Talked through the approach before coding on every prompt.' },
    { element: 'Code Correctness', status: 'strong', notes: 'All three solutions passed, including edge cases like an empty array.' },
    { element: 'Time & Space Complexity', status: 'needs-work', notes: 'Found the right approach but rarely stated Big-O trade-offs unprompted.' },
    { element: 'Code Quality & Style', status: 'strong', notes: 'Clear variable names, no dead code, consistent formatting.' },
    { element: 'Communication While Coding', status: 'partial', notes: 'Narrated approach up front but went quiet while actually typing.' },
    { element: 'Debugging', status: 'strong', notes: 'Caught the off-by-one error on the linked list reversal without a hint.' },
  ],
  talkTime: {
    userPercent: 61,
    otherPercent: 39,
    otherLabel: 'Copilot prompts',
    tip: 'You went quiet while typing — try narrating as you code, not just before and after.',
  },
  transcript: [
    { id: 'cc-1', speaker: 'Prompt', isUser: false, timestamp: '00:10', text: 'Write a function that returns the nth Fibonacci number using memoization.' },
    { id: 'cc-2', speaker: 'You', isUser: true, timestamp: '00:22', text: 'I\'ll use a memo object keyed by n so repeated calls are O(1) instead of recomputing the whole subtree.' },
    { id: 'cc-3', speaker: 'Prompt', isUser: false, timestamp: '04:40', text: 'Reverse a singly linked list in place.' },
    { id: 'cc-4', speaker: 'You', isUser: true, timestamp: '04:55', text: 'I\'ll walk the list with a prev and curr pointer, flipping each next reference as I go.' },
    { id: 'cc-5', speaker: 'Prompt', isUser: false, timestamp: '09:15', text: 'Given an array of integers, return the two indices whose values sum to a target.' },
    { id: 'cc-6', speaker: 'You', isUser: true, timestamp: '09:30', text: 'I\'ll use a hash map to track values I\'ve seen so I can check for the complement in one pass.' },
  ],
}

export const copilotMeetingReport: CopilotReport = {
  title: 'Launch Timeline Review — Internal',
  subtitle: 'Meeting · 22 min · 3 speakers',
  score: 88,
  summary:
    'A focused meeting that reached a clear decision: a one-week launch slip, conditional on two extra days of payments-flow QA coverage. Priya, Marcus, and Devon each confirmed their part before the meeting ended, so there\'s no ambiguity on next steps.',
  whatWentWell: [
    'Reached a concrete, conditional decision instead of leaving the date open-ended',
    'Every stakeholder (Eng, Marketing, QA) confirmed their commitment out loud before wrapping up',
    'Marcus surfaced the marketing-calendar constraint early instead of finding out after the fact',
  ],
  whatNeedsWork: [
    'The one-week-vs-two-week slip wasn\'t written down anywhere until Marcus asked for confirmation',
    'No owner was assigned to update the campaign calendar after the meeting',
    'Devon\'s "assuming the extra engineer lands today" condition needs a follow-up if it doesn\'t',
  ],
  knowledgeGaps: [
    'No agreed fallback if the second engineer isn\'t available today',
    'Go/no-go review date (next Wednesday) wasn\'t re-confirmed against the new one-week timeline',
  ],
  suggestedQuestions: [
    'Who owns updating the campaign calendar, and by when?',
    'What happens to the timeline if the second engineer doesn\'t land today?',
    'Does the go/no-go review still happen next Wednesday, or does it move with the new date?',
  ],
  rubric: [
    { element: 'Key Decisions Captured', status: 'strong', notes: 'Clear conditional decision: one-week slip, contingent on 2 extra QA days.' },
    { element: 'Action Item Clarity', status: 'partial', notes: 'Decision was clear; owner and deadline for the calendar update were not.' },
    { element: 'Speaking Time Balance', status: 'strong', notes: 'All three participants spoke roughly evenly — no one dominated.' },
    { element: 'Follow-up Ownership', status: 'needs-work', notes: 'No one was explicitly assigned to confirm the engineer landed or update marketing.' },
    { element: 'Conflict Resolution', status: 'strong', notes: 'Eng/Marketing tension over timing was resolved with a concrete compromise.' },
  ],
  talkTime: {
    userPercent: 34,
    otherPercent: 66,
    otherLabel: 'Priya, Marcus & Devon',
    tip: 'Balanced three-way conversation — no single speaker dominated the discussion.',
  },
  transcript: [
    { id: 'cm-1', speaker: 'Priya (Eng Lead)', isUser: false, timestamp: '00:15', text: 'I think we should push the launch date by two weeks to finish QA properly.' },
    { id: 'cm-2', speaker: 'Marcus (Marketing)', isUser: false, timestamp: '01:40', text: 'Marketing already has assets scheduled for the original date — any slip needs to be decided today, not next week.' },
    { id: 'cm-3', speaker: 'Devon (QA Lead)', isUser: false, timestamp: '03:05', text: "It's coverage, not headcount — we're missing edge cases on the payments flow." },
    { id: 'cm-4', speaker: 'Devon (QA Lead)', isUser: false, timestamp: '05:50', text: "If we get two more days on payments-flow coverage, I'm comfortable signing off." },
    { id: 'cm-5', speaker: 'Priya (Eng Lead)', isUser: false, timestamp: '06:10', text: 'Two days works on our side — I can free up a second engineer.' },
    { id: 'cm-6', speaker: 'Marcus (Marketing)', isUser: false, timestamp: '08:30', text: "So we're looking at a one-week slip, not two — can everyone confirm that before I update the campaign calendar?" },
  ],
}
