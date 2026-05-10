type AuditScoreCardProps = {
  title: string;
  score: number;
};

function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs improvement";
  return "Poor";
}

export default function AuditScoreCard({ title, score }: AuditScoreCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
      <p className="text-sm text-white/60">{title}</p>

      <div className="mt-4 flex items-end justify-between gap-4">
        <span className="text-5xl font-semibold tracking-tight text-white">
          {score}
        </span>

        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}