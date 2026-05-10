import AuditScoreCard from "./AuditScoreCard";
import type { AiSeoResult } from "./SiteAuditPage";

type Props = {
  data: AiSeoResult;
};

export default function AiSeoAuditResult({ data }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
      
      <h2 className="text-2xl font-semibold">AI SEO Audit</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-[0.5fr_1fr]">

        {/* SCORE */}
        <AuditScoreCard title="AI Visibility" score={data.score} />

        {/* DETECTED */}
        <div className="rounded-2xl bg-black/25 p-5">
          <p className="text-sm text-white/50">What we detected</p>

          <div className="mt-4 grid gap-3 text-sm text-white/70 md:grid-cols-2">
            <p>H1 headings: {data.extracted.h1Count}</p>
            <p>H2 headings: {data.extracted.h2Count}</p>
            <p>Schema blocks: {data.extracted.schemaCount}</p>
            <p>FAQ detected: {data.extracted.faqDetected ? "Yes" : "No"}</p>
            <p>Open Graph: {data.extracted.ogDetected ? "Yes" : "No"}</p>
            <p>Canonical: {data.extracted.canonicalDetected ? "Yes" : "No"}</p>
          </div>
        </div>

      </div>

      {/* RECOMMENDATIONS */}
      {data.recommendations.length > 0 && (
        <div className="mt-6 space-y-3">
          {data.recommendations.map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-black/25 p-4 text-sm text-white/65"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}