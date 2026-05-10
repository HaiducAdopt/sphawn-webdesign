type Props = {
  speedScore: number;
  issues: {
    title: string;
  }[];
};

function getSummary(score: number) {
  if (score >= 90) return "Your website is fast and well optimized.";
  if (score >= 70) return "Your website performs well but can be improved.";
  if (score >= 50) return "Your website has performance issues that affect user experience.";
  return "Your website is slow and needs optimization.";
}

function mapIssueToHuman(issue: string) {
  const text = issue.toLowerCase();

  if (text.includes("image"))
    return "Your images are not optimized and load too slowly.";
  if (text.includes("javascript"))
    return "Too much JavaScript is loaded, slowing down the website.";
  if (text.includes("render"))
    return "Some files block the page from loading quickly.";
  if (text.includes("server"))
    return "Your server responds too slowly.";
  if (text.includes("compression"))
    return "Your files are not compressed efficiently.";

  return "There are technical issues affecting performance.";
}

function mapFix(issue: string) {
  const text = issue.toLowerCase();

  if (text.includes("image"))
    return "Convert images to WebP and reduce their size.";
  if (text.includes("javascript"))
    return "Remove unused JavaScript and reduce script size.";
  if (text.includes("render"))
    return "Defer non-critical CSS and JavaScript.";
  if (text.includes("server"))
    return "Improve hosting or server response time.";
  if (text.includes("compression"))
    return "Enable Gzip or Brotli compression.";

  return "Review and optimize this issue.";
}

export default function AuditExplain({ speedScore, issues }: Props) {
  const uniqueIssues = issues.slice(0, 3);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
      
      <h2 className="text-2xl font-semibold">AI Explanation</h2>

      <p className="mt-4 text-white/70 leading-7">
        {getSummary(speedScore)}
      </p>

      {/* WHY */}
      <div className="mt-6">
        <p className="text-sm uppercase tracking-[0.2em] text-[#D4AF37]">
          Why this happens
        </p>

        <ul className="mt-4 space-y-3 text-white/70 text-sm">
          {uniqueIssues.map((issue) => (
            <li key={issue.title}>
              • {mapIssueToHuman(issue.title)}
            </li>
          ))}
        </ul>
      </div>

      {/* FIX */}
      <div className="mt-6">
        <p className="text-sm uppercase tracking-[0.2em] text-[#D4AF37]">
          What you should do
        </p>

        <ul className="mt-4 space-y-3 text-white/70 text-sm">
          {uniqueIssues.map((issue) => (
            <li key={issue.title}>
              • {mapFix(issue.title)}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}