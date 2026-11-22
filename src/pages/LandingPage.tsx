import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Lock,
  ShieldCheck,
  Waypoints,
} from 'lucide-react';
import {
  HeroIllustration,
  WorkflowDiagramIllustration,
} from '../components/illustrations/SaathiIllustrations';
import { EligibilityBadge, ReadinessBadge } from '../components/ui/StatusBadge';
import { SAMPLE_SCENARIOS } from '../data/mockScenarios';
import { CORE_PROMISES, FOUR_AGENTS } from '../data/workflowContent';
import { PageId } from '../types/scholarship';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onNavigate: (page: PageId) => void;
  onSelectSampleScenario: (scenarioId: string) => void;
}

export function LandingPage({
  onStartAnalysis,
  onNavigate,
  onSelectSampleScenario,
}: LandingPageProps) {
  const featuredSample = SAMPLE_SCENARIOS[0];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-sm font-semibold tracking-wide text-[#3478C8]">
              ScholarshipSaathi · Source-Aware Eligibility &amp; Readiness Guide
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-[#173B68] sm:text-4xl lg:text-[44px]">
              Find your opportunity. Understand your eligibility. Prepare with confidence.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Your AI-powered companion for understanding scholarships, checking eligibility,
              and preparing your application roadmap.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onStartAnalysis}
                className="inline-flex items-center gap-2 rounded-lg bg-[#3478C8] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#173B68]"
              >
                Analyse a Scholarship
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#173B68] transition-colors hover:bg-slate-50"
              >
                How It Works
              </button>
            </div>
            <p className="text-xs text-slate-500">
              No login required · Session-based privacy · Eligibility and document readiness evaluated separately
            </p>
          </div>

          <div className="lg:col-span-6">
            <HeroIllustration className="mx-auto w-full max-w-lg" />
          </div>
        </div>
      </section>

      {/* Three-step explanation */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-[#173B68] sm:text-3xl">
            From confusing scholarship notices to a clear roadmap in three steps
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Provide only the scholarship details and relevant profile facts. Every answer stays tied to the source you supply.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="font-mono text-xs font-medium text-[#3478C8]">01</p>
            <h3 className="mt-2 font-display text-lg font-bold text-[#173B68]">
              Supply the scholarship source
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Paste scholarship eligibility text, attach a supported document, or add a reference URL. ScholarshipSaathi treats your supplied source as evidence.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="font-mono text-xs font-medium text-[#3478C8]">02</p>
            <h3 className="mt-2 font-display text-lg font-bold text-[#173B68]">
              Share relevant student details
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Complete a short, guided profile covering education, conditional financial criteria, and which documents you currently hold.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="font-mono text-xs font-medium text-[#3478C8]">03</p>
            <h3 className="mt-2 font-display text-lg font-bold text-[#173B68]">
              Review eligibility &amp; follow your roadmap
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              See your eligibility separately from document readiness, identify missing certificates early, and follow step-by-step preparation actions.
            </p>
          </div>
        </div>
      </section>

      {/* Feature / Business Rule Highlights */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-[#173B68] sm:text-3xl">
              Built for accuracy and student trust
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              Generic AI chats often guess deadlines or confuse missing paperwork with ineligibility. ScholarshipSaathi enforces strict verification rules.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {CORE_PROMISES.map((item, idx) => {
              const Icons = [Waypoints, FileSearch, ShieldCheck, Lock];
              const Icon = Icons[idx];
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-xl border border-slate-100 bg-[#F8FAFC] p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EAF2FC] text-[#173B68]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-[#173B68]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Four-Agent Workflow Explanation */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-[#173B68] sm:text-3xl">
            Four specialized CrewAI agents behind every review
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Your analysis passes through four sequential roles so criteria extraction, eligibility matching, planning, and quality control remain transparent.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <WorkflowDiagramIllustration className="mx-auto w-full max-w-3xl" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FOUR_AGENTS.map((agent) => (
              <div key={agent.stepNumber} className="space-y-2 border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-[#3478C8]">
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
        </div>
      </section>

      {/* Example Results Preview */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-semibold tracking-wide text-[#3478C8]">
              Example Results Preview · Fictional Scenario
            </p>
            <h2 className="font-display text-2xl font-bold text-[#173B68]">
              See how Eligibility and Readiness appear together
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              In Test Case A (Rahul Kumar), the student satisfies every merit and income criterion, yet is missing an Income Certificate and Institution ID. ScholarshipSaathi marks him <strong>Eligible</strong> while flagging readiness as <strong>Incomplete</strong>.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {SAMPLE_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => onSelectSampleScenario(scenario.id)}
                  className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold text-[#173B68] hover:border-[#3478C8] hover:bg-[#EAF2FC] transition-colors"
                >
                  Open {scenario.caseCode}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs text-slate-500">
                  {featuredSample.caseCode} · {featuredSample.studentSummary}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold text-[#173B68]">
                  {featuredSample.result.scholarship_name}
                </h3>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500">Eligibility Status</p>
                <div className="mt-2">
                  <EligibilityBadge status={featuredSample.result.eligibility_status} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Meets academic score (82% vs 75% min) and income threshold.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500">Application Readiness</p>
                <div className="mt-2">
                  <ReadinessBadge status={featuredSample.result.application_readiness} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  2 mandatory documents reported missing before submission.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Deadline: {featuredSample.result.deadline}</span>
              <button
                type="button"
                onClick={() => onSelectSampleScenario(featuredSample.id)}
                className="font-semibold text-[#3478C8] hover:text-[#173B68]"
              >
                Inspect full dashboard &amp; roadmap →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Trust + Final CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl bg-[#173B68] p-8 text-white sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Ready to check your scholarship fit with clarity?
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-[#EAF2FC] sm:text-base">
                Your form data stays inside your browser session until you confirm and submit. No account creation, no automatic submissions, and clear labels on every recommendation.
              </p>
              <div className="flex flex-wrap gap-6 pt-1 text-xs text-[#EAF2FC]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#20A477]" />
                  No mandatory login
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#20A477]" />
                  Source-grounded facts
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#20A477]" />
                  Clear document checklist
                </span>
              </div>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <button
                type="button"
                onClick={onStartAnalysis}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-[#173B68] transition-colors hover:bg-[#EAF2FC]"
              >
                Analyse a Scholarship
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
