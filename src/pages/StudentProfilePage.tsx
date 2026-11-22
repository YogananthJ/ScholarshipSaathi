import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Info, Plus, Trash2 } from 'lucide-react';
import { ProfileIllustration } from '../components/illustrations/SaathiIllustrations';
import {
  AcademicScoreFormat,
  DocumentAvailabilityChoice,
  ExtractedSourceRequirements,
  ProfileStep,
  StudentProfileState,
} from '../types/scholarship';
import { validateProfileStep } from '../utils/validation';

interface StudentProfilePageProps {
  profile: StudentProfileState;
  requirements: ExtractedSourceRequirements;
  activeStep: ProfileStep;
  onStepChange: (step: ProfileStep) => void;
  onChange: (next: StudentProfileState) => void;
  onBackToSource: () => void;
  onContinueToReview: () => void;
}

const STEP_LABELS: { step: ProfileStep; title: string }[] = [
  { step: 0, title: 'Step A: Basic Information' },
  { step: 1, title: 'Step B: Education Details' },
  { step: 2, title: 'Step C: Financial Information' },
  { step: 3, title: 'Step D: Document Availability' },
];

const EDUCATION_LEVELS = [
  'High School / Secondary (Class 10–12)',
  'Diploma / Polytechnic',
  'Undergraduate (Bachelor’s)',
  'Postgraduate (Master’s)',
  'Doctoral / PhD',
  'Vocational / Technical Certificate',
];

const NATIONALITY_SUGGESTIONS = [
  'Indian',
  'Bangladeshi',
  'Nepalese',
  'Sri Lankan',
  'British',
  'American',
  'Canadian',
  'Australian',
  'Nigerian',
  'Kenyan',
];

