import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageId } from '../../types/scholarship';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenSamplePreview: () => void;
}

export function Navbar({
  currentPage,
  onNavigate,
  onOpenSamplePreview,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (action: () => void) => {
    setMobileMenuOpen(false);
    action();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick(() => onNavigate('landing'))}
          className="whitespace-nowrap shrink-0 text-left font-display text-xl font-bold tracking-tight text-[#173B68] hover:text-[#3478C8] transition-colors"
        >
          ScholarshipSaathi
        </button>

        {/* Zone 2: Clean single-line text nav links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#202B3B]"
        >
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#3478C8] ${
              currentPage === 'landing'
                ? 'text-[#173B68] underline decoration-[#3478C8] decoration-2 underline-offset-8'
                : ''
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#3478C8] ${
              currentPage === 'about'
                ? 'text-[#173B68] underline decoration-[#3478C8] decoration-2 underline-offset-8'
                : ''
            }`}
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={onOpenSamplePreview}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#3478C8] ${
              currentPage === 'results' || currentPage === 'roadmap'
                ? 'text-[#173B68] underline decoration-[#3478C8] decoration-2 underline-offset-8'
                : ''
            }`}
          >
            Sample Previews
          </button>
          <button
            type="button"
            onClick={() => onNavigate('student-profile')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#3478C8] ${
              currentPage === 'student-profile'
                ? 'text-[#173B68] underline decoration-[#3478C8] decoration-2 underline-offset-8'
                : ''
            }`}
          >
            Student Profile
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="hidden md:flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('scholarship-input')}
            className="whitespace-nowrap shrink-0 rounded-lg bg-[#3478C8] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#173B68]"
          >
            Analyse a Scholarship
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-[#173B68] md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigate('landing'))}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#202B3B] hover:bg-[#EAF2FC]"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigate('about'))}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#202B3B] hover:bg-[#EAF2FC]"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(onOpenSamplePreview)}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#202B3B] hover:bg-[#EAF2FC]"
            >
              Sample Previews
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigate('student-profile'))}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#202B3B] hover:bg-[#EAF2FC]"
            >
              Student Profile
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigate('scholarship-input'))}
              className="mt-2 rounded-lg bg-[#3478C8] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#173B68]"
            >
              Analyse a Scholarship
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
