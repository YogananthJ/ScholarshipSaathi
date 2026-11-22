import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileWarning,
  HelpCircle,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { ExpandableSection } from '../components/ui/ExpandableSection';
import { ProvenanceTag } from '../components/ui/ProvenanceTag';
import { EligibilityBadge, ReadinessBadge } from '../components/ui/StatusBadge';
import { SAMPLE_SCENARIOS } from '../data/mockScenarios';
import { AnalysisResult } from '../types/scholarship';

interface ResultsDashboardPageProps {
  result: AnalysisResult;
  onOpenRoadmap: () => void;
  onSelectSampleScenario: (scenarioId: string) => void;
  onStartNewCheck: () => void;
}

export function ResultsDashboardPage({
  result,
  onOpenRoadmap,
  onSelectSampleScenario,
  onStartNewCheck,
}: ResultsDashboardPageProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-8">
      {/* Sample Preview Notice & Switcher (only shown when viewing fictional test cases) */}
      {result.isSamplePreview && (
        <div className="rounded-xl border border-[#3478C8]/30 bg-[#EAF2FC] p-4 sm:p-5 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#173B68]" />
              <div className="text-xs sm:text-sm text-[#173B68]">
                <strong>Fictional Sample Preview ({result.sampleLabel})</strong> — Displayed for UI inspection. Not produced by a live CrewAI run.
              </div>
            </div>
            <button
              type="button"
              onClick={onStartNewCheck}
              className="w-fit text-xs font-semibold text-[#3478C8] underline hover:text-[#173B68]"
            >
              Start your own scholarship check
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SCENARIOS.map((s) => {
              const active = result.scholarship_name === s.result.scholarship_name;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectSampleScenario(s.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#173B68] text-white'
                      : 'bg-white text-[#173B68] border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s.caseCode}: {s.result.eligibility_status} / {s.result.application_readiness}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Scholarship Overview */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#3478C8]">
              Step 5 of 5 · Results Dashboard
            </p>
            <h1 className="font-display text-2xl font-bold text-[#173B68] sm:text-3xl">
              {result.scholarship_name}
            </h1>
            <p className="text-sm text-slate-600">
              Provider: <span className="font-medium text-[#202B3B]">{result.provider}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {!result.isSamplePreview && (
              <button
                type="button"
                onClick={onStartNewCheck}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#173B68] transition-colors hover:bg-slate-50"
              >
                Start Another Analysis
              </button>
            )}
            <button
              type="button"
              onClick={onOpenRoadmap}
              className="inline-flex items-center gap-2 rounded-lg bg-[#3478C8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#173B68]"
            >
              View Application Roadmap
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">Benefits</p>
            <p className="text-sm leading-relaxed text-[#202B3B]">{result.benefits}</p>
          </div>

          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              Deadline
            </p>
            {result.deadline ? (
              <p className="text-sm font-semibold text-[#173B68] tabular-nums">
                {result.deadline}
              </p>
            ) : (
              <p className="text-sm font-medium text-[#946314]">
                Not stated in supplied source
              </p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">Official Application Link</p>
            {result.official_application_link ? (
              <a
                href={result.official_application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3478C8] hover:text-[#173B68] break-all"
              >
                <span>Open supplied portal link</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
            ) : (
              <p className="text-sm font-medium text-[#946314]">
                Not stated in supplied source
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] px-4 py-3 text-xs text-slate-600 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#3478C8]" />
          <span>
            <strong>Source Verification:</strong> {result.source_verification_status}
          </span>
        </div>
      </section>

      {/* Primary Decision Split: Eligibility vs Application Readiness */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold text-[#173B68]">
              Eligibility Assessment
            </h2>
            <ProvenanceTag kind="source-derived" />
          </div>
          <div>
            <EligibilityBadge status={result.eligibility_status} />
          </div>
          <p className="text-sm leading-relaxed text-slate-700">
            {result.eligibility_explanation}
          </p>
          <p className="border-t border-slate-100 pt-3 text-xs text-slate-500">
            Based solely on stated scholarship eligibility criteria. Missing documents do not alter eligibility.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold text-[#173B68]">
              Application Readiness
            </h2>
            <ProvenanceTag kind="student-reported" />
          </div>
          <div>
            <ReadinessBadge status={result.application_readiness} />
          </div>
          <p className="text-sm leading-relaxed text-slate-700">
            {result.readiness_explanation}
          </p>
          <p className="border-t border-slate-100 pt-3 text-xs text-slate-500">
            Reflects whether you reported holding required documents. Document files have not been inspected.
          </p>
        </div>
      </section>

      {/* Available vs Missing Documents */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#173B68]">
            Documents Reported as Available
          </h2>
          {result.available_documents.length > 0 ? (
            <ul className="space-y-3">
              {result.available_documents.map((doc) => (
                <li
                  key={doc.name}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#20A477]" />
                  <div>
                    <p className="text-sm font-semibold text-[#173B68]">{doc.name}</p>
                    {doc.note && (
                      <p className="mt-0.5 text-xs text-slate-600">{doc.note}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">
              No supporting documents were reported as available yet.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#173B68]">
            Missing or Unconfirmed Documents
          </h2>
          {result.missing_documents.length > 0 ? (
            <ul className="space-y-3">
              {result.missing_documents.map((doc) => (
                <li
                  key={doc.name}
                  className="flex items-start gap-3 rounded-xl border border-[#D99A34]/30 bg-[#FEF7EA]/50 p-3.5"
                >
                  <FileWarning className="mt-0.5 h-4 w-4 shrink-0 text-[#D99A34]" />
                  <div>
                    <p className="text-sm font-semibold text-[#173B68]">{doc.name}</p>
                    {doc.note && (
                      <p className="mt-0.5 text-xs text-slate-700">{doc.note}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">
              No missing mandatory documents were identified from the supplied source.
            </p>
          )}
        </div>
      </section>

      {/* Warnings, Clarification Questions, Provenance & QC Corrections */}
      <section className="space-y-4">
        {result.warnings.length > 0 && (
          <div className="rounded-2xl border border-[#D99A34]/35 bg-[#FEF7EA]/60 p-6 space-y-3">
            <div className="flex items-center gap-2 font-display text-base font-bold text-[#946314]">
              <AlertTriangle className="h-5 w-5 text-[#D99A34]" />
              <h2>Important Warnings</h2>
            </div>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-[#202B3B]">
              {result.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {(() => {
          const eligibilityClarifications =
            result.eligibility_clarification_questions ??
            result.clarification_questions;
          const documentReadinessClarifications =
            result.document_readiness_questions ?? [];
          if (
            eligibilityClarifications.length === 0 &&
            documentReadinessClarifications.length === 0
          ) {
            return null;
          }
          return (
            <div className="rounded-2xl border border-[#3478C8]/25 bg-[#EAF2FC]/50 p-6 space-y-4">
              <div className="flex items-center gap-2 font-display text-base font-bold text-[#173B68]">
                <HelpCircle className="h-5 w-5 text-[#3478C8]" />
                <h2>Clarification Questions</h2>
              </div>

              {eligibilityClarifications.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-[#173B68]">
                    Eligibility Clarifications
                  </p>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-[#202B3B]">
                    {eligibilityClarifications.map((q, i) => (
                      <li key={`elig-${i}`}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {documentReadinessClarifications.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-[#173B68]">
                    Document Availability (Unsure / Unanswered)
                  </p>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-[#202B3B]">
                    {documentReadinessClarifications.map((q, i) => (
                      <li key={`doc-${i}`}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })()}

        <div className="grid gap-4 md:grid-cols-2">
          <ExpandableSection
            title="Source & Information Provenance"
            subtitle="Where each finding came from"
            defaultOpen
          >
            {result.information_provenance.length > 0 ? (
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                {result.information_provenance.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">
                Derived strictly from the user-supplied scholarship information and student profile.
              </p>
            )}
          </ExpandableSection>

          <ExpandableSection
            title="Quality Controller Corrections"
            subtitle="Audits applied by Agent 4 before displaying results"
            defaultOpen={result.corrections_made.length > 0}
          >
            {result.corrections_made.length > 0 ? (
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                {result.corrections_made.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">
                No post-draft corrections were required by the Quality Controller.
              </p>
            )}
          </ExpandableSection>
        </div>
      </section>
    </div>
  );
}
