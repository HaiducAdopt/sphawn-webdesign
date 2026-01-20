"use client";

import React from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firestore";
import Link from "next/link";

type LabArticle = {
  id: string;
  title: string;
  locale: "en" | "nl";
  status: "draft" | "published";
  createdAt?: Timestamp;
};

export default function AdminLabPage() {
  const [articles, setArticles] = React.useState<LabArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadArticles = async () => {
      try {
        const q = query(
          collection(db, "labArticles"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data: LabArticle[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<LabArticle, "id">),
        }));

        setArticles(data);
      } catch (error) {
        console.error("Error loading lab articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  async function handleDelete(id: string) {
    const ok = confirm(
      "Are you sure you want to permanently delete this article?\n\nThis action cannot be undone."
    );
    if (!ok) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "labArticles", id));

      // remove from UI
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete article.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-8 py-10">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            Sphawn Lab
          </h1>
          <p className="text-gray-400 text-sm">
            Manage Lab articles, languages, and publication status.
          </p>
        </div>

        <Link
          href="/admin/lab/add"
          className="
            inline-flex items-center justify-center
            px-5 py-2.5
            rounded-md
            bg-[#00E1F0]
            text-black font-medium
            hover:brightness-110
            transition
          "
        >
          + New Article
        </Link>
      </header>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-500">Loading articles…</p>
      ) : articles.length === 0 ? (
        <div className="bg-[#111827] border border-white/10 rounded-lg p-6 text-gray-400">
          No Lab articles yet.
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="
                bg-[#111827]
                border border-white/10
                rounded-lg
                px-5 py-4
                hover:border-[#00E1F0]/40
                transition
              "
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* LEFT */}
                <Link
                  href={`/admin/lab/${article.id}`}
                  className="flex-1"
                >
                  <h2 className="font-medium text-white">
                    {article.title || "(No title)"}
                  </h2>

                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span className="uppercase">
                      {article.locale}
                    </span>

                    <span
                      className={`font-medium ${
                        article.status === "published"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {article.status}
                    </span>

                    <span>
                      {article.createdAt?.toDate
                        ? article.createdAt
                            .toDate()
                            .toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </Link>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-4 text-sm">
                  <Link
                    href={`/admin/lab/${article.id}`}
                    className="text-[#00E1F0] hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(article.id)}
                    disabled={deletingId === article.id}
                    className="
                      text-red-400
                      hover:text-red-300
                      transition
                      disabled:opacity-50
                    "
                  >
                    {deletingId === article.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
