import {
  ExtractedSourceRequirements,
  ScholarshipInputState,
} from '../types/scholarship';

export function getCombinedReadableSourceText(
  source: ScholarshipInputState
): string {
  const parts: string[] = [];
  if (source.scholarshipName.trim()) {
    parts.push(source.scholarshipName.trim());
  }
  if (source.sourceText.trim()) {
    parts.push(source.sourceText.trim());
  }
  if (
    source.uploadedFile?.extractionStatus === 'extracted' &&
    source.uploadedFile.extractedText.trim()
  ) {
    parts.push(source.uploadedFile.extractedText.trim());
  }
  return parts.join('\n\n');
}

function cleanDocumentLabel(raw: string): string {
  return raw
    .replace(/^[\s\-*•\d.)]+/, '')
    .replace(/^(?:and|or)\s+/i, '')
    .replace(/\s+/g, ' ')
    .replace(/[.;:]+$/, '')
    .trim();
}

function normalizeDocKey(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function splitInlineDocumentList(segment: string): string[] {
  // Handle inline numbered lists like "1. Doc A 2. Doc B"
  const numberedNormalized = segment.replace(/\s+(?=\d+[.)]\s+)/g, '\n');
  const rawParts = numberedNormalized.split(/\n|[,;]+|\s+and\s+/i);
  return rawParts.map((part) => part.trim()).filter(Boolean);
}

