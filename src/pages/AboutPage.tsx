import React from 'react';
import { ArrowRight, Lock, ShieldAlert, Workflow } from 'lucide-react';
import { WorkflowDiagramIllustration } from '../components/illustrations/SaathiIllustrations';
import { FOUR_AGENTS } from '../data/workflowContent';

interface AboutPageProps {
  onStartAnalysis: () => void;
}

export function AboutPage({ onStartAnalysis }: AboutPageProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-12">
      <section className="space-y-4">
        <p className="text-xs font-semibold text-[#3478C8]">
          About ScholarshipSaathi
        </p>
        <h1 className="font-display text-3xl font-bold text-[#173B68] sm:text-4xl">
          How ScholarshipSaathi works
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Scholarship announcements are often dense, scattered across circulars, and unclear about what disqualifies an applicant versus what paperwork can still be arranged before submission. ScholarshipSaathi structures that process into a clear, source-aware workflow.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-[#3478C8]" />
          <h2 className="font-display text-xl font-bold text-[#173B68]">
            The four-agent CrewAI workflow
          </h2>
        </div>
        <WorkflowDiagramIllustration className="w-full" />
        <div className="grid gap-5 sm:grid-cols-2">
          {FOUR_AGENTS.map((agent) => (
            <div
              key={agent.stepNumber}
              className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 space-y-1.5"
            >
              <p className="text-xs font-semibold text-[#3478C8]">
                {agent.stepNumber} · {agent.role}
              </p>
              <h3 className="font-display text-base font-bold text-[#173B68]">
                {agent.name}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {agent.responsibility}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h2 className="font-display text-lg font-bold text-[#173B68]">
            Eligibility vs. Application Readiness
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            <strong>Eligibility</strong> depends strictly on whether your academic, demographic, and financial background meets the scholarship’s stated criteria.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            <strong>Application Readiness</strong> tracks whether you currently hold the required certificates and documents. Missing a document makes your application <em>Incomplete</em>, not <em>Not Eligible</em>.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h2 className="font-display text-lg font-bold text-[#173B68]">
            Source Verification Rules
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            ScholarshipSaathi treats only the text or document you supply as evidence. It distinguishes facts found in your source from general preparation guidance, and never invents missing deadlines or portal URLs.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            Reporting that you possess a document records your self-report; ScholarshipSaathi does not inspect or authenticate document contents.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#20A477]" />
            <h2 className="font-display text-lg font-bold text-[#173B68]">
              Privacy &amp; Data Handling
            </h2>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>No account creation or mandatory login is required.</li>
            <li>Draft inputs remain in your browser session storage and can be cleared anytime.</li>
            <li>Data is transmitted only after you confirm accuracy and click Start AI Analysis.</li>
            <li>Sensitive student financial details are not stored in a permanent database or application logs.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#D99A34]" />
            <h2 className="font-display text-lg font-bold text-[#173B68]">
              AI Limitations &amp; Disclaimer
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            AI analysis can miss nuances if the supplied scholarship notice is incomplete or ambiguous. ScholarshipSaathi does not automatically submit applications and is not an official scholarship authority.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            You remain responsible for confirming final rules, deadlines, and portals directly with the scholarship provider.
          </p>
        </div>
      </section>

      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onStartAnalysis}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3478C8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#173B68]"
        >
          Analyse a Scholarship
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
