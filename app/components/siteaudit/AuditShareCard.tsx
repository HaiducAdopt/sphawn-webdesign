"use client";

type Props = {
  domain: string;
  speedScore: number;
  aiScore: number;
};

function getLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs improvement";
  return "Poor";
}

export default function AuditShareCard({ domain, speedScore, aiScore }: Props) {
  const safeDomain = domain || "yourwebsite.com";

  const imageUrl = `/api/siteaudit/og?domain=${encodeURIComponent(
    safeDomain
  )}&speed=${speedScore}&ai=${aiScore}`;

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
    <div className="rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/20 to-white/[0.04] p-6 shadow-2xl">
      <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]">
        Share card
      </p>

      <div className="mt-6 rounded-3xl bg-[#090C15] p-6 shadow-2xl">
        <p className="text-sm text-white/45">Website audit for</p>

        <h3 className="mt-2 break-words text-3xl font-semibold">{safeDomain}</h3>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/[0.06] p-4">
            <p className="text-xs text-white/40">Speed</p>
            <p className="mt-2 text-3xl font-semibold">{speedScore}</p>
          </div>

          <div className="rounded-2xl bg-white/[0.06] p-4">
            <p className="text-xs text-white/40">AI SEO</p>
            <p className="mt-2 text-3xl font-semibold">{aiScore}</p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-6 text-white/55">
          {safeDomain} has a {getLabel(speedScore).toLowerCase()} performance score
          and a {getLabel(aiScore).toLowerCase()} AI visibility score.
        </p>

        <div className="mt-6 border-t border-white/10 pt-4 text-sm text-white/45">
          Audit by Sphawn.nl
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <button
          onClick={downloadImage}
          className="w-full rounded-2xl bg-white px-5 py-4 font-semibold text-black transition hover:bg-[#D4AF37]"
        >
          Download share image
        </button>

        <button
          onClick={copyImageLink}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 font-semibold text-white transition hover:bg-white hover:text-black"
        >
          Copy image link
        </button>
      </div>
    </div>
  );
}