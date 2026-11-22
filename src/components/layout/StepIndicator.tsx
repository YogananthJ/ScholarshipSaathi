import React from 'react';
import { Check } from 'lucide-react';
import { PageId } from '../../types/scholarship';

interface StepIndicatorProps {
  currentPage: PageId;
  hasResult: boolean;
  onNavigate: (page: PageId) => void;
}

const FLOW_STEPS: { id: PageId; number: number; label: string }[] = [
  { id: 'scholarship-input', number: 1, label: 'Scholarship Source' },
  { id: 'student-profile', number: 2, label: 'Student Profile' },
  { id: 'review', number: 3, label: 'Review' },
  { id: 'analysis', number: 4, label: 'AI Analysis' },
  { id: 'results', number: 5, label: 'Results & Roadmap' },
];

export function StepIndicator({
  currentPage,
  hasResult,
  onNavigate,
}: StepIndicatorProps) {
  const effectiveId: PageId = currentPage === 'roadmap' ? 'results' : currentPage;
  const activeIndex = FLOW_STEPS.findIndex((s) => s.id === effectiveId);

  if (activeIndex === -1) return null;

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <ol className="flex items-center gap-2 overflow-x-auto text-xs sm:gap-4 sm:text-sm">
          {FLOW_STEPS.map((step, index) => {
            const isActive = index === activeIndex;
            const isCompleted = index < activeIndex;
            const canClick =
              index < activeIndex ||
              (step.id === 'results' && hasResult);

            return (
              <li key={step.id} className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={!canClick}
                  onClick={() => canClick && onNavigate(step.id)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#EAF2FC] text-[#173B68] font-semibold'
                      : isCompleted
                        ? 'text-[#20A477] hover:bg-slate-50'
                        : canClick
                          ? 'text-slate-600 hover:bg-slate-50'
                          : 'text-slate-400 cursor-default'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums ${
                      isActive
                        ? 'bg-[#3478C8] text-white'
                        : isCompleted
                          ? 'bg-[#20A477] text-white'
                          : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3" /> : step.number}
                  </span>
                  <span>{step.label}</span>
                </button>
                {index < FLOW_STEPS.length - 1 && (
                  <span aria-hidden="true" className="text-slate-300">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
