"use client";

import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";

type SiteAuditUrlFormProps = {
  url: string;
  setUrl: (value: string) => void;
  competitorUrl: string;
  setCompetitorUrl: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  error: string;
  disabled: boolean;
  saveConsent: boolean;
  setSaveConsent: (value: boolean) => void;
};

export default function SiteAuditUrlForm({
  url,
  setUrl,
  competitorUrl,
  setCompetitorUrl,
  onAnalyze,
  loading,
  error,
  disabled,
  saveConsent,
  setSaveConsent,
}: SiteAuditUrlFormProps) {
  const t = useTranslations("siteaudit");
  const isComparison = competitorUrl.trim().length > 0;

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !disabled && saveConsent) {
      onAnalyze();
    }
  };

  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur md:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="block text-sm font-medium text-white/75">
            {t("yourWebsiteLabel")}
          </span>
          <input
            type="url"
            inputMode="url"
            autoComplete="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("urlPlaceholder")}
            className="min-h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-5 text-white outline-none transition placeholder:text-white/35 focus:border-[#D4AF37]"
          />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium text-white/75">
            {t("competitorWebsiteLabel")}
          </span>
          <input
            type="url"
            inputMode="url"
            value={competitorUrl}
            onChange={(event) => setCompetitorUrl(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("competitorUrlPlaceholder")}
            className="min-h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-5 text-white outline-none transition placeholder:text-white/35 focus:border-[#D4AF37]"
          />
        </label>
      </div>

      <p className="mt-3 text-sm text-white/45">{t("competitorWebsiteHint")}</p>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
        <input
          type="checkbox"
          checked={saveConsent}
          onChange={(event) => setSaveConsent(event.target.checked)}
          className="mt-1 h-4 w-4 accent-[#D4AF37]"
        />
        <span className="text-sm leading-6 text-white/65">
          {t("saveConsentLabel")}
        </span>
      </label>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={disabled || !saveConsent}
        className="mt-5 min-h-14 w-full rounded-2xl bg-[#D4AF37] px-8 font-semibold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {loading
          ? t("analyzingButton")
          : isComparison
            ? t("compareButton")
            : t("analyzeButton")}
      </button>

      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
    </section>
  );
}