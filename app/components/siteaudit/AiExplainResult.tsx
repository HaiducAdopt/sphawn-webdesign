"use client";

import { useTranslations } from "next-intl";

export type AiExplainData = {
  summary: string;
  mainProblems: string[];
  recommendations: string[];
  priority: string;
};

type Props = {
  data: AiExplainData | null;
  loading: boolean;
};

export default function AiExplainResult({ data, loading }: Props) {
  const t = useTranslations("siteaudit");

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
      <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]">
        {t("chatgptTitle")}
      </p>

      <h2 className="mt-3 text-2xl font-semibold">
        {t("chatgptSubtitle")}
      </h2>

      {loading ? (
        <p className="mt-4 text-sm leading-6 text-white/55">
          {t("chatgptLoadingText")}
        </p>
      ) : null}

      {!loading && data ? (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl bg-black/25 p-5">
            <p className="text-sm font-semibold text-white">
              {t("summary")}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/65">
              {data.summary}
            </p>
          </div>

          <div className="rounded-2xl bg-black/25 p-5">
            <p className="text-sm font-semibold text-white">
              {t("mainProblems")}
            </p>

            <div className="mt-3 space-y-3">
              {data.mainProblems.map((item) => (
                <p key={item} className="text-sm leading-6 text-white/65">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-black/25 p-5">
            <p className="text-sm font-semibold text-white">
              {t("recommendedActions")}
            </p>

            <div className="mt-3 space-y-3">
              {data.recommendations.map((item) => (
                <p key={item} className="text-sm leading-6 text-white/65">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-5">
            <p className="text-sm font-semibold text-[#D4AF37]">
              {t("priority")}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {data.priority}
            </p>
          </div>
        </div>
      ) : null}

      {!loading && !data ? (
        <p className="mt-4 text-sm leading-6 text-white/55">
          {t("noData")}
        </p>
      ) : null}
    </div>
  );
}