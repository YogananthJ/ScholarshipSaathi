import React from 'react';

export function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a student reviewing scholarship documents on a laptop beside a graduation cap and checklist"
      className={className}
    >
      {/* Cream editorial backdrop */}
      <rect x="24" y="24" width="472" height="352" rx="24" fill="#FFFDF7" stroke="#E2E8F0" strokeWidth="1.5" />
      <circle cx="408" cy="108" r="76" fill="#EAF2FC" />
      <circle cx="116" cy="292" r="56" fill="#E8F7F1" />

      {/* Checklist floating document (top left) */}
      <g>
        <rect x="52" y="54" width="154" height="126" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <rect x="68" y="72" width="68" height="8" rx="4" fill="#173B68" />
        <circle cx="76" cy="102" r="9" fill="#E8F7F1" stroke="#20A477" strokeWidth="1.5" />
        <path d="M72.5 102L75 104.5L79.5 99.5" stroke="#20A477" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="92" y="98" width="94" height="7" rx="3.5" fill="#94A3B8" />
        <circle cx="76" cy="128" r="9" fill="#E8F7F1" stroke="#20A477" strokeWidth="1.5" />
        <path d="M72.5 128L75 130.5L79.5 125.5" stroke="#20A477" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="92" y="124" width="80" height="7" rx="3.5" fill="#94A3B8" />
        <circle cx="76" cy="154" r="9" fill="#EAF2FC" stroke="#3478C8" strokeWidth="1.5" />
        <rect x="92" y="150" width="62" height="7" rx="3.5" fill="#CBD5E1" />
      </g>

      {/* Graduation cap (top right) */}
      <g>
        <rect x="352" y="52" width="112" height="86" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <path d="M408 74L444 90L408 106L372 90L408 74Z" fill="#173B68" />
        <path d="M385 96V112C385 117 395 122 408 122C421 122 431 117 431 112V96" fill="#3478C8" />
        <path d="M444 90V114" stroke="#D99A34" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="444" cy="117" r="4" fill="#D99A34" />
      </g>

      {/* Desk */}
      <rect x="76" y="294" width="368" height="12" rx="6" fill="#173B68" />

      {/* Student figure */}
      <circle cx="242" cy="176" r="28" fill="#F3D2B3" />
      <path d="M214 173C214 155 227 144 243 144C259 144 270 155 270 173C262 165 251 161 241 161C230 161 221 165 214 173Z" fill="#173B68" />
      <path d="M192 276C192 238 214 214 242 214C270 214 292 238 292 276H192Z" fill="#3478C8" />
      <path d="M230 214L242 230L254 214" fill="#FFFFFF" />

      {/* Laptop */}
      <rect x="196" y="230" width="140" height="64" rx="8" fill="#1E293B" stroke="#173B68" strokeWidth="2" />
      <rect x="204" y="238" width="124" height="48" rx="4" fill="#EAF2FC" />
      <rect x="214" y="248" width="60" height="7" rx="3.5" fill="#173B68" />
      <rect x="214" y="261" width="96" height="5" rx="2.5" fill="#3478C8" opacity="0.6" />
      <rect x="214" y="271" width="76" height="5" rx="2.5" fill="#20A477" />
      <path d="M180 294H352L340 302H192L180 294Z" fill="#64748B" />

      {/* Scholarship Document Card (bottom right) */}
      <g>
        <rect x="358" y="198" width="114" height="126" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <rect x="374" y="216" width="44" height="14" rx="4" fill="#E8F7F1" />
        <rect x="380" y="220" width="32" height="6" rx="3" fill="#20A477" />
        <rect x="374" y="242" width="82" height="6" rx="3" fill="#173B68" />
        <rect x="374" y="256" width="68" height="6" rx="3" fill="#94A3B8" />
        <rect x="374" y="270" width="76" height="6" rx="3" fill="#94A3B8" />
        <rect x="374" y="290" width="54" height="16" rx="6" fill="#3478C8" />
      </g>
    </svg>
  );
}

export function SourceInputIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a browser window with scholarship documents and an upload icon"
      className={className}
    >
      <rect x="12" y="12" width="256" height="176" rx="16" fill="#FFFDF7" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="34" y="34" width="156" height="106" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
      <rect x="34" y="34" width="156" height="22" rx="10" fill="#EAF2FC" />
      <circle cx="48" cy="45" r="3" fill="#3478C8" />
      <circle cx="58" cy="45" r="3" fill="#94A3B8" />
      <circle cx="68" cy="45" r="3" fill="#94A3B8" />
      <rect x="50" y="70" width="84" height="8" rx="4" fill="#173B68" />
      <rect x="50" y="86" width="120" height="6" rx="3" fill="#94A3B8" />
      <rect x="50" y="99" width="104" height="6" rx="3" fill="#94A3B8" />
      <rect x="50" y="112" width="74" height="6" rx="3" fill="#CBD5E1" />

      {/* Upload badge */}
      <rect x="166" y="88" width="82" height="76" rx="12" fill="#EAF2FC" stroke="#3478C8" strokeWidth="1.5" />
      <path d="M207 136V110" stroke="#173B68" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M196 120L207 109L218 120" stroke="#173B68" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="187" y="144" width="40" height="6" rx="3" fill="#20A477" />
    </svg>
  );
}

