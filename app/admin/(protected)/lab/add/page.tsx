"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firestore";

import LabEditor from "@/app/components/LabEditor";
import CoverImageUploader from "@/app/components/CoverImageUploader";
import SeoPreview from "@/app/components/SeoPreview";

/* ================= TYPES ================= */

type Locale = "en" | "nl";
type Status = "draft" | "published";

type ArticleForm = {
  title: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  coverImage: string;
};

type ArticleDoc = ArticleForm & {
  id: string;
  slug: string;
  locale: Locale;
  status: Status;
};

const EMPTY_FORM: ArticleForm = {
  title: "",
  excerpt: "",
  content: "",
  seoTitle: "",
  seoDescription: "",
  coverImage: "",
};

const REQUIRED_FIELDS: (keyof ArticleForm)[] = [
  "title",
  "excerpt",
  "content",
  "seoTitle",
  "seoDescription",
  "coverImage",
];

/* ================= PAGE ================= */

export default function AddLabArticlePage() {
  const router = useRouter();

  const [slug, setSlug] = useState("");
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [articles, setArticles] = useState<
    Partial<Record<Locale, ArticleDoc>>
  >({});
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= HELPERS ================= */

  function updateField<K extends keyof ArticleForm>(
    key: K,
    value: ArticleForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function isComplete(data?: ArticleForm) {
    if (!data) return false;
    return REQUIRED_FIELDS.every((f) => Boolean(data[f]));
  }

  function canPublish() {
    return isComplete(articles.en) && isComplete(articles.nl);
  }

  async function loadArticlesBySlug(slugValue: string) {
    const q = query(
      collection(db, "labArticles"),
      where("slug", "==", slugValue)
    );

    const snap = await getDocs(q);
    const result: Partial<Record<Locale, ArticleDoc>> = {};

    snap.forEach((d) => {
      const data = d.data() as Omit<ArticleDoc, "id">;
      result[data.locale] = { id: d.id, ...data };
    });

    setArticles(result);

    if (result[activeLocale]) {
      const { id, slug, locale, status, ...rest } =
        result[activeLocale]!;
      setForm(rest);
    } else {
      setForm(EMPTY_FORM);
    }
  }

  /* ================= SAVE ================= */

  async function saveDraft() {
    setError(null);
    setLoading(true);

    try {
      if (!slug.trim()) {
        throw new Error("Slug is required.");
      }

      const existing = articles[activeLocale];

      if (existing) {
        await updateDoc(doc(db, "labArticles", existing.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "labArticles"), {
          slug,
          locale: activeLocale,
          ...form,
          status: "draft",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      await loadArticlesBySlug(slug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function publishArticle() {
    setError(null);
    setLoading(true);

    try {
      if (!canPublish()) {
        throw new Error(
          "Both EN and NL versions must be complete before publishing."
        );
      }

      await Promise.all(
        [articles.en!, articles.nl!].map((a) =>
          updateDoc(doc(db, "labArticles", a.id), {
            status: "published",
            updatedAt: serverTimestamp(),
          })
        )
      );

      router.push("/admin/lab");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-[#050B16] text-slate-100 px-10 py-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-2xl font-semibold">Article Editor</h1>
        <p className="text-sm text-slate-400 mt-1">
          Work on one language at a time. Publishing requires both EN &
          NL.
        </p>

        <input
          className="mt-6 w-full rounded-xl bg-[#121C33] px-4 py-3
                     text-slate-100 placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="article-slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onBlur={() => slug && loadArticlesBySlug(slug)}
        />
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 bg-red-100 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-[220px_1fr_320px] gap-10">
        {/* LANGUAGE SIDEBAR */}
        <div className="space-y-3">
          {(["en", "nl"] as Locale[]).map((lng) => {
            const article = articles[lng];
            const active = activeLocale === lng;

            const status = article
              ? isComplete(article)
                ? { label: "Ready", color: "text-green-400" }
                : { label: "Incomplete", color: "text-yellow-400" }
              : { label: "Missing", color: "text-red-400" };

            return (
              <button
                key={lng}
                onClick={() => {
                  setActiveLocale(lng);
                  if (article) {
                    const {
                      id,
                      slug,
                      locale,
                      status,
                      ...rest
                    } = article;
                    setForm(rest);
                  } else {
                    setForm(EMPTY_FORM);
                  }
                }}
                className={`w-full rounded-xl p-4 text-left transition
                  ${
                    active
                      ? "bg-cyan-400/20 ring-2 ring-cyan-400"
                      : "bg-[#0E1628] hover:bg-[#162244]"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {lng.toUpperCase()}
                  </span>
                  <span className={`text-sm ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {lng === "en"
                    ? "English version"
                    : "Dutch version"}
                </p>
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              updateField("title", e.target.value)
            }
            className="w-full rounded-xl bg-[#121C33] px-4 py-3 text-lg
                       text-slate-100 placeholder-slate-400
                       focus:ring-2 focus:ring-cyan-400"
          />

          <textarea
            placeholder="Excerpt"
            rows={3}
            value={form.excerpt}
            onChange={(e) =>
              updateField("excerpt", e.target.value)
            }
            className="w-full rounded-xl bg-[#121C33] px-4 py-3
                       text-slate-100 placeholder-slate-400
                       focus:ring-2 focus:ring-cyan-400"
          />

          {/* TIPTAP EDITOR */}
          <LabEditor
            value={form.content}
            onChange={(html) =>
              updateField("content", html)
            }
          />
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <CoverImageUploader
            value={form.coverImage}
            onChange={(url) =>
              updateField("coverImage", url)
            }
          />

          <div className="rounded-xl bg-[#0E1628] p-5 space-y-4">
            <p className="text-sm font-semibold text-slate-300">
              SEO Settings
            </p>

            <input
              placeholder="SEO Title"
              value={form.seoTitle}
              onChange={(e) =>
                updateField("seoTitle", e.target.value)
              }
              className="w-full rounded-lg bg-[#121C33] px-3 py-2
                         text-slate-100 placeholder-slate-400"
            />

            <textarea
              placeholder="SEO Description"
              rows={3}
              value={form.seoDescription}
              onChange={(e) =>
                updateField(
                  "seoDescription",
                  e.target.value
                )
              }
              className="w-full rounded-lg bg-[#121C33] px-3 py-2
                         text-slate-100 placeholder-slate-400"
            />
          </div>

          {/* SEO PREVIEW */}
          <SeoPreview
            title={form.seoTitle}
            description={form.seoDescription}
            slug={slug}
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mt-14">
        <button
          onClick={saveDraft}
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-[#0E1628] hover:bg-[#162244]"
        >
          Save Draft
        </button>

        <button
          onClick={publishArticle}
          disabled={loading || !canPublish()}
          className="px-8 py-3 rounded-lg bg-cyan-400 text-black
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Publish Article
        </button>
      </div>

      {/* PREVIEW */}
      <div className="max-w-4xl mx-auto mt-24 border-t border-white/10 pt-12">
        <p className="text-sm text-slate-400 mb-4">
          Article Preview (read-only)
        </p>

        {form.coverImage && (
          <img
            src={form.coverImage}
            alt="Cover"
            className="rounded-xl mb-6"
          />
        )}

        <h2 className="text-3xl font-bold mb-4">
          {form.title || "Article title"}
        </h2>

        <p className="text-slate-400 mb-8">
          {form.excerpt ||
            "Article excerpt will appear here."}
        </p>

        <div className="prose prose-invert max-w-none">
          {form.content ? (
            <div
              dangerouslySetInnerHTML={{
                __html: form.content,
              }}
            />
          ) : (
            <p className="text-slate-500">
              Article content preview…
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
