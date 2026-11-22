import {
  AnalysisResult,
  ApplicationReadiness,
  DocumentItem,
  EligibilityStatus,
  RoadmapStep,
} from '../types/scholarship';

function tryParseJsonString(text: string): unknown | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // 1. Direct JSON parse
  try {
    return JSON.parse(trimmed);
  } catch {
    // Continue to fence/substring extraction
  }

  // 2. Markdown code fence extraction (```json ... ``` or ``` ... ```)
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch?.[1]) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // Continue to balanced-brace extraction
    }
  }

  // 3. Extract outermost JSON object {...} from surrounding prose
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = trimmed.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // Ignore parse failure
    }
  }

  return null;
}

/**
 * Unwraps nested CrewAI deployment envelopes (result, raw, json_dict, pydantic,
 * tasks_output, last_executed_task, output) and parses JSON strings safely.
 */
export function extractStructuredCrewPayload(
  rawPayload: unknown,
  depth = 0
): Record<string, unknown> {
  if (depth > 6) {
    throw new Error('CrewAI response nesting exceeded maximum inspection depth.');
  }

  if (typeof rawPayload === 'string') {
    const parsed = tryParseJsonString(rawPayload);
    if (!parsed) {
      throw new Error(
        'CrewAI returned a text output instead of structured JSON. Ensure the final task outputs valid JSON.'
      );
    }
    return extractStructuredCrewPayload(parsed, depth + 1);
  }

  if (!rawPayload || typeof rawPayload !== 'object' || Array.isArray(rawPayload)) {
    throw new Error('CrewAI returned an unexpected non-object response.');
  }

  const obj = rawPayload as Record<string, unknown>;

  if (
    'eligibility_status' in obj ||
    'application_readiness' in obj ||
    'eligibility' in obj ||
    'readiness' in obj
  ) {
    return obj;
  }

  const candidateKeys = [
    'json_dict',
    'pydantic',
    'result',
    'output',
    'final_output',
    'raw',
    'data',
  ];

  for (const key of candidateKeys) {
    const val = obj[key];
    if (val !== undefined && val !== null && val !== '') {
      try {
        return extractStructuredCrewPayload(val, depth + 1);
      } catch {
        // Try next candidate
      }
    }
  }

  if (obj.last_executed_task && typeof obj.last_executed_task === 'object') {
    try {
      return extractStructuredCrewPayload(obj.last_executed_task, depth + 1);
    } catch {
      // Continue to tasks_output
    }
  }

  if (Array.isArray(obj.tasks_output) && obj.tasks_output.length > 0) {
    for (let i = obj.tasks_output.length - 1; i >= 0; i--) {
      const taskOut = obj.tasks_output[i];
      if (taskOut !== undefined && taskOut !== null) {
        try {
          return extractStructuredCrewPayload(taskOut, depth + 1);
        } catch {
          // Try earlier task output if final task wrapper differs
        }
      }
    }
  }

  throw new Error(
    'CrewAI response did not contain eligibility_status or application_readiness fields in its final output.'
  );
}

function normalizeEligibility(raw: unknown): EligibilityStatus {
  const value = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  if (value === 'eligible') return 'Eligible';
  if (value === 'potentially eligible' || value === 'potentially_eligible') {
    return 'Potentially Eligible';
  }
  if (
    value === 'not eligible' ||
    value === 'not_eligible' ||
    value === 'ineligible'
  ) {
    return 'Not Eligible';
  }
  return 'Insufficient Information';
}

function normalizeReadiness(raw: unknown): ApplicationReadiness {
  const value = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  if (value === 'ready') return 'Ready';
  if (
    value === 'incomplete' ||
    value === 'not ready' ||
    value === 'not_ready'
  ) {
    return 'Incomplete';
  }
  return 'Requires Clarification';
}

function mapProvenanceBasis(
  basis: unknown,
  fallback: 'source-derived' | 'general-guidance'
): 'source-derived' | 'general-guidance' {
  if (basis === 'source-derived' || basis === 'general-guidance') return basis;
  if (typeof basis === 'string') {
    const lower = basis.toLowerCase();
    if (lower.includes('general guidance') || lower.includes('recommendation')) {
      return 'general-guidance';
    }
    if (lower.includes('provided scholarship') || lower.includes('source')) {
      return 'source-derived';
    }
  }
  return fallback;
}