function extractDocumentsFromSourceText(text: string): string[] {
  const results: string[] = [];
  const seenKeys = new Set<string>();

  const addDoc = (candidate: string) => {
    if (/\boptional\b/i.test(candidate)) return;
    const cleaned = cleanDocumentLabel(candidate);
    if (!cleaned || cleaned.length < 3 || cleaned.length > 100) return;
    const key = normalizeDocKey(cleaned);
    if (!key || seenKeys.has(key)) return;
    seenKeys.add(key);
    results.push(cleaned);
  };

  // 1. Parse explicit document sections (bulleted, numbered, or inline lists after document headers)
  const lines = text.split(/\r?\n/);
  let inDocSection = false;
  const docHeaderStartRegex =
    /^(required documents|documents required|mandatory documents|supporting documents|documents needed|enclosures|documents to submit|documents to upload)\s*:?/i;
  const docHeaderInlineRegex =
    /(?:^|[.!?]\s+)(required documents|documents required|mandatory documents|supporting documents|documents needed|enclosures|documents to submit|documents to upload)\s*:/i;
  const stopSectionRegex =
    /^(deadline|last date|official|application link|portal|how to apply|benefits|award|stipend|eligibility|selection|note|notes|contact)\s*:?/i;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (inDocSection && results.length > 0) {
        inDocSection = false;
      }
      continue;
    }

    const startMatch = docHeaderStartRegex.exec(line);
    const inlineMatch = !startMatch ? docHeaderInlineRegex.exec(line) : null;

    if (startMatch || inlineMatch) {
      inDocSection = true;
      const matchEnd = startMatch
        ? startMatch.index + startMatch[0].length
        : inlineMatch!.index + inlineMatch![0].length;
      const afterColon = line.slice(matchEnd).trim();
      if (afterColon) {
        splitInlineDocumentList(afterColon).forEach(addDoc);
      }
      continue;
    }

    if (inDocSection) {
      if (stopSectionRegex.test(line)) {
        inDocSection = false;
        continue;
      }
      if (/^[-*•\d]/.test(line)) {
        splitInlineDocumentList(line).forEach(addDoc);
        continue;
      }
      if (line.length <= 90) {
        splitInlineDocumentList(line).forEach(addDoc);
        continue;
      }
      inDocSection = false;
    }
  }

  // 2. Also detect explicitly mentioned mandatory documents in prose if not already captured
  const knownDocumentPatterns: {
    regex: RegExp;
    aliases: string[];
    label: string;
  }[] = [
    {
      regex: /\b(previous\s+academic\s+marksheet|academic\s+marksheet|mark\s*sheet|transcript|grade\s*card|report\s*card)\b/i,
      aliases: ['marksheet', 'mark sheet', 'transcript', 'grade card', 'report card'],
      label: 'Previous academic marksheet',
    },
    {
      regex: /\b(income\s+certificate|proof\s+of\s+income|salary\s+certificate)\b/i,
      aliases: ['income certificate', 'proof of income', 'salary certificate'],
      label: 'Income certificate',
    },
    {
      regex: /\b(proof\s+of\s+identity|identity\s+proof|id\s+proof|government\s+id|aadhaar|passport|national\s+id|photo\s+id)\b/i,
      aliases: [
        'proof of identity',
        'identity proof',
        'identity',
        'id proof',
        'government id',
        'aadhaar',
        'passport',
        'national id',
        'photo id',
      ],
      label: 'Proof of identity',
    },
    {
      regex: /\b(current\s+educational\s+institution\s+id|educational\s+institution\s+id|institution\s+id|student\s+id|college\s+id|school\s+id|bonafide\s+(?:certificate|letter)|enrolment\s+(?:certificate|proof)|enrollment\s+(?:certificate|proof))\b/i,
      aliases: [
        'institution id',
        'student id',
        'college id',
        'school id',
        'bonafide',
        'enrolment',
        'enrollment',
      ],
      label: 'Current educational institution ID',
    },
    {
      regex: /\b(domicile\s+certificate|residence\s+proof|residency\s+proof)\b/i,
      aliases: ['domicile', 'residence proof', 'residency proof'],
      label: 'Domicile / Residence proof',
    },
    {
      regex: /\b(caste\s+certificate|category\s+certificate|ews\s+certificate)\b/i,
      aliases: ['caste certificate', 'category certificate', 'ews certificate'],
      label: 'Category / Caste / EWS certificate',
    },
    {
      regex: /\b(recommendation\s+letter|letter\s+of\s+recommendation|reference\s+letter)\b/i,
      aliases: ['recommendation', 'reference letter'],
      label: 'Recommendation letter',
    },
    {
      regex: /\b(statement\s+of\s+purpose|personal\s+statement)\b/i,
      aliases: ['statement of purpose', 'personal statement'],
      label: 'Statement of purpose',
    },
    {
      regex: /\b(admission\s+letter|offer\s+letter)\b/i,
      aliases: ['admission letter', 'offer letter'],
      label: 'Admission / Offer letter',
    },
    {
      regex: /\b(bank\s+passbook|bank\s+account\s+details|cancelled\s+cheque)\b/i,
      aliases: ['bank passbook', 'bank account', 'cancelled cheque'],
      label: 'Bank account / Passbook details',
    },
    {
      regex: /\b(fee\s+receipt|tuition\s+receipt)\b/i,
      aliases: ['fee receipt', 'tuition receipt'],
      label: 'Fee receipt',
    },
    {
      regex: /\b(disability\s+certificate|pwd\s+certificate)\b/i,
      aliases: ['disability certificate', 'pwd certificate'],
      label: 'Disability certificate',
    },
  ];

  const existingNormalized = Array.from(seenKeys).join(' | ');
  for (const pattern of knownDocumentPatterns) {
    if (pattern.regex.test(text)) {
      const alreadyCovered = pattern.aliases.some((alias) =>
        existingNormalized.includes(alias)
      );
      if (!alreadyCovered) {
        addDoc(pattern.label);
      }
    }
  }

  return results;
}

/**
 * Inspects ONLY the user-supplied scholarship text so the Student Profile form
 * prompts solely for criteria and documents explicitly present in the source.
 */
