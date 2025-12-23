// app/components/OffersIntelligentForm.tsx
"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type WebsiteType = "Next.js" | "WordPress";

export default function OffersIntelligentForm() {
  const t = useTranslations("offersForm");

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>("");

  const [websiteType, setWebsiteType] = useState<WebsiteType>("Next.js");

  const [companyName, setCompanyName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [industry, setIndustry] = useState("");
  const [menuItems, setMenuItems] = useState("Home, Services, About, Contact");
  const [goals, setGoals] = useState("");
  const [brandStyle, setBrandStyle] = useState("");
  const [budget, setBudget] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);

  const canSubmit = useMemo(() => {
    return (
      companyName.trim().length >= 2 &&
      contactName.trim().length >= 2 &&
      email.includes("@")
    );
  }, [companyName, contactName, email]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const fd = new FormData();

      fd.append("websiteType", websiteType);
      fd.append("companyName", companyName);
      fd.append("slogan", slogan);
      fd.append("industry", industry);
      fd.append("menuItems", menuItems);
      fd.append("goals", goals);
      fd.append("brandStyle", brandStyle);
      fd.append("budget", budget);
      fd.append("contactName", contactName);
      fd.append("email", email);

      if (logoFile) fd.append("logoFile", logoFile);
      if (heroFile) fd.append("heroFile", heroFile);

      const res = await fetch("/api/offers", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || t("errors.generic"));
      }

      setDone(true);
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : t("errors.generic");
      setError(msg || t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-700/60 bg-emerald-900/30 p-6 text-center">
        <h3 className="text-lg font-semibold text-emerald-300">
          {t("successTitle")}
        </h3>
        <p className="mt-2 text-sm text-slate-100">{t("successText")}</p>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400 placeholder:text-white/70 placeholder:italic";

  const textareaBase =
    "w-full rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400 resize-none placeholder:text-white/70 placeholder:italic";

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      {/* SECTION: Website type */}
      <div className="grid gap-3 sm:grid-cols-2">
        <TypeCard
          active={websiteType === "Next.js"}
          title={t("type.nextTitle")}
          desc={t("type.nextDesc")}
          onClick={() => setWebsiteType("Next.js")}
        />
        <TypeCard
          active={websiteType === "WordPress"}
          title={t("type.wpTitle")}
          desc={t("type.wpDesc")}
          onClick={() => setWebsiteType("WordPress")}
        />
      </div>

      {/* SECTION: Company info */}
      <Section title={t("sections.companyTitle")} subtitle={t("sections.companySubtitle")}>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label={t("fields.companyNameLabel")}>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className={inputBase}
              placeholder={t("fields.companyNamePh")}
            />
          </Field>

          <Field label={t("fields.sloganLabel")}>
            <input
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className={inputBase}
              placeholder={t("fields.sloganPh")}
            />
          </Field>

          <Field label={t("fields.industryLabel")}>
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className={inputBase}
              placeholder={t("fields.industryPh")}
            />
          </Field>

          <Field label={t("fields.budgetLabel")}>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={inputBase}
            >
              <option value="">{t("fields.budgetPlaceholder")}</option>
              <option value="350-1000">{t("budgetOptions.b350_1000")}</option>
              <option value="1000-2000">{t("budgetOptions.b1000_2000")}</option>
              <option value="2000+">{t("budgetOptions.b2000_plus")}</option>
              <option value="not-sure-yet">{t("budgetOptions.notSure")}</option>
            </select>
          </Field>

          <div className="md:col-span-2">
            <Field label={t("fields.menuItemsLabel")}>
              <input
                value={menuItems}
                onChange={(e) => setMenuItems(e.target.value)}
                className={inputBase}
                placeholder={t("fields.menuItemsPh")}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label={t("fields.goalsLabel")}>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={3}
                className={textareaBase}
                placeholder={t("fields.goalsPh")}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label={t("fields.brandStyleLabel")}>
              <textarea
                value={brandStyle}
                onChange={(e) => setBrandStyle(e.target.value)}
                rows={3}
                className={textareaBase}
                placeholder={t("fields.brandStylePh")}
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* SECTION: Assets */}
      <Section title={t("sections.assetsTitle")} subtitle={t("sections.assetsSubtitle")}>
        <div className="grid gap-6 md:grid-cols-2">
          <FileField
            label={t("fields.logoLabel")}
            hint={t("fields.logoHint")}
            onPick={(f) => setLogoFile(f)}
          />
          <FileField
            label={t("fields.heroLabel")}
            hint={t("fields.heroHint")}
            onPick={(f) => setHeroFile(f)}
          />
        </div>
      </Section>

      {/* SECTION: Contact */}
      <Section title={t("sections.contactTitle")} subtitle={t("sections.contactSubtitle")}>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label={t("fields.contactNameLabel")}>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              className={inputBase}
              placeholder={t("fields.contactNamePh")}
            />
          </Field>

          <Field label={t("fields.emailLabel")}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className={inputBase}
              placeholder={t("fields.emailPh")}
            />
          </Field>
        </div>

        {error && (
          <div className="mt-4">
            <p className="text-sm text-rose-300 bg-rose-900/30 border border-rose-700/60 rounded-xl px-4 py-3">
              {error}
            </p>
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 py-3 text-slate-950 font-semibold shadow-lg shadow-fuchsia-500/25 hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? t("sending") : t("send")}
          </button>

          <p className="mt-3 text-xs text-slate-400 text-center">
            {t("limitedOffer")}
          </p>
        </div>
      </Section>
    </form>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-white/60 italic">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function TypeCard({
  active,
  title,
  desc,
  onClick,
}: {
  active: boolean;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-5 py-4 text-left transition ${
        active
          ? "border-cyan-400/70 bg-slate-950/40"
          : "border-slate-700/70 bg-slate-950/20 hover:border-slate-600"
      }`}
    >
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-white/60 italic">{desc}</p>
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-white/90">{label}</label>
      {children}
    </div>
  );
}

function FileField({
  label,
  hint,
  onPick,
}: {
  label: string;
  hint: string;
  onPick: (file: File | null) => void;
}) {
  const t = useTranslations("offersForm");
  const [fileName, setFileName] = useState<string>("");
  const inputId = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-white/90">{label}</label>

      <div className="rounded-2xl border border-slate-700 bg-[#0F233E] p-4">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            onPick(f);
            setFileName(f?.name ?? "");
          }}
        />

        <div className="flex items-center gap-3">
          <label
            htmlFor={inputId}
            className="inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-full bg-slate-900/70 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900/90 active:scale-[0.98]"
          >
            <span className="text-base leading-none">+</span>
            {t("upload.choose")}
          </label>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-white">
              {fileName ? fileName : t("upload.noneSelected")}
            </p>
            <p className="mt-1 text-[11px] text-white/60 italic">{hint}</p>
          </div>

          {fileName && (
            <button
              type="button"
              onClick={() => {
                onPick(null);
                setFileName("");
                const el = document.getElementById(
                  inputId
                ) as HTMLInputElement | null;
                if (el) el.value = "";
              }}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10 active:scale-[0.98]"
            >
              {t("upload.clear")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
