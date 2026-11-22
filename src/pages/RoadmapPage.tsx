import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckSquare,
  ExternalLink,
  Square,
} from 'lucide-react';
import { SuccessRoadmapIllustration } from '../components/illustrations/SaathiIllustrations';
import { ExpandableSection } from '../components/ui/ExpandableSection';
import { ProvenanceTag } from '../components/ui/ProvenanceTag';
import { AnalysisResult } from '../types/scholarship';

interface RoadmapPageProps {
  result: AnalysisResult;
  onBackToDashboard: () => void;
  checkedItems?: Record<string, boolean>;
  onToggleItem?: (key: string) => void;
}

export function RoadmapPage({
  result,
  onBackToDashboard,
  checkedItems: controlledCheckedItems,
  onToggleItem,
}: RoadmapPageProps) {
  const [localCheckedItems, setLocalCheckedItems] = useState<
    Record<string, boolean>
  >({});
  const checkedItems = controlledCheckedItems ?? localCheckedItems;

  const toggleItem = (key: string) => {
    if (onToggleItem) {
      onToggleItem(key);
      return;
    }
    setLocalCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3478C8] hover:text-[#173B68]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Results Dashboard
          </button>
          <p className="mt-2 text-xs font-semibold text-[#3478C8]">
            Step 5 of 5 · Application Roadmap
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-[#173B68] sm:text-3xl">
            Application Roadmap
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Personal preparation checklist for <strong>{result.scholarship_name}</strong>.
          </p>
        </div>

        <SuccessRoadmapIllustration className="w-44 shrink-0" />
      </div>

      {/* Deadline & Official Link Bar (Sections 5 & 6) */}
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Calendar className="h-4 w-4 text-[#3478C8]" />
              5. Stated Deadline
            </p>
            <ProvenanceTag kind="source-derived" />
          </div>
          <p className="mt-2 text-base font-bold text-[#173B68] tabular-nums">
            {result.deadline ?? 'Not stated in supplied source'}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500">
              6. Official Application Link
            </p>
            <ProvenanceTag kind="source-derived" />
          </div>
          {result.official_application_link ? (
            <a
              href={result.official_application_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3478C8] hover:text-[#173B68] break-all"
            >
              <span>{result.official_application_link}</span>
              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          ) : (
            <p className="mt-2 text-base font-semibold text-[#946314]">
              Not stated in supplied source
            </p>
          )}
        </div>
      </div>

      {/* Sections 1 & 2: Document Checklist */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-[#173B68]">
              1. Documents Reported as Available
            </h2>
            <ProvenanceTag kind="student-reported" />
          </div>
          <p className="text-xs text-slate-500">
            Confirm each file is clear, up-to-date, and matches official format requirements before uploading.
          </p>
          {result.available_documents.length > 0 ? (
            <ul className="space-y-2.5">
              {result.available_documents.map((doc) => {
                const key = `avail-${doc.name}`;
                const checked = Boolean(checkedItems[key]);
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => toggleItem(key)}
                      className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5 text-left hover:border-[#3478C8] transition-colors"
                    >
                      {checked ? (
                        <CheckSquare className="mt-0.5 h-5 w-5 shrink-0 text-[#20A477]" />
                      ) : (
                        <Square className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                      )}
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            checked ? 'line-through text-slate-400' : 'text-[#173B68]'
                          }`}
                        >
                          {doc.name}
                        </p>
                        {doc.note && (
                          <p className="mt-0.5 text-xs text-slate-600">{doc.note}</p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">No documents marked available yet.</p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-[#173B68]">
              2. Missing Mandatory Documents
            </h2>
            <ProvenanceTag kind="source-derived" />
          </div>
          {result.missing_documents.length > 0 ? (
            <ul className="space-y-2.5">
              {result.missing_documents.map((doc) => {
                const key = `missing-${doc.name}`;
                const checked = Boolean(checkedItems[key]);
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => toggleItem(key)}
                      className="flex w-full items-start gap-3 rounded-xl border border-[#D99A34]/35 bg-[#FEF7EA]/50 p-3.5 text-left hover:border-[#D99A34] transition-colors"
                    >
                      {checked ? (
                        <CheckSquare className="mt-0.5 h-5 w-5 shrink-0 text-[#20A477]" />
                      ) : (
                        <Square className="mt-0.5 h-5 w-5 shrink-0 text-[#D99A34]" />
                      )}
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            checked ? 'line-through text-slate-400' : 'text-[#173B68]'
                          }`}
                        >
                          {doc.name}
                        </p>
                        {doc.note && (
                          <p className="mt-0.5 text-xs text-slate-700">{doc.note}</p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">
              No missing mandatory documents flagged.
            </p>
          )}
        </section>
      </div>

      {/* Section 3: Actions required to obtain missing documents */}
      <ExpandableSection
        title="3. Actions Required Before Submission"
        subtitle="Check off items locally as you complete them"
        defaultOpen
      >
        {result.actions_required_before_submission.length > 0 ? (
          <ul className="space-y-3">
            {result.actions_required_before_submission.map((item, idx) => {
              const key = `action-${idx}`;
              const checked = Boolean(checkedItems[key]);
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => toggleItem(key)}
                    className="flex w-full items-start justify-between gap-4 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 text-left hover:border-[#3478C8] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {checked ? (
                        <CheckSquare className="mt-0.5 h-5 w-5 shrink-0 text-[#20A477]" />
                      ) : (
                        <Square className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                      )}
                      <span
                        className={`text-sm ${
                          checked ? 'line-through text-slate-400' : 'text-[#202B3B]'
                        }`}
                      >
                        {item.action}
                      </span>
                    </div>
                    <div className="shrink-0">
                      <ProvenanceTag kind={item.provenance} />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">
            No pre-submission document actions identified.
          </p>
        )}
      </ExpandableSection>

      {/* Section 4: Application Steps */}
      <ExpandableSection
        title="4. Step-by-Step Application Roadmap"
        subtitle="Distinguishes official source instructions from general preparation guidance"
        defaultOpen
      >
        {result.application_steps.length > 0 ? (
          <ol className="space-y-3">
            {result.application_steps.map((step) => {
              const key = `step-${step.stepNumber}`;
              const checked = Boolean(checkedItems[key]);
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => toggleItem(key)}
                    className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-[#3478C8] transition-colors"
                  >
                    {checked ? (
                      <CheckSquare className="mt-0.5 h-5 w-5 shrink-0 text-[#20A477]" />
                    ) : (
                      <Square className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                    )}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p
                          className={`font-display text-sm font-bold ${
                            checked ? 'line-through text-slate-400' : 'text-[#173B68]'
                          }`}
                        >
                          {step.stepNumber}. {step.title}
                        </p>
                        <ProvenanceTag kind={step.provenance} />
                      </div>
                      {step.description && step.description !== step.title && (
                        <p className="text-sm leading-relaxed text-slate-600">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-sm text-slate-600">No application steps returned.</p>
        )}
      </ExpandableSection>

      {/* Section 7: Warnings & Clarification Questions */}
      {(() => {
        const eligibilityClarifications =
          result.eligibility_clarification_questions ??
          result.clarification_questions;
        const documentReadinessClarifications =
          result.document_readiness_questions ?? [];
        const hasClarifications =
          eligibilityClarifications.length > 0 ||
          documentReadinessClarifications.length > 0;

        if (result.warnings.length === 0 && !hasClarifications) {
          return null;
        }

        return (
          <ExpandableSection
            title="7. Warnings & Clarification Questions"
            subtitle="Items to verify directly with the scholarship provider"
            defaultOpen
          >
            <div className="space-y-4">
              {result.warnings.length > 0 && (
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-[#946314]">
                    <AlertTriangle className="h-4 w-4 text-[#D99A34]" />
                    Warnings
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {result.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {eligibilityClarifications.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#173B68]">
                    Eligibility Clarifications
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {eligibilityClarifications.map((q, i) => (
                      <li key={`elig-${i}`}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {documentReadinessClarifications.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#173B68]">
                    Document Availability Clarifications
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {documentReadinessClarifications.map((q, i) => (
                      <li key={`doc-${i}`}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ExpandableSection>
        );
      })()}
    </div>
  );
}