export function analyzeSuppliedSourceRequirements(
  source: ScholarshipInputState
): ExtractedSourceRequirements {
  const text = getCombinedReadableSourceText(source);

  // Nationality / Citizenship criterion
  const requiresNationality =
    /\b(indian\s+citizen|citizens?\s+of|citizenship|nationality|national\s+of|indian\s+national|domestic\s+student|international\s+student|passport\s+holder)\b/i.test(
      text
    );

  // Strict Age criterion detection: only when an actual age limit, range, or birth cutoff is stated
  const sanitizedForAge = text.replace(
    /\b(no\s+age\s+(?:limit|restriction|bar|criterion|criteria)|all\s+ages|any\s+age)\b/gi,
    ''
  );
  const ageMatch = sanitizedForAge.match(
    /(?:\b(?:minimum|maximum|max|min|upper|lower)\s+age\b[^\n.]{0,40}\d{1,2}|\bage\s*(?:limit|criterion|criteria|requirement)\s*(?:is|of|:)?\s*[^\n.]{0,40}\d{1,2}|\b(?:aged|age)\s+(?:between\s+)?\d{1,2}\s*(?:to|-|and)\s*\d{1,2}\b|\b(?:under|below|above|over|at\s+least|not\s+(?:more|older)\s+than|up\s+to)\s+\d{1,2}\s+years(?:\s+of\s+age)?\b|\b\d{1,2}\s+years\s+of\s+age\b|\bborn\s+(?:on\s+or\s+)?(?:after|before|between)\s+[^\n.]{4,40}\d{4}\b|\bapplicant(?:s)?\s+must\s+be\s+(?:aged|under|below|above|at\s+least)\s+\d{1,2}\b)/i
  );
  const hasAgeRequirement = Boolean(ageMatch);

  // Residence / Domicile criterion
  const requiresResidence =
    /\b(resident\s+of|residing\s+in|residency|domicile|permanent\s+resident|state\s+of\s+residence|local\s+district)\b/i.test(
      text
    );

  // Education level criterion
  const requiresEducationLevel =
    /\b(undergraduate|postgraduate|bachelor|master|phd|doctoral|diploma|high\s+school|higher\s+secondary|secondary\s+school|class\s+10|class\s+12|degree\s+programme|degree\s+program|enrolled\s+in|b\.tech|b\.sc|m\.sc|vocational)\b/i.test(
      text
    );

  // Academic year / semester criterion (ignore award duration like "per academic year")
  const requiresAcademicYear =
    /\b((?:1st|2nd|3rd|4th|first|second|third|fourth|final)\s+year\s+(?:student|undergraduate|postgraduate|diploma)|currently\s+(?:studying\s+)?in\s+(?:year|semester)|semester\s+\d+|current\s+academic\s+year\s+(?:required|must))\b/i.test(
      text
    );

  // Academic performance / score criterion
  const scoreMatch = text.match(
    /(?:\b\d{1,3}(?:\.\d+)?\s*%\s*(?:marks|score|aggregate)?[^\n.]{0,40}|\b(?:minimum|min|at\s+least)\s+\d+(?:\.\d+)?\s*(?:%|percent|percentage|cgpa|gpa|marks)[^\n.]{0,40}|\b(?:cgpa|gpa|percentage|marks|academic\s+performance|academic\s+score|first\s+class|distinction)\b[^\n.]{0,40})/i
  );
  const requiresAcademicScore = Boolean(scoreMatch);

  // Specific school / college name criterion (not triggered by "institution ID")
  const requiresInstitution =
    /\b(school\s+name\s+required|college\s+name\s+required|institution\s+name\s+required|only\s+students\s+(?:of|from)\s+[^\n.]{3,50}|affiliated\s+to\s+[^\n.]{3,40})\b/i.test(
      text
    );

  // Financial / Income criterion
  const incomeMatch = text.match(
    /\b((?:annual\s+)?(?:family|household|parental)\s+income[^\n.]{0,60}|income\s+(?:ceiling|limit|cap|below|less\s+than|not\s+exceed|criteria)[^\n.]{0,50}|merit-cum-means|means-tested|economically\s+weaker|ews|below\s+poverty\s+line|bpl|financial\s+need)\b/i
  );
  const hasIncomeRequirement = Boolean(incomeMatch);

  const requiresAdditionalFinancialDetails =
    /\b(single\s+parent|orphan|other\s+scholarship|other\s+fee\s+waiver|tax\s+return|itr|bank\s+statement|financial\s+hardship|loan\s+details|assets)\b/i.test(
      text
    );

  const requiredDocuments = extractDocumentsFromSourceText(text);

  return {
    requiresNationality,
    hasAgeRequirement,
    ageCriterionHint: ageMatch ? ageMatch[0].trim() : null,
    requiresResidence,
    requiresEducationLevel,
    requiresAcademicYear,
    requiresAcademicScore,
    scoreThresholdHint: scoreMatch ? scoreMatch[0].trim() : null,
    requiresInstitution,
    hasIncomeRequirement,
    incomeCriterionHint: incomeMatch ? incomeMatch[0].trim() : null,
    requiresAdditionalFinancialDetails,
    requiredDocuments,
  };
}
