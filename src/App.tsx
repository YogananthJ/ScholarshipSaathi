import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { StepIndicator } from './components/layout/StepIndicator';
import { SAMPLE_SCENARIOS } from './data/mockScenarios';
import { AboutPage } from './pages/AboutPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { LandingPage } from './pages/LandingPage';
import { ResultsDashboardPage } from './pages/ResultsDashboardPage';
import { ReviewPage } from './pages/ReviewPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ScholarshipInputPage } from './pages/ScholarshipInputPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { submitScholarshipAnalysis } from './services/apiClient';
import {
  AnalysisResult,
  AnalyzeApiResponse,
  PageId,
  ProfileStep,
  ScholarshipInputState,
  StudentProfileState,
} from './types/scholarship';
import { analyzeSuppliedSourceRequirements } from './utils/sourceRequirements';
import { buildCrewAIPayloadStrings } from './utils/validation';

const SESSION_KEY = 'scholarshipsaathi_session_v2';

const INITIAL_SOURCE: ScholarshipInputState = {
  scholarshipName: '',
  sourceText: '',
  documentUrl: '',
  uploadedFile: null,
};

const INITIAL_PROFILE: StudentProfileState = {
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [profileStep, setProfileStep] = useState<ProfileStep>(0);
  const [sourceInput, setSourceInput] = useState<ScholarshipInputState>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.sourceInput) return parsed.sourceInput;
      }
    } catch {
      // Ignore invalid session storage
    }
    return INITIAL_SOURCE;
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfileState>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.studentProfile) {
          return {
            ...INITIAL_PROFILE,
            ...parsed.studentProfile,
            documentResponses: parsed.studentProfile.documentResponses ?? {},
            customDocuments: Array.isArray(parsed.studentProfile.customDocuments)
              ? parsed.studentProfile.customDocuments
              : [],
          };
        }
      }
    } catch {
      // Ignore invalid session storage
    }
    return INITIAL_PROFILE;
  });

  const sourceRequirements = useMemo(
    () => analyzeSuppliedSourceRequirements(sourceInput),
    [sourceInput]
  );

  const [analysisStatus, setAnalysisStatus] = useState<'loading' | 'error'>('loading');
  const [analysisError, setAnalysisError] =
    useState<AnalyzeApiResponse['error'] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ sourceInput, studentProfile })
      );
    } catch {
      // Ignore quota errors
    }
  }, [sourceInput, studentProfile]);

  const navigateTo = (page: PageId) => {
    if (page !== 'analysis' && abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const runAnalysis = async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setAnalysisStatus('loading');
    setAnalysisError(null);
    setCurrentPage('analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const { scholarship_source, student_profile } = buildCrewAIPayloadStrings(
      sourceInput,
      studentProfile,
      sourceRequirements
    );

    const documentResponsesForMetadata: Record<
      string,
      StudentProfileState['documentResponses'][string] | ''
    > = {};
    for (const docName of sourceRequirements.requiredDocuments) {
      documentResponsesForMetadata[docName] =
        studentProfile.documentResponses[docName] ?? '';
    }
    for (const customDoc of studentProfile.customDocuments) {
      if (customDoc.label.trim()) {
        documentResponsesForMetadata[customDoc.label.trim()] =
          customDoc.status ?? '';
      }
    }

    const response = await submitScholarshipAnalysis(
      {
        scholarship_source,
        student_profile,
        metadata: {
          scholarship_name: sourceInput.scholarshipName.trim() || undefined,
          document_url: sourceInput.documentUrl.trim() || undefined,
          uploaded_file_name:
            sourceInput.uploadedFile?.extractionStatus === 'extracted'
              ? sourceInput.uploadedFile.fileName
              : undefined,
          document_responses: documentResponsesForMetadata,
        },
      },
      controller.signal
    );

    if (controller.signal.aborted) return;

    if (response.ok && response.result) {
      setAnalysisResult(response.result);
      navigateTo('results');
    } else {
      setAnalysisStatus('error');
      setAnalysisError(
        response.error ?? {
          code: 'UPSTREAM_ERROR',
          message: 'Unexpected error while waiting for analysis.',
          retryable: true,
        }
      );
    }
  };

  const openSampleScenario = (scenarioId: string = SAMPLE_SCENARIOS[0].id) => {
    const found =
      SAMPLE_SCENARIOS.find((s) => s.id === scenarioId) ?? SAMPLE_SCENARIOS[0];
    setAnalysisResult(found.result);
    navigateTo('results');
  };

  const handleResetSession = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setSourceInput(INITIAL_SOURCE);
    setStudentProfile(INITIAL_PROFILE);
    setProfileStep(0);
    setAnalysisResult(null);
    setAnalysisError(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore
    }
    navigateTo('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#202B3B]">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenSamplePreview={() => openSampleScenario(SAMPLE_SCENARIOS[0].id)}
      />

      <StepIndicator
        currentPage={currentPage}
        hasResult={Boolean(analysisResult)}
        onNavigate={navigateTo}
      />

      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onStartAnalysis={() => navigateTo('scholarship-input')}
            onNavigate={navigateTo}
            onSelectSampleScenario={openSampleScenario}
          />
        )}

        {currentPage === 'scholarship-input' && (
          <ScholarshipInputPage
            value={sourceInput}
            onChange={setSourceInput}
            onContinue={() => {
              setProfileStep(0);
              navigateTo('student-profile');
            }}
          />
        )}

        {currentPage === 'student-profile' && (
          <StudentProfilePage
            profile={studentProfile}
            requirements={sourceRequirements}
            activeStep={profileStep}
            onStepChange={setProfileStep}
            onChange={setStudentProfile}
            onBackToSource={() => navigateTo('scholarship-input')}
            onContinueToReview={() => navigateTo('review')}
          />
        )}

        {currentPage === 'review' && (
          <ReviewPage
            source={sourceInput}
            profile={studentProfile}
            requirements={sourceRequirements}
            onEditSource={() => navigateTo('scholarship-input')}
            onEditProfileStep={(step) => {
              setProfileStep(step);
              navigateTo('student-profile');
            }}
            onStartAnalysis={() => {
              void runAnalysis();
            }}
          />
        )}

        {currentPage === 'analysis' && (
          <AnalysisPage
            status={analysisStatus}
            errorInfo={analysisError}
            onRetry={() => {
              void runAnalysis();
            }}
            onBackToReview={() => navigateTo('review')}
            onOpenSamplePreview={() => openSampleScenario(SAMPLE_SCENARIOS[0].id)}
          />
        )}

        {currentPage === 'results' && analysisResult && (
          <ResultsDashboardPage
            result={analysisResult}
            onOpenRoadmap={() => navigateTo('roadmap')}
            onSelectSampleScenario={openSampleScenario}
            onStartNewCheck={() => navigateTo('scholarship-input')}
          />
        )}

        {currentPage === 'roadmap' && analysisResult && (
          <RoadmapPage
            result={analysisResult}
            onBackToDashboard={() => navigateTo('results')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onStartAnalysis={() => navigateTo('scholarship-input')} />
        )}
      </main>

      <Footer onNavigate={navigateTo} onResetSession={handleResetSession} />
    </div>
  );
}
