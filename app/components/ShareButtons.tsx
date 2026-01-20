"use client";

type Props = {
  url: string;
  title: string;
};

export default function ShareButtons({ url, title }: Props) {
  function copyLink() {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard");
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-full text-sm font-semibold
                   bg-[#0E1628] border border-white/10
                   hover:bg-[#1877F2] transition"
      >
        👍 Facebook
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-full text-sm font-semibold
                   bg-[#0E1628] border border-white/10
                   hover:bg-[#0A66C2] transition"
      >
        💼 LinkedIn
      </a>

      {/* X */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-full text-sm font-semibold
                   bg-[#0E1628] border border-white/10
                   hover:bg-black transition"
      >
        ✖️ X
      </a>

      {/* Copy */}
      <button
        onClick={copyLink}
        className="px-4 py-2 rounded-full text-sm font-semibold
                   bg-[#0E1628] border border-white/10
                   hover:bg-[#00E1F0] hover:text-black transition"
      >
        🔗 Copy link
      </button>
    </div>
  );
}
