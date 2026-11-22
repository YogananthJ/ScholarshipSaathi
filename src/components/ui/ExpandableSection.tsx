import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableSectionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function ExpandableSection({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/70 transition-colors rounded-xl"
      >
        <div>
          <h3 className="font-display text-base font-semibold text-[#173B68]">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-slate-500" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" />
        )}
      </button>
      {isOpen && (
        <div className="border-t border-slate-100 px-5 py-4">{children}</div>
      )}
    </div>
  );
}
