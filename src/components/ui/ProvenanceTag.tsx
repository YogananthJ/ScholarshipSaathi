import React from 'react';
import { BookOpen, Compass, UserCheck } from 'lucide-react';

type ProvenanceKind = 'source-derived' | 'student-reported' | 'general-guidance';

export function ProvenanceTag({ kind }: { kind: ProvenanceKind }) {
  if (kind === 'source-derived') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#173B68]">
        <BookOpen className="h-3.5 w-3.5 text-[#3478C8]" />
        From Supplied Source
      </span>
    );
  }

  if (kind === 'student-reported') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
        <UserCheck className="h-3.5 w-3.5 text-[#20A477]" />
        Student-Reported (Not Inspected)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#946314]">
      <Compass className="h-3.5 w-3.5 text-[#D99A34]" />
      General Guidance
    </span>
  );
}
