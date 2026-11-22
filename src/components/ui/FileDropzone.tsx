import React, { useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileText, RefreshCw, Trash2, Upload } from 'lucide-react';
import { UploadedDocumentState } from '../../types/scholarship';
import {
  formatFileSize,
  getFileExtension,
  MAX_FILE_SIZE_BYTES,
  SUPPORTED_READABLE_EXTENSIONS,
  UNIMPLEMENTED_DOCUMENT_EXTENSIONS,
} from '../../utils/validation';

interface FileDropzoneProps {
  uploadedFile: UploadedDocumentState | null;
  onFileChange: (file: UploadedDocumentState | null) => void;
}

export function FileDropzone({ uploadedFile, onFileChange }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  const processFile = async (file: File) => {
    setUploadError(null);
    const ext = getFileExtension(file.name);

    if (UNIMPLEMENTED_DOCUMENT_EXTENSIONS.includes(ext as (typeof UNIMPLEMENTED_DOCUMENT_EXTENSIONS)[number])) {
      onFileChange(null);
      setUploadError(
        `Text extraction for ${ext.toUpperCase()} files is not implemented yet, so the contents of "${file.name}" cannot currently be read. Please upload a .txt, .md, or .csv file, or paste the scholarship text directly above.`
      );
      return;
    }

    if (!SUPPORTED_READABLE_EXTENSIONS.includes(ext as (typeof SUPPORTED_READABLE_EXTENSIONS)[number])) {
      onFileChange(null);
      setUploadError(
        `Unsupported file format (${ext || 'unknown'}). Currently supported readable formats: ${SUPPORTED_READABLE_EXTENSIONS.join(', ')}. Please choose a supported file or paste the scholarship text above.`
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      onFileChange(null);
      setUploadError(
        `File exceeds the 5 MB limit (${formatFileSize(file.size)}). Please upload a smaller document or paste the text directly.`
      );
      return;
    }

    setIsReading(true);
    try {
      const text = await file.text();
      if (!text.trim()) {
        setUploadError(
          `The file "${file.name}" appears to be empty. Please upload another file or paste the scholarship text.`
        );
        onFileChange(null);
      } else {
        onFileChange({
          fileName: file.name,
          fileSizeBytes: file.size,
          mimeType: file.type || 'text/plain',
          extractionStatus: 'extracted',
          extractedText: text,
          statusMessage: `Extracted ${text.trim().length.toLocaleString()} characters from "${file.name}".`,
        });
      }
    } catch {
      setUploadError(
        `Unable to read the contents of "${file.name}". No contents were claimed as read. Please try another file or paste the text.`
      );
      onFileChange(null);
    } finally {
      setIsReading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED_READABLE_EXTENSIONS.join(',')}
        onChange={handleInputChange}
        className="sr-only"
        id="scholarship-file-upload"
      />

      {!uploadedFile ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
            isDragging
              ? 'border-[#3478C8] bg-[#EAF2FC]'
              : 'border-slate-300 bg-slate-50/70 hover:border-[#3478C8] hover:bg-[#EAF2FC]/40'
          }`}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF2FC] text-[#3478C8]">
            <Upload className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-[#173B68]">
            {isReading ? 'Reading file...' : 'Drop a readable text document here, or click to browse'}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Supported readable formats: .txt, .md, .csv (up to 5 MB). PDF and DOCX extraction is not yet available—paste text from PDF/DOCX files directly above.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EAF2FC] text-[#173B68]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#173B68] break-all">
                  {uploadedFile.fileName}
                </p>
                <p className="text-xs text-slate-500 tabular-nums">
                  {formatFileSize(uploadedFile.fileSizeBytes)}
                </p>
                <div className="mt-2 flex items-start gap-2 text-xs">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#20A477]" />
                  <span className="text-[#136F50]">{uploadedFile.statusMessage}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#202B3B] hover:bg-slate-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Replace
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadError(null);
                  onFileChange(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D65A62]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#A1363D] hover:bg-[#FDF1F2]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {uploadError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-[#D65A62]/40 bg-[#FDF1F2] p-3 text-xs text-[#A1363D]"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D65A62]" />
          <p>{uploadError}</p>
        </div>
      )}
    </div>
  );
}
