import AuditScoreCard from "./AuditScoreCard";
import AuditMetricCard from "./AuditMetricCard";
import AuditIssueList from "./AuditIssueList";
import type { SpeedResult } from "./SiteAuditPage";

type Props = {
  data: SpeedResult;
};

export default function SpeedAuditResult({ data }: Props) {
  return (
    <>
      {/* SCORE CARDS */}
      <div className="grid gap-4 md:grid-cols-4">
        <AuditScoreCard title="Performance" score={data.scores.performance} />
        <AuditScoreCard title="SEO" score={data.scores.seo} />
        <AuditScoreCard title="Accessibility" score={data.scores.accessibility} />
        <AuditScoreCard title="Best Practices" score={data.scores.bestPractices} />
      </div>

      {/* CORE WEB VITALS */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
        <h2 className="text-2xl font-semibold">Core Web Vitals</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          <AuditMetricCard label="FCP" value={data.metrics.fcp} />
          <AuditMetricCard label="LCP" value={data.metrics.lcp} />
          <AuditMetricCard label="CLS" value={data.metrics.cls} />
          <AuditMetricCard label="TBT" value={data.metrics.tbt} />
          <AuditMetricCard label="Speed Index" value={data.metrics.speedIndex} />
        </div>
      </div>

      {/* ISSUES */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
        <h2 className="text-2xl font-semibold">Speed recommendations</h2>

        <AuditIssueList issues={data.issues} />
      </div>
    </>
  );
}