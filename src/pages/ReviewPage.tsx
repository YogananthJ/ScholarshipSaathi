import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Edit3, ShieldCheck } from 'lucide-react';
import {
  DocumentAvailabilityChoice,
  ExtractedSourceRequirements,
  ProfileStep,
  ScholarshipInputState,
  StudentProfileState,
} from '../types/scholarship';
import { formatScoreForDisplay } from '../utils/validation';

interface ReviewPageProps {
  source: ScholarshipInputState;
  profile: StudentProfileState;
  requirements: ExtractedSourceRequirements;
  onEditSource: () => void;
  onEditProfileStep: (step: ProfileStep) => void;
  onStartAnalysis: () => void;
}

const DOC_LABEL_MAP: Record<DocumentAvailabilityChoice, string> = {
  yes: 'Reported as available (not inspected)',
  no: 'Reported as missing',
  unsure: 'Unsure',
};

export function ReviewPage({
  source,
  profile,
  requirements,
  onEditSource,
  onEditProfileStep,
  onStartAnalysis,
}: ReviewPageProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [confirmError, setConfirmError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      setConfirmError(true);
      return;
    }
    setConfirmError(false);
    onStartAnalysis();
  };

  const customDocsWithLabels = profile.customDocuments.filter((d) =>
    d.label.trim()
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-6">
      <div>
        <p className="text-xs font-semibold text-[#3478C8]">
          Step 3 of 5 · Review &amp; Confirmation
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-[#173B68] sm:text-3xl">
          Confirm your scholarship and profile details
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Review every section before sending your request to the four-agent CrewAI workflow. You can edit any section below.
        </p>
      </div>

      {/* Scholarship Source Summary */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <h2 className="font-display text-lg font-bold text-[#173B68]">
            1. Scholarship Source Information
          </h2>
          <button
            type="button"
            onClick={onEditSource}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3478C8] hover:text-[#173B68]"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500">Scholarship Name</dt>
            <dd className="font-medium text-[#202B3B]">
              {source.scholarshipName.trim() || 'Not specified'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Reference URL (not scraped automatically)</dt>
            <dd className="font-medium text-[#202B3B] break-all">
              {source.documentUrl.trim() || 'Not provided'}
            </dd>
          </div>
        </dl>

        {source.uploadedFile && (
          <div className="text-sm">
            <span className="text-xs text-slate-500">Uploaded File: </span>
            <span className="font-medium text-[#202B3B]">
              {source.uploadedFile.fileName} ({source.uploadedFile.statusMessage})
            </span>
          </div>
        )}

        {source.sourceText.trim() && (
          <div>
            <p className="text-xs text-slate-500">Supplied Text Preview</p>
            <p className="mt-1 max-h-32 overflow-y-auto rounded-lg border border-slate-100 bg-[#F8FAFC] p-3 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
              {source.sourceText.trim()}
            </p>
          </div>
        )}
      </section>

      {/* Basic & Education Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <h2 className="font-display text-lg font-bold text-[#173B68]">
              2. Basic Profile
            </h2>
            <button
              type="button"
              onClick={() => onEditProfileStep(0)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3478C8] hover:text-[#173B68]"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>
          <dl className="space-y-2.5 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Name</dt>
              <dd className="font-medium">{profile.fullName.trim() || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Nationality</dt>
              <dd className="font-medium">{profile.nationality || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Residence</dt>
              <dd className="font-medium">{profile.residence.trim() || 'Not provided'}</dd>
            </div>
            {requirements.hasAgeRequirement && (
              <div>
                <dt className="text-xs text-slate-500">Age</dt>
                <dd className="font-medium tabular-nums">
                  {profile.age || 'Not provided'}
                </dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <h2 className="font-display text-lg font-bold text-[#173B68]">
              3. Education Details
            </h2>
            <button
              type="button"
              onClick={() => onEditProfileStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3478C8] hover:text-[#173B68]"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>
          <dl className="space-y-2.5 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Current Level</dt>
              <dd className="font-medium">{profile.educationLevel || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Current Academic Year</dt>
              <dd className="font-medium">{profile.currentAcademicYear || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Previous Academic Score</dt>
              <dd className="font-medium">{formatScoreForDisplay(profile)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">School / College</dt>
              <dd className="font-medium">{profile.institutionName.trim() || 'Not provided'}</dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Financial & Documents Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <h2 className="font-display text-lg font-bold text-[#173B68]">
              4. Financial Information
            </h2>
            <button
              type="button"
              onClick={() => onEditProfileStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3478C8] hover:text-[#173B68]"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>
          {requirements.hasIncomeRequirement ? (
            <dl className="space-y-2.5 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Annual Family Income</dt>
                <dd className="font-medium tabular-nums">
                  {profile.annualFamilyIncome || 'Not provided'}
                </dd>
              </div>
              {requirements.requiresAdditionalFinancialDetails &&
                profile.additionalFinancialNotes.trim() && (
                  <div>
                    <dt className="text-xs text-slate-500">Additional Notes</dt>
                    <dd className="font-medium">{profile.additionalFinancialNotes}</dd>
                  </div>
                )}
            </dl>
          ) : (
            <p className="text-sm text-slate-600">
              Not collected — no income or financial criteria were detected in the supplied scholarship source.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <h2 className="font-display text-lg font-bold text-[#173B68]">
              5. Reported Document Availability
            </h2>
            <button
              type="button"
              onClick={() => onEditProfileStep(3)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3478C8] hover:text-[#173B68]"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>
          {requirements.requiredDocuments.length === 0 &&
          customDocsWithLabels.length === 0 ? (
            <p className="text-sm text-slate-600">
              No mandatory documents were listed in the supplied scholarship source.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {requirements.requiredDocuments.map((docName) => {
                const status = profile.documentResponses[docName];
                return (
                  <li key={docName} className="flex justify-between gap-3">
                    <span className="text-slate-600">{docName}</span>
                    <span className="font-medium text-right">
                      {status ? DOC_LABEL_MAP[status] : 'Not answered'}
                    </span>
                  </li>
                );
              })}
              {customDocsWithLabels.map((doc) => (
                <li key={doc.id} className="flex justify-between gap-3">
                  <span className="text-slate-600">{doc.label}</span>
                  <span className="font-medium text-right">
                    {doc.status ? DOC_LABEL_MAP[doc.status] : 'Not answered'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Confirmation and Submit */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5"
      >
        <div className="flex items-start gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#20A477]" />
          <p>
            When you click <strong>Start AI Analysis</strong>, only the scholarship source and profile details shown above are sent to the secure backend for CrewAI evaluation.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => {
              setConfirmed(e.target.checked);
              if (e.target.checked) setConfirmError(false);
            }}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#3478C8]"
          />
          <span className="text-sm font-medium text-[#173B68]">
            I confirm that the information I provided is accurate to the best of my knowledge.
          </span>
        </label>

        {confirmError && (
          <p role="alert" className="text-xs font-medium text-[#A1363D]">
            Please check the confirmation box before starting AI analysis.
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => onEditProfileStep(3)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#173B68] hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#3478C8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#173B68]"
          >
            Start AI Analysis
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
