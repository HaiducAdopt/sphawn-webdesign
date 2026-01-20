"use client";

type Props = {
  title: string;
  description: string;
  slug: string;
};

export default function SeoPreview({
  title,
  description,
  slug,
}: Props) {
  return (
    <div className="rounded-xl bg-[#0E1628] p-5 border border-white/10">
      <p className="text-sm font-semibold text-slate-300 mb-3">
        Google Preview
      </p>

      <div className="space-y-1">
        <p className="text-blue-400 text-lg leading-tight">
          {title || "SEO title will appear here"}
        </p>

        <p className="text-green-400 text-sm">
          https://www.sphawn.nl/lab/{slug || "article-slug"}
        </p>

        <p className="text-slate-300 text-sm">
          {description ||
            "SEO description will appear here. Aim for 140–160 characters."}
        </p>
      </div>
    </div>
  );
}
