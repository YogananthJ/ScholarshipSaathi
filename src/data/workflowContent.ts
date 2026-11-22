export interface AgentOverview {
  stepNumber: string;
  name: string;
  role: string;
  responsibility: string;
}

export const FOUR_AGENTS: AgentOverview[] = [
  {
    stepNumber: '01',
    name: 'Scholarship Information Analyst',
    role: 'Evidence Extraction',
    responsibility:
      'Reads the scholarship text or document you provide and isolates stated eligibility criteria, benefits, deadlines, required documents, and official links.',
  },
  {
    stepNumber: '02',
    name: 'Student Eligibility Specialist',
    role: 'Criteria Matching',
    responsibility:
      'Compares your academic, demographic, and financial details strictly against the stated criteria without assuming unstated rules.',
  },
  {
    stepNumber: '03',
    name: 'Scholarship Application Planner',
    role: 'Readiness & Roadmap',
    responsibility:
      'Separates what makes you eligible from what you need to submit, tracks missing documents, and builds your step-by-step preparation roadmap.',
  },
  {
    stepNumber: '04',
    name: 'Scholarship Information Quality Controller',
    role: 'Accuracy & Provenance Check',
    responsibility:
      'Audits the draft analysis for unsupported claims, removes invented deadlines or links, and flags corrections and clarification questions.',
  },
];

export const CORE_PROMISES = [
  {
    title: 'Eligibility stays separate from readiness',
    description:
      'Missing a marksheet or income certificate affects whether you are ready to submit—not whether you meet the scholarship criteria.',
  },
  {
    title: 'Source-derived facts, never invented',
    description:
      'If a deadline or official application link is missing from the source you provided, ScholarshipSaathi marks it unavailable instead of guessing.',
  },
  {
    title: 'Self-reported documents stay honest',
    description:
      'Reporting that you have a document marks it available for planning, never claiming its contents were inspected or verified.',
  },
  {
    title: 'Session-only student privacy',
    description:
      'No mandatory login or permanent profile database. Your draft stays in your browser session and is sent only when you start analysis.',
  },
];