function toStringArray(raw: unknown): string[] {
  if (!raw) return [];
  if (typeof raw === 'string') {
    return raw.trim() ? [raw.trim()] : [];
  }
  if (!Array.isArray(raw)) {
    if (typeof raw === 'object') {
      return Object.entries(raw as Record<string, unknown>)
        .map(([key, val]) => {
          if (typeof val === 'string' && val.trim()) {
            return `${key}: ${val.trim()}`;
          }
          if (val && typeof val === 'object') {
            const rec = val as Record<string, unknown>;
            const label = typeof rec.label === 'string' ? rec.label.trim() : '';
            const note = typeof rec.note === 'string' ? rec.note.trim() : '';
            if (label && note) return `${key}: ${label} — ${note}`;
            if (label || note) return `${key}: ${label || note}`;
          }
          return '';
        })
        .filter(Boolean);
    }
    return [];
  }
  return raw
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object') {
        const rec = item as Record<string, unknown>;
        if (
          typeof rec.item === 'string' &&
          (typeof rec.previous_value_or_label === 'string' ||
            typeof rec.corrected_value_or_label === 'string')
        ) {
          const prev =
            typeof rec.previous_value_or_label === 'string'
              ? rec.previous_value_or_label.trim()
              : '';
          const next =
            typeof rec.corrected_value_or_label === 'string'
              ? rec.corrected_value_or_label.trim()
              : '';
          return `${rec.item}: ${prev ? `"${prev}" → ` : ''}${next}`;
        }
        const text =
          rec.text ?? rec.message ?? rec.description ?? rec.correction ?? rec.question;
        return typeof text === 'string' ? text.trim() : '';
      }
      return '';
    })
    .filter(Boolean);
}

function normalizeNullableText(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (
    ['unknown', 'none', 'n/a', 'null'].includes(lower) ||
    lower.startsWith('not stated') ||
    lower.startsWith('unavailable') ||
    lower.startsWith('none stated') ||
    lower.startsWith('not specified') ||
    lower.startsWith('not provided') ||
    lower.startsWith('not mentioned') ||
    lower.startsWith('no deadline')
  ) {
    return null;
  }
  return trimmed;
}

function normalizeSafeHttpUrl(raw: unknown): string | null {
  let candidate: unknown = raw;
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;
    candidate = obj.link ?? obj.url ?? obj.href ?? null;
  }
  const text = normalizeNullableText(candidate);
  if (!text) return null;
  try {
    const url = new URL(text);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
    return null;
  } catch {
    return null;
  }
}

function extractDeadlineText(data: Record<string, unknown>): string | null {
  const direct = normalizeNullableText(data.deadline ?? data.application_deadline);
  if (direct) return direct;
  if (data.important_deadlines && typeof data.important_deadlines === 'object') {
    const imp = data.important_deadlines as Record<string, unknown>;
    return normalizeNullableText(imp.deadline ?? imp.date ?? imp.value);
  }
  return null;
}

function isMarkedUnavailableNote(note: string | undefined): boolean {
  if (!note) return false;
  return /\b(not reported as available|reported as missing|not available|missing)\b/i.test(
    note
  );
}

