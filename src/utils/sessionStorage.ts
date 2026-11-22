import {
  AnalysisResult,
  PageId,
  ProfileStep,
  ScholarshipInputState,
  StudentProfileState,
} from '../types/scholarship';

export const SESSION_KEY = 'scholarshipsaathi_session_v2';
const LEGACY_SESSION_KEYS = ['scholarshipsaathi_session_v1'];

export const INITIAL_SOURCE: ScholarshipInputState = {
  scholarshipName: '',
  sourceText: '',
  documentUrl: '',
  uploadedFile: null,
};

export const INITIAL_PROFILE: StudentProfileState = {
  fullName: '',
  age: '',
  nationality: '',
  residence: '',
  educationLevel: '',
  institutionName: '',
  currentAcademicYear: '',
  scoreFormat: '',
  previousAcademicScore: '',
  annualFamilyIncome: '',
  additionalFinancialNotes: '',
  documentResponses: {},
  customDocuments: [],
};

export interface PersistedSessionData {
  version: 2;
  currentPage: PageId;
  profileStep: ProfileStep;
  sourceInput: ScholarshipInputState;
  studentProfile: StudentProfileState;
  analysisResult: AnalysisResult | null;
  roadmapCheckedItems: Record<string, boolean>;
}

const VALID_PAGES: PageId[] = [
  'landing',
  'scholarship-input',
  'student-profile',
  'review',
  'analysis',
  'results',
  'roadmap',
  'about',
];

function isEmptySession(data: PersistedSessionData): boolean {
  const s = data.sourceInput;
  const p = data.studentProfile;
  const hasSource =
    Boolean(s.scholarshipName.trim()) ||
    Boolean(s.sourceText.trim()) ||
    Boolean(s.documentUrl.trim()) ||
    Boolean(s.uploadedFile);
  const hasProfile =
    Boolean(p.fullName.trim()) ||
    Boolean(p.age.trim()) ||
    Boolean(p.nationality.trim()) ||
    Boolean(p.residence.trim()) ||
    Boolean(p.educationLevel.trim()) ||
    Boolean(p.institutionName.trim()) ||
    Boolean(p.currentAcademicYear.trim()) ||
    Boolean(p.scoreFormat) ||
    Boolean(p.previousAcademicScore.trim()) ||
    Boolean(p.annualFamilyIncome.trim()) ||
    Boolean(p.additionalFinancialNotes.trim()) ||
    Object.keys(p.documentResponses).length > 0 ||
    p.customDocuments.length > 0;
  const hasResult = Boolean(data.analysisResult);
  const hasChecklist = Object.keys(data.roadmapCheckedItems).length > 0;
  const isAtStart = data.currentPage === 'landing' && data.profileStep === 0;

  return isAtStart && !hasSource && !hasProfile && !hasResult && !hasChecklist;
}

export function createEmptySession(): PersistedSessionData {
  return {
    version: 2,
    currentPage: 'landing',
    profileStep: 0,
    sourceInput: INITIAL_SOURCE,
    studentProfile: INITIAL_PROFILE,
    analysisResult: null,
    roadmapCheckedItems: {},
  };
}

export function loadSessionData(
  storage: Pick<Storage, 'getItem'> | null = typeof window !== 'undefined'
    ? window.sessionStorage
    : null
): PersistedSessionData {
  const empty = createEmptySession();
  if (!storage) return empty;

  try {
    const raw = storage.getItem(SESSION_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<PersistedSessionData> | null;
    if (!parsed || typeof parsed !== 'object') return empty;

    const sourceInput: ScholarshipInputState = {
      ...INITIAL_SOURCE,
      ...(parsed.sourceInput && typeof parsed.sourceInput === 'object'
        ? parsed.sourceInput
        : {}),
    };

    const rawProfile =
      parsed.studentProfile && typeof parsed.studentProfile === 'object'
        ? parsed.studentProfile
        : undefined;

    const studentProfile: StudentProfileState = {
      ...INITIAL_PROFILE,
      ...(rawProfile ?? {}),
      documentResponses:
        rawProfile?.documentResponses &&
        typeof rawProfile.documentResponses === 'object' &&
        !Array.isArray(rawProfile.documentResponses)
          ? rawProfile.documentResponses
          : {},
      customDocuments: Array.isArray(rawProfile?.customDocuments)
        ? rawProfile.customDocuments
        : [],
    };

    const analysisResult: AnalysisResult | null =
      parsed.analysisResult && typeof parsed.analysisResult === 'object'
        ? (parsed.analysisResult as AnalysisResult)
        : null;

    const rawStep = parsed.profileStep;
    const profileStep: ProfileStep =
      rawStep === 0 || rawStep === 1 || rawStep === 2 || rawStep === 3
        ? rawStep
        : 0;

    let currentPage: PageId =
      typeof parsed.currentPage === 'string' &&
      VALID_PAGES.includes(parsed.currentPage as PageId)
        ? (parsed.currentPage as PageId)
        : 'landing';

    // Never restore into an active loading spinner without an in-flight request
    if (currentPage === 'analysis') {
      currentPage = 'review';
    }
    if (
      (currentPage === 'results' || currentPage === 'roadmap') &&
      !analysisResult
    ) {
      currentPage = sourceInput.sourceText.trim()
        ? 'scholarship-input'
        : 'landing';
    }

    const roadmapCheckedItems =
      parsed.roadmapCheckedItems &&
      typeof parsed.roadmapCheckedItems === 'object' &&
      !Array.isArray(parsed.roadmapCheckedItems)
        ? parsed.roadmapCheckedItems
        : {};

    return {
      version: 2,
      currentPage,
      profileStep,
      sourceInput,
      studentProfile,
      analysisResult,
      roadmapCheckedItems,
    };
  } catch {
    return empty;
  }
}

export function saveSessionData(
  data: PersistedSessionData,
  storage: Pick<Storage, 'setItem' | 'removeItem'> | null =
    typeof window !== 'undefined' ? window.sessionStorage : null
): void {
  if (!storage) return;
  try {
    if (isEmptySession(data)) {
      storage.removeItem(SESSION_KEY);
      return;
    }
    storage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota or restricted-environment errors
  }
}

export function clearSessionData(
  storage: Pick<Storage, 'removeItem'> | null = typeof window !== 'undefined'
    ? window.sessionStorage
    : null
): void {
  if (!storage) return;
  try {
    storage.removeItem(SESSION_KEY);
    for (const key of LEGACY_SESSION_KEYS) {
      storage.removeItem(key);
    }
  } catch {
    // Ignore restricted-environment errors
  }
}
