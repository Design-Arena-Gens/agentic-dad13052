import { ReportAnalyzer } from "@/components/ReportAnalyzer";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-12 md:px-10 lg:px-16">
      <header className="space-y-4">
        <span className="inline-flex w-fit rounded-full border border-primary-500/50 bg-primary-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary-100">
          MedScope
        </span>
        <h1 className="text-4xl font-semibold leading-tight text-slate-50 md:text-5xl">
          Rapid insights from medical reports.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
          Paste clinical notes, discharge summaries, or lab reports to uncover
          structured vitals, care plans, and follow-up considerations. Built
          for healthcare teams who need a fast read on patient documentation.
        </p>
      </header>
      <ReportAnalyzer />
    </main>
  );
}