function mapDocuments(
  raw: unknown,
  defaultStatus: DocumentItem['status'],
  defaultProvenance: DocumentItem['provenance']
): DocumentItem[] {
  if (!raw) return [];

  // Handle dictionary format returned by CrewAI: { "Income certificate": "not reported as available by student" }
  if (!Array.isArray(raw) && typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>)
      .map(([docName, noteVal]): DocumentItem | null => {
        const name = docName.trim();
        if (!name) return null;
        const note = typeof noteVal === 'string' ? noteVal.trim() : undefined;
        if (defaultStatus === 'reported-available' && isMarkedUnavailableNote(note)) {
          return null;
        }
        return {
          name,
          status: defaultStatus,
          note,
          provenance: defaultProvenance,
        };
      })
      .filter((item): item is DocumentItem => item !== null);
  }

  if (!Array.isArray(raw)) return [];
  return raw
    .map((item): DocumentItem | null => {
      if (typeof item === 'string' && item.trim()) {
        return {
          name: item.trim(),
          status: defaultStatus,
          provenance: defaultProvenance,
        };
      }
      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>;
        const name =
          typeof obj.name === 'string'
            ? obj.name.trim()
            : typeof obj.document === 'string'
              ? obj.document.trim()
              : typeof obj.title === 'string'
                ? obj.title.trim()
                : '';
        if (!name) return null;
        const note = typeof obj.note === 'string' ? obj.note.trim() : undefined;
        if (defaultStatus === 'reported-available' && isMarkedUnavailableNote(note)) {
          return null;
        }
        return {
          name,
          status: defaultStatus,
          note,
          provenance:
            obj.provenance === 'source-derived' ||
            obj.provenance === 'student-reported' ||
            obj.provenance === 'general-guidance'
              ? obj.provenance
              : defaultProvenance,
        };
      }
      return null;
    })
    .filter((item): item is DocumentItem => item !== null);
}

function mapSteps(raw: unknown): RoadmapStep[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, idx): RoadmapStep | null => {
      if (typeof item === 'string' && item.trim()) {
        return {
          stepNumber: idx + 1,
          title: `Step ${idx + 1}`,
          description: item.trim(),
          provenance: 'source-derived',
        };
      }
      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>;
        const textVal = typeof obj.text === 'string' ? obj.text.trim() : '';
        const priorityVal =
          typeof obj.priority === 'string' && obj.priority.trim()
            ? `Priority: ${obj.priority.trim()}`
            : '';

        const title =
          typeof obj.title === 'string'
            ? obj.title.trim()
            : textVal || `Step ${idx + 1}`;
        const description =
          typeof obj.description === 'string'
            ? obj.description.trim()
            : typeof obj.step === 'string'
              ? obj.step.trim()
              : typeof obj.action === 'string'
                ? obj.action.trim()
                : priorityVal || (typeof obj.title === 'string' ? textVal : '');
        if (!description && !title) return null;
        return {
          stepNumber:
            typeof obj.stepNumber === 'number'
              ? obj.stepNumber
              : typeof obj.step_number === 'number'
                ? obj.step_number
                : idx + 1,
          title,
          description,
          provenance: mapProvenanceBasis(
            obj.provenance ?? obj.basis,
            'source-derived'
          ),
        };
      }
      return null;
    })
    .filter((item): item is RoadmapStep => item !== null);
}

interface ParsedDocStatus {
  name: string;
  status: 'yes' | 'no' | 'unsure';
}

const DOC_STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'of',
  'for',
  'and',
  'or',
  'in',
  'on',
  'to',
  'your',
  'current',
  'previous',
  'valid',
  'official',
  'required',
  'mandatory',
  'supporting',
  'document',
  'documents',
  'copy',
  'card',
]);

function extractDocKeywords(docName: string): string[] {
  return docName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 2 && !DOC_STOPWORDS.has(token));
}

function tokenMatchesQuestion(questionLower: string, token: string): boolean {
  if (token === 'institution') {
    return /\b(institution|school|college|university)\b/i.test(questionLower);
  }
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(questionLower);
}

function questionMentionsDoc(question: string, docName: string): boolean {
  const qLower = question.toLowerCase();
  const docLower = docName.trim().toLowerCase();
  if (!docLower) return false;
  if (qLower.includes(docLower)) return true;

  const keywords = extractDocKeywords(docName);
  if (keywords.length === 0) return false;
  return keywords.every((kw) => tokenMatchesQuestion(qLower, kw));
}

