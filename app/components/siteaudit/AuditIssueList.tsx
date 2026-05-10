type AuditIssue = {
  title: string;
  description: string;
  score: number | null;
  displayValue: string | null;
};

type AuditIssueListProps = {
  issues: AuditIssue[];
};

function cleanDescription(description: string) {
  return description.replace(/<[^>]*>/g, "");
}

export default function AuditIssueList({ issues }: AuditIssueListProps) {
  if (issues.length === 0) {
    return (
      <p className="mt-6 rounded-2xl bg-black/25 p-5 text-sm text-white/60">
        No major speed issues detected.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {issues.map((issue) => (
        <div key={issue.title} className="rounded-2xl bg-black/25 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h3 className="font-semibold text-white">{issue.title}</h3>

            {issue.displayValue ? (
              <span className="text-sm text-[#D4AF37]">
                {issue.displayValue}
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm leading-6 text-white/55">
            {cleanDescription(issue.description)}
          </p>
        </div>
      ))}
    </div>
  );
}