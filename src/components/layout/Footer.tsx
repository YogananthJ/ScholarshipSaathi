import React from 'react';
import { PageId } from '../../types/scholarship';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onResetSession: () => void;
}

export function Footer({ onNavigate, onResetSession }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold text-[#173B68]">
              ScholarshipSaathi
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
              Your Scholarship Journey, Made Simpler. Source-aware eligibility checks,
              document readiness tracking, and clear application roadmaps for students.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <p className="font-display font-semibold text-[#173B68]">Navigation</p>
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="w-fit text-slate-600 hover:text-[#3478C8]"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => onNavigate('scholarship-input')}
              className="w-fit text-slate-600 hover:text-[#3478C8]"
            >
              Analyse a Scholarship
            </button>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="w-fit text-slate-600 hover:text-[#3478C8]"
            >
              About &amp; How It Works
            </button>
            <button
              type="button"
              onClick={onResetSession}
              className="w-fit text-slate-600 hover:text-[#D65A62]"
            >
              Clear Session Data
            </button>
          </div>

          <div className="text-sm leading-relaxed text-slate-600">
            <p className="font-display font-semibold text-[#173B68]">
              Student Verification Notice
            </p>
            <p className="mt-2">
              ScholarshipSaathi provides AI-assisted guidance strictly from the source you
              supply. It does not submit applications automatically. Always verify final
              criteria, deadlines, and official portals directly with the scholarship provider.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>ScholarshipSaathi · Session-based privacy · No permanent student profile database</p>
          <p>Eligibility and application readiness are always evaluated separately.</p>
        </div>
      </div>
    </footer>
  );
}
