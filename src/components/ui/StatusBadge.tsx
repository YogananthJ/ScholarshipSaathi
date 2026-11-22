import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  XCircle,
} from 'lucide-react';
import {
  ApplicationReadiness,
  EligibilityStatus,
} from '../../types/scholarship';

export function EligibilityBadge({ status }: { status: EligibilityStatus }) {
  switch (status) {
    case 'Eligible':
      return (
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#20A477]/30 bg-[#E8F7F1] px-3 py-1.5 text-sm font-semibold text-[#136F50] whitespace-nowrap">
          <CheckCircle2 className="h-4 w-4 text-[#20A477]" />
          Eligible
        </span>
      );
    case 'Potentially Eligible':
      return (
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#3478C8]/30 bg-[#EAF2FC] px-3 py-1.5 text-sm font-semibold text-[#173B68] whitespace-nowrap">
          <Clock className="h-4 w-4 text-[#3478C8]" />
          Potentially Eligible
        </span>
      );
    case 'Not Eligible':
      return (
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#D65A62]/30 bg-[#FDF1F2] px-3 py-1.5 text-sm font-semibold text-[#A1363D] whitespace-nowrap">
          <XCircle className="h-4 w-4 text-[#D65A62]" />
          Not Eligible
        </span>
      );
    case 'Insufficient Information':
    default:
      return (
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#D99A34]/35 bg-[#FEF7EA] px-3 py-1.5 text-sm font-semibold text-[#946314] whitespace-nowrap">
          <HelpCircle className="h-4 w-4 text-[#D99A34]" />
          Insufficient Information
        </span>
      );
  }
}

export function ReadinessBadge({ status }: { status: ApplicationReadiness }) {
  switch (status) {
    case 'Ready':
      return (
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#20A477]/30 bg-[#E8F7F1] px-3 py-1.5 text-sm font-semibold text-[#136F50] whitespace-nowrap">
          <CheckCircle2 className="h-4 w-4 text-[#20A477]" />
          Ready
        </span>
      );
    case 'Incomplete':
      return (
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#D99A34]/35 bg-[#FEF7EA] px-3 py-1.5 text-sm font-semibold text-[#946314] whitespace-nowrap">
          <AlertCircle className="h-4 w-4 text-[#D99A34]" />
          Incomplete
        </span>
      );
    case 'Requires Clarification':
    default:
      return (
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#3478C8]/30 bg-[#EAF2FC] px-3 py-1.5 text-sm font-semibold text-[#173B68] whitespace-nowrap">
          <HelpCircle className="h-4 w-4 text-[#3478C8]" />
          Requires Clarification
        </span>
      );
  }
}
