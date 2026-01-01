"use client";

import { useMemo, useState } from "react";
import classNames from "classnames";
import { analyzeReport, AnalysisResult } from "@/lib/analysis";

const SAMPLE_REPORT = `Patient: Jane Doe (DOB 1980-04-12)
Visit Date: 2024-04-18

Chief Complaint:
- Persistent fatigue and intermittent headaches for 3 weeks.

History:
- Hypertension diagnosed 2015, currently on amlodipine 5 mg daily.
- Type 2 diabetes mellitus diagnosed 2019, on metformin 1000 mg twice daily.
- Denies tobacco use; occasional alcohol.

Vitals:
- Blood pressure 142/88 mmHg sitting.
- Heart rate 78 bpm, respiratory rate 16, SpO2 98% on room air.
- BMI 29.4 kg/m².

Labs (2024-04-10):
- Hemoglobin A1c 7.4%.
- Fasting glucose 146 mg/dL.
- Total cholesterol 212 mg/dL (LDL 138 mg/dL, HDL 42 mg/dL, triglycerides 188 mg/dL).
- Serum creatinine 1.1 mg/dL, eGFR 68 mL/min/1.73m².

Medications:
- Amlodipine 5 mg daily.
- Metformin 1000 mg twice daily.
- Atorvastatin 20 mg nightly.

Allergies: Penicillin (rash).

Assessment:
- Essential hypertension with suboptimal control.
- Type 2 diabetes with elevated A1c.
- Hyperlipidemia not at LDL goal.

Plan:
- Increase amlodipine to 10 mg daily.
- Continue metformin; reinforce diet/exercise.
- Add lisinopril 5 mg daily for renal protection.
- Lifestyle: DASH diet, target 150 minutes/week moderate activity.
- Follow-up in 6 weeks with repeat labs.
`;

interface InputState {
  raw: string;
  touched: boolean;
}

export function ReportAnalyzer() {
  const [input, setInput] = useState<InputState>({
    raw: "",
    touched: false
  });

  const analysis: AnalysisResult = useMemo(
    () => analyzeReport(input.raw),
    [input.raw]
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <section className="w-full lg:w-1/2">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-100">
            Medical Report
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm transition hover:border-primary-400 hover:text-primary-100"
              onClick={() =>
                setInput({
                  raw: SAMPLE_REPORT,
                  touched: true
                })
              }
            >
              Load sample
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm transition hover:border-primary-400 hover:text-primary-100"
              onClick={() =>
                setInput({
                  raw: "",
                  touched: true
                })
              }
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          className="h-[540px] w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 font-mono text-sm leading-relaxed text-slate-100 outline-none shadow-2xl shadow-slate-950 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/20"
          placeholder="Paste the text contents of a medical report here..."
          value={input.raw}
          onChange={(event) =>
            setInput({
              raw: event.target.value,
              touched: true
            })
          }
        />
        {!input.raw && input.touched && (
          <p className="mt-2 text-sm text-slate-400">
            Paste text from a PDF or EMR export to generate structured insights.
          </p>
        )}
      </section>

      <section className="w-full lg:w-1/2">
        <div className="gradient-border rounded-2xl">
          <div className="rounded-[22px] bg-slate-900/80 p-6 backdrop-blur">
            <header className="mb-4">
              <h2 className="text-lg font-semibold text-slate-100">
                Structured Insights
              </h2>
              <p className="text-sm text-slate-400">
                Automatically highlights vitals, sections, and possible follow-up
                needs from unstructured reports.
              </p>
            </header>

            <div className="flex flex-col gap-5">
              <MetricGrid metrics={analysis.metrics} />
              <SectionsList sections={analysis.sections} />
              <InsightList
                items={analysis.flags}
                title="Attention"
                empty="No high-priority flags detected."
                tone="warning"
              />
              <InsightList
                items={analysis.recommendations}
                title="Suggested follow-up"
                empty="No additional suggestions automatically generated."
                tone="info"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricGrid({ metrics }: { metrics: AnalysisResult["metrics"] }) {
  if (metrics.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-6 text-sm text-slate-400">
        No vitals or lab metrics detected yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className={classNames(
            "rounded-xl border p-4 transition",
            metric.status === "elevated" && "border-red-500/60 bg-red-500/10",
            metric.status === "low" && "border-amber-400/60 bg-amber-400/10",
            metric.status === "normal" &&
              "border-emerald-500/40 bg-emerald-500/10"
          )}
        >
          <p className="text-sm uppercase tracking-wide text-slate-300">
            {metric.label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {metric.value}
          </p>
          <span
            className={classNames(
              "mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
              metric.status === "elevated" && "bg-red-500/20 text-red-200",
              metric.status === "low" && "bg-amber-500/20 text-amber-100",
              metric.status === "normal" && "bg-emerald-500/20 text-emerald-100"
            )}
          >
            {metric.status}
          </span>
          {metric.details && (
            <p className="mt-2 text-xs text-slate-300">{metric.details}</p>
          )}
        </article>
      ))}
    </div>
  );
}

function SectionsList({
  sections
}: {
  sections: AnalysisResult["sections"];
}) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <article
          key={section.title}
          className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-200">
            {section.title}
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-slate-200">
            {section.bullets.map((bullet, index) => (
              <li key={`${section.title}-${index}`} className="leading-relaxed">
                • {bullet}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function InsightList({
  items,
  title,
  empty,
  tone
}: {
  items: string[];
  title: string;
  empty: string;
  tone: "warning" | "info";
}) {
  const toneClasses =
    tone === "warning"
      ? "border-red-500/60 bg-red-500/10 text-red-100"
      : "border-primary-500/60 bg-primary-500/10 text-primary-50";

  return (
    <article
      className={classNames(
        "rounded-xl border p-4 text-sm leading-relaxed",
        items.length === 0 && "border-dashed border-slate-700 bg-transparent",
        items.length > 0 && toneClasses
      )}
    >
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-200">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-slate-300">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