export function ProfileIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a student profile card and academic record"
      className={className}
    >
      <rect x="12" y="12" width="256" height="176" rx="16" fill="#FFFDF7" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="38" y="34" width="204" height="132" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
      <circle cx="82" cy="82" r="24" fill="#EAF2FC" stroke="#3478C8" strokeWidth="1.5" />
      <circle cx="82" cy="75" r="8" fill="#173B68" />
      <path d="M66 98C66 89 73 84 82 84C91 84 98 89 98 98" fill="#3478C8" />
      <rect x="122" y="64" width="96" height="9" rx="4.5" fill="#173B68" />
      <rect x="122" y="82" width="72" height="6" rx="3" fill="#94A3B8" />
      <rect x="122" y="96" width="84" height="6" rx="3" fill="#CBD5E1" />

      <rect x="58" y="122" width="76" height="24" rx="6" fill="#E8F7F1" />
      <rect x="68" y="131" width="56" height="6" rx="3" fill="#20A477" />
      <rect x="146" y="122" width="76" height="24" rx="6" fill="#EAF2FC" />
      <rect x="156" y="131" width="56" height="6" rx="3" fill="#3478C8" />
    </svg>
  );
}

export function WorkflowDiagramIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Diagram of four connected ScholarshipSaathi analysis agents"
      className={className}
    >
      {/* Connector line */}
      <path d="M90 80H550" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="6 6" />

      {/* Node 1 */}
      <rect x="24" y="32" width="128" height="96" rx="12" fill="#FFFFFF" stroke="#3478C8" strokeWidth="1.5" />
      <circle cx="52" cy="58" r="12" fill="#EAF2FC" />
      <text x="52" y="62" textAnchor="middle" fill="#173B68" fontSize="11" fontWeight="700">01</text>
      <rect x="40" y="82" width="92" height="7" rx="3.5" fill="#173B68" />
      <rect x="40" y="96" width="70" height="6" rx="3" fill="#94A3B8" />

      {/* Node 2 */}
      <rect x="178" y="32" width="128" height="96" rx="12" fill="#FFFFFF" stroke="#3478C8" strokeWidth="1.5" />
      <circle cx="206" cy="58" r="12" fill="#EAF2FC" />
      <text x="206" y="62" textAnchor="middle" fill="#173B68" fontSize="11" fontWeight="700">02</text>
      <rect x="194" y="82" width="92" height="7" rx="3.5" fill="#173B68" />
      <rect x="194" y="96" width="76" height="6" rx="3" fill="#94A3B8" />

      {/* Node 3 */}
      <rect x="332" y="32" width="128" height="96" rx="12" fill="#FFFFFF" stroke="#3478C8" strokeWidth="1.5" />
      <circle cx="360" cy="58" r="12" fill="#EAF2FC" />
      <text x="360" y="62" textAnchor="middle" fill="#173B68" fontSize="11" fontWeight="700">03</text>
      <rect x="348" y="82" width="92" height="7" rx="3.5" fill="#173B68" />
      <rect x="348" y="96" width="68" height="6" rx="3" fill="#94A3B8" />

      {/* Node 4 */}
      <rect x="486" y="32" width="130" height="96" rx="12" fill="#FFFFFF" stroke="#20A477" strokeWidth="1.5" />
      <circle cx="514" cy="58" r="12" fill="#E8F7F1" />
      <text x="514" y="62" textAnchor="middle" fill="#20A477" fontSize="11" fontWeight="700">04</text>
      <rect x="502" y="82" width="96" height="7" rx="3.5" fill="#173B68" />
      <rect x="502" y="96" width="74" height="6" rx="3" fill="#20A477" />
    </svg>
  );
}

export function SuccessRoadmapIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a completed scholarship application roadmap and certificate"
      className={className}
    >
      <rect x="12" y="12" width="256" height="176" rx="16" fill="#FFFDF7" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="44" y="36" width="144" height="128" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
      <rect x="64" y="56" width="84" height="8" rx="4" fill="#173B68" />
      <rect x="64" y="76" width="104" height="6" rx="3" fill="#94A3B8" />
      <rect x="64" y="92" width="92" height="6" rx="3" fill="#94A3B8" />
      <rect x="64" y="108" width="76" height="6" rx="3" fill="#CBD5E1" />
      <rect x="64" y="130" width="64" height="16" rx="6" fill="#E8F7F1" />
      <rect x="74" y="135" width="44" height="6" rx="3" fill="#20A477" />

      {/* Ribbon seal */}
      <circle cx="206" cy="96" r="30" fill="#E8F7F1" stroke="#20A477" strokeWidth="2" />
      <path d="M194 96L202 104L219 87" stroke="#20A477" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M194 123L188 152L206 142L224 152L218 123" fill="#3478C8" />
    </svg>
  );
}
