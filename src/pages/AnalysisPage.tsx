import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { FOUR_AGENTS } from '../data/workflowContent';
import { AnalyzeApiResponse } from '../types/scholarship';

interface AnalysisPageProps {
  status: 'loading' | 'error';
  errorInfo: AnalyzeApiResponse['error'] | null;
  onRetry: () => void;
  onBackToReview: () => void;
  onOpenSamplePreview: () => void;
}

export function AnalysisPage({
  status,
  errorInfo,
  onRetry,
  onBackToReview,
  onOpenSamplePreview,
}: AnalysisPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 space-y-8">
        {status === 'loading' ? (
          <>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FC] text-[#3478C8]">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#3478C8]">
                  Step 4 of 5 · AI Analysis
                </p>
                <h1 className="mt-1 font-display text-2xl font-bold text-[#173B68]">
                  Analysing scholarship criteria and your profile
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  The backend has submitted your request to the four-agent workflow and is waiting for the final structured response. Live step-by-step progress is not simulated because the workflow returns one complete verified result.
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-6">
              <p className="text-xs font-semibold text-slate-500">
                Workflow stages executing on server:
              </p>
              <ol className="space-y-3">
                {FOUR_AGENTS.map((agent) => (
                  <li
                    key={agent.stepNumber}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4"
                  >
                    <span className="font-mono text-xs font-semibold text-[#3478C8]">
                      {agent.stepNumber}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#173B68]">
                        {agent.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {agent.responsibility}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FDF1F2] text-[#D65A62]">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#A1363D]">
                  Analysis Could Not Be Completed
                </p>
                <h1 className="mt-1 font-display text-2xl font-bold text-[#173B68]">
                  {errorInfo?.code === 'CREWAI_NOT_CONFIGURED'
                    ? 'CrewAI deployment endpoint not connected yet'
                    : errorInfo?.code === 'CREWAI_TIMEOUT'
                      ? 'Analysis request timed out'
                      : errorInfo?.code === 'INVALID_JSON'
                        ? 'Invalid response from analysis service'
                        : 'Processing error'}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {errorInfo?.message ??
                    'The analysis request failed. ScholarshipSaathi never fabricates eligibility results when the backend fails.'}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 text-xs leading-relaxed text-slate-600">
              Your scholarship source and student profile remain safely preserved in this browser session. You can return to review your inputs, retry the connection, or inspect the fictional test scenarios to preview the Results Dashboard and Application Roadmap.
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onBackToReview}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#173B68] hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Review
              </button>

              {errorInfo?.retryable && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#3478C8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#173B68]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Analysis
                </button>
              )}

              <button
                type="button"
                onClick={onOpenSamplePreview}
                className="inline-flex items-center gap-2 rounded-lg bg-[#173B68] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3478C8]"
              >
                <Eye className="h-4 w-4" />
                View Fictional Test Scenarios
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