function parseStudentDocumentStatuses(
  studentProfile?: string,
  documentResponses?: Record<string, string>
): ParsedDocStatus[] {
  const map = new Map<string, ParsedDocStatus>();

  if (studentProfile) {
    const lines = studentProfile.split(/\r?\n/);
    let inDocSection = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (
        /^(?:reported\s+)?document\s+availability\b/i.test(line) ||
        /^supporting\s+documents\b/i.test(line)
      ) {
        inDocSection = true;
        continue;
      }

      if (!inDocSection) continue;
      if (/^[-*•]?\s*no mandatory documents\b/i.test(line)) continue;

      const match = line.match(/^(?:[-*•]|\d+[.)])?\s*([^:\n]{2,100}):\s*(.+)$/);
      if (!match) continue;

      const docName = match[1].trim();
      const statusRaw = match[2].trim().toLowerCase();

      let status: 'yes' | 'no' | 'unsure' = 'unsure';
      if (
        /\b(unsure|not sure|not answered|unanswered|unknown)\b/i.test(statusRaw)
      ) {
        status = 'unsure';
      } else if (
        /\b(missing|not having|do not have|don't have|reports? not|not available|unavailable)\b/i.test(
          statusRaw
        ) ||
        statusRaw === 'no'
      ) {
        status = 'no';
      } else if (
        /\b(have it|reports? having|already have|available|in possession)\b/i.test(
          statusRaw
        ) ||
        statusRaw === 'yes'
      ) {
        status = 'yes';
      }

      map.set(docName.toLowerCase(), { name: docName, status });
    }
  }

  if (documentResponses) {
    for (const [docName, rawChoice] of Object.entries(documentResponses)) {
      const cleanName = docName.trim();
      if (!cleanName) continue;
      const choice = rawChoice.trim().toLowerCase();
      const status: 'yes' | 'no' | 'unsure' =
        choice === 'yes' ? 'yes' : choice === 'no' ? 'no' : 'unsure';
      map.set(cleanName.toLowerCase(), { name: cleanName, status });
    }
  }

  return Array.from(map.values());
}

function questionAsksForDocumentToVerifyEligibility(question: string): boolean {
  const hasDocNoun =
    /\b(document|documents|certificate|marksheet|transcript|id|identity|proof|attestation)\b/i.test(
      question
    );
  if (!hasDocNoun) return false;

  const asksToVerifyEligibility =
    /\b(verify|confirm|prove|establish|validate|demonstrate)\s+(?:your\s+)?(?:eligibility|eligible|marks|score|percentage|cgpa|income|nationality|citizenship|residence|domicile|age|enrolment|enrollment)\b/i.test(
      question
    ) ||
    /\b(?:for|to)\s+(?:verify|verifying|confirm|confirming|prove|proving)\s+(?:your\s+)?eligibility\b/i.test(
      question
    ) ||
    (/\b(upload|submit|provide|attach|send|share|show)\b/i.test(question) &&
      /\b(eligibility|eligible)\b/i.test(question));

  return asksToVerifyEligibility;
}

function isDocumentAvailabilityQuestion(
  question: string,
  allKnownDocNames: string[]
): boolean {
  const mentionsAnyDoc = allKnownDocNames.some((docName) =>
    questionMentionsDoc(question, docName)
  );
  const hasDocTerm =
    mentionsAnyDoc ||
    /\b(document|documents|certificate|marksheet|transcript|institution id|proof of identity|identity proof|bonafide|domicile)\b/i.test(
      question
    );

  if (!hasDocTerm) return false;

  const hasAvailabilityVerb =
    /\b(do you (already |currently )?have|do you possess|do you hold|can you confirm (whether|if) you have|confirm whether you have|have you (already )?(obtained|acquired|got)|already have|is .+ available|ready for (the )?application|needed for the application|required for the application|missing)\b/i.test(
      question
    );

  return hasAvailabilityVerb;
}

