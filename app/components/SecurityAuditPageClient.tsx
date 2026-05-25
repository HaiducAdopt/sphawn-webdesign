"use client";

import {
  useLocale,
  useTranslations,
} from "next-intl";

import {
  useState,
} from "react";

type SecurityCheck = {
  id: string;
  title: string;
  description: string;
  status: "pass" | "warning" | "fail" | "info";
  risk: "info" | "low" | "medium" | "high";
  recommendation: string;
};

type SecurityResult = {
  hostname: string;
  scannedAt: string;
  summary: {
    score: number;
    passed: number;
    warnings: number;
    failed: number;
  };
  checks: SecurityCheck[];
};

function getRiskClass(risk: SecurityCheck["risk"]) {
  if (risk === "high") return "bg-red-100 text-red-700 border-red-200";
  if (risk === "medium") return "bg-amber-100 text-amber-700 border-amber-200";
  if (risk === "low") return "bg-blue-100 text-blue-700 border-blue-200";

  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

function getStatusLabel(status: SecurityCheck["status"]) {
  if (status === "pass") return "Passed";
  if (status === "warning") return "Warning";
  if (status === "fail") return "Failed";

  return "Info";
}

export default function SecurityAuditPage() {
  const t = useTranslations(
    "securityAudit"
  );

  const locale =
    useLocale();

  const [url, setUrl] =
    useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    result,
    setResult,
  ] = useState<
    SecurityResult | null
  >(null);

  const [
    error,
    setError,
  ] = useState("");

  async function runAudit() {
    try {
      setLoading(true);

      setError("");

      setResult(null);

      const response =
        await fetch(
          "/api/security-audit",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                url,
              }
            ),
          }
        );

      const data =
        await response.json();

      if (
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Audit failed"
        );
      }

      setResult(
        data.result
      );
    } catch (
      err
    ) {
      setError(
        err instanceof
          Error
          ? err.message
          : "Unknown error"
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  async function downloadPdf() {
    if (!result)
      return;

    try {
      const response =
        await fetch(
          "/api/security-audit/pdf",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                domain:
                  result.hostname,

                summary:
                  result.summary,

                checks:
                  result.checks,

                locale,
              }
            ),
          }
        );

      if (
        !response.ok
      ) {
        throw new Error(
          "Failed to generate PDF report."
        );
      }

      const blob =
        await response.blob();

      const downloadUrl =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        downloadUrl;

      link.download =
        `sphawn-security-audit-${result.hostname}.pdf`;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        downloadUrl
      );
    } catch (
      error
    ) {
      console.error(
        error
      );

      setError(
        "Failed to generate PDF report."
      );
    }
  }
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b16] text-white">
      <div className="pointer-events-none absolute left-[-160px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#3b82f6]/30 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-140px] top-[220px] h-[460px] w-[460px] rounded-full bg-[#ccaa3e]/25 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[-180px] left-[25%] h-[420px] w-[420px] rounded-full bg-cyan-400/15 blur-[140px]" />

      <section className="relative mx-auto max-w-[1440px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
              {t("badge")}
            </p>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
              {t("heroTitle")}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              {t("heroDescription")}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                <p className="text-2xl font-bold">{t("sslTitle")}</p>
                <p className="mt-2 text-sm text-white/60">
                  {t("sslDescription")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                <p className="text-2xl font-bold">{t("headersTitle")}</p>
                <p className="mt-2 text-sm text-white/60">
                  {t("headersDescription")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                <p className="text-2xl font-bold">{t("dnsTitle")}</p>
                <p className="mt-2 text-sm text-white/60">
                  {t("dnsDescription")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <h2 className="text-2xl font-bold">{t("formTitle")}</h2>

            <p className="mt-3 text-sm leading-6 text-white/60">
              {t("formDescription")}
            </p>

            <div className="mt-6 space-y-4">
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder={t("placeholder")}
                className="w-full rounded-2xl border border-white/10 bg-white px-5 py-4 text-gray-900 outline-none transition focus:border-[#ccaa3e] focus:ring-4 focus:ring-[#ccaa3e]/20"
              />

              <button
                onClick={runAudit}
                disabled={loading || !url.trim()}
                className="w-full rounded-2xl bg-[#ccaa3e] px-6 py-4 font-semibold text-[#070b16] shadow-lg transition hover:bg-[#d9bb58] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? t("loading") : t("button")}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm font-semibold text-white">
                {t("whatYouGetTitle")}
              </p>

              <p className="mt-2 text-sm leading-6 text-white/60">
                {t("whatYouGetDescription")}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-10 rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-red-100">
            {error}
          </div>
        )}

        {result && (
          <section className="mt-16">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-8 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.25em] text-white/50">
                  {t("scoreTitle")}
                </p>

                <div className="mt-5 text-7xl font-bold text-[#ccaa3e]">
                  {result.summary.score}
                  <span className="text-3xl text-white/40">/100</span>
                </div>

                <p className="mt-5 text-white/60">
                  {t("scanResultFor")}{" "}
                  <span className="font-semibold text-white">
                    {result.hostname}
                  </span>
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-emerald-500/10 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-300">
                      {result.summary.passed}
                    </p>
                    <p className="mt-1 text-xs text-white/50">{t("passed")}</p>
                  </div>

                  <div className="rounded-2xl bg-amber-500/10 p-4 text-center">
                    <p className="text-2xl font-bold text-amber-300">
                      {result.summary.warnings}
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      {t("warnings")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-red-500/10 p-4 text-center">
                    <p className="text-2xl font-bold text-red-300">
                      {result.summary.failed}
                    </p>
                    <p className="mt-1 text-xs text-white/50">{t("failed")}</p>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-[#ccaa3e]/20 bg-[#ccaa3e]/10 p-5">
                  <p className="font-semibold text-[#f4d77b]">
                    {t("needHelpTitle")}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {t("needHelpDescription")}
                  </p>

                  <button
                    onClick={downloadPdf}
                    className="mt-5 w-full rounded-2xl bg-[#ccaa3e] px-6 py-4 font-semibold text-[#070b16] transition hover:bg-[#d9bb58]"
                  >
                    Download Security Report
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {result.checks.map((check) => (
                  <div
                    key={check.id}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-xl"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{check.title}</h3>

                        <p className="mt-2 leading-7 text-white/60">
                          {check.description}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">
                          {getStatusLabel(check.status)}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs ${getRiskClass(
                            check.risk
                          )}`}
                        >
                          {check.risk}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-black/20 p-4">
                      <p className="text-sm font-semibold text-white/80">
                        {t("recommendation")}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/55">
                        {check.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}