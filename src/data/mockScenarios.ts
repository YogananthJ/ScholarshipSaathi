import { AnalysisResult } from '../types/scholarship';

export interface SampleScenario {
  id: string;
  caseCode: string;
  title: string;
  subtitle: string;
  studentSummary: string;
  result: AnalysisResult;
}

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'test-case-a',
    caseCode: 'Test Case A',
    title: 'Rahul Kumar — Eligible, Missing Documents',
    subtitle: 'National Merit-cum-Means Undergraduate Grant (Fictional Scenario)',
    studentSummary: 'B.Tech 2nd Year · 82% previous marks · Annual family income INR 2,10,000',
    result: {
      scholarship_name: 'National Merit-cum-Means Undergraduate Grant 2026',
      provider: 'State Higher Education Foundation',
      benefits: 'Tuition waiver up to INR 50,000 per academic year and annual book allowance of INR 5,000.',
      eligibility_status: 'Eligible',
      eligibility_explanation:
        'Based on the supplied criteria, Rahul Kumar meets the nationality requirement, undergraduate enrolment condition, minimum 75% previous academic score (reported 82%), and annual family income ceiling below INR 2,50,000.',
      application_readiness: 'Incomplete',
      readiness_explanation:
        'Eligibility criteria are met, but application readiness is Incomplete because a valid Income Certificate and Current Institution ID were reported as missing.',
      information_provenance: [
        'Eligibility criteria, income ceiling, and deadline extracted from user-supplied scholarship notice.',
        'Academic marks, family income, and document possession are student-reported and unverified.',
      ],
      source_verification_status:
        'Derived from user-supplied text only; official portal was not externally checked.',
      available_documents: [
        {
          name: 'Previous Academic Marksheet',
          status: 'reported-available',
          note: 'Student reported as available (contents not inspected).',
          provenance: 'student-reported',
        },
        {
          name: 'Government Identity Proof',
          status: 'reported-available',
          note: 'Student reported as available (contents not inspected).',
          provenance: 'student-reported',
        },
      ],
      missing_documents: [
        {
          name: 'Official Annual Family Income Certificate',
          status: 'missing',
          note: 'Required by the supplied scholarship notice for income verification.',
          provenance: 'source-derived',
        },
        {
          name: 'Current Educational Institution ID Card',
          status: 'missing',
          note: 'Required to confirm active undergraduate enrolment.',
          provenance: 'source-derived',
        },
      ],
      application_steps: [
        {
          stepNumber: 1,
          title: 'Obtain missing mandatory certificates',
          description:
            'Apply for a current-year Income Certificate from the local revenue office and request an active Institution ID or bonafide letter from your college.',
          provenance: 'general-guidance',
        },
        {
          stepNumber: 2,
          title: 'Prepare digital scans of all four documents',
          description:
            'Keep clear, legible copies of your marksheet, identity proof, income certificate, and institution ID ready before opening the application form.',
          provenance: 'general-guidance',
        },
        {
          stepNumber: 3,
          title: 'Submit through the official scholarship portal before the deadline',
          description:
            'Complete the online registration and upload supporting documents on the stated portal prior to November 30, 2026.',
          provenance: 'source-derived',
        },
      ],
      actions_required_before_submission: [
        {
          action: 'Obtain a valid Income Certificate issued by a competent authority.',
          provenance: 'source-derived',
        },
        {
          action: 'Collect or renew your Current Educational Institution ID or bonafide enrolment letter.',
          provenance: 'source-derived',
        },
        {
          action: 'Cross-check final document format rules directly on the provider website before uploading.',
          provenance: 'general-guidance',
        },
      ],
      official_application_link: 'https://scholarships.example.edu/merit-means-2026',
      deadline: 'November 30, 2026',
      warnings: [
        'Student-reported marks (82%) and income (INR 2,10,000) have not been independently verified.',
        'Do not wait until the final week to request a government-issued income certificate, as processing times vary.',
      ],
      clarification_questions: [
        'Is your existing academic marksheet attested or issued as an official college transcript?',
      ],
      corrections_made: [
        'Quality Controller confirmed that missing Income Certificate lowers Application Readiness to Incomplete without changing Eligibility from Eligible.',
      ],
      isSamplePreview: true,
      sampleLabel: 'Test Case A · Eligible with Missing Documents',
    },
  },
  {
    id: 'test-case-b',
    caseCode: 'Test Case B',
    title: 'Ananya Verma — Not Eligible (Criterion Not Met)',
    subtitle: 'STEM Women Postgraduate Fellowship (Fictional Scenario)',
    studentSummary: '1st Year B.Sc. Student · All 4 documents reported available',
    result: {
      scholarship_name: 'STEM Women Postgraduate Fellowship 2026',
      provider: 'Apex Science & Innovation Council',
      benefits: 'Monthly research stipend of INR 18,000 for two postgraduate years.',
      eligibility_status: 'Not Eligible',
      eligibility_explanation:
        'The supplied source strictly restricts this fellowship to applicants enrolled in or admitted to a full-time Postgraduate (Master’s) STEM programme. You reported currently studying at the Undergraduate (B.Sc.) level.',
      application_readiness: 'Ready',
      readiness_explanation:
        'You reported holding the standard supporting documents, though eligibility criteria for this specific fellowship are not met.',
      information_provenance: [
        'Programme level restriction extracted directly from supplied fellowship guidelines.',
        'Current education level is student-reported.',
      ],
      source_verification_status:
        'Assessed strictly from supplied text; no external portal verification performed.',
      available_documents: [
        {
          name: 'Academic Marksheet',
          status: 'reported-available',
          note: 'Student reported as available (not inspected).',
          provenance: 'student-reported',
        },
        {
          name: 'Identity Proof',
          status: 'reported-available',
          note: 'Student reported as available (not inspected).',
          provenance: 'student-reported',
        },
      ],
      missing_documents: [],
      application_steps: [
        {
          stepNumber: 1,
          title: 'Confirm whether any undergraduate exception exists',
          description:
            'Review the provider’s FAQ or contact their helpdesk only if you expect to begin a Master’s programme before the fellowship start date.',
          provenance: 'general-guidance',
        },
        {
          stepNumber: 2,
          title: 'Redirect effort toward undergraduate STEM scholarships',
          description:
            'Keep your existing marksheet and identity documents organized for undergraduate-level opportunities.',
          provenance: 'general-guidance',
        },
      ],
      actions_required_before_submission: [
        {
          action: 'Do not submit an application unless you hold formal postgraduate admission matching the stated intake window.',
          provenance: 'source-derived',
        },
      ],
      official_application_link: 'https://sciencecouncil.example.org/pg-fellowship',
      deadline: 'December 15, 2026',
      warnings: [
        'Possessing all required documents does not override the postgraduate degree requirement.',
      ],
      clarification_questions: [],
      corrections_made: [
        'Quality Controller verified that having documents available keeps Readiness separate and does not alter the Not Eligible assessment.',
      ],
      isSamplePreview: true,
      sampleLabel: 'Test Case B · Not Eligible',
    },
  },
  {
    id: 'test-case-c',
    caseCode: 'Test Case C',
    title: 'Insufficient Information — Missing Age & Income Bounds',
    subtitle: 'District Youth Skill Scholarship (Fictional Scenario)',
    studentSummary: 'Diploma Student · Supplied notice omits income cap; student omitted residence',
    result: {
      scholarship_name: 'District Youth Skill Scholarship',
      provider: 'Regional Skill Development Trust',
      benefits: 'One-time tool and exam fee reimbursement up to INR 12,000.',
      eligibility_status: 'Insufficient Information',
      eligibility_explanation:
        'The supplied source mentions "income-based priority for local district residents" without stating an exact income threshold, and your state/district of residence was not provided.',
      application_readiness: 'Requires Clarification',
      readiness_explanation:
        'Application readiness cannot be confirmed until the exact local residency requirement and income documentation rules are clarified.',
      information_provenance: [
        'Extracted from partial text pasted by the student.',
        'Residency and income cap details are incomplete in the supplied inputs.',
      ],
      source_verification_status:
        'Assessed from partial user-supplied source; unverified externally.',
      available_documents: [
        {
          name: 'Academic Marksheet',
          status: 'reported-available',
          note: 'Student reported as available (not inspected).',
          provenance: 'student-reported',
        },
      ],
      missing_documents: [
        {
          name: 'Domicile / Residence Proof',
          status: 'clarification-needed',
          note: 'Mentioned indirectly by "local district residents"; verify accepted proof with provider.',
          provenance: 'source-derived',
        },
      ],
      application_steps: [
        {
          stepNumber: 1,
          title: 'Retrieve the full official notification',
          description:
            'Look for the complete PDF circular specifying exact district boundaries and income limits.',
          provenance: 'general-guidance',
        },
        {
          stepNumber: 2,
          title: 'Re-run analysis with complete source text and residence',
          description:
            'Once you locate the full criteria and add your district/state of residence, run ScholarshipSaathi again.',
          provenance: 'general-guidance',
        },
      ],
      actions_required_before_submission: [
        {
          action: 'Confirm the exact income limit and eligible districts from the trust’s full circular.',
          provenance: 'general-guidance',
        },
      ],
      official_application_link: null,
      deadline: null,
      warnings: [
        'Deadline and official application link were not stated in the supplied text and remain marked unavailable.',
      ],
      clarification_questions: [
        'Which state or district do you permanently reside in?',
        'Does the full scholarship circular specify a maximum annual family income limit?',
        'Are part-time diploma students eligible or only full-time students?',
      ],
      corrections_made: [
        'Quality Controller removed an inferred deadline and set official_application_link and deadline to unavailable because neither appeared in the supplied text.',
      ],
      isSamplePreview: true,
      sampleLabel: 'Test Case C, D & E · Insufficient Info + Missing Deadline/Link',
    },
  },
];