function filterAndSeparateClarificationQuestions(params: {
  rawClarificationQuestions: string[];
  rawReadinessQuestions: string[];
  availableDocs: DocumentItem[];
  missingDocs: DocumentItem[];
  context?: {
    studentProfile?: string;
    documentResponses?: Record<string, string>;
  };
}): {
  eligibilityQuestions: string[];
  documentReadinessQuestions: string[];
  combinedQuestions: string[];
} {
  const parsedStatuses = parseStudentDocumentStatuses(
    params.context?.studentProfile,
    params.context?.documentResponses
  );

  // If no explicit studentProfile/documentResponses context was provided, infer known "Have it" docs
  const statusMap = new Map<string, ParsedDocStatus>(
    parsedStatuses.map((entry) => [entry.name.toLowerCase(), entry])
  );
  if (parsedStatuses.length === 0) {
    for (const doc of params.availableDocs) {
      statusMap.set(doc.name.toLowerCase(), { name: doc.name, status: 'yes' });
    }
  }

  const allStatuses = Array.from(statusMap.values());
  const knownAnsweredNames = allStatuses
    .filter((d) => d.status === 'yes' || d.status === 'no')
    .map((d) => d.name);
  const unsureOrUnansweredNames = allStatuses
    .filter((d) => d.status === 'unsure')
    .map((d) => d.name);

  const allKnownDocNames = Array.from(
    new Set([
      ...allStatuses.map((d) => d.name),
      ...params.availableDocs.map((d) => d.name),
      ...params.missingDocs.map((d) => d.name),
    ])
  );

  const eligibilityQuestions: string[] = [];
  const documentReadinessQuestions: string[] = [];
  const seen = new Set<string>();

  const candidates: { text: string; fromReadiness: boolean }[] = [
    ...params.rawClarificationQuestions.map((text) => ({
      text,
      fromReadiness: false,
    })),
    ...params.rawReadinessQuestions.map((text) => ({
      text,
      fromReadiness: true,
    })),
  ];

  for (const candidate of candidates) {
    const q = candidate.text.trim();
    if (!q) continue;
    const dedupKey = q.toLowerCase();
    if (seen.has(dedupKey)) continue;

    // Rule 5: Never ask for documents to verify eligibility.
    if (questionAsksForDocumentToVerifyEligibility(q)) {
      continue;
    }

    const mentionsDoc = allKnownDocNames.some((doc) =>
      questionMentionsDoc(q, doc)
    );
    const isDocQuestion =
      isDocumentAvailabilityQuestion(q, allKnownDocNames) ||
      (candidate.fromReadiness && mentionsDoc);

    if (isDocQuestion) {
      const mentionsAnsweredDoc = knownAnsweredNames.some((doc) =>
        questionMentionsDoc(q, doc)
      );
      const mentionsUnsureDoc = unsureOrUnansweredNames.some((doc) =>
        questionMentionsDoc(q, doc)
      );

      // Rules 1 & 2: Never ask whether the student has a document marked "Missing" or "Have it".
      if (mentionsAnsweredDoc && !mentionsUnsureDoc) {
        continue;
      }

      // Rule 3: Only ask document availability questions when at least one doc is Unsure/Unanswered.
      if (allStatuses.length > 0 && unsureOrUnansweredNames.length === 0) {
        continue;
      }

      seen.add(dedupKey);
      documentReadinessQuestions.push(q);
      continue;
    }

    // Ignore generic readiness questions when all documents are already answered
    if (
      candidate.fromReadiness &&
      allStatuses.length > 0 &&
      unsureOrUnansweredNames.length === 0
    ) {
      continue;
    }

    seen.add(dedupKey);
    if (candidate.fromReadiness) {
      documentReadinessQuestions.push(q);
    } else {
      eligibilityQuestions.push(q);
    }
  }

  // Rule 3: Ensure every "Unsure" or unanswered document gets a clear availability question
  for (const docName of unsureOrUnansweredNames) {
    const alreadyCovered = documentReadinessQuestions.some((q) =>
      questionMentionsDoc(q, docName)
    );
    if (!alreadyCovered) {
      const generated = `Do you currently have your ${docName} available for the application?`;
      if (!seen.has(generated.toLowerCase())) {
        seen.add(generated.toLowerCase());
        documentReadinessQuestions.push(generated);
      }
    }
  }

  return {
    eligibilityQuestions,
    documentReadinessQuestions,
    combinedQuestions: [...eligibilityQuestions, ...documentReadinessQuestions],
  };
}

/**
 * Safely maps raw CrewAI JSON output (flat, stringified, markdown-fenced, or nested)
 * into the strict AnalysisResult model without inventing deadlines, links, or document inspections.
 */
