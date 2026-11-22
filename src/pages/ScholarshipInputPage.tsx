import React, { useState } from 'react';
import { AlertCircle, ArrowRight, FileText, Info, Link2 } from 'lucide-react';
import { SourceInputIllustration } from '../components/illustrations/SaathiIllustrations';
import { FileDropzone } from '../components/ui/FileDropzone';
import { ScholarshipInputState } from '../types/scholarship';
import { validateScholarshipInput } from '../utils/validation';

interface ScholarshipInputPageProps {
  value: ScholarshipInputState;
  onChange: (next: ScholarshipInputState) => void;
  onContinue: () => void;
}

const SAMPLE_NOTICE_TEXT = `Future Learners Support Scholarship
Offered by: Future Learners Education Foundation
Benefits: Annual tuition support of INR 45,000 for selected students.
Eligibility Criteria:
1. Applicant must be an Indian citizen enrolled in an accredited undergraduate degree programme.
2. Minimum 75% marks in the previous academic examination.
3. Annual family income must not exceed INR 2,50,000.
Required Documents:
- Previous academic marksheet
- Income certificate
- Proof of identity
- Current educational institution ID
Deadline: November 30, 2026
Official Application Portal: https://scholarships.example.edu/future-learners`;

export function ScholarshipInputPage({
  value,
  onChange,
  onContinue,
}: ScholarshipInputPageProps) {
  const [errors, setErrors] = useState<{
    sourceText?: string;
    documentUrl?: string;
    general?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateScholarshipInput(value);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onContinue();
  };

  const handleFillSample = () => {
    setErrors({});
    onChange({
      ...value,
      scholarshipName: 'Future Learners Support Scholarship',
      sourceText: SAMPLE_NOTICE_TEXT,
      documentUrl: 'https://scholarships.example.edu/future-learners',
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-5">
          <div>
            <p className="text-xs font-semibold text-[#3478C8]">
              Step 1 of 5 · Scholarship Source
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-[#173B68] sm:text-3xl">
              Provide the scholarship details
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              ScholarshipSaathi treats the readable text and supported text files you supply here as its sole source of evidence.
            </p>
          </div>

          <SourceInputIllustration className="w-full max-w-xs" />

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#173B68]">
              <Info className="h-4 w-4 text-[#3478C8]" />
              <span>Evidence honesty guarantee</span>
            </div>
            <p>
              If a deadline, income limit, or official application link is missing from what you provide, the system will mark it unavailable rather than guessing.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#EAF2FC]/60 p-4 text-xs space-y-2">
            <p className="font-semibold text-[#173B68]">Testing the flow?</p>
            <p className="text-slate-600">
              You can populate this form with a fictional scholarship notice to try out the journey.
            </p>
            <button
              type="button"
              onClick={handleFillSample}
              className="font-semibold text-[#3478C8] hover:text-[#173B68]"
            >
              Fill fictional sample scholarship notice →
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6"
        >
          {errors.general && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-[#D65A62]/40 bg-[#FDF1F2] p-3.5 text-sm text-[#A1363D]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#D65A62]" />
              <p>{errors.general}</p>
            </div>
          )}

          {/* Optional Scholarship Name */}
          <div>
            <label
              htmlFor="scholarship-name"
              className="block text-sm font-semibold text-[#173B68]"
            >
              Scholarship Name{' '}
              <span className="font-normal text-slate-500">(Optional)</span>
            </label>
            <input
              id="scholarship-name"
              type="text"
              value={value.scholarshipName}
              onChange={(e) =>
                onChange({ ...value, scholarshipName: e.target.value })
              }
              placeholder="e.g., National Merit-cum-Means Scholarship 2026"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#202B3B] placeholder:text-slate-400 focus:border-[#3478C8] focus:outline-none"
            />
          </div>

          {/* Paste Scholarship Information */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="scholarship-source-text"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#173B68]"
              >
                <FileText className="h-4 w-4 text-[#3478C8]" />
                Paste Scholarship Information
              </label>
              <span className="text-xs text-slate-500 tabular-nums">
                {value.sourceText.trim().length.toLocaleString()} chars
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Copy and paste the eligibility rules, benefits, required documents, deadline, and application link from the official announcement.
            </p>
            <textarea
              id="scholarship-source-text"
              rows={8}
              value={value.sourceText}
              onChange={(e) => {
                setErrors((prev) => ({ ...prev, sourceText: undefined, general: undefined }));
                onChange({ ...value, sourceText: e.target.value });
              }}
              placeholder="Paste the full eligibility criteria, required documents, deadline, and official portal details here..."
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm leading-relaxed text-[#202B3B] placeholder:text-slate-400 focus:border-[#3478C8] focus:outline-none"
            />
            {errors.sourceText && (
              <p className="mt-1.5 text-xs text-[#A1363D]">{errors.sourceText}</p>
            )}
          </div>

          {/* Document URL */}
          <div>
            <label
              htmlFor="scholarship-url"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#173B68]"
            >
              <Link2 className="h-4 w-4 text-[#3478C8]" />
              Scholarship Webpage or Document URL{' '}
              <span className="font-normal text-slate-500">(Optional)</span>
            </label>
            <input
              id="scholarship-url"
              type="url"
              value={value.documentUrl}
              onChange={(e) => {
                setErrors((prev) => ({ ...prev, documentUrl: undefined, general: undefined }));
                onChange({ ...value, documentUrl: e.target.value });
              }}
              placeholder="https://official-provider.org/scholarship-guidelines"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#202B3B] placeholder:text-slate-400 focus:border-[#3478C8] focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              Provided as a reference link. ScholarshipSaathi does not scrape external websites automatically, so pasting key criteria above ensures accurate results.
            </p>
            {errors.documentUrl && (
              <p className="mt-1.5 text-xs text-[#A1363D]">{errors.documentUrl}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <p className="mb-1.5 text-sm font-semibold text-[#173B68]">
              Upload a Scholarship Document{' '}
              <span className="font-normal text-slate-500">(Optional)</span>
            </p>
            <FileDropzone
              uploadedFile={value.uploadedFile}
              onFileChange={(file) => {
                setErrors((prev) => ({ ...prev, general: undefined }));
                onChange({ ...value, uploadedFile: file });
              }}
            />
          </div>

          <div className="flex items-center justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3478C8] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#173B68]"
            >
              Continue to Student Profile
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
