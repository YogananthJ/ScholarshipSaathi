import React, { useEffect, useRef } from 'react';
import { Trash2, X } from 'lucide-react';

interface ConfirmClearModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmClearModal({
  isOpen,
  onCancel,
  onConfirm,
}: ConfirmClearModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    cancelButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#173B68]/45 px-4 backdrop-blur-[1px]"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-session-title"
        aria-describedby="clear-session-description"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF1F2] text-[#D65A62]">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="clear-session-title"
                className="font-display text-lg font-bold text-[#173B68]"
              >
                Clear all session data?
              </h2>
              <p
                id="clear-session-description"
                className="mt-1.5 text-sm leading-relaxed text-slate-600"
              >
                This will immediately remove your scholarship source, student profile, document availability responses, and analysis results from this browser session.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close confirmation dialog"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#173B68] hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[#D65A62] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A1363D]"
          >
            Yes, Clear Session Data
          </button>
        </div>
      </div>
    </div>
  );
}