export function mapCrewAIResponseToResult(
  payload: unknown,
  context?: {
    studentProfile?: string;
    documentResponses?: Record<string, string>;
  }
): AnalysisResult {
  const data = extractStructuredCrewPayload(payload);

  const overview =
    data.scholarship_overview && typeof data.scholarship_overview === 'object'
      ? (data.scholarship_overview as Record<string, unknown>)
      : null;

  const rawEligibility = data.eligibility_status ?? data.eligibility;
  const rawReadiness = data.application_readiness ?? data.readiness;

  if (rawEligibility === undefined && rawReadiness === undefined) {
    throw new Error(
      'CrewAI response is missing required eligibility_status or application_readiness fields.'
    );
  }

  const rawActions = Array.isArray(data.actions_required_before_submission)
    ? data.actions_required_before_submission
    : Array.isArray(data.actions_before_submission)
      ? data.actions_before_submission
      : [];

  const availableDocs = mapDocuments(
    data.available_documents ?? data.available_docs,
    'reported-available',
    'student-reported'
  );
  const missingDocs = mapDocuments(
    data.missing_documents ?? data.missing_docs,
    'missing',
    'source-derived'
  );

  const {
    eligibilityQuestions,
    documentReadinessQuestions,
    combinedQuestions,
  } = filterAndSeparateClarificationQuestions({
    rawClarificationQuestions: toStringArray(data.clarification_questions),
    rawReadinessQuestions: toStringArray(data.readiness_questions),
    availableDocs,
    missingDocs,
    context,
  });

  const warningItems = [
    ...toStringArray(data.warnings),
    ...toStringArray(data.warnings_and_items_to_confirm),
  ];

  return {
    scholarship_name:
      normalizeNullableText(
        data.scholarship_name ?? overview?.scholarship_name
      ) ?? 'Supplied Scholarship Opportunity',
    provider:
      normalizeNullableText(data.provider ?? overview?.provider) ??
      'Not stated in supplied source',
    benefits:
      normalizeNullableText(
        data.benefits ??
          data.scholarship_benefits ??
          data.benefit ??
          overview?.benefits ??
          overview?.scholarship_benefits ??
          overview?.benefit
      ) ?? 'Not stated in supplied source',
    eligibility_status: normalizeEligibility(rawEligibility),
    eligibility_explanation:
      normalizeNullableText(
        data.eligibility_explanation ?? data.eligibility_reason ?? data.summary
      ) ??
      'Eligibility assessment completed based on the supplied scholarship criteria and student profile.',
    application_readiness: normalizeReadiness(rawReadiness),
    readiness_explanation:
      normalizeNullableText(
        data.readiness_explanation ?? data.readiness_reason
      ) ??
      'Application readiness reflects student-reported document availability only.',
    information_provenance: toStringArray(
      data.information_provenance ?? data.provenance
    ),
    source_verification_status:
      normalizeNullableText(
        data.source_verification_status ?? data.student_data_disclaimer
      ) ??
      'Assessed strictly from user-supplied source; not independently verified against an external portal.',
    available_documents: availableDocs,
    missing_documents: missingDocs,
    application_steps: mapSteps(data.application_steps ?? data.steps),
    actions_required_before_submission: rawActions
      .map((item) => {
        if (typeof item === 'string' && item.trim()) {
          return {
            action: item.trim(),
            provenance: 'general-guidance' as const,
          };
        }
        if (item && typeof item === 'object') {
          const obj = item as Record<string, unknown>;
          const action =
            typeof obj.action === 'string'
              ? obj.action.trim()
              : typeof obj.text === 'string'
                ? obj.text.trim()
                : typeof obj.description === 'string'
                  ? obj.description.trim()
                  : '';
          if (!action) return null;
          return {
            action,
            provenance: mapProvenanceBasis(
              obj.provenance ?? obj.basis,
              'general-guidance'
            ),
          };
        }
        return null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null),
    official_application_link: normalizeSafeHttpUrl(
      data.official_application_link ?? data.official_link
    ),
    deadline: extractDeadlineText(data),
    warnings: warningItems,
    clarification_questions: combinedQuestions,
    eligibility_clarification_questions: eligibilityQuestions,
    document_readiness_questions: documentReadinessQuestions,
    corrections_made: toStringArray(
      data.corrections_made ?? data.quality_controller_corrections
    ),
  };
}