export function StudentProfilePage({
  profile,
  requirements,
  activeStep,
  onStepChange,
  onChange,
  onBackToSource,
  onContinueToReview,
}: StudentProfilePageProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const stepErrors = validateProfileStep(activeStep, profile, requirements);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (activeStep < 3) {
      onStepChange((activeStep + 1) as ProfileStep);
    } else {
      onContinueToReview();
    }
  };

  const handleBack = () => {
    setErrors({});
    if (activeStep > 0) {
      onStepChange((activeStep - 1) as ProfileStep);
    } else {
      onBackToSource();
    }
  };

  const setDocumentResponse = (docName: string, choice: DocumentAvailabilityChoice) => {
    setErrors((prev) => ({ ...prev, [`doc:${docName}`]: '' }));
    onChange({
      ...profile,
      documentResponses: {
        ...profile.documentResponses,
        [docName]: choice,
      },
    });
  };

  const addCustomDocument = () => {
    onChange({
      ...profile,
      customDocuments: [
        ...profile.customDocuments,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          label: '',
          status: '',
        },
      ],
    });
  };

  const updateCustomDocument = (
    id: string,
    patch: { label?: string; status?: DocumentAvailabilityChoice }
  ) => {
    setErrors((prev) => ({ ...prev, [`custom:${id}`]: '' }));
    onChange({
      ...profile,
      customDocuments: profile.customDocuments.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    });
  };

  const removeCustomDocument = (id: string) => {
    onChange({
      ...profile,
      customDocuments: profile.customDocuments.filter((item) => item.id !== id),
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left guidance column */}
        <div className="lg:col-span-4 space-y-5">
          <div>
            <p className="text-xs font-semibold text-[#3478C8]">
              Step 2 of 5 · Student Profile
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-[#173B68] sm:text-3xl">
              Share relevant details
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Fields and required documents below are adapted automatically from the scholarship source you supplied.
            </p>
          </div>

          <ProfileIllustration className="w-full max-w-xs" />

          {/* Internal Profile Sub-step navigation (A, B, C, D) */}
          <nav aria-label="Profile form sections" className="space-y-1.5">
            {STEP_LABELS.map((item) => {
              const isCurrent = item.step === activeStep;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => {
                    setErrors({});
                    onStepChange(item.step);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-sm transition-colors ${
                    isCurrent
                      ? 'bg-[#EAF2FC] font-semibold text-[#173B68]'
                      : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  <span>{item.title}</span>
                  {item.step < activeStep && (
                    <span className="text-xs font-medium text-[#20A477]">Visited</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right multi-step form */}
        <form
          onSubmit={handleNext}
          noValidate
          className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-display text-xl font-bold text-[#173B68]">
                {STEP_LABELS[activeStep].title}
              </h2>
            </div>

            {/* STEP A: BASIC INFORMATION */}
            {activeStep === 0 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="full-name" className="block text-sm font-semibold text-[#173B68]">
                    Full Name <span className="font-normal text-slate-500">(Optional)</span>
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => onChange({ ...profile, fullName: e.target.value })}
                    placeholder="Enter your name if you want it shown in the summary"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#3478C8] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="nationality" className="block text-sm font-semibold text-[#173B68]">
                    Nationality{' '}
                    {requirements.requiresNationality ? (
                      <span className="text-[#D65A62]">*</span>
                    ) : (
                      <span className="font-normal text-slate-500">(Optional)</span>
                    )}
                  </label>
                  <input
                    id="nationality"
                    type="text"
                    list="nationality-suggestions"
                    value={profile.nationality}
                    onChange={(e) => {
                      setErrors((prev) => ({ ...prev, nationality: '' }));
                      onChange({ ...profile, nationality: e.target.value });
                    }}
                    placeholder="Type or select your nationality"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#3478C8] focus:outline-none"
                  />
                  <datalist id="nationality-suggestions">
                    {NATIONALITY_SUGGESTIONS.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                  {errors.nationality && (
                    <p className="mt-1 text-xs text-[#A1363D]">{errors.nationality}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="residence" className="block text-sm font-semibold text-[#173B68]">
                    State or Country of Residence{' '}
                    {requirements.requiresResidence ? (
                      <span className="text-[#D65A62]">*</span>
                    ) : (
                      <span className="font-normal text-slate-500">(Optional)</span>
                    )}
                  </label>
                  <input
                    id="residence"
                    type="text"
                    value={profile.residence}
                    onChange={(e) => {
                      setErrors((prev) => ({ ...prev, residence: '' }));
                      onChange({ ...profile, residence: e.target.value });
                    }}
                    placeholder="Enter your state or country of residence"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#3478C8] focus:outline-none"
                  />
                  {errors.residence && (
                    <p className="mt-1 text-xs text-[#A1363D]">{errors.residence}</p>
                  )}
                </div>

                {requirements.hasAgeRequirement && (
                  <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-2">
                    <label htmlFor="age" className="block text-sm font-semibold text-[#173B68]">
                      Your Age <span className="text-[#D65A62]">*</span>
                    </label>
                    {requirements.ageCriterionHint && (
                      <p className="text-xs text-slate-600">
                        Source reference: &ldquo;{requirements.ageCriterionHint}&rdquo;
                      </p>
                    )}
                    <input
                      id="age"
                      type="number"
                      min={10}
                      max={99}
                      value={profile.age}
                      onChange={(e) => {
                        setErrors((prev) => ({ ...prev, age: '' }));
                        onChange({ ...profile, age: e.target.value });
                      }}
                      placeholder="Enter age in years"
                      className="w-44 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm tabular-nums focus:border-[#3478C8] focus:outline-none"
                    />
                    {errors.age && (
                      <p className="text-xs text-[#A1363D]">{errors.age}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP B: EDUCATION DETAILS */}
            {activeStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="education-level" className="block text-sm font-semibold text-[#173B68]">
                    Current Education Level{' '}
                    {requirements.requiresEducationLevel ? (
                      <span className="text-[#D65A62]">*</span>
                    ) : (
                      <span className="font-normal text-slate-500">(Optional)</span>
                    )}
                  </label>
                  <select
                    id="education-level"
                    value={profile.educationLevel}
                    onChange={(e) => {
                      setErrors((prev) => ({ ...prev, educationLevel: '' }));
                      onChange({ ...profile, educationLevel: e.target.value });
                    }}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-[#3478C8] focus:outline-none"
                  >
                    <option value="">Select your current level</option>
                    {EDUCATION_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                  {errors.educationLevel && (
                    <p className="mt-1 text-xs text-[#A1363D]">{errors.educationLevel}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="academic-year" className="block text-sm font-semibold text-[#173B68]">
                    Current Academic Year / Semester{' '}
                    {requirements.requiresAcademicYear ? (
                      <span className="text-[#D65A62]">*</span>
                    ) : (
                      <span className="font-normal text-slate-500">(Optional)</span>
                    )}
                  </label>
                  <input
                    id="academic-year"
                    type="text"
                    value={profile.currentAcademicYear}
                    onChange={(e) => {
                      setErrors((prev) => ({ ...prev, currentAcademicYear: '' }));
                      onChange({ ...profile, currentAcademicYear: e.target.value });
                    }}
                    placeholder="e.g., 2nd Year / Semester 4"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#3478C8] focus:outline-none"
                  />
                  {errors.currentAcademicYear && (
                    <p className="mt-1 text-xs text-[#A1363D]">{errors.currentAcademicYear}</p>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-[#173B68]">
                      Previous Academic Marks, Percentage, or CGPA{' '}
                      {requirements.requiresAcademicScore ? (
                        <span className="text-[#D65A62]">*</span>
                      ) : (
                        <span className="font-normal text-slate-500">(Optional)</span>
                      )}
                    </span>
                    {requirements.scoreThresholdHint && (
                      <span className="text-xs text-slate-600">
                        Source reference: &ldquo;{requirements.scoreThresholdHint}&rdquo;
                      </span>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="score-format" className="block text-xs font-medium text-slate-600">
                        Score Format
                      </label>
                      <select
                        id="score-format"
                        value={profile.scoreFormat}
                        onChange={(e) => {
                          setErrors((prev) => ({
                            ...prev,
                            scoreFormat: '',
                            previousAcademicScore: '',
                          }));
                          onChange({
                            ...profile,
                            scoreFormat: e.target.value as AcademicScoreFormat,
                          });
                        }}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#3478C8] focus:outline-none"
                      >
                        <option value="">Select format</option>
                        <option value="percentage">Percentage (%)</option>
                        <option value="cgpa">CGPA / GPA</option>
                        <option value="grade">Letter Grade / Other</option>
                      </select>
                      {errors.scoreFormat && (
                        <p className="mt-1 text-xs text-[#A1363D]">{errors.scoreFormat}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="academic-score" className="block text-xs font-medium text-slate-600">
                        Score Value
                      </label>
                      <input
                        id="academic-score"
                        type="text"
                        value={profile.previousAcademicScore}
                        onChange={(e) => {
                          setErrors((prev) => ({ ...prev, previousAcademicScore: '' }));
                          onChange({ ...profile, previousAcademicScore: e.target.value });
                        }}
                        placeholder={
                          profile.scoreFormat === 'cgpa'
                            ? 'e.g., 8.4'
                            : profile.scoreFormat === 'grade'
                              ? 'e.g., A / First Class'
                              : 'e.g., 82'
                        }
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm tabular-nums focus:border-[#3478C8] focus:outline-none"
                      />
                      {errors.previousAcademicScore && (
                        <p className="mt-1 text-xs text-[#A1363D]">
                          {errors.previousAcademicScore}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600">
                    CGPA/GPA and percentage scores are recorded in their original format and are never converted or directly compared against each other.
                  </p>
                </div>

                <div>
                  <label htmlFor="institution-name" className="block text-sm font-semibold text-[#173B68]">
                    School or College Name{' '}
                    {requirements.requiresInstitution ? (
                      <span className="text-[#D65A62]">*</span>
                    ) : (
                      <span className="font-normal text-slate-500">(Optional)</span>
                    )}
                  </label>
                  <input
                    id="institution-name"
                    type="text"
                    value={profile.institutionName}
                    onChange={(e) => {
                      setErrors((prev) => ({ ...prev, institutionName: '' }));
                      onChange({ ...profile, institutionName: e.target.value });
                    }}
                    placeholder="Enter your school, college, or university name"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#3478C8] focus:outline-none"
                  />
                  {errors.institutionName && (
                    <p className="mt-1 text-xs text-[#A1363D]">{errors.institutionName}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP C: FINANCIAL INFORMATION (SOURCE-DRIVEN ONLY) */}
            {activeStep === 2 && (
              <div className="space-y-5">
                {requirements.hasIncomeRequirement ? (
                  <>
                    <div className="flex items-start gap-2.5 rounded-xl border border-[#3478C8]/25 bg-[#EAF2FC]/60 p-4 text-xs leading-relaxed text-[#173B68]">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#3478C8]" />
                      <div>
                        <p>
                          An income or financial need criterion was detected in the supplied scholarship source.
                        </p>
                        {requirements.incomeCriterionHint && (
                          <p className="mt-1 text-slate-700">
                            Source reference: &ldquo;{requirements.incomeCriterionHint}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="family-income" className="block text-sm font-semibold text-[#173B68]">
                        Annual Family Income <span className="text-[#D65A62]">*</span>
                      </label>
                      <input
                        id="family-income"
                        type="text"
                        value={profile.annualFamilyIncome}
                        onChange={(e) => {
                          setErrors((prev) => ({ ...prev, annualFamilyIncome: '' }));
                          onChange({ ...profile, annualFamilyIncome: e.target.value });
                        }}
                        placeholder="Include currency and amount, e.g., INR 2,10,000 per year"
                        className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#3478C8] focus:outline-none"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Used only during your current session for eligibility comparison.
                      </p>
                      {errors.annualFamilyIncome && (
                        <p className="mt-1 text-xs text-[#A1363D]">
                          {errors.annualFamilyIncome}
                        </p>
                      )}
                    </div>

                    {requirements.requiresAdditionalFinancialDetails && (
                      <div>
                        <label htmlFor="financial-notes" className="block text-sm font-semibold text-[#173B68]">
                          Additional Financial Details{' '}
                          <span className="font-normal text-slate-500">(Referenced by source)</span>
                        </label>
                        <textarea
                          id="financial-notes"
                          rows={3}
                          value={profile.additionalFinancialNotes}
                          onChange={(e) =>
                            onChange({
                              ...profile,
                              additionalFinancialNotes: e.target.value,
                            })
                          }
                          placeholder="Provide only the extra financial details requested by the scholarship source"
                          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#3478C8] focus:outline-none"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 space-y-2">
                    <p className="text-sm font-semibold text-[#173B68]">
                      No income or financial criteria detected
                    </p>
                    <p className="text-sm leading-relaxed text-slate-600">
                      The supplied scholarship source does not state a family income limit or financial need criterion. To avoid collecting unnecessary personal financial data, income fields are hidden for this scholarship.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP D: DOCUMENT AVAILABILITY (DYNAMIC FROM SOURCE, UNSELECTED BY DEFAULT) */}
            {activeStep === 3 && (
              <div className="space-y-5">
                <div className="flex items-start gap-2.5 rounded-xl border border-[#3478C8]/25 bg-[#EAF2FC]/60 p-4 text-xs leading-relaxed text-[#173B68]">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#3478C8]" />
                  <p>
                    Document availability assesses <strong>application readiness</strong>, not eligibility. Marking <em>Have it</em> records your self-report only; ScholarshipSaathi does not inspect or verify document contents.
                  </p>
                </div>

                {requirements.requiredDocuments.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-slate-600">
                      Required documents detected from your supplied scholarship source:
                    </p>
                    {requirements.requiredDocuments.map((docName) => {
                      const selected = profile.documentResponses[docName];
                      const errorMsg = errors[`doc:${docName}`];
                      return (
                        <div
                          key={docName}
                          className="rounded-xl border border-slate-200 p-4 space-y-2"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-sm font-medium text-[#173B68]">
                              {docName} <span className="text-[#D65A62]">*</span>
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {(
                                [
                                  { val: 'yes', text: 'Have it' },
                                  { val: 'no', text: 'Missing' },
                                  { val: 'unsure', text: 'Unsure' },
                                ] as const
                              ).map((opt) => {
                                const active = selected === opt.val;
                                return (
                                  <button
                                    key={opt.val}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => setDocumentResponse(docName, opt.val)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                                      active
                                        ? opt.val === 'yes'
                                          ? 'bg-[#20A477] text-white'
                                          : opt.val === 'no'
                                            ? 'bg-[#D99A34] text-white'
                                            : 'bg-[#3478C8] text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {opt.text}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          {errorMsg && (
                            <p className="text-xs text-[#A1363D]">{errorMsg}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 text-sm text-slate-600">
                    No mandatory documents were explicitly listed in the supplied scholarship source. You can continue directly, or add a document below if the notice mentions one separately.
                  </div>
                )}

                {/* Optional user-added documents from source */}
                <div className="space-y-3 pt-1">
                  {profile.customDocuments.map((customDoc) => (
                    <div
                      key={customDoc.id}
                      className="rounded-xl border border-slate-200 p-4 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customDoc.label}
                          onChange={(e) =>
                            updateCustomDocument(customDoc.id, { label: e.target.value })
                          }
                          placeholder="Enter another document mentioned in the scholarship source"
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#3478C8] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomDocument(customDoc.id)}
                          aria-label="Remove document"
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-[#D65A62]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {customDoc.label.trim() && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-slate-600">Availability:</span>
                          {(
                            [
                              { val: 'yes', text: 'Have it' },
                              { val: 'no', text: 'Missing' },
                              { val: 'unsure', text: 'Unsure' },
                            ] as const
                          ).map((opt) => {
                            const active = customDoc.status === opt.val;
                            return (
                              <button
                                key={opt.val}
                                type="button"
                                aria-pressed={active}
                                onClick={() =>
                                  updateCustomDocument(customDoc.id, { status: opt.val })
                                }
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                  active
                                    ? opt.val === 'yes'
                                      ? 'bg-[#20A477] text-white'
                                      : opt.val === 'no'
                                        ? 'bg-[#D99A34] text-white'
                                        : 'bg-[#3478C8] text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {opt.text}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {errors[`custom:${customDoc.id}`] && (
                        <p className="text-xs text-[#A1363D]">
                          {errors[`custom:${customDoc.id}`]}
                        </p>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addCustomDocument}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3478C8] hover:text-[#173B68]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add another document mentioned in the source
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form footer controls */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#173B68] hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3478C8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#173B68]"
            >
              {activeStep < 3 ? 'Continue' : 'Review Information'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
