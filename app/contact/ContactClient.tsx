"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactClient() {
  const t = useTranslations("contact.page");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const subject = String(formData.get("subject") || "");
    const message = String(formData.get("message") || "");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSuccessMessage(t("form.success"));
      form.reset();
    } catch (err) {
      console.error(err);
      setErrorMessage(t("form.error"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG blur circles */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-28 pb-24">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">{t("hero.title")}</h1>
          <p className="text-slate-300 max-w-xl mx-auto">{t("hero.subtitle")}</p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-12 space-y-5 bg-slate-900/50 border border-slate-800/70 rounded-2xl p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.9)]"
        >
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-200" htmlFor="name">
              {t("form.nameLabel")}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white focus:border-cyan-400 outline-none"
              placeholder={t("form.namePlaceholder")}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-200" htmlFor="email">
              {t("form.emailLabel")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white focus:border-cyan-400 outline-none"
              placeholder={t("form.emailPlaceholder")}
            />
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-200" htmlFor="subject">
              {t("form.subjectLabel")}
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              className="rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white focus:border-cyan-400 outline-none"
              placeholder={t("form.subjectPlaceholder")}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-200" htmlFor="message">
              {t("form.messageLabel")}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white focus:border-cyan-400 outline-none resize-none"
              placeholder={t("form.messagePlaceholder")}
            />
          </div>

          {/* Messages */}
          {successMessage && (
            <p className="text-sm text-emerald-300 bg-emerald-900/30 border border-emerald-700/60 rounded-xl px-4 py-3">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-sm text-rose-300 bg-rose-900/30 border border-rose-700/60 rounded-xl px-4 py-3">
              {errorMessage}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 py-3 text-slate-950 font-semibold shadow-lg shadow-fuchsia-500/25 hover:brightness-110 transition disabled:opacity-60"
          >
            {isLoading ? t("form.buttonLoading") : t("form.button")}
          </button>
        </form>

        {/* OWNER + COMPANY DETAILS */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* OWNER */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-xl flex gap-4 items-start">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 opacity-45 blur-3xl" />
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                <img
                  src="/stefan-temp.jpg"
                  alt="Stefan – Eigenaar van Sphawn"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {t("owner.name")}
                </h3>
                <span className="text-[11px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-cyan-300/40 text-cyan-300">
                  {t("owner.badge")}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {t("owner.p1")}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t("owner.p2")}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t("owner.p3")}
              </p>
            </div>
          </div>

          {/* COMPANY */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white mb-3">
              {t("company.title")}
            </h2>

            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <span className="font-medium text-slate-200">{t("company.nameLabel")}</span>{" "}
                {t("company.nameValue")}
              </li>
              <li>
                <span className="font-medium text-slate-200">{t("company.kvkLabel")}</span>{" "}
                97594148
              </li>
              <li>
                <span className="font-medium text-slate-200">{t("company.locationLabel")}</span>{" "}
                {t("company.locationValue")}
              </li>
              <li>
                <span className="font-medium text-slate-200">{t("company.emailLabel")}</span>{" "}
                <a
                  href="mailto:support@sphawn.nl"
                  className="text-cyan-300 hover:text-cyan-200 underline"
                >
                  support@sphawn.nl
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Direct email */}
        <p className="text-center mt-8 text-slate-400 text-sm">
          {t("directEmail.text")}
          <a
            href="mailto:support@sphawn.nl"
            className="text-cyan-300 hover:text-cyan-200 underline ml-1"
          >
            support@sphawn.nl
          </a>
        </p>
      </section>
    </main>
  );
}
