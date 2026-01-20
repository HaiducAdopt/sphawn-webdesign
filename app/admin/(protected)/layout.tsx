"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setLoading(false);              // 🔧 IMPORTANT
        router.replace("/admin/login"); // 🔧 ABSOLUT
      } else {
        setUser(firebaseUser);
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  async function handleLogout() {
    await signOut(auth);
    router.replace("/admin/login"); // 🔧 ABSOLUT
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0B1220] text-white">
        Checking authentication…
      </main>
    );
  }

  // când NU e user, layout-ul nu mai randă nimic
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-semibold text-lg">
            Admin Dashboard
          </Link>

          <nav className="flex items-center gap-4 text-sm text-gray-300">
            <Link href="/admin/lab" className="hover:text-white">
              Articles
            </Link>
            <Link href="/admin/offers" className="hover:text-white">
              Offers
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Logout
        </button>
      </header>

      {/* CONTENT */}
      <main className="p-8">{children}</main>
    </div>
  );
}
