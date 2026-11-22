export type PageId =
  | 'landing'
  | 'scholarship-input'
  | 'student-profile'
  | 'review'
  | 'analysis'
  | 'results'
  | 'roadmap'
  | 'about';

export type ProfileStep = 0 | 1 | 2 | 3;

export type EligibilityStatus =
  | 'Eligible'
  | 'Potentially Eligible'
  | 'Not Eligible'
  | 'Insufficient Information';

export type ApplicationReadiness =
  | 'Ready'
  | 'Incomplete'
  | 'Requires Clarification';

export type UploadedDocumentState = {
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  extractionStatus: 'extracted' | 'error';
  extractedText: string;
  statusMessage: string;
};

export interface ScholarshipInputState {
  scholarshipName: string;
  sourceText: string;
  documentUrl: string;
  uploadedFile: UploadedDocumentState | null;
}

export type DocumentAvailabilityChoice = 'yes' | 'no' | 'unsure';

export type AcademicScoreFormat = 'percentage' | 'cgpa' | 'grade' | '';

export interface ExtractedSourceRequirements {
  requiresNationality: boolean;
  hasAgeRequirement: boolean;
  ageCriterionHint: string | null;
  requiresResidence: boolean;
  requiresEducationLevel: boolean;
  requiresAcademicYear: boolean;
  requiresAcademicScore: boolean;
  scoreThresholdHint: string | null;
  requiresInstitution: boolean;
  hasIncomeRequirement: boolean;
  incomeCriterionHint: string | null;
  requiresAdditionalFinancialDetails: boolean;
  requiredDocuments: string[];
}

export interface CustomDocumentEntry {
  id: string;
  label: string;
  status: DocumentAvailabilityChoice | '';
}

export interface StudentProfileState {
  // Step A: Basic information
  fullName: string;
  age: string;
  nationality: string;
  residence: string;

  // Step B: Education
  educationLevel: string;
  institutionName: string;
  currentAcademicYear: string;
  scoreFormat: AcademicScoreFormat;
  previousAcademicScore: string;

  // Step C: Financial information (shown only when detected from source)
  annualFamilyIncome: string;
  additionalFinancialNotes: string;

  // Step D: Document availability (student-reported, affects readiness only)
  // Keyed by exact required document name; undefined/empty means unselected
  documentResponses: Record<string, DocumentAvailabilityChoice>;
  customDocuments: CustomDocumentEntry[];
}

export interface RoadmapStep {
  stepNumber: number;
  title: string;
  description: string;
  provenance: 'source-derived' | 'general-guidance';
}

export interface DocumentItem {
  name: string;
  status: 'reported-available' | 'missing' | 'clarification-needed';
  note?: string;
  provenance: 'source-derived' | 'student-reported' | 'general-guidance';
}

export interface AnalysisResult {
  scholarship_name: string;
  provider: string;
  benefits: string;
  eligibility_status: EligibilityStatus;
  eligibility_explanation: string;
  application_readiness: ApplicationReadiness;
  readiness_explanation: string;
  information_provenance: string[];
  source_verification_status: string;
  available_documents: DocumentItem[];
  missing_documents: DocumentItem[];
  application_steps: RoadmapStep[];
  actions_required_before_submission: {
    action: string;
    provenance: 'source-derived' | 'general-guidance';
  }[];
  official_application_link: string | null;
  deadline: string | null;
  warnings: string[];
  clarification_questions: string[];
  eligibility_clarification_questions?: string[];
  document_readiness_questions?: string[];
  corrections_made: string[];
  isSamplePreview?: boolean;
  sampleLabel?: string;
}

export interface CrewAIAnalyzeRequest {
  scholarship_source: string;
  student_profile: string;
  metadata?: {
    scholarship_name?: string;
    document_url?: string;
    uploaded_file_name?: string;
    document_responses?: Record<string, DocumentAvailabilityChoice | ''>;
  };
}

export interface AnalyzeApiResponse {
  ok: boolean;
  result?: AnalysisResult;
  raw?: unknown;
  error?: {
    code:
      | 'VALIDATION_ERROR'
      | 'CREWAI_NOT_CONFIGURED'
      | 'CREWAI_TIMEOUT'
      | 'INVALID_JSON'
      | 'UPSTREAM_ERROR';
    message: string;
    retryable: boolean;
  };
}
