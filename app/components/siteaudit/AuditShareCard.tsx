"use client";

type Props = {
  domain: string;
  speedScore: number;
  seoScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  aiScore: number;
  fcp?: string;
  lcp?: string;
  cls?: string;
  tbt?: string;
  speedIndex?: string;
};

function getLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs improvement";
  return "Poor";
}

function getAverageScore(scores: number[]) {
  const validScores = scores.filter((score) => Number.isFinite(score));

  if (validScores.length === 0) {
    return 0;
  }

  const total = validScores.reduce((sum, score) => sum + score, 0);

  return Math.round(total / validScores.length);
}

export default function AuditShareCard({
  domain,
  speedScore,
  seoScore,
  accessibilityScore,
  bestPracticesScore,
  aiScore,
  fcp,
  lcp,
  cls,
  tbt,
  speedIndex,
}: Props) {
  const safeDomain = domain || "yourwebsite.com";

  const overallScore = getAverageScore([
    speedScore,
    seoScore,
    accessibilityScore,
    bestPracticesScore,
    aiScore,
  ]);

  const imageUrl =
    `/api/siteaudit/og?domain=${encodeURIComponent(safeDomain)}` +
    `&overall=${overallScore}` +
    `&speed=${speedScore}` +
    `&seo=${seoScore}` +
    `&accessibility=${accessibilityScore}` +
    `&bestPractices=${bestPracticesScore}` +
    `&ai=${aiScore}` +
    `&fcp=${encodeURIComponent(fcp || "-")}` +
    `&lcp=${encodeURIComponent(lcp || "-")}` +
    `&cls=${encodeURIComponent(cls || "-")}` +
    `&tbt=${encodeURIComponent(tbt || "-")}` +
    `&speedIndex=${encodeURIComponent(speedIndex || "-")}`;

  async function copyImageLink() {
    await navigator.clipboard.writeText(`${window.location.origin}${imageUrl}`);
  }

  async function downloadImage() {
    const absoluteImageUrl = `${window.location.origin}${imageUrl}`;
    const response = await fetch(absoluteImageUrl);

    if (!response.ok) {
      throw new Error("Could not generate share image.");
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `sphawn-siteaudit-${safeDomain}.png`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(objectUrl);
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/15 to-white/[0.04] p-4 shadow-2xl sm:p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] sm:text-sm">
        Share card
      </p>

      <div className="mt-5 w-full min-w-0 overflow-hidden rounded-3xl bg-[#090C15] p-5 shadow-2xl sm:mt-6 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-white/45">Website audit for</p>

            <h3 className="mt-2 break-words text-2xl font-semibold leading-tight sm:text-3xl">
              {safeDomain}
            </h3>
          </div>

          <div className="shrink-0 rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37]">
              Overall
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {overallScore}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/[0.06] p-4">
            <p className="text-xs text-white/40">Speed</p>
            <p className="mt-2 text-3xl font-semibold">{speedScore}</p>
          </div>

          <div className="rounded-2xl bg-white/[0.06] p-4">
            <p className="text-xs text-white/40">SEO</p>
            <p className="mt-2 text-3xl font-semibold">{seoScore}</p>
          </div>

          <div className="rounded-2xl bg-white/[0.06] p-4">
            <p className="text-xs text-white/40">Accessibility</p>
            <p className="mt-2 text-3xl font-semibold">
              {accessibilityScore}
            </p>
          </div>

          <div className="rounded-2xl bg-white/[0.06] p-4">
            <p className="text-xs text-white/40">AI Visibility</p>
            <p className="mt-2 text-3xl font-semibold">{aiScore}</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-white/[0.06] p-4">
          <p className="text-xs text-white/40">Best Practices</p>
          <p className="mt-2 text-3xl font-semibold">{bestPracticesScore}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/35">
              FCP
            </p>
            <p className="mt-2 font-semibold text-white">{fcp || "-"}</p>
          </div>

          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/35">
              LCP
            </p>
            <p className="mt-2 font-semibold text-white">{lcp || "-"}</p>
          </div>

          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/35">
              CLS
            </p>
            <p className="mt-2 font-semibold text-white">{cls || "-"}</p>
          </div>

          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/35">
              TBT
            </p>
            <p className="mt-2 font-semibold text-white">{tbt || "-"}</p>
          </div>

          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/35">
              Speed Index
            </p>
            <p className="mt-2 font-semibold text-white">
              {speedIndex || "-"}
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-6 text-white/55">
          {safeDomain} has a {getLabel(speedScore).toLowerCase()} performance
          score, a {getLabel(seoScore).toLowerCase()} SEO score and a{" "}
          {getLabel(aiScore).toLowerCase()} AI visibility score.
        </p>

        <div className="mt-6 border-t border-white/10 pt-4 text-sm text-white/45">
          Generated with Sphawn SiteAudit · sphawn.nl/siteaudit
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          onClick={downloadImage}
          className="w-full rounded-2xl bg-white px-5 py-4 font-semibold text-black transition hover:bg-[#D4AF37]"
        >
          Download share image
        </button>

        <button
          type="button"
          onClick={copyImageLink}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 font-semibold text-white transition hover:bg-white hover:text-black"
        >
          Copy image link
        </button>
      </div>
    </div>
  );
}