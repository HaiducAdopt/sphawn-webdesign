"use client";

import { useTranslations } from "next-intl";

type SiteAuditUrlFormProps = {
  url: string;
  setUrl: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  error: string;
  disabled: boolean;
};

export default function SiteAuditUrlForm({
  url,
  setUrl,
  onAnalyze,
  loading,
  error,
  disabled,
}: SiteAuditUrlFormProps) {
  const t = useTranslations("siteaudit");

  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur md:p-6">
      
      <div className="flex flex-col gap-4 md:flex-row">
        
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder={t("urlPlaceholder")}
          className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-black/30 px-5 text-white outline-none transition placeholder:text-white/35 focus:border-[#D4AF37]"
        />

        <button
          onClick={onAnalyze}
          disabled={disabled}
          className="min-h-14 rounded-2xl bg-[#D4AF37] px-8 font-semibold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t("analyzingButton") : t("analyzeButton")}
        </button>

      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-300">
          {error}
        </p>
      ) : null}

    </section>
  );
}