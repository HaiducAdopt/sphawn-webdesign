"use client";

import { FormEvent, useState } from "react";

export default function ContactClient() {
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

      setSuccessMessage(
        "Thank you! Your message has been sent. I’ll get back to you within 24 hours."
      );
      form.reset();
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Oops. Something went wrong. Please try again, or email me directly at support@sphawn.nl."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG cercuri blur */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-28 pb-24">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Let’s Build Something Amazing
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Share a few details about your project. I&apos;ll review everything
            and reply within 24 hours with next steps.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-12 space-y-5 bg-slate-900/50 border border-slate-800/70 rounded-2xl p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.9)]"
        >
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-200" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white focus:border-cyan-400 outline-none"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white focus:border-cyan-400 outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-200" htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              className="rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white focus:border-cyan-400 outline-none"
              placeholder="New website, redesign, online shop, etc."
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-200" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white focus:border-cyan-400 outline-none resize-none"
              placeholder="Tell me a bit about your project, budget and timeline."
            />
          </div>

          {/* Status messages */}
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
            className="w-full mt-2 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 py-3 text-slate-950 font-semibold shadow-lg shadow-fuchsia-500/25 hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Company details */}
        <div className="mt-10 bg-slate-900/40 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white mb-3">
            Company details
          </h2>

          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <span className="font-medium text-slate-200">Business name:</span>{" "}
              Sphawn
            </li>
            <li>
              <span className="font-medium text-slate-200">KvK number:</span>{" "}
              97594148
            </li>
            <li>
              <span className="font-medium text-slate-200">Location:</span>{" "}
              Heerlen, Limburg, Netherlands
            </li>
            <li>
              <span className="font-medium text-slate-200">Email:</span>{" "}
              <a
                href="mailto:support@sphawn.nl"
                className="text-cyan-300 hover:text-cyan-200 underline"
              >
                support@sphawn.nl
              </a>
            </li>
          </ul>
        </div>

        {/* Email direct */}
        <p className="text-center mt-8 text-slate-400 text-sm">
          Direct email?
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
