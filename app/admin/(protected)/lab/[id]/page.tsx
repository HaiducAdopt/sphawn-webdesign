"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firestore";
import { useParams, useRouter } from "next/navigation";
import LabEditor from "@/app/components/LabEditor";
import CoverImageUploader from "@/app/components/CoverImageUploader";

type LabArticle = {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
  locale: "en" | "nl";
  coverImage?: string;
};

export default function AdminLabEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [article, setArticle] = useState<LabArticle | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      const ref = doc(db, "labArticles", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        router.push("/admin/lab");
        return;
      }

      const data = snap.data() as Partial<LabArticle>;

      setArticle({
        title: data.title || "",
        content: data.content || "",
        excerpt: data.excerpt || "",
        slug: data.slug || "",
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        status: (data.status as "draft" | "published") || "draft",
        locale: data.locale as "en" | "nl",
        coverImage: data.coverImage || "",
      });

      setContent(data.content || "");
      setLoading(false);
    }

    fetchArticle();
  }, [id, router]);

  async function handleSave() {
    if (!article) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, "labArticles", id), {
        ...article,
        content,
        updatedAt: serverTimestamp(),
      });

      alert("Saved successfully");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !article) {
    return (
      <main className="p-10 text-white">
        Loading article...
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-10 text-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">
          Edit Article ({article.locale.toUpperCase()})
        </h1>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#00E1F0] text-black px-4 py-2 rounded font-medium hover:brightness-110"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* COVER IMAGE */}
      <div className="mb-10">
        <CoverImageUploader
          value={article.coverImage}
          onChange={(url) =>
            setArticle({ ...article, coverImage: url })
          }
        />
      </div>

      {/* TITLE */}
      <div className="mb-6">
        <label className="block mb-2 text-sm text-gray-400">
          Title
        </label>
        <input
          value={article.title}
          onChange={(e) =>
            setArticle({ ...article, title: e.target.value })
          }
          className="w-full px-4 py-2 rounded bg-[#111827] border border-white/10"
        />
      </div>

      {/* STATUS */}
      <div className="mb-6">
        <label className="block mb-2 text-sm text-gray-400">
          Status
        </label>
        <select
          value={article.status}
          onChange={(e) =>
            setArticle({
              ...article,
              status: e.target.value as "draft" | "published",
            })
          }
          className="px-4 py-2 rounded bg-[#111827] border border-white/10"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* CONTENT */}
      <div className="mb-10">
        <label className="block mb-2 text-sm text-gray-400">
          Content
        </label>
        <LabEditor value={content} onChange={setContent} />
      </div>

      {/* EXCERPT */}
      <div className="mb-6">
        <label className="block mb-2 text-sm text-gray-400">
          Excerpt
        </label>
        <textarea
          value={article.excerpt}
          onChange={(e) =>
            setArticle({ ...article, excerpt: e.target.value })
          }
          rows={3}
          className="w-full px-4 py-2 rounded bg-[#111827] border border-white/10"
        />
      </div>

      {/* SLUG */}
      <div className="mb-6">
        <label className="block mb-2 text-sm text-gray-400">
          Slug (URL)
        </label>
        <input
          value={article.slug}
          onChange={(e) =>
            setArticle({ ...article, slug: e.target.value })
          }
          className="w-full px-4 py-2 rounded bg-[#111827] border border-white/10"
        />
      </div>

      {/* SEO TITLE */}
      <div className="mb-6">
        <label className="block mb-2 text-sm text-gray-400">
          SEO Title
        </label>
        <input
          value={article.seoTitle}
          onChange={(e) =>
            setArticle({ ...article, seoTitle: e.target.value })
          }
          className="w-full px-4 py-2 rounded bg-[#111827] border border-white/10"
        />
      </div>

      {/* SEO DESCRIPTION */}
      <div className="mb-10">
        <label className="block mb-2 text-sm text-gray-400">
          SEO Description
        </label>
        <textarea
          value={article.seoDescription}
          onChange={(e) =>
            setArticle({
              ...article,
              seoDescription: e.target.value,
            })
          }
          rows={2}
          className="w-full px-4 py-2 rounded bg-[#111827] border border-white/10"
        />
      </div>
    </main>
  );
}
