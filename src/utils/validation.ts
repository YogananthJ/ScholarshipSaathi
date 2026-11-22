import {
  ExtractedSourceRequirements,
  ScholarshipInputState,
  StudentProfileState,
} from '../types/scholarship';

export const SUPPORTED_READABLE_EXTENSIONS = ['.txt', '.md', '.csv'] as const;
export const UNIMPLEMENTED_DOCUMENT_EXTENSIONS = ['.pdf', '.docx', '.doc'] as const;
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function getFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex === -1) return '';
  return fileName.slice(dotIndex).toLowerCase();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function validateDocumentUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return 'Please enter a web link starting with https:// or http://.';
    }
    return null;
  } catch {
    return 'Please enter a valid scholarship webpage or document URL (e.g., https://example.org/scholarship).';
  }
}

export function validateScholarshipInput(input: ScholarshipInputState): {
  valid: boolean;
  errors: { sourceText?: string; documentUrl?: string; general?: string };
} {
  const errors: { sourceText?: string; documentUrl?: string; general?: string } = {};

  const urlError = validateDocumentUrl(input.documentUrl);
  if (urlError) {
    errors.documentUrl = urlError;
  }

  const pastedLength = input.sourceText.trim().length;
  const hasReadablePastedText = pastedLength >= 30;
  const hasExtractedFileText =
    input.uploadedFile?.extractionStatus === 'extracted' &&
    input.uploadedFile.extractedText.trim().length >= 30;
  const hasUrlOnly =
    input.documentUrl.trim().length > 0 && !urlError && !hasReadablePastedText && !hasExtractedFileText;

  if (hasUrlOnly) {
    errors.general =
      'External websites are not automatically scraped. A URL alone cannot be analysed—please also paste the relevant scholarship information or upload a readable document (.txt, .md, .csv).';
  } else if (!hasReadablePastedText && !hasExtractedFileText) {
    errors.general =
      'Please paste at least 30 characters of scholarship information or upload a readable text document (.txt, .md, .csv).';
  } else if (pastedLength > 0 && pastedLength < 30 && !hasExtractedFileText) {
    errors.sourceText =
      'Please paste more scholarship details (at least 30 characters) so eligibility criteria can be assessed accurately.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateProfileStep(
  step: number,
  profile: StudentProfileState,
  requirements: ExtractedSourceRequirements
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (step === 0) {
    if (requirements.requiresNationality && !profile.nationality.trim()) {
      errors.nationality =
        'The supplied scholarship specifies a nationality or citizenship requirement. Please enter or select your nationality.';
    }
    if (requirements.requiresResidence && !profile.residence.trim()) {
      errors.residence =
        'The supplied source mentions residency or domicile criteria. Please enter your state or country of residence.';
    }
    if (requirements.hasAgeRequirement) {
      const ageNum = Number(profile.age);
      if (!profile.age.trim() || Number.isNaN(ageNum) || ageNum < 10 || ageNum > 99) {
        errors.age = 'Please enter a valid age between 10 and 99.';
      }
    }
  }

  if (step === 1) {
    if (requirements.requiresEducationLevel && !profile.educationLevel.trim()) {
      errors.educationLevel =
        'Please select your current education level as referenced by the scholarship criteria.';
    }
    if (requirements.requiresAcademicYear && !profile.currentAcademicYear.trim()) {
      errors.currentAcademicYear =
        'The supplied source mentions an academic year or semester requirement. Please enter yours.';
    }
    if (requirements.requiresInstitution && !profile.institutionName.trim()) {
      errors.institutionName =
        'The supplied source references institution details. Please enter your school or college name.';
    }
    if (requirements.requiresAcademicScore) {
      if (!profile.scoreFormat) {
        errors.scoreFormat = 'Please select whether your score is a percentage, CGPA/GPA, or grade.';
      }
      const rawScore = profile.previousAcademicScore.trim();
      if (!rawScore) {
        errors.previousAcademicScore =
          'Please enter your previous academic score or grade.';
      } else if (profile.scoreFormat === 'percentage') {
        const numeric = Number(rawScore.replace(/%$/, '').trim());
        if (Number.isNaN(numeric) || numeric < 0 || numeric > 100) {
          errors.previousAcademicScore =
            'Please enter a percentage value between 0 and 100 (for example, 82 or 82%).';
        }
      } else if (profile.scoreFormat === 'cgpa') {
        const numeric = Number(rawScore);
        if (Number.isNaN(numeric) || numeric < 0 || numeric > 10) {
          errors.previousAcademicScore =
            'Please enter a numeric CGPA/GPA (typically on a 4.0 or 10.0 scale).';
        }
      }
    }
  }

  if (step === 2 && requirements.hasIncomeRequirement) {
    if (!profile.annualFamilyIncome.trim()) {
      errors.annualFamilyIncome =
        'The supplied scholarship specifies an income criterion. Please enter your approximate annual family income.';
    }
  }

  if (step === 3) {
    for (const docName of requirements.requiredDocuments) {
      if (!profile.documentResponses[docName]) {
        errors[`doc:${docName}`] = 'Please select Have it, Missing, or Unsure.';
      }
    }
    for (const customDoc of profile.customDocuments) {
      if (customDoc.label.trim() && !customDoc.status) {
        errors[`custom:${customDoc.id}`] = 'Please select Have it, Missing, or Unsure.';
      }
    }
  }

  return errors;
}

export function formatScoreForDisplay(profile: StudentProfileState): string {
  const val = profile.previousAcademicScore.trim();
  if (!val) return 'Not provided';
  if (profile.scoreFormat === 'percentage') {
    return val.endsWith('%') ? `${val} (Percentage)` : `${val}% (Percentage)`;
  }
  if (profile.scoreFormat === 'cgpa') {
    return `${val} CGPA / GPA (reported as CGPA without direct percentage conversion)`;
  }
  if (profile.scoreFormat === 'grade') {
    return `${val} (Grade / Other)`;
  }
  return val;
}

export function buildCrewAIPayloadStrings(
  source: ScholarshipInputState,
  profile: StudentProfileState,
  requirements: ExtractedSourceRequirements
): { scholarship_source: string; student_profile: string } {
  const sourceParts: string[] = [];
  if (source.scholarshipName.trim()) {
    sourceParts.push(`Scholarship Name: ${source.scholarshipName.trim()}`);
  }
  if (source.documentUrl.trim()) {
    sourceParts.push(
      `Supplied Reference URL (not scraped automatically): ${source.documentUrl.trim()}`
    );
  }
  if (source.sourceText.trim()) {
    sourceParts.push(`Supplied Scholarship Text:\n${source.sourceText.trim()}`);
  }
  if (
    source.uploadedFile?.extractionStatus === 'extracted' &&
    source.uploadedFile.extractedText.trim()
  ) {
    sourceParts.push(
      `Uploaded Document (${source.uploadedFile.fileName}):\n${source.uploadedFile.extractedText.trim()}`
    );
  }

  const formatDocStatus = (val: string | undefined) =>
    val === 'yes'
      ? 'Have it (student reports having this document, not inspected)'
      : val === 'no'
        ? 'Missing (student explicitly confirmed they do NOT have this document)'
        : val === 'unsure'
          ? 'Unsure (student is unsure whether they have this document)'
          : 'Not answered';

  const docLines: string[] = [];
  for (const docName of requirements.requiredDocuments) {
    docLines.push(
      `- ${docName}: ${formatDocStatus(profile.documentResponses[docName])}`
    );
  }
  for (const customDoc of profile.customDocuments) {
    if (customDoc.label.trim()) {
      docLines.push(
        `- ${customDoc.label.trim()}: ${formatDocStatus(customDoc.status)}`
      );
    }
  }

  const profileLines = [
    profile.fullName.trim() ? `Name: ${profile.fullName.trim()}` : 'Name: Not provided',
    requirements.hasAgeRequirement
      ? `Age: ${profile.age.trim() || 'Not provided'}`
      : 'Age: Not required by supplied scholarship source',
    profile.nationality.trim()
      ? `Nationality: ${profile.nationality.trim()}`
      : 'Nationality: Not provided',
    profile.residence.trim()
      ? `State/Country of Residence: ${profile.residence.trim()}`
      : 'State/Country of Residence: Not provided',
    profile.educationLevel.trim()
      ? `Current Education Level: ${profile.educationLevel.trim()}`
      : 'Current Education Level: Not provided',
    profile.institutionName.trim()
      ? `School/College: ${profile.institutionName.trim()}`
      : 'School/College: Not provided',
    profile.currentAcademicYear.trim()
      ? `Current Academic Year: ${profile.currentAcademicYear.trim()}`
      : 'Current Academic Year: Not provided',
    `Previous Academic Score: ${formatScoreForDisplay(profile)}`,
    requirements.hasIncomeRequirement
      ? `Annual Family Income: ${profile.annualFamilyIncome.trim() || 'Not provided'}`
      : 'Annual Family Income: Not collected (no income criterion detected in supplied source)',
    requirements.requiresAdditionalFinancialDetails && profile.additionalFinancialNotes.trim()
      ? `Additional Financial Details: ${profile.additionalFinancialNotes.trim()}`
      : null,
    'Reported Document Availability (unverified student self-report):',
    ...(docLines.length > 0
      ? docLines
      : ['- No mandatory documents were explicitly listed in the supplied scholarship source.']),
  ].filter(Boolean);

  return {
    scholarship_source: sourceParts.join('\n\n'),
    student_profile: profileLines.join('\n'),
  };
}
